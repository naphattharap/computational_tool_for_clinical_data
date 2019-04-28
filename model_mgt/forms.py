from django import forms

"""
 The form’s is_bound attribute will tell you whether a form has data bound to it or not.
 Whatever the data submitted with a form, once it has been successfully validated by calling is_valid() 
 (and is_valid() has returned True), the validated form data will be in the form.cleaned_data dictionary. 
 This data will have been nicely converted into Python types for you
"""


class SupervisedLearningTrainTestForm(forms.Form):
    """
    Bind data from parameter settings
    """
    sel_algorithm = forms.CharField()
    sel_dim_reduction = forms.CharField()
    n_components = forms.IntegerField()
    # Dataset File
    dataset_file_name = forms.CharField()
    column_header = forms.CharField(required=False)
    # Label File
    label_file_name = forms.CharField()
    label_column_header = forms.CharField(required=False)
    # Test
    test_size = forms.FloatField()
    sel_test_method = forms.CharField()
    n_folds = forms.IntegerField()
    # 1: Save model after created, 0: Do not save
    is_saved = forms.IntegerField()
    model_file_name = forms.CharField(required=False)


class PipelineForm(forms.Form):
    """
    Bind data from parameter settings
    """
    # Dataset file
    dataset_file_name = forms.CharField()
    column_header = forms.CharField(required=False)
    
    # Label File
    label_file_name = forms.CharField(required=False)
    label_column_header = forms.CharField(required=False)
    
    # Dimensionality Reduction
    pca_n_components = forms.IntegerField(required=False)
    kernel_pca_n_components = forms.IntegerField(required=False)
    lda_n_components = forms.IntegerField(required=False)
    tsne_n_components = forms.IntegerField(required=False)
    # Test
    test_size = forms.FloatField(required=False)
    n_folds = forms.IntegerField(required=False)
    
    pipeline = forms.CharField()
    
    save_as_name = forms.CharField(required=False)
    
    # Feature Selection
    sfs_k_neighbors = forms.IntegerField(required=False)
    sfs_k_features = forms.IntegerField(required=False)
    sfs_forward = forms.BooleanField(required=False)
    sfs_floating = forms.BooleanField(required=False)
    sfs_scoring = forms.CharField(required=False)
    sfs_cv = forms.IntegerField(required=False)
    sfs_n_jobs = forms.IntegerField(required=False)
    
    select_k_best_n_k = forms.IntegerField(required=False)
    
    stratified_kfold_n_split = forms.IntegerField(required=False)
    stratified_kfold_shuffle = forms.BooleanField(required=False)

