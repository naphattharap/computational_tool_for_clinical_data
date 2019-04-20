from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.utils.html import escape

from .forms import SupervisedLearningTrainTestForm, PipelineForm
from naphyutils.pca import PcaUtil
from naphyutils.dataframe import DataFrameUtil
from naphyutils.file import FileStorage
from naphyutils.model import ModelUtils
from naphyutils.standardization import PreProcessingUtil
import constants.const_msg as msg 
from sklearn import svm
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.manifold import TSNE
from sklearn.feature_selection import SelectKBest, chi2
import pandas as pd
import numpy as np
from sklearn.decomposition import KernelPCA

# Feature Selection
from sklearn.neighbors import KNeighborsClassifier
from mlxtend.feature_selection import SequentialFeatureSelector as SFS
from sklearn.model_selection import StratifiedKFold
import logging

logger = logging.getLogger(__name__)

fs = FileStorage()

"""
https://scikit-learn.org/stable/modules/svm.html
https://scikit-learn.org/stable/modules/cross_validation.html
"""


def supervised_learning_home_handler(request):
    """
    Called from menu, forward to model creation page
    """
    return render(request, template_name='supervised_learning.html')


def supervised_learning_train_test_handler(request):
    resp_data = dict()
    process_log = []
    msg = []
    resp_data['process_log'] = process_log
    resp_data['msg'] = msg
    
    form = SupervisedLearningTrainTestForm(request.GET)
    # When it's valid, data from screen is converted to Python type
    # and stored in clean_data
    if form.is_valid():
        sel_algorithm = form.cleaned_data['sel_algorithm']
        sel_dim_reduction = form.cleaned_data['sel_dim_reduction']
        n_components = form.cleaned_data['n_components']
        dataset_file_name = form.cleaned_data['dataset_file_name']
        column_header = form.cleaned_data['column_header']
        label_file_name = form.cleaned_data['label_file_name']
        label_column_header = form.cleaned_data['label_column_header']
        test_size = form.cleaned_data['test_size']
        sel_test_method = form.cleaned_data['sel_test_method']
        n_folds = form.cleaned_data['n_folds']
        is_saved = form.cleaned_data['is_saved']
        model_file_name = form.cleaned_data['model_file_name']
        
        # Dataframe for storing dataset from file.
        df = None
        
        if fs.is_file_in_base_location(dataset_file_name) \
            and fs.is_file_in_base_location(label_file_name):
            
            # Get data file and store in data frame.
            data_file_path = fs.get_base_location() + dataset_file_name
            # dataset column header checking
            column_header_idx = None
            if column_header == "on":
                column_header_idx = 0
            
            df = DataFrameUtil.convert_file_to_dataframe(data_file_path, header=column_header_idx)
            
            # PCA process
            # Features data
            X = None;  
            if sel_dim_reduction == "pca":
                logger.debug("Dimensionality Reduction by PCA...")
                pca_helper = PcaUtil()
                # Standardize data, reduce dimensions and return as X.
                X_scaled = PreProcessingUtil.fit_transform(df)
                X = pca_helper.reduce_dimension(X_scaled, n_components)
                logger.debug("PCA Done")
            
            # Label data
            y = None  
            label_file_path = fs.get_base_location() + label_file_name
            label_column_header_idx = None
            if label_column_header == "on":
                label_column_header_idx = 0
            
            # Use pandas to read data then change to 1D array 
            y = pd.read_csv(label_file_path, header=label_column_header_idx).values.ravel()
            
            clf = None  # Model
            if sel_algorithm:
                logger.debug("Creating model by SVM...")
                # Split train, test data based on specified ratio.
                # Select to create SVM as one vs one or one vs all
                clf = init_model_object(sel_algorithm)
                
            if sel_test_method:
                logger.debug("Starting Cross Validation...")
                if sel_test_method == "cv" and n_folds:
                    scores = cross_val_score(clf, X, y, cv=n_folds)
                    txt_accuracy = "%0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2)
                    logger.debug(txt_accuracy)
                    resp_data["scores"] = scores.tolist()
                    resp_data["accuracy_mean"] = scores.mean()
                    resp_data["params"] = clf.get_params(deep=True)
                else:
                    # Set random_state here to get the same split for different run.
                    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
                
            if is_saved == 1 and model_file_name:
                clf.fit(X, y)
                logger.debug("Save model as %s", model_file_name)
                saved_model_file_name = ModelUtils.save_model(clf, model_file_name);
                resp_data[msg.SUCCESS] = "Model has been saved successfully as " + saved_model_file_name
        else:
            # File dataset file is not found. 
            msg.append("File name is not found in storage.")
        
    else:
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data)


def init_model_object(sel_algorithm):
    clf = None
    if sel_algorithm == "svm_ovo":
        # SVC implements the "one-against-one"
        clf = svm.SVC(gamma='scale', decision_function_shape='ovo')
        # clf.fit(X_train, y_train) 
    elif sel_algorithm == "svm_ovr":
        # LinearSVC implements "one-vs-the-rest" multi-class strategy, 
        # thus training n_class models.
        #  If there are only two classes, only one model is trained:
        clf = svm.LinearSVC(max_iter=5000)
        # clf.fit(X_train, y_train)
    return clf


def unsupervised_learning_home_handler(request):
    """
    Called from menu, forward to model creation page
    """
    return render(request, template_name='unsupervised_learning.html')


def pipeline_home_handler(request):
    """
    Called from menu, forward to pipeline for model creation page
    """
    return render(request, template_name='pipeline.html')


def pipeline_run_handler(request):
    resp_data = dict()

    form = PipelineForm(request.GET)
    # When it's valid, data from screen is converted to Python type
    # and stored in clean_data
    
    if form.is_valid():
        str_pipeline = form.cleaned_data['pipeline']
        dataset_file_name = form.cleaned_data['dataset_file_name']
        column_header = form.cleaned_data['column_header']
        
        label_file_name = form.cleaned_data['label_file_name']
        label_column_header = form.cleaned_data['label_column_header']
        
        # Dimensionality Reduction
        pca_n_components = form.cleaned_data['pca_n_components']
        kernel_pca_n_components = form.cleaned_data['kernel_pca_n_components']
        lda_n_components = form.cleaned_data['lda_n_components']
        tsne_n_components = form.cleaned_data['tsne_n_components']
        
        # Test
        test_size = form.cleaned_data['test_size']
        n_folds = form.cleaned_data['n_folds']
        
        # Save model
        save_as_name = form.cleaned_data['save_as_name']
        
        # Feature Selection
        sfs_k_features = form.cleaned_data['sfs_k_features']
        sfs_forward = form.cleaned_data['sfs_forward']
        sfs_floating = form.cleaned_data['sfs_floating']
        sfs_scoring = form.cleaned_data['sfs_scoring']
        sfs_cv = form.cleaned_data['sfs_cv']
        sfs_n_jobs = form.cleaned_data['sfs_n_jobs']
        
        select_k_best_n_k = form.cleaned_data['select_k_best_n_k']
        
        stratified_kfold_n_split = form.cleaned_data['stratified_kfold_n_split']
        stratified_kfold_shuffle = form.cleaned_data['stratified_kfold_shuffle']
        
        # Dataframe for storing dataset from file.
        df = None
        
        if fs.is_file_in_base_location(dataset_file_name):
            # and fs.is_file_in_base_location(label_file_name):
            
            # Get data file and store in data frame.
            data_file_path = fs.get_base_location() + dataset_file_name
            # dataset column header checking
            column_header_idx = None
            if column_header == "on":
                column_header_idx = 0
                
            df = DataFrameUtil.convert_file_to_dataframe(data_file_path, header=column_header_idx)
            
            # PCA process
            # Features data
            X = df;
            
            # Label data
            y = None  

            # Use pandas to read data then change to 1D array 
            if fs.is_file_in_base_location(label_file_name):
                label_column_header_idx = None
                if label_column_header == "on":
                    label_column_header_idx = 0
                label_file_path = fs.get_base_location() + label_file_name
                y = pd.read_csv(label_file_path, header=label_column_header_idx).values.ravel()
            
            # process pipeline
            arr_pipeline = str_pipeline.split(",")
            parameters = dict();
            parameters['n_folds'] = n_folds
            parameters['pca_n_components'] = pca_n_components
            parameters['kernel_pca_n_components'] = kernel_pca_n_components
            parameters['lda_n_components'] = lda_n_components
            parameters['tsne_n_components'] = tsne_n_components
            parameters['test_size'] = test_size 
            parameters['select_k_best_n_k'] = select_k_best_n_k 
            
            parameters['stratified_kfold_n_split'] = stratified_kfold_n_split 
            parameters['stratified_kfold_shuffle'] = stratified_kfold_shuffle 
            
            if sfs_k_features != "":
                # In case of feature selection, plot result as table
                # Feature Selection
                parameters['sfs_k_features'] = sfs_k_features
                parameters['sfs_forward'] = sfs_forward
                parameters['sfs_floating'] = sfs_floating
                parameters['sfs_scoring'] = sfs_scoring
                parameters['sfs_cv'] = sfs_cv
                parameters['sfs_n_jobs'] = sfs_n_jobs
                parameters['feature_names'] = df.columns 
                
            result, X, y, model = process_pipeline(arr_pipeline, X, y, parameters)
            print(X)
            print(y)
            resp_data = result;
            
            if save_as_name != "":
                # If model is not fitted yet, fit the model and save
                if not ModelUtils.is_fitted(model):
                    model.fit(X, y)
                    
                save_as_name = ModelUtils.save_model(model, save_as_name)
                resp_data[msg.SUCCESS] = "Model has been save successfully as " + save_as_name
                
                # Display table that list feature in order.
            
            if X.any():
                # Check X dimension
                nD = X.shape[1]
                if nD == 2:
                    # For 2D
#                     pca_helper = PcaUtil()
#                     X2d = pca_helper.reduce_dimension(X, n_components=2)
                    df_plot = pd.DataFrame(data=X, columns=['x', 'y'])
                    df_label = pd.DataFrame(data=y, columns=['label'])
                    df_plot = df_plot.join(df_label)
                    resp_data['plot_data'] = df_plot.to_json()
                    resp_data['dimension'] = 2
                    
                elif nD == 3:
                # For 3D
#                 X3d = pca_helper.reduce_dimension(X, n_components=3)
                    df_plot = pd.DataFrame(data=X, columns=['x', 'y', 'z'])
                    df_label = pd.DataFrame(data=y, columns=['label'])
                    df_plot = df_plot.join(df_label)
                    resp_data['plot_data'] = df_plot.to_json()
                    resp_data['dimension'] = 3
                
                elif nD > 3:
                    # Default to 3D
                    pca_helper = PcaUtil()
                    X = pca_helper.reduce_dimension(X, n_components=3)
                    df_plot = pd.DataFrame(data=X, columns=['x', 'y', 'z'])
                    df_label = pd.DataFrame(data=y, columns=['label'])
                    df_plot = df_plot.join(df_label)
                    resp_data['plot_data'] = df_plot.to_json()
                    resp_data['dimension'] = 3
            
        else:
            # File dataset file is not found. 
            resp_data[msg.ERROR] = "File name is not found in storage."
        
    else:
        resp_data[msg.ERROR] = escape(form._errors)
    
    return JsonResponse(resp_data, safe=False)


def process_pipeline(arr_pipeline, X, y, parameters):
    result = dict()
    clf = None  # Model
    score = None
     
    for p in arr_pipeline:
        if p == "sfs":
            # Select data
            clf = feature_selection_sfs(X, y, parameters)
            if isinstance(X, pd.DataFrame):
                X = DataFrameUtil.get_columns_by_indexes(X, list(clf.k_feature_idx_))
            elif isinstance(X, np.ndarray):
                X = X[:, list(clf.k_feature_idx_)]
            
            result["scores"] = clf.k_score_
            result['table_columns'] = ['Feature Indexes', 'Feature Names']
            # Convert data to array 
            arr_feature_indexes = list(clf.k_feature_idx_);
            arr_feature_names = list(clf.k_feature_names_);
            result['table_data'] = [arr_feature_indexes, arr_feature_names]
        elif p == "select_k_best":
            # !! Input X must be non-negative.
            n_k = parameters['select_k_best_n_k']
            X = SelectKBest(chi2, k=n_k).fit_transform(X, y)
        elif p == "scale":
            # Standardize data
            X = PreProcessingUtil.fit_transform(X)  
        elif p == "pca":
            # reduce dimensions and return as X.
            # logger.debug("Dimensionality Reduction by PCA...")
            n_components = parameters['pca_n_components']  
            pca_helper = PcaUtil()
            X = pca_helper.reduce_dimension(X, n_components)
           
        elif p == "kernel_pca":
            # reduce dimensions and return as X.
            n_components = parameters['kernel_pca_n_components']  
            kpca = KernelPCA(n_components=n_components, kernel='rbf', gamma=15)
            X = kpca.fit_transform(X, y)
        elif p == "lda":
            n_components = parameters['lda_n_components']  
            clf = LinearDiscriminantAnalysis(n_components=n_components)
            X = clf.fit_transform(X, y)
            
        elif p == "tsne":
            n_components = parameters['tsne_n_components']  
            clf = TSNE(n_components=n_components)
            X = clf.fit_transform(X, y)
            
        elif p == "svmovo":   
            logger.debug("Creating model by SVM...")
            # Split train, test data based on specified ratio.
            # Select to create SVM as one vs one or one vs all
            clf = svm.SVC(gamma='scale', decision_function_shape='ovo')
            # no fit_transform function for SVC
            # clf.fit(X, y)
            
        elif p == "svmovr":   
            clf = svm.LinearSVC(max_iter=5000)
           
        elif p == "kfold":   
            n_folds = parameters['n_folds']  
            scores = cross_val_score(clf, X, y, cv=n_folds)
            txt_accuracy = "%0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2)
            logger.debug(txt_accuracy)
            result["scores"] = scores.tolist()
            result["accuracy_mean"] = scores.mean()
            
        elif p == "stratified_kfold": 
            stratified_kfold_n_split = parameters['stratified_kfold_n_split'] 
            stratified_kfold_shuffle = parameters['stratified_kfold_shuffle'] 
            sklearn.model_selection.StratifiedKFold(n_splits=stratified_kfold_n_split,
                                                    shuffle=stratified_kfold_shuffle,
                                                    random_state=42)

        elif p == "handout":
            # Set random_state here to get the same split for different run.
            test_size = parameters['test_size']
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
           
            # X = X_test
            if isinstance(clf, svm.SVC) or isinstance(clf, LinearSVC):
                clf.fit(X_train, y_train)
                y = clf.predict(X);
            else:
                # t-SNE, not SVM
                X = clf.fit_transform(X_train, y_train)
                
            if not isinstance(clf, TSNE) :
                result["scores"] = clf.score(X_test, y_test).tolist()
        
        # result['X'] = X.tolist();
        # result['y'] = y;
        # if p != "sfs" and clf:
            # result["params"] = clf.get_params(deep=True)
    print(clf)       
    return result, X, y, clf


def feature_selection_sfs(X, y, parameters):
    # TODO check n_neighbor
#     k_features = parameters['sfs_k_features']
#     forward = parameters['sfs_forward']
#     floating = parameters['floating']
#     scoring = parameters['scoring']
#     n_folds = parameters['n_folds']
#     n_jobs = parameters['n_jobs']
    knn = KNeighborsClassifier(n_neighbors=4)
    sfs1 = SFS(knn,
           k_features=parameters['sfs_k_features'],
           forward=parameters['sfs_forward'],
           floating=parameters['sfs_floating'],
           verbose=2,
           scoring=parameters['sfs_scoring'],
           cv=parameters['sfs_cv'],
           n_jobs=parameters['sfs_n_jobs'])

    custom_feature_names = None
    if parameters['feature_names'].any():
        custom_feature_names = parameters['feature_names']
        
    sfs1 = sfs1.fit(X, y, custom_feature_names=custom_feature_names)
    return sfs1
