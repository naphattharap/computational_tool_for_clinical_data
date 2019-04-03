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
    def convert_csv_to_json(file_path, header_row=None, orient="values"):
        """
        Separator default is ','
        Result format:
            orient='records' ==>   '[{"col 1":"a","col 2":"b"},{"col 1":"c","col 2":"d"}]'
            orient='values' ==> '[["a","b"],["c","d"]]'
        """
        # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
        df = pd.read_csv(file_path, header=header_row) 
        data = df.to_json(orient=orient)
        return data, df.columns.values.tolist()
    
    @staticmethod
    def convert_file_to_dataframe(file_path, separator=",", header=None):
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path, sep=separator, header=header)
        elif file_path.endswith('.txt'):
            df = pd.read_csv(file_path, sep=" ", header=header) 
        return df
    
    @staticmethod
    def get_column_value(data_frame, column_name):
        return data_frame[column_name].values
    
    @staticmethod
    def drop_column_by_name(data_frame, columns_names):
        return data_frame.drop(columns_names, axis=1)
    
    @staticmethod
    def drop_column_by_index(data_frame, column_indexes):
        """
        Drop column from data frame by specified column index.
        df - Dataframe object
        column_index - zero based column index
        
        """
        return data_frame.drop(data_frame.columns[column_indexes], axis=1)
    
    @staticmethod
    def drop_na(data_frame, columns_names):
        return data_frame.dropna(subset=columns_names)
    
    @staticmethod
    def drop_na_row(data_frame):
        return data_frame.dropna()
    
    @staticmethod
    def sort_by_column(data_frame, colume_name):
        return data_frame.sort_values(colume_name)
    
    @staticmethod
    def get_group_mean(data_frame, main_column, sub_columns):
        return data_frame.groupby(main_column)[sub_columns].mean().reset_index()
    
    @staticmethod
    def get_column_mean_value(self):
        pass
