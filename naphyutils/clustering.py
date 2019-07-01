from sklearn.cluster import MeanShift, estimate_bandwidth, KMeans
from sklearn.metrics import silhouette_score
from itertools import cycle
from scipy.cluster.hierarchy import ward, dendrogram, linkage

import numpy as np


class HierarchycalAnalysisUtil:
    
    @staticmethod
    def get_dendrogram(X):
        distance = linkage(X, 'ward')
        return dendrogram(distance, leaf_rotation=90, leaf_font_size=9.)


class MeanShiftUtil:

    @staticmethod
    def mean_shift(X, quantile=0.3, n_samples=None, random_state=0, n_jobs=None):
        """
        Get cluster center by => model.cluster_centers_ the result is x,y coordinate
        
        """
        bandwidth_X = estimate_bandwidth(X, quantile, n_samples, random_state, n_jobs)
        model = MeanShift(bandwidth=bandwidth_X, bin_seeding=True)
        model.fit(X)
        return model

    @staticmethod
    def get_number_of_clusters(model):
        """
        model - Fitted model of MeanShift
        Return number of unique labels in the fitted model
        """
        return len(np.unique(model.labels_))

    
class KMeanUtil:
    
    @staticmethod
    def get_kmean_model(X, n_clusters=8, random_state=None):
        """
        kmeans.labels_
        kmeans.cluster_centers_
        """
        kmeans = KMeans(n_clusters=n_clusters, random_state=random_state).fit(X)
        return kmeans
    
    @staticmethod
    def get_kmean_sse(X, n_cluster_from=1, n_cluster_to=10, random_state=None):
        """
        kmeans.labels_
        kmeans.cluster_centers_
        """
        sse_ = []
        for n in range(n_cluster_from, n_cluster_to):
            kmeans = KMeans(n_clusters=n, random_state=random_state).fit(X)
            sse_.append([n, kmeans.inertia_])
        return sse_
    
    @staticmethod
    def get_silhouette_score(X, n_cluster_from=1, n_cluster_to=10, random_state=None):
        """
        Return x,y 
        x - number of clusters
        y - sse
        """
        sse_ = []
        for n in range(n_cluster_from, n_cluster_to):
            kmeans = KMeans(n_clusters=n, random_state=random_state).fit(X)
            sse_.append([n, silhouette_score(X, kmeans.labels_)])
        
        return sse_
