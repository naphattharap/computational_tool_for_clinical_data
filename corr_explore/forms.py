from django import forms


class FormUploadFile(forms.Form):
    # Label will use to generate validation result
    source_file = forms.FileField(label="Source File")
    target_file = forms.FileField(label="Target File")
    source_column_header = forms.CharField(required=False)
    target_column_header = forms.CharField(required=False)


class FormStratifyData(forms.Form):
    source_file = forms.FileField(label="Source")
    target_file = forms.FileField(label="Target")
    source_column_header = forms.CharField(required=False)
    target_column_header = forms.CharField(required=False)
    # Target labels
    target_strat = forms.CharField(label="Target Column")
     
    # Radiomics feature selected feature index
    # Not required when click XGBoost button
    feature_indexes = forms.CharField(label="Feature", required=False)
    # Target value and condition
    numtypes = forms.CharField(label="Number Type")
    criterion = forms.CharField(label="Criterion")
    bin = forms.CharField(label="Bin", required=False)
    groupby = forms.CharField(label="Group By Level", required=False)
    # is_calc_framingham = forms.CharField(label="Framingham Risk Score Calculation Flag")
    target_action = forms.CharField(label="Target action")
    target_labels = forms.CharField(label="Target Label(s)", required=False)
    n_feature_selection = forms.IntegerField(label="Number of Features", required=False)


class DimensionReductionForm(FormUploadFile):
    # Target labels for filtering
    target_strat = forms.CharField(label="Labels")
    # Radiomics feature selected feature index

    feature_indexes = forms.CharField(label="Feature")
    column_index = forms.CharField(label="Select Column Name")
    dim_algo = forms.CharField(label="Dimensionality Reduction Algorithm")
    numtypes = forms.CharField(label="Number Type")
    criterion = forms.CharField(label="Criterion")


class FeatureSelectionForm(FormUploadFile):
    label_column_index = forms.CharField(label="Select Column Name")
    n_features = forms.IntegerField(label="Number of Features")
    numtypes = forms.CharField(label="Number Type")
    algorithm = forms.CharField(label="Algorithm for Feature Selection")
