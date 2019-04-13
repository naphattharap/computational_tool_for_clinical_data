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

  
class FileStorage():

    def __init__(self):
        self.fss = FileSystemStorage(location=FILE_DB)
        
    def get_base_location(self):
        return self.fss.base_location
    
    def save_file(self, file):
        filename = self.fss.save(file.name, file)
        return filename
    
    def save_file_as(self, file, name):
        filename = self.fss.save(name, file)
        return filename
    
    def is_file(self, file_full_path):
        config = Path(file_full_path) 
        if config.is_file(): 
            return True
        else:
            return False
        
    def is_file_in_base_location(self, file_name):
        """
        Return True when the file name is in the base storage, otherwise return false.
        """
        file_full_path = self.get_base_location() + file_name
        config = Path(file_full_path) 
        if config.is_file(): 
            return True
        else:
            return False
        
    def list_all_files(self, filter_file_name):
        """
        List all files in FILE DB, also in sub-directory
        """
        # Ex. "/dir1/dir2/[abc]*.tx?"
        filter_file = FILE_DB + "*" + filter_file_name + "*.*"
        print(filter_file)
        file_names = [os.path.basename(x) for x in glob.glob(filter_file)]
        return file_names
    
    def get_full_path(self, file_name):
        """
        Return file full path if it does exist in storage
        """
        if self.is_file_in_base_location(file_name):
            return self.get_base_location() + file_name
        else:
            return None
