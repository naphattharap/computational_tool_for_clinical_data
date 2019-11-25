from django import forms


class DataFileInputForm(forms.Form):
    
    data_file = forms.FileField(label="Input file")
    output_file = forms.FileField(label="Output file")
        
    data_column_header = forms.CharField(required=False)
    output_column_header = forms.CharField(required=False)
   
