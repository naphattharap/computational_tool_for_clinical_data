'''
Created on Feb 6, 2019

@author: naphatthara
'''

import pandas as pd
import numpy as np

# class File2DataFrameUtil():
#     '''
#     Convert file to dataframe
#     '''
    

class DataFrameUtil():
    '''
    classdocs
    '''

    @staticmethod
    def convert_csv_to_json(file_path, header=None, orient="values"):
        """
        Separator default is ','
        Result format:
            orient='records' ==>   '[{"col 1":"a","col 2":"b"},{"col 1":"c","col 2":"d"}]'
            orient='values' ==> '[["a","b"],["c","d"]]'
        """
        # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html
        df = pd.read_csv(file_path, header=header) 
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
    def file_to_dataframe(file, separator=",", header=None):
        if file.name.endswith('.csv'):
            df = pd.read_csv(file, sep=separator, header=header)
        elif file.name.endswith('.txt'):
            df = pd.read_csv(file, sep=" ", header=header) 
        return df
    
    @staticmethod
    def dataframe_to_json(df, orient="values"):
        """
        Convert dataframe object to JSON object by .to_json
        return data - json object for data in data frame
               column names - data frame column name
        """
        data = df.to_json(orient="values")
        return data, df.columns.values.tolist()
    
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
    def analyze_dataframe(df):
        """
        Describe data frame information.
        Result - columns_nan, n_rows_nan, columns_null, n_rows_null
                n_columns, n_rows
        """
        results = dict()
        column_with_nan = df.columns[df.isna().any()].tolist()
        results["columns_nan"] = column_with_nan
    
        # Count NaN Row
        rows_nan = df.isna().sum(axis=1)
        cnt_rows_nan = 0
        for r in rows_nan:
            if r != 0:
                cnt_rows_nan += 1
        
        results["n_rows_nan"] = cnt_rows_nan
        
        # Check Null
        column_with_null = df.columns[df.isnull().any()].tolist()
        results["columns_null"] = column_with_null
         
        # Count Null Row
        rows_null = df.isnull().sum(axis=1)
        cnt_rows_null = 0
        for r in rows_null:
            if r != 0:
                cnt_rows_null += 1
        
        results["n_rows_null"] = cnt_rows_null
        
        # Get number of rows, columns
        count_row, count_col = df.shape
        results["n_columns"] = count_col
        results["n_rows"] = count_row
        
        return results
       
    @staticmethod
    def get_sorted_coeff(model, X, y, dataframe):
        """
        To identify key feature, one way to do is to checking coefficient.
        The coefficient will show that which variable show variablity than the others (more important)
        
        The input data X must be standardized before using this function.
        Steps in this function:
            Fit model, Sort value by coefficient from large to small.
        
        """
        model.fit(X, y)
        result = pd.DataFrame(list(zip(model.coef_, dataframe.columns)), columns=['coefficient', 'name']).set_index('name')
        np.abs(result).sort_values(by='coefficient', ascending=False)
        
