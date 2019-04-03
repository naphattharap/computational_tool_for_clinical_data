'''
Created on Feb 6, 2019

@author: naphatthara
'''
from django.core.files.storage import FileSystemStorage
from naphyutils.dataframe import DataFrameUtil as df_util
from services.naphyutils.file import FileStorage
from config.constant import UploadFileConst


class ProcessDataset():
    '''
    Process dataset based on selected criterian
    '''

    @staticmethod
    def process_data(dataset_file, data_file, label_file, form):
        data_separator = form.data_separator
        ds_label_related = form.ds_label_related
        label_col_idx = form.label_col_idx
        nan_cleanup = form.nan_cleanup
        column_names = []
        separator = ","
        
        if form.upload_type == UploadFileConst.UPLOAD_DATA_LABEL_SEPARATE:
            
            form.key_column_idx
        
        elif form.upload_type == UploadFileConst.UPLOAD_DATA_LABEL:
            pass
        
        elif form.upload_type == UploadFileConst.UPLOAD_DATA_ONLY:
            pass
        
        fs = FileStorage()
        file_name = fs.save_file(dataset_file)
        # ProcessDataset.process_data(file_name, form)
        file_url = "temp"
        
        if data_separator == "single_space":
            separator = " "
        elif data_separator == "tab":
            separator = "\t"
        # read file
        # df = df_util.convert_to_dataframe(file_path, column_names, separator)
        # data clean up
        if nan_cleanup == "mean":
            # find mean of each column and replace NaN
            pass
        elif nan_cleanup == "median":
            # find median of each column and replace NaN
            pass
        elif nan_cleanup == "delete":
            # delete NaN rows
            # df_util.drop_na(df, columns_names)
            pass
