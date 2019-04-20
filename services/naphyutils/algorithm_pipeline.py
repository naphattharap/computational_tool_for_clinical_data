import logging

from django.http import JsonResponse
from django.shortcuts import render
from django.utils.html import escape
from django.views import View
from mlxtend.feature_selection import SequentialFeatureSelector as SFS
from sklearn import svm
from sklearn.decomposition import KernelPCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.manifold import TSNE
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import LinearSVC

import constants.const_msg as msg 
from naphyutils.dataframe import DataFrameUtil
from naphyutils.file import FileStorage
from naphyutils.model import ModelUtils
from naphyutils.pca import PcaUtil
from naphyutils.standardization import PreProcessingUtil

import numpy as np
import pandas as pd

PIPELINE_SFS = "sfs"
PIPELINE_SELECT_K_BEST = "select_k_best"
PIPELINE_SCALE = "scale"
PIPELINE_PCA = "pca"
PIPELINE_KERNEL_PCA = "kernel_pca"
PIPELINE_KERNEL_LDA = "lda"
PIPELINE_T_SNE = "tsne"
PIPELINE_SVM_OVO = "svmovo"
PIPELINE_SVM_OVR = "svmovr"
PIPELINE_K_FOLD = "kfold"
PIPELINE_STRATIFIED_K_FOLD = "stratified_kfold"
PIPELINE_HANDOUT = "handout"


# Feature Selection
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
            result["scores"] = scores.tolist()
            result["accuracy_mean"] = scores.mean()
            
        elif p == "stratified_kfold": 
            stratified_kfold_n_split = parameters['stratified_kfold_n_split'] 
            stratified_kfold_shuffle = parameters['stratified_kfold_shuffle'] 
            StratifiedKFold(n_splits=stratified_kfold_n_split,
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
