from django.shortcuts import render
from django.views import View


# Create your views here.
class ModelMgt(View):
    
    def get(self, request):
        """
        Called from menu, forward to model creation page
        """
        return render(request, template_name='model_creation.html')
    
    
