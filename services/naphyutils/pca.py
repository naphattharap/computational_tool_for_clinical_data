from sklearn.decomposition import PCA


class PcaHelper:
    """
    This class contains functions that useful for PCA.
    e.g. analyze elbow by explain eigenvalues of each PC, 
    perform dimensionality reduction for input data.
    """

    def __init__(self):
        pass

    def get_pc(self, X, n_components):
        """
        Get principle components
        """
        pca = PCA(n_components)
        pc = pca.fit_transform(X)
        return pc
        
    def get_explain_variance_ratio(self, X):
        """
        Return array of ratio of each PC
        """
        pca = PCA()
        pca.fit_transform(X)
        
        return pca.explained_variance_ratio_
    
    def get_explain_variance(self, X):
        """
        Return array of variance of each PC
        """
        pca = PCA()
        pca.fit_transform(X)
        return pca.explained_variance_

    def reduce_dimension_input(self, n_components, X):
        pca = PCA(n_components)
        return pca.fit_transform(X)
    
    def reduce_dimension_dataset(self, n_components, inputX, y):
        pca = PCA(n_components)
        return pca.fit_transform(inputX, y)

