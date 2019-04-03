"""
Dataset should be scaled in PCA in order not to have various results 
and avoiding issues related to big different of scale
"""
from sklearn.preprocessing import StandardScaler


class PreProcess:
    """
    class docstring
    """

    def __init__(self):
        self.std_scaler = StandardScaler()

    def transform_dataset(self, X, y):
        """
        Transform both of X and y for supervised learning
        """
        return self.std_scaler.fit_transform(X, y)

    def transform(self, data):
        """
        """
        return self.std_scaler.transform(data)
