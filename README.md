# Patient Data Analysis by Machine Learning 
Machine Learning Application for Analyzing Patient Blood Test

IDE: Eclipse
Initial setting:
Import project by clicking on File > Open Projects from File System
Right click at the project and select PyDev > Set as Django Project

To run the project, right click on the project then select Django

## Install Django
$ sudo pip install Django

### Start project
$ django-admin.py startproject <project name>
$ python manage.py runserver

## Create a new module
###Change directory to the place where a new module will be created.
$ python manage.py startapp <module name>

###Manually add urls.py and serializers.py inside the module folder.
- Add urls.py and and serializers.py into a new module folder	
- Configure config file path to settings.py by adding path to INSTALLED_APP. Ex. data_mgt.apps.DataMgtConfig

### Register urls.py path in config folder

# Other python command
Install required libraries listed in requirments.txt file.

pip install -r requirements.txt
