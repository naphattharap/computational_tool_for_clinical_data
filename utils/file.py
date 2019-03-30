'''
Created on Feb 6, 2019

@author: naphatthara
'''
from django.core.files.storage import FileSystemStorage

# TODO move to config
folder = 'train_test_data_files/' 


class ProcessDatasetFile():
    
    def __init__(self, file):
        self._file = file
    
    def save_file(self):
        pass
    
    def data_label_mapping(self):
        pass
    
    # Process NaN
    def delete_nan_row(self):
        pass
    
    def replace_nan_by_mean(self):
        pass
    
    def replace_nan_by_median(self):
        pass

    def split_data(self):
        pass

    
class FileStorage():

    @staticmethod
    def save_file(file):
        fs = FileSystemStorage(location=folder)  # defaults to   MEDIA_ROOT  
        filename = fs.save(file.name, file)
        return filename
        
