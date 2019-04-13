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

