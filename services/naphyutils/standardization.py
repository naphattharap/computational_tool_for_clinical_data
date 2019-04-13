from sklearn import preprocessing
from sklearn.preprocessing import OneHotEncoder, StandardScaler, Binarizer


class PreProcessingUtil:
    """
    Standardization / Mean Removal / Variance Scaling
    Mean is removed.
    Data is centered on zero.
    Remove bias.
    X' = (X - mean)/ STD
    """

    @staticmethod
    def standardize(X):
        """
        Scale/Transform data to normal distributed data.
        Mean zero [-3, 3]
        """
        X_scaled = preprocessing.scale(X)
        return X_scaled
    
    @staticmethod
    def fit_transform(X):
        """
        Transform data to standard normal distributed data.
            Mean zero, unit variance

        Need to transform both of X and y for supervised learning
        """
        scaler = preprocessing.StandardScaler()
        X_scaled = scaler.fit_transform(X)
        return X_scaled

    @staticmethod
    def standard_scalar(X):
        """
        Scale train data and return the object of scalar.
        Test data must use this object to scale data before predicting
        Default:
            StandardScaler(copy=True, with_mean=True, with_std=True)
            After .fit(X), use scaler.mean_, scaler.scale_ to see data description.
        How to transform test data.
            scaler.transform(X_test)
            
        Train vs Test:
            Train:perform fit to scaler and transform or use fit_transform
            Test: transform
        """
        scaler = StandardScaler().fit(X)
        return  scaler
    
    @staticmethod
    def fit_min_max_scaler(X):
        """
        Scale data to the [0, 1] range.
        Max becomes 1 and min becomes 0.
        """
        min_max_scaler = preprocessing.MinMaxScaler()
        X_min_max = min_max_scaler.fit_transform(X)
        return X_min_max
    
    @staticmethod
    def max_abs_scaler(X):
        """
        Scales in a way that the training data lies within the range [-1, 1]
        by dividing maximum value in each feature.
        Useful for sparse data.
        """
        scaler = preprocessing.MaxAbsScaler(X)
        return scaler
    
    @staticmethod
    def std(X):
        """
        After doing pre-processing by X_scaled = preprocessing.scale(X).

        """
        X_scaled = X.std(X)
        return X_scaled

    @staticmethod
    def mean(X):
        """
        For data pre-processing, the input X here should be X_scaled.
        We can confirm that all means of each feature has become zero 
        """
        X_mean = X.mean(axis=0)
        return X_mean

    
class Normalization:
    """
    Normalization is the process of scaling individual sample to have unit form.
    This process can be useful if you plan to use quadratic form such as dot-product 
    or any other kernel to quantify the similarity of any pair of samples.
    X' = (X - Xmean)/(Xmax - Xmin)
    
    There are 2 types of Normalization.
    1. L1 normalization, Least Absolute Deviations Ensure the sum of absolute value is 1 in each row
    2. L2 normalization, Least squares, Ensure that the sum of squares is 1.
    """

    def __init__(self):
        pass
    
    def get_normalizer(self, X):
        """
        How to use normalizer
        - Fit data by normalizer.fit(X) in this case norm = l2
        - Transform data. normalizer.transform([[ data ]]) for X or test 
        """
        normalizer = preprocessing.Normalizer().fit(X)  # fit does nothing
        return  normalizer

    
class Binarization:
    """
    Process of thresholding to get boolean value as 0,1.
    Common used in text procesing for binaray feature value.
    """

    def fit_binarizer(self, X):
        """
        Usage:
            Transform by calling binarizer.transform(X).
            By default threshold value is 0.0 then the value that less than 0 becomes 0 
            and the greater values become 1. 
        """
        binarizer = Binarizer().fit(X)
        return binarizer
    
    
class EncodingCategoricalFeatures:

    def __init__(self):
        pass
    
    def label_encoder(self, source):
        """
        Class label has no meaning in term of more meaningful data.
        It's just a category label.
        """
        label_enc = preprocessing.LabelEncoder()
        src = label_enc.fit_transform(source)
        for k, v in enumerate(label_enc.classes_):
            print(v, '\t', k)
        return src
    
    def one_hot_encoder(self, source):
        """
        Transform into a sparse matrix.
        Number of input data will become number of feature
        How to reverse data to label
            inv_result = lebel_enc.inverse_transform([np.argmax(one_hot[row_idx, :])])
        """
        one_hot_enc = OneHotEncoder(sparse=False)
        src = self.label_encoder(source)
        src = src.reshape(len(src), 1)
        one_hot = one_hot_enc.fit_transform(src)
        # print(one_hot)
 
