from django import forms


class FlexViewForm(forms.Form):
    model_file_name = forms.CharField(label="Model File Name")
    data_file_name = forms.CharField(label="Data File Name")
    data_detail_file_name = forms.CharField(label="Data Detail File Name")
