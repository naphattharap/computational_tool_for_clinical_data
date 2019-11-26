from django import forms


class VisDynamicSourceInputForm(forms.Form):
    # base space
    data_file = forms.FileField()
    label_file = forms.FileField()
    add_data_file = forms.FileField(required=False)
    
    # new data
    model_id = forms.CharField(required=False)
    new_data_file = forms.FileField(required=False)
    general_data_file = forms.FileField(required=False)
        
    data_column_header = forms.CharField(required=False)
    add_data_column_header = forms.CharField(required=False)
    label_column_header = forms.CharField(required=False)
    new_data_column_header = forms.CharField(required=False)
    general_data_column_header = forms.CharField(required=False)
