from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis


class LdaUtil:

    @staticmethod
    def reduce_dimension(X, y, n_components):
        """
            Reduced dimension by default setting from LDA
        """
        lda = LinearDiscriminantAnalysis(n_components=n_components)
        X_lda = lda.fit_transform(X, y)
        return X_lda
    
    
class PcaUtil:
    """
    This class contains functions that useful for PCA.
    e.g. analyze elbow by explain eigenvalues of each PC, 
    perform dimensionality reduction for input data.
    
    fit_transform - joins step of calculating mean and STD
    and is used for the initial fitting of parameters on the training set X 
    but it also returns a transformed X'. 
    Internally, it just calls first fit() and then transform() on the same data.
    """

    @staticmethod
    def reduce_dimension_by_percent(X, percent):
        """
        Get principle components
        """
        pca = PCA()
        new_X = pca.fit_transform(X)
        arr_ratio = pca.explained_variance_ratio_
        sum_val = 0
        for idx in range(0, len(arr_ratio)):
            sum_val = sum_val + arr_ratio[idx]
            if sum_val > percent:
                break
            
        new_X = new_X[:, 0:idx]
            
        return new_X, pca
    
    @staticmethod
    def reduce_dimension(X, n_components=None):
        """
        Get principle components
        """
        pca = PCA(n_components=n_components)
        new_X = pca.fit_transform(X)
        return new_X, pca
    
    @staticmethod
    def get_fit_transfrom_pca(X, n_components=None):
        """
        Get principle components
        """
        pca = PCA(n_components=n_components)
        pca.fit_transform(X)
        return pca
    
    @staticmethod  
    def get_explain_variance_ratio(X):
        """
        Return array of ratio of each PC
        """
        pca = PCA()
        pca.fit_transform(X)
        return pca.explained_variance_ratio_
    
    @staticmethod
    def get_explain_variance(X):
        """
        Return array of variance of each PC
        """
        pca = PCA()
        pca.fit_transform(X)
        return pca.explained_variance_
    
#     @staticmethod
#     def reduce_dimension_input(n_components, X):
#         pca = PCA(n_components)
#         return pca.fit_transform(X)
    
#     @staticmethod
#     def reduce_dimension_dataset(n_components, X, y):
#         pca = PCA(n_components)
#         return pca.fit_transform(X, y)

