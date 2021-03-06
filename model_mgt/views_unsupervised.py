from django.shortcuts import render
from django.views import View
from django.http import JsonResponse

from .forms import SupervisedLearningTrainTestForm
from naphyutils.pca import PcaUtil
from naphyutils.dataframe import DataFrameUtil
from naphyutils.file import FileStorage
from naphyutils.model import ModelUtils
from naphyutils.standardization import PreProcessingUtil

from sklearn import svm
from sklearn.model_selection import train_test_split, cross_val_score
import pandas as pd

import logging

logger = logging.getLogger(__name__)

fs = FileStorage()

"""

"""


def unsupervised_learning_home_handler(request):
    """
    Called from menu, forward to model creation page
    """
    return render(request, template_name='unsupervised_learning.html')


def unsupervised_learning_train_test_handler(request):
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
                pca_helper = PcaHelper()
                # Standardize data, reduce dimensions and return as X.
                X_scaled = PreProcessingUtil.fit_transform(df)
                X = pca_helper.get_pc(X_scaled, n_components)
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
                resp_data["msg"] = "Model has been saved succuessfully as " + saved_model_file_name
        else:
            # File dataset file is not found. 
            msg.append("File name is not found in storage.")
        
    else:
        resp_data['msg'] = form._errors
    
    return JsonResponse(resp_data)

