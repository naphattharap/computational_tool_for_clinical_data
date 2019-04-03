from django.db import models
from django.forms import ModelForm


# Create your models here.
class Pca(models.Model):
    n_component = models.IntegerField()

    def __str__(self):
        return self.n_component
