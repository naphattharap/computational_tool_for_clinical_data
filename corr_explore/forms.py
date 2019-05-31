from django import forms


class FormUploadFile(forms.Form):
    # Label will use to generate validation result
    source_file = forms.FileField(label="Source File")
    target_file = forms.FileField(label="Target File")
    source_column_header = forms.CharField(required=False)
    target_column_header = forms.CharField(required=False)


class FormStratifyData(FormUploadFile):
    # Radiomics feature selected feature index
    feature_indexes = forms.CharField(label="Features")
    # Target value and condition
    numtypes = forms.CharField(label="Number Type")
    criterion = forms.CharField(label="Criterion")
    bin = forms.CharField(label="Bin")
    groupby = forms.CharField(label="Group By Level")
    
