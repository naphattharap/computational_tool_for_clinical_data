from django import forms


class FormUploadFile(forms.Form):
    # Label will use to generate validation result
    source_file = forms.FileField(label="Source File")
    target_file = forms.FileField(label="Target File")
    source_column_header = forms.CharField(required=False)
    target_column_header = forms.CharField(required=False)


class FormStratifyData(FormUploadFile):
    # Radiomics feature selected feature index
    feature_indexes = forms.CharField(label="Feature")
    # Target value and condition
    numtypes = forms.CharField(label="Number Type")
    criterion = forms.CharField(label="Criterion")
    bin = forms.CharField(label="Bin")
    groupby = forms.CharField(label="Group By Level")
    

class DimensionReductionForm(FormUploadFile):
    # Radiomics feature selected feature index
    pca_feature_indexes = forms.CharField(label="Feature")
    column_index = forms.CharField(label="Select Column Name")
    dim_algo = forms.CharField(label="Dimensionality Reduction Algorithm")
#   numtype = forms.CharField(label="Number Type")
    numtypes = forms.CharField(label="Number Type")
    criterion = forms.CharField(label="Criterion")


class FeatureSelectionForm(FormUploadFile):
    label_column_index = forms.CharField(label="Select Column Name")
    n_features = forms.IntegerField(label="Number of Features")
    numtypes = forms.CharField(label="Number Type")
    algorithm = forms.CharField(label="Algorithm for Feature Selection")
