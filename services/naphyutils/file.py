'''
Created on Feb 6, 2019

@author: naphatthara
'''
from django.core.files.storage import FileSystemStorage
import glob
import os
from pathlib import Path

# TODO move to config
FILE_DB = '/Volumes/Work/UPF/thesis/FILE_DB/' 


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

    def __init__(self):
        self.fss = FileSystemStorage(location=FILE_DB)
        
    def get_base_location(self):
        return self.fss.base_location
    
    def save_file(self, file):
        filename = self.fss.save(file.name, file)
        return filename
    
    def is_file(self, file_full_path):
        config = Path(file_full_path) 
        if config.is_file(): 
            return True
        else:
            return False
        
    def list_all_files(self):
        """
        List all files in FILE DB, also in sub-directory
        """
        # List all folder in root
#         folders = [f for f in glob.glob(FILE_DB + "*", recursive=True)]
#         file_names = []
#         for f in folders:
#             file_names.append(f)
#         file_names = os.path.basename(FILE_DB)
        file_names = [os.path.basename(x) for x in glob.glob(FILE_DB + "*.*")]
        return file_names
