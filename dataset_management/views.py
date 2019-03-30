from django.core import serializers

from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from dataset_management.forms import DatasetFileForm

from dataset_management.logic import ProcessDataset


class DatasetManagementView(View):
    
    def get(self, request):
        """
        Forward to main page of data management module.
        """
        return render(request, template_name='upload_dataset.html')
    
    
class DatasetManagementUpload(View):
    
    def get(self, request):
        """
        Forward to main page of data management module.
        """
        return render(request, template_name='upload_dataset.html')
    
    def post(self, request):
        """
        Forward to main page of data management module.
        """

        # if this is a POST request we need to process the form data
        if request.method == 'POST':
            # and request.FILES['file_train_test_data']
            # check whether it's valid:
            # create a form instance and populate it with data from the request:
            # form = DatasetFileForm(request.POST)
            form = DatasetFileForm(request.POST, request.FILES)
            if form.is_valid():
                # process the data in form.cleaned_data as required
                dataset_file = request.FILES['dataset_file']
                data_file = request.FILES['data_file']
                label_file = request.FILES['label_file']
                
                ProcessDataset.process_data(dataset_file, data_file, label_file, form);

                data = dict()
                # data['file_url'] = file_url
                json_serializer = serializers.get_serializer("json")()
                # response =  json_serializer.serialize(data, ensure_ascii=False, indent=2, use_natural_keys=True)
                # return HttpResponse(response, mimetype="application/json")
                return JsonResponse({'file_url': "temp", 'msg':'The file has been uploaded successfully.'})
            else:
                # Error 
                form = DatasetFileForm()
                return render(request, 'upload_dataset.html', {'form': form})
        else:
            return JsonResponse({'msg':'Failed'})
        
