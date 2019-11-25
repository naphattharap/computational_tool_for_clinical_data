from sklearn.model_selection import train_test_split  
from  sklearn.ensemble import RandomForestRegressor
import pandas as pd
pd.set_option("display.max_columns", 10)


def feature_selection_random_forest_regressor(X, y):
    # Convert categorical data in outcomes file to numeric.
    y_new, arr_cate_columns = convert_categorical_to_numeric(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y_new, test_size=0.2, random_state=42)
    print("train size: ", X_train.shape, ",", y_train.shape)
    
    # https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html
    
    regr = RandomForestRegressor(n_estimators=20)
    regr.fit(X_train, y_train)
    y_predict = regr.predict(X_test)
    
    # print(y_predict)
    # Return the feature importance (the higher, the more important the feature)
    print()
    print("Feature importance:", regr.feature_importances_)
    
    important_features_dict = {}
    for x, i in enumerate(regr.feature_importances_):
        important_features_dict[x] = i
    
    # sorted from max to min
    important_features_list = sorted(important_features_dict,
                                     key=important_features_dict.get,
                                     reverse=True)
    
    print('Most important features: ', important_features_list)
    col_names = list(X_train.columns)
    n_columns = 0
    if len(col_names) > 2:
        n_columns = 3
    elif len(col_names) == 2:
        n_columns = 2
    else:
        raise ValueError("Number of columns are less then 2.")
    
    max_importance = []
    max_col_names = []
    for idx in range(0, n_columns):
        col_idx = important_features_list[idx]
        max_importance.append(col_idx)
        max_col_names.append(col_names[col_idx])
    
    print("The most important columns: ", max_col_names)
        
    X_selected = pd.DataFrame(data=X[max_col_names])  
    
    print("max importance feature column names: ", X_selected.columns)
    print(X_selected.head())
    
    # sorted column name based on importance
    arr_col_names = list(X.columns)
    arr_importances = list(regr.feature_importances_)
    arr_sorted_columns = []
    arr_sorted_importance = []
    for col_idx in important_features_list:
        arr_sorted_columns.append(arr_col_names[col_idx])
        arr_sorted_importance.append(arr_importances[col_idx])

    print(arr_sorted_columns)
    print(arr_sorted_importance)
    
    return X_selected, arr_sorted_columns, arr_sorted_importance, arr_cate_columns


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

