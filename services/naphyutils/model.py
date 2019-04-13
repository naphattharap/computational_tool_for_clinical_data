# from sklearn.externals import joblib
from joblib import dump, load

"""
For saving and loading model
https://scikit-learn.org/stable/modules/model_persistence.html
"""

MODEL_STORAGE = "/Volumes/Work/UPF/thesis/FILE_DB/"
FILE_EXTENSION = ".joblib"


class ModelUtils:
    
    @staticmethod
    def save_model(model, model_file_name):
        """
        model_file_name: file name with extension .joblib
        """
        # Save to file in the current working directory
        if not ModelUtils.is_extension_added(model_file_name):
            model_file_name += FILE_EXTENSION
        
        dump(model, MODEL_STORAGE + model_file_name)
        return model_file_name

    @staticmethod
    def load_model(model_file_name):
        # Load from file
        
        if not ModelUtils.is_extension_added(model_file_name):
            model_file_name += FILE_EXTENSION
            
        joblib_model = load(MODEL_STORAGE + model_file_name)
        return joblib_model
    
    @staticmethod 
    def predict(model, X_test):
        # Calculate the accuracy and predictions
        # score = joblib_model.score(Xtest, Ytest)  
        # print("Test score: {0:.2f} %".format(100 * score))  
        Ypredict = model.predict(X_test) 
        return  Ypredict

    @staticmethod
    def is_extension_added(model_file_name):
        """
        If model_file_name has no extension, append it with .joblib 
        """
        temp_arr = model_file_name.split(".")
        if temp_arr[len(temp_arr) - 1] != "joblib":
            return False
        
        return True

