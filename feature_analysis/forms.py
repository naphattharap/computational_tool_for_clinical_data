from django import forms


class DataFileInputForm(forms.Form):
    
    data_file = forms.FileField(label="Data file")
    outcomes_file = forms.FileField(label="Outcomes file")
        
    data_column_header = forms.CharField()
    outcomes_column_header = forms.CharField()
   
