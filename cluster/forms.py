from django import forms


class DataForm(forms.Form):
    data_file_name = forms.CharField(label="Data File Name")
    column_header = forms.CharField(label="Column Header Row", required=False)
#     dim_reduction = forms.CharField(label="Dimensionality Reduction")
#     n_components = forms.CharField(label="Number of Components")


class KMeanForm(DataForm):
    n_clusters = forms.IntegerField(label="Number of Clusters")

    
class ElbowMethodForm(DataForm):
    n_cluster_from = forms.IntegerField(label="Number of Clusters From")
    n_cluster_to = forms.IntegerField(label="Number of Clusters To")
    
    
class SilhouetteAnalysisForm(ElbowMethodForm):
    n_cluster_from = forms.IntegerField(label="Number of Clusters From")
    n_cluster_to = forms.IntegerField(label="Number of Clusters To")
