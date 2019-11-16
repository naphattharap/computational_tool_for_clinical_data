"""
Django settings for thesis project.

Generated by 'django-admin startproject' using Django 2.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'muyg&jl5qm=cm*+@k_w$$&m5a@%#v1$h05&%nqx!vhrh1g^+gv'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# radiomics-exploration.herokuapp.com
ALLOWED_HOSTS = ['.herokuapp.com', '0.0.0.0', 'localhost', '127.0.0.1', '[::1]']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
        # third part
    'rest_framework',
    'django_extensions',
    # our project apps
    'login.apps.LoginConfig',
    'corr_explore.apps.CorrExploreConfig',
    # 'vis_brain.apps.VisBrainConfig',
    'main_menu.apps.MainMenuConfig',
    'data_preprocess.apps.DatasetManagementConfig',
    'core_bokeh.apps.CoreBokehConfig',
    'model_mgt.apps.ModelMgtConfig',
    'dimreduction.apps.DimreductionConfig',
    'db.apps.DbConfig',
    'visualization.apps.VisualizationConfig',
    'cluster.apps.ClusterConfig',
    'vis_radiomic.apps.VisRadiomicConfig',
    'vis_stratified_radiomic.apps.VisStratifiedRadiomicConfig',
    'feature_analysis.apps.FeatureAnalysisConfig'
    # Django
#     'django_plotly_dash.apps.DjangoPlotlyDashConfig'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ml_patient_analysis.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ml_patient_analysis.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/
# custom
import os.path
# BASE_DIR = os.path.dirname(os.path.dirname(__file__))
# PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
# STATIC_ROOT = os.path.join(PROJECT_DIR, 'static')
# STATIC_URL = '/static/'

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_TMP = os.path.join(BASE_DIR, 'static')  # solve error when deploy to heroku
STATIC_URL = '/static/'

os.makedirs(STATIC_TMP, exist_ok=True)  # solve error when deploy to heroku
os.makedirs(STATIC_ROOT, exist_ok=True)  # solve error when deploy to heroku

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

# STATICFILES_DIRS = [
#     os.path.join(PROJECT_DIR, "static"),
# ]
# print(BASE_DIR)
# print(STATIC_ROOT)
# print(STATIC_URL)
# print(STATICFILES_DIRS)

