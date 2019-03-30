from django import forms


class DatasetFileForm(forms.Form):
    # mode of uploading file
    upload_type = forms.CharField()
    # data and label in one file
    dataset_file = forms.FileField()
    # data only
    data_file = forms.FileField()
    # label only
    label_file = forms.FileField()
    # column index in data file to map with label in label file
    key_column_idx = forms.IntegerField()
    
    # data separator (tab, space, comma)
    data_separator = forms.CharField()
    
    # method to clean up NaN value 
    nan_cleanup = forms.CharField()
    
