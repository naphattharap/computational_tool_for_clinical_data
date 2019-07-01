// ======== SlickGrid =========

var data_view_medical_history;
var data_view_radiomic_result;
var all_grids = [];
var plugin = new Slick.ColumnGroup();
//======== SlickGrid Option =========

var options = {
  columnPicker: {
    columnTitle: "Columns",
    hideForceFitButton: false,
    hideSyncResizeButton: false, 
    forceFitTitle: "Force fit columns",
    syncResizeTitle: "Synchronous resize",
  },
  editable: false,
  enableAddRow: false,
  enableCellNavigation: true,
  asyncEditorLoading: true,
  forceFitColumns: false,
  topPanelHeight: 25,
  frozenColumn: 0, // Frozen first column
  enableColumnReorder: true //Group column
};
var sortcol = "id";
var sortdir = 1;
//var percentCompleteThreshold = 0;



// ========= Column to display in Grid ========
var columns_rediomic_result = [ "id",
	"0","1","2","3","4","5","6","7","8","9","10",
	"11", "12","13","14","15","16","17","18","19","20",
	"21","22","23","24","25","26","27","28","29","30"
];

// id, field, name
var radiomic_view_columns_name = [
	"f.eid",
	"Total|Radiomics|Shape|Volume|LV|ED",
	"Total|Radiomics|Shape|SurfaceArea|LV|ED",
	"Total|Radiomics|Shape|SurfaceAreatoVolumeRatio|LV|ED",
	"Total|Radiomics|Shape|Sphericity|LV|ED",
	"Total|Radiomics|Shape|SphericalDisproportion|LV|ED",
	"Total|Radiomics|Shape|Compactness|LV|ED",
	"Total|Radiomics|Shape|Compactness2|LV|ED",
	"Total|Radiomics|Shape|Max3Ddiameter|LV|ED",
	"Total|Radiomics|Shape|Max2DdiameterSlice|LV|ED",
	"Total|Radiomics|Shape|Max2DdiameterColumn|LV|ED",
	"Total|Radiomics|Shape|Max2DdiameterRow|LV|ED",
	"Total|Radiomics|Shape|MajorAxis|LV|ED",
	"Total|Radiomics|Shape|MinorAxis|LV|ED",
	"Total|Radiomics|Shape|LeastAxis|LV|ED",
	"Total|Radiomics|Shape|Elongation|LV|ED",
	"Total|Radiomics|Shape|Flatness|LV|ED",
	"Total|Radiomics|Shape|Volume|LV|ES",
	"Total|Radiomics|Shape|SurfaceArea|LV|ES",
	"Total|Radiomics|Shape|SurfaceAreatoVolumeRatio|LV|ES",
	"Total|Radiomics|Shape|Sphericity|LV|ES",
	"Total|Radiomics|Shape|SphericalDisproportion|LV|ES",
	"Total|Radiomics|Shape|Compactness|LV|ES",
	"Total|Radiomics|Shape|Compactness2|LV|ES",
	"Total|Radiomics|Shape|Max3Ddiameter|LV|ES",
	"Total|Radiomics|Shape|Max2DdiameterSlice|LV|ES",
	"Total|Radiomics|Shape|Max2DdiameterColumn|LV|ES",
	"Total|Radiomics|Shape|Max2DdiameterRow|LV|ES",
	"Total|Radiomics|Shape|MajAxis|LV|ES",
	"Total|Radiomics|Shape|MinorAxis|LV|ES",
	"Total|Radiomics|Shape|LeastAxis|LV|ES",
	"Total|Radiomics|Shape|Elongation|LV|ES",
	"Total|Radiomics|Shape|Flatness|LV|ES",
	"Total|Radiomics|Shape|Volume|RV|ED",
	"Total|Radiomics|Shape|SurfaceArea|RV|ED",
	"Total|Radiomics|Shape|SurfaceAreatoVolumeRatio|RV|ED",
	"Total|Radiomics|Shape|Sphericity|RV|ED",
	"Total|Radiomics|Shape|SphericalDisproportion|RV|ED",
	"Total|Radiomics|Shape|Compactness|RV|ED",
	"Total|Radiomics|Shape|Compactness2|RV|ED",
	"Total|Radiomics|Shape|Max3Ddiameter|RV|ED",
	"Total|Radiomics|Shape|Max2DdiameterSlice|RV|ED",
	"Total|Radiomics|Shape|Max2DdiameterColumn|RV|ED",
	"Total|Radiomics|Shape|Max2DdiameterRow|RV|ED",
	"Total|Radiomics|Shape|MajorAxis|RV|ED",
	"Total|Radiomics|Shape|MinorAxis|RV|ED",
	"Total|Radiomics|Shape|LeastAxis|RV|ED",
	"Total|Radiomics|Shape|Elongation|RV|ED",
	"Total|Radiomics|Shape|Flatness|RV|ED",
	"Total|Radiomics|Shape|Volume|RV|ES",
	"Total|Radiomics|Shape|SurfaceArea|RV|ES",
	"Total|Radiomics|Shape|SurfaceAreatoVolumeRatio|RV|ES",
	"Total|Radiomics|Shape|Sphericity|RV|ES",
	"Total|Radiomics|Shape|SphericalDisproportion|RV|ES",
	"Total|Radiomics|Shape|Compactness|RV|ES",
	"Total|Radiomics|Shape|Compactness2|RV|ES",
	"Total|Radiomics|Shape|Max3Ddiameter|RV|ES",
	"Total|Radiomics|Shape|Max2DdiameterSlice|RV|ES",
	"Total|Radiomics|Shape|Max2DdiameterColumn|RV|ES",
	"Total|Radiomics|Shape|Max2DdiameterRow|RV|ES",
	"Total|Radiomics|Shape|MajorAxis|RV|ES",
	"Total|Radiomics|Shape|MinorAxis|RV|ES",
	"Total|Radiomics|Shape|LeastAxis|RV|ES",
	"Total|Radiomics|Shape|Elongation|RV|ES",
	"Total|Radiomics|Shape|Flatness|RV|ES",
	"Total|Radiomics|Shape|Volume|MYO|ED",
	"Total|Radiomics|Shape|SurfaceArea|MYO|ED",
	"Total|Radiomics|Shape|SurfaceAreatoVolumeRatio|MYO|ED",
	"Total|Radiomics|Shape|Sphericity|MYO|ED",
	"Total|Radiomics|Shape|SphericalDisproportion|MYO|ED",
	"Total|Radiomics|Shape|Compactness|MYO|ED",
	"Total|Radiomics|Shape|Compactness2|MYO|ED",
	"Total|Radiomics|Shape|Max3Ddiameter|MYO|ED",
	"Total|Radiomics|Shape|Max2DdiameterSlice|MYO|ED",
	"Total|Radiomics|Shape|Max2DdiameterColumn|MYO|ED",
	"Total|Radiomics|Shape|Max2DdiameterRow|MYO|ED",
	"Total|Radiomics|Shape|MajorAxis|MYO|ED",
	"Total|Radiomics|Shape|MinorAxis|MYO|ED",
	"Total|Radiomics|Shape|LeastAxis|MYO|ED",
	"Total|Radiomics|Shape|Elongation|MYO|ED",
	"Total|Radiomics|Shape|Flatness|MYO|ED",
	"Total|Radiomics|Shape|Volume|MYO|ES",
	"Total|Radiomics|Shape|SurfaceArea|MYO|ES",
	"Total|Radiomics|Shape|SurfaceAreatoVolumeRatio|MYO|ES",
	"Total|Radiomics|Shape|Sphericity|MYO|ES",
	"Total|Radiomics|Shape|SphericalDisproportion|MYO|ES",
	"Total|Radiomics|Shape|Compactness|MYO|ES",
	"Total|Radiomics|Shape|Compactness2|MYO|ES",
	"Total|Radiomics|Shape|Max3Ddiameter|MYO|ES",
	"Total|Radiomics|Shape|Max2DdiameterSlice|MYO|ES",
	"Total|Radiomics|Shape|Max2DdiameterColumn|MYO|ES",
	"Total|Radiomics|Shape|Max2DdiameterRow|MYO|ES",
	"Total|Radiomics|Shape|MajorAxis|MYO|ES",
	"Total|Radiomics|Shape|MinorAxis|MYO|ES",
	"Total|Radiomics|Shape|LeastAxis|MYO|ES",
	"Total|Radiomics|Shape|Elongation|MYO|ES",
	"Total|Radiomics|Shape|Flatness|MYO|ES",
	"Total|Radiomics|FistOrder|Energy|LV|ED",
	"Total|Radiomics|FistOrder|TotalEnergy|LV|ED",
	"Total|Radiomics|FistOrder|Entropy|LV|ED",
	"Total|Radiomics|FistOrder|Minimum|LV|ED",
	"Total|Radiomics|FistOrder|Percentile10|LV|ED",
	"Total|Radiomics|FistOrder|Percentile90|LV|ED",
	"Total|Radiomics|FistOrder|Maximum|LV|ED",
	"Total|Radiomics|FistOrder|Mean|LV|ED",
	"Total|Radiomics|FistOrder|Median|LV|ED",
	"Total|Radiomics|FistOrder|InterquartileRange|LV|ED",
	"Total|Radiomics|FistOrder|Range|LV|ED",
	"Total|Radiomics|FistOrder|MeanAbsoluteDeviation|LV|ED",
	"Total|Radiomics|FistOrder|RobustMeanAbsoluteDeviation|LV|ED",
	"Total|Radiomics|FistOrder|RootMeanSquared|LV|ED",
	"Total|Radiomics|FistOrder|StandardDeviation|LV|ED",
	"Total|Radiomics|FistOrder|Skewness|LV|ED",
	"Total|Radiomics|FistOrder|Kurtosis|LV|ED",
	"Total|Radiomics|FistOrder|Variance|LV|ED",
	"Total|Radiomics|FistOrder|Uniformity|LV|ED",
	"Total|Radiomics|FistOrder|Energy|LV|ES",
	"Total|Radiomics|FistOrder|TotalEnergy|LV|ES",
	"Total|Radiomics|FistOrder|Entropy|LV|ES",
	"Total|Radiomics|FistOrder|Minimum|LV|ES",
	"Total|Radiomics|FistOrder|Percentile10|LV|ES",
	"Total|Radiomics|FistOrder|Percentile90|LV|ES",
	"Total|Radiomics|FistOrder|Maximum|LV|ES",
	"Total|Radiomics|FistOrder|Mean|LV|ES",
	"Total|Radiomics|FistOrder|Median|LV|ES",
	"Total|Radiomics|FistOrder|InterquartileRange|LV|ES",
	"Total|Radiomics|FistOrder|Range|LV|ES",
	"Total|Radiomics|FistOrder|MeanAbsoluteDeviation|LV|ES",
	"Total|Radiomics|FistOrder|RobustMeanAbsoluteDeviation|LV|ES",
	"Total|Radiomics|FistOrder|RootMeanSquared|LV|ES",
	"Total|Radiomics|FistOrder|StandardDeviation|LV|ES",
	"Total|Radiomics|FistOrder|Skewness|LV|ES",
	"Total|Radiomics|FistOrder|Kurtosis|LV|ES",
	"Total|Radiomics|FistOrder|Variance|LV|ES",
	"Total|Radiomics|FistOrder|Uniformity|LV|ES",
	"Total|Radiomics|FistOrder|Energy|RV|ED",
	"Total|Radiomics|FistOrder|TotalEnergy|RV|ED",
	"Total|Radiomics|FistOrder|Entropy|RV|ED",
	"Total|Radiomics|FistOrder|Minimum|RV|ED",
	"Total|Radiomics|FistOrder|Percentile10|RV|ED",
	"Total|Radiomics|FistOrder|Percentile90|RV|ED",
	"Total|Radiomics|FistOrder|Maximum|RV|ED",
	"Total|Radiomics|FistOrder|Mean|RV|ED",
	"Total|Radiomics|FistOrder|Median|RV|ED",
	"Total|Radiomics|FistOrder|InterquartileRange|RV|ED",
	"Total|Radiomics|FistOrder|Range|RV|ED",
	"Total|Radiomics|FistOrder|MeanAbsoluteDeviation|RV|ED",
	"Total|Radiomics|FistOrder|RobustMeanAbsoluteDeviation|RV|ED",
	"Total|Radiomics|FistOrder|RootMeanSquared|RV|ED",
	"Total|Radiomics|FistOrder|StandardDeviation|RV|ED",
	"Total|Radiomics|FistOrder|Skewness|RV|ED",
	"Total|Radiomics|FistOrder|Kurtosis|RV|ED",
	"Total|Radiomics|FistOrder|Variance|RV|ED",
	"Total|Radiomics|FistOrder|Uniformity|RV|ED",
	"Total|Radiomics|FistOrder|Energy|RV|ES",
	"Total|Radiomics|FistOrder|TotalEnergy|RV|ES",
	"Total|Radiomics|FistOrder|Entropy|RV|ES",
	"Total|Radiomics|FistOrder|Minimum|RV|ES",
	"Total|Radiomics|FistOrder|Percentile10|RV|ES",
	"Total|Radiomics|FistOrder|Percentile90|RV|ES",
	"Total|Radiomics|FistOrder|Maximum|RV|ES",
	"Total|Radiomics|FistOrder|Mean|RV|ES",
	"Total|Radiomics|FistOrder|Median|RV|ES",
	"Total|Radiomics|FistOrder|InterquartileRange|RV|ES",
	"Total|Radiomics|FistOrder|Range|RV|ES",
	"Total|Radiomics|FistOrder|MeanAbsoluteDeviation|RV|ES",
	"Total|Radiomics|FistOrder|RobustMeanAbsoluteDeviation|RV|ES",
	"Total|Radiomics|FistOrder|RootMeanSquared|RV|ES",
	"Total|Radiomics|FistOrder|StandardDeviation|RV|ES",
	"Total|Radiomics|FistOrder|Skewness|RV|ES",
	"Total|Radiomics|FistOrder|Kurtosis|RV|ES",
	"Total|Radiomics|FistOrder|Variance|RV|ES",
	"Total|Radiomics|FistOrder|Uniformity|RV|ES",
	"Total|Radiomics|FistOrder|Energy|MYO|ED",
	"Total|Radiomics|FistOrder|TotalEnergy|MYO|ED",
	"Total|Radiomics|FistOrder|Entropy|MYO|ED",
	"Total|Radiomics|FistOrder|Minimum|MYO|ED",
	"Total|Radiomics|FistOrder|Percentile10|MYO|ED",
	"Total|Radiomics|FistOrder|Percentile90|MYO|ED",
	"Total|Radiomics|FistOrder|Maximum|MYO|ED",
	"Total|Radiomics|FistOrder|Mean|MYO|ED",
	"Total|Radiomics|FistOrder|Median|MYO|ED",
	"Total|Radiomics|FistOrder|InterquartileRange|MYO|ED",
	"Total|Radiomics|FistOrder|Range|MYO|ED",
	"Total|Radiomics|FistOrder|MeanAbsoluteDeviation|MYO|ED",
	"Total|Radiomics|FistOrder|RobustMeanAbsoluteDeviation|MYO|ED",
	"Total|Radiomics|FistOrder|RootMeanSquared|MYO|ED",
	"Total|Radiomics|FistOrder|StandardDeviation|MYO|ED",
	"Total|Radiomics|FistOrder|Skewness|MYO|ED",
	"Total|Radiomics|FistOrder|Kurtosis|MYO|ED",
	"Total|Radiomics|FistOrder|Variance|MYO|ED",
	"Total|Radiomics|FistOrder|Uniformity|MYO|ED",
	"Total|Radiomics|FistOrder|Energy|MYO|ES",
	"Total|Radiomics|FistOrder|TotalEnergy|MYO|ES",
	"Total|Radiomics|FistOrder|Entropy|MYO|ES",
	"Total|Radiomics|FistOrder|Min|MYO|ES",
	"Total|Radiomics|FistOrder|Percentile10|MYO|ES",
	"Total|Radiomics|FistOrder|Percentile90|MYO|ES",
	"Total|Radiomics|FistOrder|Maximum|MYO|ES",
	"Total|Radiomics|FistOrder|Mean|MYO|ES",
	"Total|Radiomics|FistOrder|Median|MYO|ES",
	"Total|Radiomics|FistOrder|InterquartileRange|MYO|ES",
	"Total|Radiomics|FistOrder|Range|MYO|ES",
	"Total|Radiomics|FistOrder|MeanAbsoluteDeviation|MYO|ES",
	"Total|Radiomics|FistOrder|RobustMeanAbsoluteDeviation|MYO|ES",
	"Total|Radiomics|FistOrder|RootMeanSquared|MYO|ES",
	"Total|Radiomics|FistOrder|StandardDeviation|MYO|ES",
	"Total|Radiomics|FistOrder|Skewness|MYO|ES",
	"Total|Radiomics|FistOrder|Kurtosis|MYO|ES",
	"Total|Radiomics|FistOrder|Variance|MYO|ES",
	"Total|Radiomics|FistOrder|Uniformity|MYO|ES",
	"Total|Radiomics|glcm|Autocorrelation|LV|ED",
	"Total|Radiomics|glcm|JointAverage|LV|ED",
	"Total|Radiomics|glcm|ClusterProminence|LV|ED",
	"Total|Radiomics|glcm|ClusterShade|LV|ED",
	"Total|Radiomics|glcm|ClusterTendency|LV|ED",
	"Total|Radiomics|glcm|Contrast|LV|ED",
	"Total|Radiomics|glcm|Correlation|LV|ED",
	"Total|Radiomics|glcm|DifferenceAverage|LV|ED",
	"Total|Radiomics|glcm|DifferenceEntropy|LV|ED",
	"Total|Radiomics|glcm|DifferenceVariance|LV|ED",
	"Total|Radiomics|glcm|Dissimilarity|LV|ED",
	"Total|Radiomics|glcm|JointEnergy|LV|ED",
	"Total|Radiomics|glcm|JointEntropy|LV|ED",
	"Total|Radiomics|glcm|Homogeneity1|LV|ED",
	"Total|Radiomics|glcm|Homogeneity2|LV|ED",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation1|LV|ED",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation2|LV|ED",
	"Total|Radiomics|glcm|InverseDifferenceMoment|LV|ED",
	"Total|Radiomics|glcm|InverseDifferenceMomentNormalized|LV|ED",
	"Total|Radiomics|glcm|InverseDifference|LV|ED",
	"Total|Radiomics|glcm|InverseDifferenceNormalized|LV|ED",
	"Total|Radiomics|glcm|InverseVariance|LV|ED",
	"Total|Radiomics|glcm|MaximumProbability|LV|ED",
	"Total|Radiomics|glcm|SumAverage|LV|ED",
	"Total|Radiomics|glcm|SumEntropy|LV|ED",
	"Total|Radiomics|glcm|SumofSquares|LV|ED",
	"Total|Radiomics|glcm|Autocorrelation|LV|ES",
	"Total|Radiomics|glcm|JointAverage|LV|ES",
	"Total|Radiomics|glcm|ClusterProminence|LV|ES",
	"Total|Radiomics|glcm|ClusterShade|LV|ES",
	"Total|Radiomics|glcm|ClusterTendency|LV|ES",
	"Total|Radiomics|glcm|Contrast|LV|ES",
	"Total|Radiomics|glcm|Correlation|LV|ES",
	"Total|Radiomics|glcm|DifferenceAverage|LV|ES",
	"Total|Radiomics|glcm|DifferenceEntropy|LV|ES",
	"Total|Radiomics|glcm|DifferenceVariance|LV|ES",
	"Total|Radiomics|glcm|Dissimilarity|LV|ES",
	"Total|Radiomics|glcm|JointEnergy|LV|ES",
	"Total|Radiomics|glcm|JointEntropy|LV|ES",
	"Total|Radiomics|glcm|Homogeneity1|LV|ES",
	"Total|Radiomics|glcm|Homogeneity2|LV|ES",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation1|LV|ES",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation2|LV|ES",
	"Total|Radiomics|glcm|InverseDifferenceMoment|LV|ES",
	"Total|Radiomics|glcm|InverseDifferenceMomentNormalized|LV|ES",
	"Total|Radiomics|glcm|InverseDifference|LV|ES",
	"Total|Radiomics|glcm|InverseDifferenceNormalized|LV|ES",
	"Total|Radiomics|glcm|InverseVariance|LV|ES",
	"Total|Radiomics|glcm|MaximumProbability|LV|ES",
	"Total|Radiomics|glcm|SumAverage|LV|ES",
	"Total|Radiomics|glcm|SumEntropy|LV|ES",
	"Total|Radiomics|glcm|SumofSquares|LV|ES",
	"Total|Radiomics|glcm|Autocorrelation|RV|ED",
	"Total|Radiomics|glcm|JointAverage|RV|ED",
	"Total|Radiomics|glcm|ClusterProminence|RV|ED",
	"Total|Radiomics|glcm|ClusterShade|RV|ED",
	"Total|Radiomics|glcm|ClusterTendency|RV|ED",
	"Total|Radiomics|glcm|Contrast|RV|ED",
	"Total|Radiomics|glcm|Correlation|RV|ED",
	"Total|Radiomics|glcm|DifferenceAverage|RV|ED",
	"Total|Radiomics|glcm|DifferenceEntropy|RV|ED",
	"Total|Radiomics|glcm|DifferenceVariance|RV|ED",
	"Total|Radiomics|glcm|Dissimilarity|RV|ED",
	"Total|Radiomics|glcm|JointEnergy|RV|ED",
	"Total|Radiomics|glcm|JointEntropy|RV|ED",
	"Total|Radiomics|glcm|Homogeneity1|RV|ED",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation1|RV|ED",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation2|RV|ED",
	"Total|Radiomics|glcm|InverseDifferenceMoment|RV|ED",
	"Total|Radiomics|glcm|InverseDifferenceMomentNormalized|RV|ED",
	"Total|Radiomics|glcm|InverseDifference|RV|ED",
	"Total|Radiomics|glcm|InverseDifferenceNormalized|RV|ED",
	"Total|Radiomics|glcm|InverseVariance|RV|ED",
	"Total|Radiomics|glcm|MaximumProbability|RV|ED",
	"Total|Radiomics|glcm|SumAverage|RV|ED",
	"Total|Radiomics|glcm|SumEntropy|RV|ED",
	"Total|Radiomics|glcm|SumofSquares|RV|ED",
	"Total|Radiomics|glcm|Autocorrelation|RV|ES",
	"Total|Radiomics|glcm|JointAverage|RV|ES",
	"Total|Radiomics|glcm|ClusterProminence|RV|ES",
	"Total|Radiomics|glcm|ClusterShade|RV|ES",
	"Total|Radiomics|glcm|ClusterTendency|RV|ES",
	"Total|Radiomics|glcm|Contrast|RV|ES",
	"Total|Radiomics|glcm|Correlation|RV|ES",
	"Total|Radiomics|glcm|DifferenceAverage|RV|ES",
	"Total|Radiomics|glcm|DifferenceEntropy|RV|ES",
	"Total|Radiomics|glcm|DifferenceVariance|RV|ES",
	"Total|Radiomics|glcm|Dissimilarity|RV|ES",
	"Total|Radiomics|glcm|JointEnergy|RV|ES",
	"Total|Radiomics|glcm|JointEntropy|RV|ES",
	"Total|Radiomics|glcm|Homogeneity1|RV|ES",
	"Total|Radiomics|glcm|Homogeneity2|RV|ES",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation1|RV|ES",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation2|RV|ES",
	"Total|Radiomics|glcm|InverseDifferenceMoment|RV|ES",
	"Total|Radiomics|glcm|InverseDifferenceMomentNormalized|RV|ES",
	"Total|Radiomics|glcm|InverseDifference|RV|ES",
	"Total|Radiomics|glcm|InverseDifferenceNormalized|RV|ES",
	"Total|Radiomics|glcm|InverseVariance|RV|ES",
	"Total|Radiomics|glcm|MaximumProbability|RV|ES",
	"Total|Radiomics|glcm|SumAverage|RV|ES",
	"Total|Radiomics|glcm|SumEntropy|RV|ES",
	"Total|Radiomics|glcm|SumofSquares|RV|ES",
	"Total|Radiomics|glcm|Autocorrelation|MYO|ED",
	"Total|Radiomics|glcm|JointAverage|MYO|ED",
	"Total|Radiomics|glcm|ClusterProminence|MYO|ED",
	"Total|Radiomics|glcm|ClusterShade|MYO|ED",
	"Total|Radiomics|glcm|ClusterTendency|MYO|ED",
	"Total|Radiomics|glcm|Contrast|MYO|ED",
	"Total|Radiomics|glcm|Correlation|MYO|ED",
	"Total|Radiomics|glcm|DifferenceAverage|MYO|ED",
	"Total|Radiomics|glcm|DifferenceEntropy|MYO|ED",
	"Total|Radiomics|glcm|DifferenceVariance|MYO|ED",
	"Total|Radiomics|glcm|Dissimilarity|MYO|ED",
	"Total|Radiomics|glcm|JointEnergy|MYO|ED",
	"Total|Radiomics|glcm|JointEntropy|MYO|ED",
	"Total|Radiomics|glcm|Homogeneity1|MYO|ED",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation1|MYO|ED",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation2|MYO|ED",
	"Total|Radiomics|glcm|InverseDifferenceMoment|MYO|ED",
	"Total|Radiomics|glcm|InverseDifferenceMomentNormalized|MYO|ED",
	"Total|Radiomics|glcm|InverseDifference|MYO|ED",
	"Total|Radiomics|glcm|InverseDifferenceNormalized|MYO|ED",
	"Total|Radiomics|glcm|InverseVariance|MYO|ED",
	"Total|Radiomics|glcm|MaximumProbability|MYO|ED",
	"Total|Radiomics|glcm|SumAverage|MYO|ED",
	"Total|Radiomics|glcm|SumEntropy|MYO|ED",
	"Total|Radiomics|glcm|SumofSquares|MYO|ED",
	"Total|Radiomics|glcm|Autocorrelation|MYO|ES",
	"Total|Radiomics|glcm|JointAverage|MYO|ES",
	"Total|Radiomics|glcm|ClusterProminence|MYO|ES",
	"Total|Radiomics|glcm|ClusterShade|MYO|ES",
	"Total|Radiomics|glcm|ClusterTendency|MYO|ES",
	"Total|Radiomics|glcm|Contrast|MYO|ES",
	"Total|Radiomics|glcm|Correlation|MYO|ES",
	"Total|Radiomics|glcm|DifferenceAverage|MYO|ES",
	"Total|Radiomics|glcm|DifferenceEntropy|MYO|ES",
	"Total|Radiomics|glcm|DifferenceVariance|MYO|ES",
	"Total|Radiomics|glcm|Dissimilarity|MYO|ES",
	"Total|Radiomics|glcm|JointEnergy|MYO|ES",
	"Total|Radiomics|glcm|JointEntropy|MYO|ES",
	"Total|Radiomics|glcm|Homogeneity1|MYO|ES",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation1|MYO|ES",
	"Total|Radiomics|glcm|InformalMeasureofCorrelation2|MYO|ES",
	"Total|Radiomics|glcm|InverseDifferenceMoment|MYO|ES",
	"Total|Radiomics|glcm|InverseDifferenceMomentNormalized|MYO|ES",
	"Total|Radiomics|glcm|InverseDifference|MYO|ES",
	"Total|Radiomics|glcm|InverseDifferenceNormalized|MYO|ES",
	"Total|Radiomics|glcm|InverseVariance|MYO|ES",
	"Total|Radiomics|glcm|MaximumProbability|MYO|ES",
	"Total|Radiomics|glcm|SumAverage|MYO|ES",
	"Total|Radiomics|glcm|SumEntropy|MYO|ES",
	"Total|Radiomics|glcm|SumofSquares|MYO|ES",
	"Total|Radiomics|glszm|SmallAreaEmphasis|LV|ED",
	"Total|Radiomics|glszm|LargeAreaEmphasis|LV|ED",
	"Total|Radiomics|glszm|GrayLevelNonUniformity|LV|ED",
	"Total|Radiomics|glszm|GrayLevelNonUniformityNormalized|LV|ED",
	"Total|Radiomics|glszm|SizeZoneNonUniformity|LV|ED",
	"Total|Radiomics|glszm|SizeZoneNonUniformityNormalized|LV|ED",
	"Total|Radiomics|glszm|ZonePercentage|LV|ED",
	"Total|Radiomics|glszm|GrayLevelVariance|LV|ED",
	"Total|Radiomics|glszm|ZoneVariance|LV|ED",
	"Total|Radiomics|glszm|ZoneEntropy|LV|ED",
	"Total|Radiomics|glszm|LowGrayLevelZoneEmphasis|LV|ED",
	"Total|Radiomics|glszm|HighGrayLevelZoneEmphasis|LV|ED",
	"Total|Radiomics|glszm|SmallAreaLowGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glszm|SmallAreaHighGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glszm|LargeAreaLowGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glszm|LargeAreaHighGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glszm|SmallAreaEmphasis|LV|ES",
	"Total|Radiomics|glszm|LargeAreaEmphasis|LV|ES",
	"Total|Radiomics|glszm|GrayLevelNonUniformity|LV|ES",
	"Total|Radiomics|glszm|GrayLevelNonUniformityNormalized|LV|ES",
	"Total|Radiomics|glszm|SizeZoneNonUniformity|LV|ES",
	"Total|Radiomics|glszm|SizeZoneNonUniformityNormalized|LV|ES",
	"Total|Radiomics|glszm|ZonePercentage|LV|ES",
	"Total|Radiomics|glszm|GrayLevelVariance|LV|ES",
	"Total|Radiomics|glszm|ZoneVariance|LV|ES",
	"Total|Radiomics|glszm|ZoneEntropy|LV|ES",
	"Total|Radiomics|glszm|LowGrayLevelZoneEmphasis|LV|ES",
	"Total|Radiomics|glszm|HighGrayLevelZoneEmphasis|LV|ES",
	"Total|Radiomics|glszm|SmallAreaLowGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glszm|SmallAreaHighGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glszm|LargeAreaLowGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glszm|LargeAreaHighGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glszm|SmallAreaEmphasis|RV|ED",
	"Total|Radiomics|glszm|LargeAreaEmphasis|RV|ED",
	"Total|Radiomics|glszm|GrayLevelNonUniformity|RV|ED",
	"Total|Radiomics|glszm|GrayLevelNonUniformityNormalized|RV|ED",
	"Total|Radiomics|glszm|SizeZoneNonUniformity|RV|ED",
	"Total|Radiomics|glszm|SizeZoneNonUniformityNormalized|RV|ED",
	"Total|Radiomics|glszm|ZonePercentage|RV|ED",
	"Total|Radiomics|glszm|GrayLevelVariance|RV|ED",
	"Total|Radiomics|glszm|ZoneVariance|RV|ED",
	"Total|Radiomics|glszm|ZoneEntropy|RV|ED",
	"Total|Radiomics|glszm|LowGrayLevelZoneEmphasis|RV|ED",
	"Total|Radiomics|glszm|HighGrayLevelZoneEmphasis|RV|ED",
	"Total|Radiomics|glszm|SmallAreaLowGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glszm|SmallAreaHighGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glszm|LargeAreaLowGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glszm|LargeAreaHighGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glszm|SmallAreaEmphasi|RV|ES",
	"Total|Radiomics|glszm|LargeAreaEmphasis|RV|ES",
	"Total|Radiomics|glszm|GrayLevelNonUniformity|RV|ES",
	"Total|Radiomics|glszm|GrayLevelNonUniformityNormalized|RV|ES",
	"Total|Radiomics|glszm|SizeZoneNonUniformity|RV|ES",
	"Total|Radiomics|glszm|SizeZoneNonUniformityNormalized|RV|ES",
	"Total|Radiomics|glszm|ZonePercentage|RV|ES",
	"Total|Radiomics|glszm|GrayLevelVariance|RV|ES",
	"Total|Radiomics|glszm|ZoneVariance|RV|ES",
	"Total|Radiomics|glszm|ZoneEntropy|RV|ES",
	"Total|Radiomics|glszm|LowGrayLevelZoneEmphasis|RV|ES",
	"Total|Radiomics|glszm|HighGrayLevelZoneEmphasis|RV|ES",
	"Total|Radiomics|glszm|SmallAreaLowGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glszm|SmallAreaHighGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glszm|LargeAreaLowGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glszm|LargeAreaHighGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glszm|SmallAreaEmphasis|MYO|ED",
	"Total|Radiomics|glszm|LargeAreaEmphasis|MYO|ED",
	"Total|Radiomics|glszm|GrayLevelNonUniformity|MYO|ED",
	"Total|Radiomics|glszm|GrayLevelNonUniformityNormalized|MYO|ED",
	"Total|Radiomics|glszm|SizeZoneNonUniformity|MYO|ED",
	"Total|Radiomics|glszm|SizeZoneNonUniformityNormalized|MYO|ED",
	"Total|Radiomics|glszm|ZonePercentage|MYO|ED",
	"Total|Radiomics|glszm|GrayLevelVariance|MYO|ED",
	"Total|Radiomics|glszm|ZoneVariance|MYO|ED",
	"Total|Radiomics|glszm|ZoneEntropy|MYO|ED",
	"Total|Radiomics|glszm|LowGrayLevelZoneEmphasis|MYO|ED",
	"Total|Radiomics|glszm|HighGrayLevelZoneEmphasis|MYO|ED",
	"Total|Radiomics|glszm|SmallAreaLowGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glszm|SmallAreaHighGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glszm|LargeAreaLowGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glszm|LargeAreaHighGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glszm|SmallAreaEmphasis|MYO|ES",
	"Total|Radiomics|glszm|LargeAreaEmphasis|MYO|ES",
	"Total|Radiomics|glszm|GrayLevelNonUniformity|MYO|ES",
	"Total|Radiomics|glszm|GrayLevelNonUniformityNormalized|MYO|ES",
	"Total|Radiomics|glszm|SizeZoneNonUniformity|MYO|ES",
	"Total|Radiomics|glszm|SizeZoneNonUniformityNormalized|MYO|ES",
	"Total|Radiomics|glszm|ZonePercentage|MYO|ES",
	"Total|Radiomics|glszm|GrayLevelVariance|MYO|ES",
	"Total|Radiomics|glszm|ZoneVariance|MYO|ES",
	"Total|Radiomics|glszm|ZoneEntropy|MYO|ES",
	"Total|Radiomics|glszm|LowGrayLevelZoneEmphasis|MYO|ES",
	"Total|Radiomics|glszm|HighGrayLevelZoneEmphasis|MYO|ES",
	"Total|Radiomics|glszm|SmallAreaLowGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|glszm|SmallAreaHighGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|glszm|LargeAreaLowGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|glszm|LargeAreaHighGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|ShortRunEmphasis|LV|ED",
	"Total|Radiomics|glrlm|LongRunEmphasis|LV|ED",
	"Total|Radiomics|glrlm|GrayLevelNonUniformity|LV|ED",
	"Total|Radiomics|glrlm|GrayLevelNonUniformityNormalized|LV|ED",
	"Total|Radiomics|glrlm|RunLengthNonUniformity|LV|ED",
	"Total|Radiomics|glrlm|RunLengthNonUniformityNormalized|LV|ED",
	"Total|Radiomics|glrlm|RunPercentage|LV|ED",
	"Total|Radiomics|glrlm|GrayLevelVariance|LV|ED",
	"Total|Radiomics|glrlm|RunVariance|LV|ED",
	"Total|Radiomics|glrlm|RunEntropy|LV|ED",
	"Total|Radiomics|glrlm|LowGrayLevelRunEmphasis|LV|ED",
	"Total|Radiomics|glrlm|HighGrayLevelRunEmphasis|LV|ED",
	"Total|Radiomics|glrlm|ShortRunLowGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glrlm|ShortRunHighGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glrlm|LongRunLowGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glrlm|LongRunHighGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|glrlm|ShortRunEmphasis|LV|ES",
	"Total|Radiomics|glrlm|LongRunEmphasis|LV|ES",
	"Total|Radiomics|glrlm|GrayLevelNonUniformity|LV|ES",
	"Total|Radiomics|glrlm|GrayLevelNonUniformityNormalized|LV|ES",
	"Total|Radiomics|glrlm|RunLengthNonUniformity|LV|ES",
	"Total|Radiomics|glrlm|RunLengthNonUniformityNormalized|LV|ES",
	"Total|Radiomics|glrlm|RunPercentage|LV|ES",
	"Total|Radiomics|glrlm|GrayLevelVariance|LV|ES",
	"Total|Radiomics|glrlm|RunVariance|LV|ES",
	"Total|Radiomics|glrlm|RunEntropy|LV|ES",
	"Total|Radiomics|glrlm|LowGrayLevelRunEmphasis|LV|ES",
	"Total|Radiomics|glrlm|HighGrayLevelRunEmphasis|LV|ES",
	"Total|Radiomics|glrlm|ShortRunLowGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glrlm|ShortRunHighGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glrlm|LongRunLowGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glrlm|LongRunHighGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|glrlm|ShortRunEmphasis|RV|ED",
	"Total|Radiomics|glrlm|LongRunEmphasis|RV|ED",
	"Total|Radiomics|glrlm|GrayLevelNonUniformity|RV|ED",
	"Total|Radiomics|glrlm|GrayLevelNonUniformityNormalized|RV|ED",
	"Total|Radiomics|glrlm|RunLengthNonUniformity|RV|ED",
	"Total|Radiomics|glrlm|RunLengthNonUniformityNormalized|RV|ED",
	"Total|Radiomics|glrlm|RunPercentage|RV|ED",
	"Total|Radiomics|glrlm|GrayLevelVariance|RV|ED",
	"Total|Radiomics|glrlm|RunVariance|RV|ED",
	"Total|Radiomics|glrlm|RunEntropy|RV|ED",
	"Total|Radiomics|glrlm|LowGrayLevelRunEmphasis|RV|ED",
	"Total|Radiomics|glrlm|HighGrayLevelRunEmphasis|RV|ED",
	"Total|Radiomics|glrlm|ShortRunLowGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glrlm|ShortRunHighGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glrlm|LongRunLowGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glrlm|LongRunHighGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|glrlm|ShortRunEmphasis|RV|ES",
	"Total|Radiomics|glrlm|LongRunEmphasis|RV|ES",
	"Total|Radiomics|glrlm|GrayLevelNonUniformity|RV|ES",
	"Total|Radiomics|glrlm|GrayLevelNonUniformityNormalized|RV|ES",
	"Total|Radiomics|glrlm|RunLengthNonUniformity|RV|ES",
	"Total|Radiomics|glrlm|RunLengthNonUniformityNormalized|RV|ES",
	"Total|Radiomics|glrlm|RunPercentage|RV|ES",
	"Total|Radiomics|glrlm|GrayLevelVariance|RV|ES",
	"Total|Radiomics|glrlm|RunVariance|RV|ES",
	"Total|Radiomics|glrlm|RunEntropy|RV|ES",
	"Total|Radiomics|glrlm|LowGrayLevelRunEmphasis|RV|ES",
	"Total|Radiomics|glrlm|HighGrayLevelRunEmphasis|RV|ES",
	"Total|Radiomics|glrlm|ShortRunLowGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glrlm|ShortRunHighGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glrlm|LongRunLowGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glrlm|LongRunHighGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|glrlm|ShortRunEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|LongRunEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|GrayLevelNonUniformity|MYO|ED",
	"Total|Radiomics|glrlm|GrayLevelNonUniformityNormalized|MYO|ED",
	"Total|Radiomics|glrlm|RunLengthNonUniformity|MYO|ED",
	"Total|Radiomics|glrlm|RunLengthNonUniformityNormalized|MYO|ED",
	"Total|Radiomics|glrlm|RunPercentage|MYO|ED",
	"Total|Radiomics|glrlm|GrayLevelVariance|MYO|ED",
	"Total|Radiomics|glrlm|RunVariance|MYO|ED",
	"Total|Radiomics|glrlm|RunEntropy|MYO|ED",
	"Total|Radiomics|glrlm|LowGrayLevelRunEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|HighGrayLevelRunEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|ShortRunLowGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|ShortRunHighGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|LongRunLowGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|LongRunHighGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|glrlm|ShortRunEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|LongRunEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|GrayLevelNonUniformity|MYO|ES",
	"Total|Radiomics|glrlm|GrayLevelNonUniformityNormalized|MYO|ES",
	"Total|Radiomics|glrlm|RunLengthNonUniformity|MYO|ES",
	"Total|Radiomics|glrlm|RunLengthNonUniformityNormalized|MYO|ES",
	"Total|Radiomics|glrlm|RunPercentage|MYO|ES",
	"Total|Radiomics|glrlm|GrayLevelVariance|MYO|ES",
	"Total|Radiomics|glrlm|RunVariance|MYO|ES",
	"Total|Radiomics|glrlm|RunEntropy|MYO|ES",
	"Total|Radiomics|glrlm|LowGrayLevelRunEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|HighGrayLevelRunEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|ShortRunLowGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|ShortRunHighGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|LongRunLowGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|glrlm|LongRunHighGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|ngtdm|Coarseness|LV|ED",
	"Total|Radiomics|ngtdm|Contrast|LV|ED",
	"Total|Radiomics|ngtdm|Busyness|LV|ED",
	"Total|Radiomics|ngtdm|Complexity|LV|ED",
	"Total|Radiomics|ngtdm|Strength|LV|ED",
	"Total|Radiomics|ngtdm|Coarseness|LV|ES",
	"Total|Radiomics|ngtdm|Contrast|LV|ES",
	"Total|Radiomics|ngtdm|Busyness|LV|ES",
	"Total|Radiomics|ngtdm|Complexity|LV|ES",
	"Total|Radiomics|ngtdm|Strength|LV|ES",
	"Total|Radiomics|ngtdm|Coarseness|RV|ED",
	"Total|Radiomics|ngtdm|Contrast|RV|ED",
	"Total|Radiomics|ngtdm|Busyness|RV|ED",
	"Total|Radiomics|ngtdm|Complexity|RV|ED",
	"Total|Radiomics|ngtdm|Strength|RV|ED",
	"Total|Radiomics|ngtdm|Coarseness|RV|ES",
	"Total|Radiomics|ngtdm|Contrast|RV|ES",
	"Total|Radiomics|ngtdm|Busyness|RV|ES",
	"Total|Radiomics|ngtdm|Complexity|RV|ES",
	"Total|Radiomics|ngtdm|Strength|RV|ES",
	"Total|Radiomics|ngtdm|Coarseness|MYO|ED",
	"Total|Radiomics|ngtdm|Contrast|MYO|ED",
	"Total|Radiomics|ngtdm|Busyness|MYO|ED",
	"Total|Radiomics|ngtdm|Complexity|MYO|ED",
	"Total|Radiomics|ngtdm|Strength|MYO|ED",
	"Total|Radiomics|ngtdm|Coarseness|MYO|ES",
	"Total|Radiomics|ngtdm|Contrast|MYO|ES",
	"Total|Radiomics|ngtdm|Busyness|MYO|ES",
	"Total|Radiomics|ngtdm|Complexity|MYO|ES",
	"Total|Radiomics|ngtdm|Strength|MYO|ES",
	"Total|Radiomics|gldm|SmallDependenceEmphasis|LV|ED",
	"Total|Radiomics|gldm|LargeDependenceEmphasis|LV|ED",
	"Total|Radiomics|gldm|GrayLevelNonUniformity|LV|ED",
	"Total|Radiomics|gldm|GrayLevelNonUniformityNormalized|LV|ED",
	"Total|Radiomics|gldm|DependenceNonUniformity|LV|ED",
	"Total|Radiomics|gldm|DependenceNonUniformityNormalized|LV|ED",
	"Total|Radiomics|gldm|GrayLevelVariance|LV|ED",
	"Total|Radiomics|gldm|DependenceVariance|LV|ED",
	"Total|Radiomics|gldm|DependenceEntropy|LV|ED",
	"Total|Radiomics|gldm|LowGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|gldm|HighGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|gldm|SmallDependenceLowGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|gldm|SmallDependenceHighGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|gldm|LargeDependenceLowGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|gldm|LargeDependenceHighGrayLevelEmphasis|LV|ED",
	"Total|Radiomics|gldm|SmallDependenceEmphasis|LV|ES",
	"Total|Radiomics|gldm|LargeDependenceEmphasis|LV|ES",
	"Total|Radiomics|gldm|GrayLevelNonUniformity|LV|ES",
	"Total|Radiomics|gldm|GrayLevelNonUniformityNormalized|LV|ES",
	"Total|Radiomics|gldm|DependenceNonUniformity|LV|ES",
	"Total|Radiomics|gldm|DependenceNonUniformityNormalized|LV|ES",
	"Total|Radiomics|gldm|GrayLevelVariance|LV|ES",
	"Total|Radiomics|gldm|DependenceVariance|LV|ES",
	"Total|Radiomics|gldm|DependenceEntropy|LV|ES",
	"Total|Radiomics|gldm|LowGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|gldm|HighGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|gldm|SmallDependenceLowGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|gldm|SmallDependenceHighGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|gldm|LargeDependenceLowGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|gldm|LargeDependenceHighGrayLevelEmphasis|LV|ES",
	"Total|Radiomics|gldm|SmallDependenceEmphasis|RV|ED",
	"Total|Radiomics|gldm|LargeDependenceEmphasis|RV|ED",
	"Total|Radiomics|gldm|GrayLevelNonUniformity|RV|ED",
	"Total|Radiomics|gldm|GrayLevelNonUniformityNormalized|RV|ED",
	"Total|Radiomics|gldm|DependenceNonUniformity|RV|ED",
	"Total|Radiomics|gldm|DependenceNonUniformityNormalized|RV|ED",
	"Total|Radiomics|gldm|GrayLevelVariance|RV|ED",
	"Total|Radiomics|gldm|DependenceVariance|RV|ED",
	"Total|Radiomics|gldm|DependenceEntropy|RV|ED",
	"Total|Radiomics|gldm|LowGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|gldm|HighGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|gldm|SmallDependenceLowGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|gldm|SmallDependenceHighGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|gldm|LargeDependenceLowGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|gldm|LargeDependenceHighGrayLevelEmphasis|RV|ED",
	"Total|Radiomics|gldm|LargeDependenceEmphasis|RV|ES",
	"Total|Radiomics|gldm|GrayLevelNonUniformity|RV|ES",
	"Total|Radiomics|gldm|GrayLevelNonUniformityNormalized|RV|ES",
	"Total|Radiomics|gldm|DependenceNonUniformity|RV|ES",
	"Total|Radiomics|gldm|DependenceNonUniformityNormalized|RV|ES",
	"Total|Radiomics|gldm|GrayLevelVariance|RV|ES",
	"Total|Radiomics|gldm|DependenceVariance|RV|ES",
	"Total|Radiomics|gldm|DependenceEntropy|RV|ES",
	"Total|Radiomics|gldm|LowGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|gldm|SmallDependenceLowGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|gldm|SmallDependenceHighGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|gldm|LargeDependenceLowGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|gldm|LargeDependenceHighGrayLevelEmphasis|RV|ES",
	"Total|Radiomics|gldm|SmallDependenceEmphasis|MYO|ED",
	"Total|Radiomics|gldm|LargeDependenceEmphasis|MYO|ED",
	"Total|Radiomics|gldm|GrayLevelNonUniformity|MYO|ED",
	"Total|Radiomics|gldm|GrayLevelNonUniformityNormalized|MYO|ED",
	"Total|Radiomics|gldm|DependenceNonUniformity|MYO|ED",
	"Total|Radiomics|gldm|DependenceNonUniformityNormalized|MYO|ED",
	"Total|Radiomics|gldm|GrayLevelVariance|MYO|ED",
	"Total|Radiomics|gldm|DependenceVariance|MYO|ED",
	"Total|Radiomics|gldm|DependenceEntropy|MYO|ED",
	"Total|Radiomics|gldm|LowGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|gldm|HighGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|gldm|SmallDependenceLowGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|gldm|SmallDependenceHighGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|gldm|LargeDependenceLowGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|gldm|LargeDependenceHighGrayLevelEmphasis|MYO|ED",
	"Total|Radiomics|gldm|SmallDependenceEmphasis|MYO|ES",
	"Total|Radiomics|gldm|LargeDependenceEmphasis|MYO|ES",
	"Total|Radiomics|gldm|GrayLevelNonUniformity|MYO|ES",
	"Total|Radiomics|gldm|GrayLevelNonUniformityNormalized|MYO|ES",
	"Total|Radiomics|gldm|DependenceNonUniformity|MYO|ES",
	"Total|Radiomics|gldm|DependenceNonUniformityNormalized|MYO|ES",
	"Total|Radiomics|gldm|GrayLevelVariance|MYO|ES",
	"Total|Radiomics|gldm|DependenceVariance|MYO|ES",
	"Total|Radiomics|gldm|DependenceEntropy|MYO|ES",
	"Total|Radiomics|gldm|LowGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|gldm|HighGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|gldm|SmallDependenceLowGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|gldm|SmallDependenceHighGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|gldm|LargeDependenceLowGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|gldm|LargeDependenceHighGrayLevelEmphasis|MYO|ES",
	"Total|Radiomics|dim|fractal|LV|ED",
	"Total|Radiomics|dim|fractal|RV|ED",
	"Total|Radiomics|dim|fractal|MYO|ED",
	"Total|Radiomics|dim|fractal|LV|ES",
	"Total|Radiomics|dim|fractal|RV|ES",
	"Total|Radiomics|dim|fractal|MYO|ES",
	"Total|Demographics|Height",
	"Total|Demographics|Weight",
	"Total|Demographics|sex",
	"Total|Demographics|yearOfBirth"
]


//var columns_medical_history = [
//	"f:eid",
//	"bio:overall health rating:0:baseline",
//	"bio:overall health rating:0:imaging",
//	"bio:long-standing illness, disability or infirmity:0:baseline",
//	"bio:long-standing illness, disability or infirmity:0:imaging",
//	"bio:wears glasses or contact lenses:0:baseline",
//	"bio:wears glasses or contact lenses:0:imaging",
//	"bio:age started wearing glasses or contact lenses:0:baseline",
//	"bio:age started wearing glasses or contact lenses:0:imaging",
//	"bio:other eye problems:0:baseline",
//	"bio:other eye problems:0:imaging",
//	"bio:hearing difficulty/problems:0:baseline",
//	"bio:hearing difficulty/problems:0:imaging",
//	"bio:hearing difficulty/problems with background noise:0:baseline",
//	"bio:hearing difficulty/problems with background noise:0:imaging",
//	"bio:falls in the last year:0:baseline",
//	"bio:falls in the last year:0:imaging",
//	"bio:weight change compared with 1 year ago:0:baseline",
//	"bio:weight change compared with 1 year ago:0:imaging",
//	"bio:wheeze or whistling in the chest in last year:0:baseline",
//	"bio:wheeze or whistling in the chest in last year:0:imaging",
//	"bio:chest pain or discomfort:0:baseline",
//	"bio:chest pain or discomfort:0:imaging",
//	"bio:ever had bowel cancer screening:0:baseline",
//	"bio:ever had bowel cancer screening:0:imaging",
//	"bio:most recent bowel cancer screening:0:baseline",
//	"bio:most recent bowel cancer screening:0:imaging",
//	"bio:ever had prostate specific antigen (psa) test:0:baseline",
//	"bio:ever had prostate specific antigen (psa) test:0:imaging",
//	"bio:had major operations:0:baseline",
//	"bio:had major operations:0:imaging",
//	"bio:diabetes diagnosed by doctor:0:baseline",
//	"bio:diabetes diagnosed by doctor:0:imaging",
//	"bio:cancer diagnosed by doctor:0:baseline",
//	"bio:cancer diagnosed by doctor:0:imaging",
//	"bio:fractured/broken bones in last 5 years:0:baseline",
//	"bio:fractured/broken bones in last 5 years:0:imaging",
//	"bio:other serious medical condition/disability diagnosed by doctor:0:baseline",
//	"bio:other serious medical condition/disability diagnosed by doctor:0:imaging",
//	"bio:taking other prescription medications:0:baseline",
//	"bio:taking other prescription medications:0:imaging",
//	"bio:had other major operations:0:baseline",
//	"bio:had other major operations:0:imaging",
//	"bio:general pain for 3+ months:0:baseline",
//	"bio:general pain for 3+ months:0:imaging",
//	"bio:age high blood pressure diagnosed:0:baseline",
//	"bio:age high blood pressure diagnosed:0:imaging",
//	"bio:age diabetes diagnosed:0:baseline",
//	"bio:age diabetes diagnosed:0:imaging",
//	"bio:started insulin within one year diagnosis of diabetes:0:baseline",
//	"bio:started insulin within one year diagnosis of diabetes:0:imaging",
//	"bio:fracture resulting from simple fall:0:baseline",
//	"bio:fracture resulting from simple fall:0:imaging",
//	"bio:hearing aid user:0:baseline",
//	"bio:hearing aid user:0:imaging",
//	"bio:neck/shoulder pain for 3+ months:0:baseline",
//	"bio:neck/shoulder pain for 3+ months:0:imaging",
//	"bio:hip pain for 3+ months:0:baseline",
//	"bio:hip pain for 3+ months:0:imaging",
//	"bio:back pain for 3+ months:0:baseline",
//	"bio:back pain for 3+ months:0:imaging",
//	"bio:chest pain or discomfort walking normally:0:baseline",
//	"bio:chest pain or discomfort walking normally:0:imaging",
//	"bio:chest pain due to walking ceases when standing still:0:baseline",
//	"bio:chest pain due to walking ceases when standing still:0:imaging",
//	"bio:age angina diagnosed:0:baseline",
//	"bio:age angina diagnosed:0:imaging",
//	"bio:stomach/abdominal pain for 3+ months:0:baseline",
//	"bio:stomach/abdominal pain for 3+ months:0:imaging",
//	"bio:chest pain or discomfort when walking uphill or hurrying:0:baseline",
//	"bio:chest pain or discomfort when walking uphill or hurrying:0:imaging",
//	"bio:age hay fever, rhinitis or eczema diagnosed:0:baseline",
//	"bio:age hay fever, rhinitis or eczema diagnosed:0:imaging",
//	"bio:knee pain for 3+ months:0:baseline",
//	"bio:knee pain for 3+ months:0:imaging",
//	"bio:age asthma diagnosed:0:baseline",
//	"bio:age asthma diagnosed:0:imaging",
//	"bio:headaches for 3+ months:0:baseline",
//	"bio:headaches for 3+ months:0:imaging",
//	"bio:time since last prostate specific antigen (psa) test:0:baseline",
//	"bio:time since last prostate specific antigen (psa) test:0:imaging",
//	"bio:age heart attack diagnosed:0:baseline",
//	"bio:age heart attack diagnosed:0:imaging",
//	"bio:age emphysema/chronic bronchitis diagnosed:0:baseline",
//	"bio:age emphysema/chronic bronchitis diagnosed:0:imaging",
//	"bio:age deep-vein thrombosis (dvt, blood clot in leg) diagnosed:0:baseline",
//	"bio:age deep-vein thrombosis (dvt, blood clot in leg) diagnosed:0:imaging",
//	"bio:age pulmonary embolism (blood clot in lung) diagnosed:0:baseline",
//	"bio:age pulmonary embolism (blood clot in lung) diagnosed:0:imaging",
//	"bio:gestational diabetes only:0:baseline",
//	"bio:gestational diabetes only:0:imaging",
//	"bio:age stroke diagnosed:0:baseline",
//	"bio:age stroke diagnosed:0:imaging",
//	"bio:facial pains for 3+ months:0:baseline",
//	"bio:facial pains for 3+ months:0:imaging",
//	"bio:age glaucoma diagnosed:0:baseline",
//	"bio:age glaucoma diagnosed:0:imaging",
//	"bio:age cataract diagnosed:0:baseline",
//	"bio:age cataract diagnosed:0:imaging",
//	"bio:shortness of breath walking on level ground:0:baseline",
//	"bio:shortness of breath walking on level ground:0:imaging",
//	"bio:leg pain on walking:0:baseline",
//	"bio:leg pain on walking:0:imaging",
//	"bio:cochlear implant:0:baseline",
//	"bio:cochlear implant:0:imaging",
//	"bio:tinnitus:0:baseline",
//	"bio:tinnitus:0:imaging",
//	"bio:tinnitus severity/nuisance:0:baseline",
//	"bio:tinnitus severity/nuisance:0:imaging",
//	"bio:noisy workplace:0:baseline",
//	"bio:noisy workplace:0:imaging",
//	"bio:loud music exposure frequency:0:baseline",
//	"bio:loud music exposure frequency:0:imaging",
//	"bio:which eye(s) affected by amblyopia (lazy eye):0:baseline",
//	"bio:which eye(s) affected by amblyopia (lazy eye):0:imaging",
//	"bio:which eye(s) affected by injury or trauma resulting in loss of vision:0:baseline",
//	"bio:which eye(s) affected by injury or trauma resulting in loss of vision:0:imaging",
//	"bio:age when loss of vision due to injury or trauma diagnosed:0:baseline",
//	"bio:age when loss of vision due to injury or trauma diagnosed:0:imaging",
//	"bio:which eye(s) are affected by cataract:0:baseline",
//	"bio:which eye(s) are affected by cataract:0:imaging",
//	"bio:leg pain when standing still or sitting:0:baseline",
//	"bio:leg pain when standing still or sitting:0:imaging",
//	"bio:leg pain in calf/calves:0:baseline",
//	"bio:leg pain in calf/calves:0:imaging",
//	"bio:leg pain when walking uphill or hurrying:0:baseline",
//	"bio:leg pain when walking uphill or hurrying:0:imaging",
//	"bio:leg pain when walking normally:0:baseline",
//	"bio:leg pain when walking normally:0:imaging",
//	"bio:leg pain when walking ever disappears while walking:0:baseline",
//	"bio:leg pain when walking ever disappears while walking:0:imaging",
//	"bio:leg pain on walking : action taken:0:baseline",
//	"bio:leg pain on walking : action taken:0:imaging",
//	"bio:leg pain on walking : effect of standing still:0:baseline",
//	"bio:leg pain on walking : effect of standing still:0:imaging",
//	"bio:surgery on leg arteries (other than for varicose veins):0:baseline",
//	"bio:surgery on leg arteries (other than for varicose veins):0:imaging",
//	"bio:surgery/amputation of toe or leg:0:baseline",
//	"bio:surgery/amputation of toe or leg:0:imaging",
//	"bio:which eye(s) affected by presbyopia:0:baseline",
//	"bio:which eye(s) affected by presbyopia:0:imaging",
//	"bio:which eye(s) affected by hypermetropia (long sight):0:baseline",
//	"bio:which eye(s) affected by hypermetropia (long sight):0:imaging",
//	"bio:which eye(s) affected by myopia (short sight):0:baseline",
//	"bio:which eye(s) affected by myopia (short sight):0:imaging",
//	"bio:which eye(s) affected by astigmatism:0:baseline",
//	"bio:which eye(s) affected by astigmatism:0:imaging",
//	"bio:which eye(s) affected by other eye condition:0:baseline",
//	"bio:which eye(s) affected by other eye condition:0:imaging",
//	"bio:which eye(s) affected by diabetes-related eye disease:0:baseline",
//	"bio:which eye(s) affected by diabetes-related eye disease:0:imaging",
//	"bio:age when diabetes-related eye disease diagnosed:0:baseline",
//	"bio:age when diabetes-related eye disease diagnosed:0:imaging",
//	"bio:which eye(s) affected by macular degeneration:0:baseline",
//	"bio:which eye(s) affected by macular degeneration:0:imaging",
//	"bio:age macular degeneration diagnosed:0:baseline",
//	"bio:age macular degeneration diagnosed:0:imaging",
//	"bio:which eye(s) affected by other serious eye condition:0:baseline",
//	"bio:which eye(s) affected by other serious eye condition:0:imaging",
//	"bio:age other serious eye condition diagnosed:0:baseline",
//	"bio:age other serious eye condition diagnosed:0:imaging",
//	"bio:which eye(s) affected by glaucoma:0:baseline",
//	"bio:which eye(s) affected by glaucoma:0:imaging",
//	"bio:reason for glasses/contact lenses:0:baseline",
//	"bio:reason for glasses/contact lenses:1:baseline",
//	"bio:reason for glasses/contact lenses:2:baseline",
//	"bio:reason for glasses/contact lenses:3:baseline",
//	"bio:reason for glasses/contact lenses:4:baseline",
//	"bio:reason for glasses/contact lenses:0:imaging",
//	"bio:reason for glasses/contact lenses:1:imaging",
//	"bio:reason for glasses/contact lenses:2:imaging",
//	"bio:reason for glasses/contact lenses:3:imaging",
//	"bio:reason for glasses/contact lenses:4:imaging",
//	"bio:eye problems/disorders:0:baseline",
//	"bio:eye problems/disorders:1:baseline",
//	"bio:eye problems/disorders:2:baseline",
//	"bio:eye problems/disorders:3:baseline",
//	"bio:eye problems/disorders:0:imaging",
//	"bio:eye problems/disorders:1:imaging",
//	"bio:eye problems/disorders:2:imaging",
//	"bio:eye problems/disorders:3:imaging",
//	"bio:mouth/teeth dental problems:0:baseline",
//	"bio:mouth/teeth dental problems:1:baseline",
//	"bio:mouth/teeth dental problems:2:baseline",
//	"bio:mouth/teeth dental problems:3:baseline",
//	"bio:mouth/teeth dental problems:4:baseline",
//	"bio:mouth/teeth dental problems:5:baseline",
//	"bio:mouth/teeth dental problems:0:imaging",
//	"bio:mouth/teeth dental problems:1:imaging",
//	"bio:mouth/teeth dental problems:2:imaging",
//	"bio:mouth/teeth dental problems:3:imaging",
//	"bio:mouth/teeth dental problems:4:imaging",
//	"bio:mouth/teeth dental problems:5:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:0:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:1:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:2:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:3:baseline",
//	"bio:vascular/heart problems diagnosed by doctor:0:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:1:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:2:imaging",
//	"bio:vascular/heart problems diagnosed by doctor:3:imaging",
//	"bio:fractured bone site(s):0:baseline",
//	"bio:fractured bone site(s):1:baseline",
//	"bio:fractured bone site(s):2:baseline",
//	"bio:fractured bone site(s):0:imaging",
//	"bio:fractured bone site(s):1:imaging",
//	"bio:fractured bone site(s):2:imaging",
//	"bio:fractured bone site(s):3:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:0:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:1:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:2:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:3:baseline",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:0:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:1:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:2:imaging",
//	"bio:blood clot, dvt, bronchitis, emphysema, asthma, rhinitis, eczema, allergy diagnosed by doctor:3:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:0:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:1:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:2:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:3:baseline",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:0:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:1:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:2:imaging",
//	"bio:medication for cholesterol, blood pressure, diabetes, or take exogenous hormones:3:imaging",
//	"bio:medication for pain relief, constipation, heartburn:0:baseline",
//	"bio:medication for pain relief, constipation, heartburn:1:baseline",
//	"bio:medication for pain relief, constipation, heartburn:2:baseline",
//	"bio:medication for pain relief, constipation, heartburn:3:baseline",
//	"bio:medication for pain relief, constipation, heartburn:0:imaging",
//	"bio:medication for pain relief, constipation, heartburn:1:imaging",
//	"bio:medication for pain relief, constipation, heartburn:2:imaging",
//	"bio:medication for pain relief, constipation, heartburn:3:imaging",
//	"bio:medication for pain relief, constipation, heartburn:4:imaging",
//	"bio:vitamin and mineral supplements:0:baseline",
//	"bio:vitamin and mineral supplements:1:baseline",
//	"bio:vitamin and mineral supplements:2:baseline",
//	"bio:vitamin and mineral supplements:3:baseline",
//	"bio:vitamin and mineral supplements:4:baseline",
//	"bio:vitamin and mineral supplements:5:baseline",
//	"bio:vitamin and mineral supplements:6:baseline",
//	"bio:vitamin and mineral supplements:0:imaging",
//	"bio:vitamin and mineral supplements:1:imaging",
//	"bio:vitamin and mineral supplements:2:imaging",
//	"bio:vitamin and mineral supplements:3:imaging",
//	"bio:vitamin and mineral supplements:4:imaging",
//	"bio:vitamin and mineral supplements:5:imaging",
//	"bio:vitamin and mineral supplements:6:imaging",
//	"bio:pain type(s) experienced in last month:0:baseline",
//	"bio:pain type(s) experienced in last month:1:baseline",
//	"bio:pain type(s) experienced in last month:2:baseline",
//	"bio:pain type(s) experienced in last month:3:baseline",
//	"bio:pain type(s) experienced in last month:4:baseline",
//	"bio:pain type(s) experienced in last month:5:baseline",
//	"bio:pain type(s) experienced in last month:6:baseline",
//	"bio:pain type(s) experienced in last month:0:imaging",
//	"bio:pain type(s) experienced in last month:1:imaging",
//	"bio:pain type(s) experienced in last month:2:imaging",
//	"bio:pain type(s) experienced in last month:3:imaging",
//	"bio:pain type(s) experienced in last month:4:imaging",
//	"bio:pain type(s) experienced in last month:5:imaging",
//	"bio:pain type(s) experienced in last month:6:imaging",
//	"bio:medication for cholesterol, blood pressure or diabetes:0:baseline",
//	"bio:medication for cholesterol, blood pressure or diabetes:1:baseline",
//	"bio:medication for cholesterol, blood pressure or diabetes:2:baseline",
//	"bio:medication for cholesterol, blood pressure or diabetes:0:imaging",
//	"bio:medication for cholesterol, blood pressure or diabetes:1:imaging",
//	"bio:medication for cholesterol, blood pressure or diabetes:2:imaging",
//	"bio:mineral and other dietary supplements:0:baseline",
//	"bio:mineral and other dietary supplements:1:baseline",
//	"bio:mineral and other dietary supplements:2:baseline",
//	"bio:mineral and other dietary supplements:3:baseline",
//	"bio:mineral and other dietary supplements:4:baseline",
//	"bio:mineral and other dietary supplements:5:baseline",
//	"bio:mineral and other dietary supplements:0:imaging",
//	"bio:mineral and other dietary supplements:1:imaging",
//	"bio:mineral and other dietary supplements:2:imaging",
//	"bio:mineral and other dietary supplements:3:imaging",
//	"bio:mineral and other dietary supplements:4:imaging",
//	"bio:mineral and other dietary supplements:5:imaging",
//	"bio:which eye(s) affected by strabismus (squint):0:baseline",
//	"bio:which eye(s) affected by strabismus (squint):0:imaging"
// ];

//var disp_radiomic_column = [
//	{column_name: "f.eid", label: "Patient"},
//	{column_name: "Volume_LV_ED", label: "Volume_LV_ED" },
//	{column_name: "SurfaceArea_LV_ED", label: "SurfaceArea_LV_ED" },
//	{column_name: "SurfaceAreatoVolumeRatio_LV_ED", label: "SurfaceAreatoVolumeRatio_LV_ED" },
//	{column_name: "Sphericity_LV_ED", label: "Sphericity_LV_ED" },
//	{column_name: "SphericalDisproportion_LV_ED", label: "SphericalDisproportion_LV_ED" },
//	{column_name: "Compactness_LV_ED", label: "Compactness_LV_ED" },
//	{column_name: "Compactness2_LV_ED", label: "Compactness2_LV_ED" },
//	{column_name: "Max3Ddiameter_LV_ED", label: "Max3Ddiameter_LV_ED" },
//	{column_name: "Max2DdiameterSlice_LV_ED", label: "Max2DdiameterSlice_LV_ED" },
//	{column_name: "Max2DdiameterColumn_LV_ED", label: "Max2DdiameterColumn_LV_ED" },
//	{column_name: "Max2DdiameterRow_LV_ED", label: "Max2DdiameterRow_LV_ED" },
//	{column_name: "MajorAxis_LV_ED", label: "MajorAxis_LV_ED" },
//	{column_name: "MinorAxis_LV_ED", label: "MinorAxis_LV_ED" },
//	{column_name: "LeastAxis_LV_ED", label: "LeastAxis_LV_ED" },
//	{column_name: "Elongation_LV_ED", label: "Elongation_LV_ED" },
//];



function get_radiomic_grid_columns(arr_columns){
	//arr_columns is column
	//groupName: "Group-1"
	// Not good layout shown, so not using
	var columns = [];
	for(var i in arr_columns){
		var col_field = arr_columns[i];
		columns.push({id: i, name:col_field, field:col_field});
//		if(i <= 15){
//			columns.push({id: i, name:col_field, field:col_field, groupName: "Shape"});
//		}else if (i <= 30){
//			columns.push({id: i, name:col_field, field:col_field, groupName: "First Order"});
//		}
	}
	return columns;
}

function get_grid_columns(target_div_id, arr_columns){
	var columns = [];
	if(columns != undefined){
		for(var i in arr_columns){
			var col_field = arr_columns[i]; 
			var col_id = target_div_id + "-c" + i;
			columns.push({id: col_id, name:col_field, field:col_field});
		}
	}else{
		  console.error("Columns is undefined.");
	}
	return columns;
}

function resize_all_grids_canvas(){
	for(var i in all_grids){
		var grid = all_grids[i];
		grid.resizeCanvas();
	}
}
function render_grid(target_div_id, pager_id, data, arr_columns){
//var columns = [];
//	if(target_div_id == "grid_radiomic_result"){
//		columns = get_radiomic_grid_columns(arr_columns);
//	}else{
//		columns = get_grid_columns(target_div_id, arr_columns);
//	}
 columns = arr_columns;
	
  dataView = new Slick.Data.DataView({ inlineFilters: true });
  var grid = new Slick.Grid("#"+target_div_id, dataView, columns, options);
  all_grids.push(grid); // Use to fix bug in slickgrid when column disappear after show/hide
  grid.setSelectionModel(new Slick.RowSelectionModel());
  var pager = new Slick.Controls.Pager(dataView, grid, $("#"+pager_id));
  var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
  // move the filter panel defined in a hidden div into grid top panel
  $("#inlineFilterPanel")
      .appendTo(grid.getTopPanel())
      .show();
  grid.onCellChange.subscribe(function (e, args) {
    dataView.updateItem(args.item.id, args.item);
  });
  grid.onAddNewRow.subscribe(function (e, args) {
    var item = {"num": data.length, "id": "new_" + (Math.round(Math.random() * 10000)), "title": "New task", "duration": "1 day", "percentComplete": 0, "start": "01/01/2009", "finish": "01/01/2009", "effortDriven": false};
    $.extend(item, args.item);
    dataView.addItem(item);
  });
  grid.onKeyDown.subscribe(function (e) {
    // select all rows on ctrl-a
    if (e.which != 65 || !e.ctrlKey) {
      return false;
    }
    var rows = [];
    for (var i = 0; i < dataView.getLength(); i++) {
      rows.push(i);
    }
    grid.setSelectedRows(rows);
    e.preventDefault();
  });
  
 /* 
  grid.onSort.subscribe(function (e, args) {
    sortdir = args.sortAsc ? 1 : -1;
    sortcol = args.sortCol.field;
    if (isIEPreVer9()) {
      // using temporary Object.prototype.toString override
      // more limited and does lexicographic sort only by default, but can be much faster
      var percentCompleteValueFn = function () {
        var val = this["percentComplete"];
        if (val < 10) {
          return "00" + val;
        } else if (val < 100) {
          return "0" + val;
        } else {
          return val;
        }
      };
      // use numeric sort of % and lexicographic for everything else
      dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc);
    } else {
      // using native sort with comparer
      // preferred method but can be very slow in IE with huge datasets
      dataView.sort(comparer, args.sortAsc);
    }
  });
  */
  
  // wire up model events to drive the grid
  // !! both dataView.onRowCountChanged and dataView.onRowsChanged MUST be wired to correctly update the grid
  // see Issue#91
  dataView.onRowCountChanged.subscribe(function (e, args) {
    grid.updateRowCount();
    grid.render();
  });
  
  dataView.onRowsChanged.subscribe(function (e, args) {
    grid.invalidateRows(args.rows);
    grid.render();
  });
  
  dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
    grid.updatePagingStatusFromView( pagingInfo );
  });
  
  
  var h_runfilters = null;
  // wire up the slider to apply the filter to the model
//  $("#pcSlider,#pcSlider2").slider({
//    "range": "min",
//    "slide": function (event, ui) {
//      Slick.GlobalEditorLock.cancelCurrentEdit();
//      if (percentCompleteThreshold != ui.value) {
//        window.clearTimeout(h_runfilters);
//        h_runfilters = window.setTimeout(updateFilter, 10);
//        percentCompleteThreshold = ui.value;
//      }
//    }
//  });

  
  
  /*
  
  $("#btnSelectRows").click(function () {
    if (!Slick.GlobalEditorLock.commitCurrentEdit()) {
      return;
    }
    var rows = [];
    for (var i = 0; i < 10 && i < dataView.getLength(); i++) {
      rows.push(i);
    }
    grid.setSelectedRows(rows);
  });
  
  */
  
  // initialize the model after all the events have been hooked up
  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilterArgs({
      //percentCompleteThreshold: percentCompleteThreshold,
      txt_search: txt_search,
      search_id: search_id,
      //filter_health_rating: filter_health_rating,
      search_selected_dots: search_selected_dots,
      sex: sex,
      age_min: age_min, 
      age_max: age_max, 
      height_min: height_min,
      height_max: height_max,
      weight_min: weight_min,
      weight_max: weight_max      
    });
  dataView.setFilter(filter_data);
  dataView.endUpdate();
  
  // Register plugin for grouping column
 // grid.registerPlugin(plugin);
 // grid.render();
  
  // if you don't want the items that are not visible (due to being filtered out
  // or being on a different page) to stay selected, pass 'false' to the second arg
  dataView.syncGridSelection(grid, true);
  $("#gridContainer").resizable();
  
  return dataView;
}

function update_filter(dataView) {
	if(dataView != undefined){
	    dataView.setFilterArgs({
	      //percentCompleteThreshold: percentCompleteThreshold,
	      txt_search: txt_search,
	      search_id: search_id,
	      filter_health_rating: filter_health_rating,
	      search_selected_dots: search_selected_dots,
	      sex: sex,
	      age_min: age_min, 
	      age_max: age_max, 
	      height_min: height_min,
	      height_max: height_max,
	      weight_min: weight_min,
	      weight_max: weight_max      
	    });
	    dataView.refresh();
	}
}

function filter_data(item, args) {
	// args is set in update_filter() function
	// console.log(args);
	// Search ID
	if (args.search_id != "" 
			&& item[ds_col_id] != args.search_id){
		return false;
	}
	
	// Scan Search
	if (args.txt_search != "" 
		   && item["bio:overall health rating:0:baseline"].indexOf(args.txt_search) == -1) {
	     return false;
	 }
	
	// Health Rating
//	if(args.filter_health_rating != "" 
//		&& item["bio:overall health rating:0:baseline"].indexOf(args.filter_health_rating) == -1) {
//		 return false;
//	}
	// Filter data when dots are selected on plot
	if (args.search_selected_dots != undefined && args.search_selected_dots.length > 0){      
             var multi_filters = args.search_selected_dots;
             var valid=false;
             for(var j=0; j < multi_filters.length; j++){
                 if (multi_filters[j] != undefined && multi_filters[j] != "" && item[ds_col_id] != undefined){
                    // if (("" +item['f:eid']).toLowerCase().indexOf(multiFilters[j].toLowerCase()) != -1){
                	 if (item[ds_col_id] == multi_filters[j]){
                        valid = true;
                     }
                 }
             }
             
             if(!valid){
                 return false;
             }
	}      

	// Sex
	if (args.sex != "" 
		&& item[ds_col_sex] != args.sex){
		return false;
	}
	
	// Age
	if (args.age_min != "" && args.age_max != ""
		&& (item[ds_col_age] < args.age_min || item[ds_col_age] > age_max)){
		return false;
	}
  
	// Height
	if (args.height_min != "" && args.height_max != ""
		&& (item[ds_col_height] < args.height_min || item[ds_col_height] > height_max)){
		return false;
	}	
	
	if (args.weight_min != "" && args.weight_max != ""
		&& (item[ds_col_weight] < args.weight_min || item[ds_col_weight] > weight_max)){
		return false;
	}

   return true;
}

function requiredFieldValidator(value) {
	   if (value == null || value == undefined || !value.length) {
	     return {valid: false, msg: "This is a required field"};
	   }
	   else {
	     return {valid: true, msg: null};
	   }
}

 function percentCompleteSort(a, b) {
   return a["percentComplete"] - b["percentComplete"];
 }
 
 function comparer(a, b) {
   var x = a[sortcol], y = b[sortcol];
   return (x == y ? 0 : (x > y ? 1 : -1));
 }
 
 //Event For clicking on grid
 function toggleFilterRow() {
   grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
 }
 

 function enableGrouping() {
     plugin.enableColumnGrouping();
 }
 
 function removeGrouping() {
     plugin.removeColumnGrouping();  
 }
 
 

