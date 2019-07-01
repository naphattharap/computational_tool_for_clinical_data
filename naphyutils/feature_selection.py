from sklearn.model_selection import train_test_split  
from  sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBClassifier, XGBRegressor
from naphyutils.standardization import EncodingCategoricalFeatures
from mlxtend.feature_selection import SequentialFeatureSelector as SFS
from sklearn.metrics import accuracy_score
import xgboost as xgb
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error

pd.set_option("display.max_columns", 10)


class FeatureSelectionUtil:
    
    @staticmethod
    def select_by_random_forest_regressor(X, y, n_features, numtype):
        """
            X: Source data to select feature from
            y: Label of source data
            n_features: Number of features to be selected.
            numtype: Type of number e.g. INTERVAL, ORDINAL, NOMINAL
        """
        arr_cate_columns = []
        if numtype == "NOMINAL":
            # Convert categorical data in outcomes file to numeric.
            y, arr_cate_columns = FeatureSelectionUtil.convert_categorical_to_numeric(y)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        print("train size: ", X_train.shape, ",", y_train.shape)
        
        # https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html
        
        regr = RandomForestRegressor(n_estimators=100, max_features=n_features)
        regr.fit(X_train, y_train)
        y_predict = regr.predict(X_test)
        
        # print(y_predict)
        # Return the feature importance (the higher, the more important the feature)
        print(regr.feature_importances_)
        
        important_features_dict = {}
        for x, i in enumerate(regr.feature_importances_):
            important_features_dict[x] = i
        
        sorted_important_col_indexes = sorted(important_features_dict,
                                         key=important_features_dict.get,
                                         reverse=True)
        
        print('Most important features: ', sorted_important_col_indexes)
        col_names = list(X_train.columns)
        max_selected_importance = []
        max_selected_col_names = []
        for idx in range(0, n_features):
            col_idx = sorted_important_col_indexes[idx]
            max_selected_importance.append(col_idx)
            max_selected_col_names.append(col_names[col_idx])
        
        print("Select 3 most important columns: ", max_selected_col_names)
        X_selected = pd.DataFrame(data=X[max_selected_col_names])  
        # pd.DataFrame(data=df_radiomic.loc[:, max3_col_names], columns=max3_col_names)
        # selected_features = selected_features.reset_index()
        
        print("max importance feature column names: ", X_selected.columns)
        print(X_selected.head())
        
        # sorted column name based on importance
        arr_col_names = list(X.columns)
        arr_importances = list(regr.feature_importances_)
        arr_sorted_important_columns = []
        arr_sorted_important_val = []
        for col_idx in sorted_important_col_indexes:
            arr_sorted_important_columns.append(arr_col_names[col_idx])
            arr_sorted_important_val.append(arr_importances[col_idx])
    
        print(arr_sorted_important_columns)
        print(arr_sorted_important_val)
        
        return X_selected, arr_sorted_important_columns, arr_sorted_important_val, sorted_important_col_indexes
    
    @staticmethod
    def convert_categorical_to_numeric(df):
        # Check if any column data contain non numeric and auto convert to categorical code
        dtype_text_cols = df.select_dtypes(include=['object'])
        # dtype str is not allowed, so need to use 'object' instead.
        # print(dtype_text_cols.shape)
        # print(dtype_text_cols.head())
        
        # convert to categorical code
        arr_cate_columns = []
        df_new = df.copy()
        for col in dtype_text_cols:
             df_new[col] = df[col].astype('category').cat.codes
             arr_cate_columns.append(col)
        print("Categorical data: ", arr_cate_columns)
        return df_new, arr_cate_columns
    
    @staticmethod
    def select_by_xgboost(df_source, df_fs_target, arr_numtype_flag, n_feature_selection):
        # Loop through each target factor.
        n_factor_cols = df_fs_target.shape[1]
        X = df_source
        y = df_fs_target.copy()
        
        # Categorical Encoding
        encoder = EncodingCategoricalFeatures()
        
        # Loop to check data type and do label encoding
        for col in y.columns:
            if y[col].dtype == 'object':
                str = y[[col]].values
                y[col] = encoder.label_encoder(str)
        
        temp_arr_fs_col_name = []
        temp_arr_fs_col_idx = []
        arr_train_score = []
        arr_test_score = []
        for i in range(0, n_factor_cols):
            numtype = arr_numtype_flag[i]
            y = df_fs_target.iloc[:, i]
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            model = None
            if numtype == "INTERVAL":
                model = XGBRegressor()

            elif numtype == "NOMINAL":
                model = XGBClassifier()
            
            else:
                raise Exception("Cannot perform feature selection due to invalid data to select model.")

            model.fit(X_train, y_train)
#             acc_train = FeatureSelectionUtil.get_acc_score(model, X_test, y_test)
            y_pred = model.predict(X_test)
            acc_test = FeatureSelectionUtil.get_score(model, y_test, y_pred)
            print("Accuracy test for all data: ", acc_test)
            
            # max -> min for feature importance
            sorted_idx = np.argsort(model.feature_importances_)[::-1]
            sel_feature_col_idx = sorted_idx[0: n_feature_selection]
            # Train test again based on selected features to get accuracy score
            X_train_new = X_train.iloc[:, sel_feature_col_idx]
            X_test_new = X_test.iloc[:, sel_feature_col_idx]
            model.fit(X_train_new, y_train)
            
            y_train_pred_new = model.predict(X_train_new)
            y_test_pred_new = model.predict(X_test_new)
            
            # Get score
            acc_new_train = FeatureSelectionUtil.get_score(model, y_train, y_train_pred_new)
            acc_new_test = FeatureSelectionUtil.get_score(model, y_test, y_test_pred_new)
            arr_train_score.append(acc_new_train)
            arr_test_score.append(acc_new_test)
            
            print("Accuracy test for X new data: ", acc_new_test)
            
            temp_arr_fs_col_name.append(X_train.iloc[:, sel_feature_col_idx].columns.values)
            temp_arr_fs_col_idx.append(sel_feature_col_idx)
            
            # values = sorted(zip(X.columns, model.feature_importances_), key=lambda x: x[1] * -1)
        
        arr_fs_col_name, cnt_name = np.unique(temp_arr_fs_col_name, return_counts=True)
        
        # Find duplicated features from different target factors
        dup_feature_names = []
        for i in range(0, len(arr_fs_col_name)):
            n_dup = cnt_name[i]
            if n_dup > 1:
                fmt_msg = arr_fs_col_name[i] + "(" + cnt_name[i].__str__() + ")"
                dup_feature_names.append(fmt_msg)
                
        arr_fs_col_idx = np.unique(temp_arr_fs_col_idx)
        # Since score for classification and regression are different.
        # So we can't find mean value.
#         train_score = np.mean(arr_train_score)
#         test_score = np.mean(arr_test_score)
        return arr_fs_col_name, arr_fs_col_idx, arr_train_score, arr_test_score, dup_feature_names
    
    @staticmethod
    def get_score(model, y_test, y_pred):
        if isinstance(model, XGBRegressor):
            return FeatureSelectionUtil.get_mse_score(y_test, y_pred)
        elif isinstance(model, XGBClassifier):
            return FeatureSelectionUtil.get_acc_score(y_test, y_pred)

    @staticmethod
    def get_acc_score(y_test, y_pred):
       
        # predictions = [round(value) for value in y_pred]
        accuracy = accuracy_score(y_test, y_pred)
        print("Accuracy X new: %.2f%%" % (accuracy * 100.0))
        return accuracy
    
    @staticmethod
    def get_mse_score(y_true, y_pred):
        return mean_squared_error(y_true, y_pred)
    
#     @staticmethod
#     def select_by_xgboost_regressor(df_source, df_output, n_features):
#         encoder = EncodingCategoricalFeatures()
#         df_output_temp = df_output.copy()
#         # Loop to check data type and do label encoding
#         for col in df_output_temp.columns:
#             if df_output_temp[col].dtype == 'object':
#                 str = df_output_temp[[col]].values
#                 df_output_temp[col] = encoder.label_encoder(str)
#             
#         X_train, X_test, y_train, y_test = train_test_split(df_source, df_output_temp, \
#                                                             test_size=0.2, random_state=42)
#         print("train size: ", X_train.shape, ",", y_train.shape)
# 
#         eval_set = [(X_test, y_test)]
#         regr = xgb.XGBRegressor(eval_set=eval_set, verbose_eval=True)
#         regr_multirf = MultiOutputRegressor(regr)
# 
#         regr_multirf.fit(X_train, y_train)
#         y_multirf = regr_multirf.predict(X_test)
#         
#         train_score = regr_multirf.score(X_train, y_train)
#         test_score = regr_multirf.score(X_test, y_test)
#         print("train score: ", train_score)
#         print("test score: ", test_score)
#         print("# of estimators: ", len(regr_multirf.estimators_))
#         col_names = list(X_train.columns)
#         
#         arr_fs_col_name = []
#         arr_fs_col_idx = []
#         
#         for e in regr_multirf.estimators_:
#             important_features_dict = {}
#             print("estimator: ", e)
#             for x, i in enumerate(e.feature_importances_):
#                 important_features_dict[x] = i
#             # Sort columns 
#             important_features_list = sorted(important_features_dict,
#                                          key=important_features_dict.get,
#                                          reverse=True)
#             print('Most important features: ', important_features_list)
#             # Print most importance features
#             max_importance = []
#             max_col_names = []
#             for idx in range(0, n_features):
#                 col_idx = important_features_list[idx]
#                 max_importance.append(col_idx)
#                 max_col_names.append(col_names[col_idx])
#             print(max_col_names)
#             arr_fs_col_name.append(max_col_names)
#             arr_fs_col_idx.append(max_importance)
#         
#         # selected_features = pd.DataFrame(data=df_source[max_col_names])
#         # print("Last estimator: ", selected_features.columns)
#         return arr_fs_col_name, arr_fs_col_idx, train_score, test_score
