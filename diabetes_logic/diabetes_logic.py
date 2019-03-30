# Import libraries
# - graphviz for displaying tree graph
# import graphviz 
# - pyplot for ploting graphs
# import matplotlib.pyplot as plt
# - numpy for scientific computing
import numpy as np
# - package for decision tree
from sklearn import tree
# - load_svmlight_file for loading dataset_management in LIBSVM format
from sklearn.datasets import load_svmlight_file
# - calculation methods for prediction's result
from sklearn.metrics import mean_squared_error, accuracy_score
# - function for spliting train and test data by provided ratio
from sklearn.model_selection import train_test_split
# - pandas, tool for data structures and data analysis

import pandas as pd
# - for printing contribution of attr in tree
# from treeinterpreter import treeinterpreter as ti
# - for confusion matrix
from sklearn.metrics import confusion_matrix
# import seaborn as sns; sns.set()
from sklearn.model_selection import cross_val_score
# import matplotlib.image as mpimg
from IPython.display import Image
# import pydotplus
# import pydot
from sklearn.metrics import classification_report


class DiabetesLogic:
    
    def read_dataset(self, dataset_file_path):
        # load data
        temp_x, temp_y = load_svmlight_file(dataset_file_path)
        # since temp_x's data type and temp_y are different
        # in order to merge those column together to create dataframe
        # we need to change data type
        arr_y = np.array([np.array(temp_y)]).T
        # print(len(arr_y))
        # print(temp_x.toarray())
        dataset = np.concatenate((arr_y, temp_x.toarray()), axis=1)
        
        # Visualize data in table
        data_columns = ['Label', 'Pregnancies', 'Glucose Plasma', 'Blood Pressure', 'Skin Thickness', 'Insulin',
                'BMI', 'Diabetes Pedigree Function', 'Age']
        df = pd.DataFrame(data=dataset, columns=data_columns)

        # Check combined data
#         print("Example of first 20 samples dataset_management...")
#         df.head(20)
        return df

# obj = DiabetesLogic()
# obj.read_dataset()
