from django import forms


class VisInputForm(forms.Form):
    
    data_file = forms.FileField(required=False)
    label_file = forms.FileField(required=False)
    add_data_file = forms.FileField(required=False)
    new_data_file = forms.FileField(required=False)
    general_data_file = forms.FileField(required=False)
        
    data_column_header = forms.CharField(required=False)
    add_data_column_header = forms.CharField(required=False)
    label_column_header = forms.CharField(required=False)
    new_data_column_header = forms.CharField(required=False)
    general_data_column_header = forms.CharField(required=False)
