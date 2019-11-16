from django import forms

# 
# class DatasetFileForm(forms.Form):
#     # mode of uploading file
#     upload_type = forms.CharField()
#     # data and label in one file
#     dataset_file = forms.FileField()
#     # data only
#     data_file = forms.FileField()
#     # label only
#     label_file = forms.FileField()
#     # column index in data file to map with label in label file
#     key_column_idx = forms.IntegerField()
#     
#     # data separator (tab, space, comma)
#     data_separator = forms.CharField()
#     
#     # method to clean up NaN value 
#     nan_cleanup = forms.CharField()

    
class UploadFileAsForm(forms.Form):
    file_name = forms.CharField()
    data_file = forms.FileField(label="Data File")

    
class UploadFileForm(forms.Form):
    # data only
    data_file = forms.FileField(label="Data File")
    column_header = forms.CharField(label="Column Header", required=False)
  
  
class ProcessFileForm(forms.Form):  
    data_file = forms.FileField(label="Data File", required=True)
    choice_cleanup = forms.CharField(label="Choice Cleanup", required=False)
    column_header = forms.CharField(label="Column Header", required=False)
    exclude_columns = forms.CharField(required=False)
    remain_columns = forms.CharField(required=False)
    split_row_from = forms.IntegerField(required=False)
    split_row_to = forms.IntegerField(required=False)
    

class SaveFileForm(ProcessFileForm):
    save_as_name = forms.CharField(required=False)


class CleanUpSettingsForm(forms.Form):
    file_name = forms.CharField()
    choice_cleanup = forms.CharField()
    column_header = forms.CharField()
    exclude_columns = forms.CharField()
    remain_columns = forms.CharField()
    save_as_name = forms.CharField()

    
class ExtractMatchedKeysForm(forms.Form):
    key_file = forms.FileField(label="Key File Name")
    data_file = forms.FileField(label="Data File Name")
