'''
Created on Feb 6, 2019

@author: naphatthara
'''

import pandas as pd

# class File2DataFrameUtil():
#     '''
#     Convert file to dataframe
#     '''
    

class DataFrameUtil():
    '''
    classdocs
    '''

    @staticmethod
    def convert_to_dataframe(file_path, column_names, separator):
        if file_path.endswith('.csv'):
            df = pd.read_csv(column_names, sep=separator, header=None)
        elif file_path.endswith('.txt'):
            df = pd.read_csv(column_names, sep=" ", header=None) 
        return df
    
    @staticmethod
    def get_column_value(data_frame, column_name):
        return data_frame[column_name].values
    
    @staticmethod
    def drop_column(data_frame, columns_names):
        return data_frame.drop(columns_names, axis=1)
    
    @staticmethod
    def drop_na(data_frame, columns_names):
        return data_frame.dropna(subset=columns_names)
    
    @staticmethod
    def sort_by_column(data_frame, colume_name):
        return data_frame.sort_values(colume_name)
    
    @staticmethod
    def get_group_mean(data_frame, main_column, sub_columns):
        return data_frame.groupby(main_column)[sub_columns].mean().reset_index()
    
    @staticmethod
    def get_column_mean_value(self):
        pass
