from django import forms


class PcaPlotForm(forms.Form):
    
    data_file = forms.FileField(label="Data file") 
#     data_column_header = forms.CharField(required=False)
