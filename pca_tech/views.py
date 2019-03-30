from django.shortcuts import render
from django.views import View
from sklearn.decomposition import PCA
from django.http import JsonResponse
from diabetes_logic.diabetes_logic import DiabetesLogic
import codecs, json 
from django.core import serializers


# Create your views here.
class PcaTechView(View):
    
    def get(self, request):
        """
        Called from menu, forward to model creation page
        """
        return render(request, template_name='pca.html')


class PcaProcess(View):
    
    def post(self, request):
        """
        Take n_component and return eigenvalues for contributions
        """
        pca_n_component = request.POST["pca_n_component"]
        dataset_file_path = request.POST["dataset_file_path"]
        pca = PCA(n_components=int(pca_n_component));
        logic = DiabetesLogic()
        df = logic.read_dataset(dataset_file_path)
        X = df.iloc[:, 1:9]
        y = df.iloc[:, 0]
        print(X)
        print(y)
        pca.fit(X, y)
        eigenvalue = pca.singular_values_
        dic = {}
        dic['eigenvalue'] = eigenvalue.tolist()
        dic['msg'] = ""
        j = json.dumps(dic)
#         response = serializers.serialize('json', j)
        return JsonResponse(j, safe=False)
    
#     def get(self, request):
#         """
#         Take n_component and return eigenvalues for contributions
#         """
#         pca_n_component = request["pca_n_component"]
#         dataset_file_path = request["dataset_file_path"]
#         pca = PCA(n_components = pca_n_component);
#         
#         return JsonResponse({'msg':'The file has been uploaded successfully.'})
