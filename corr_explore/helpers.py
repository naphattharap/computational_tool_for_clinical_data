import numpy as np
import pandas as pd
from random import randint
from services.naphyutils.pca import PcaUtil, LdaUtil
from services.naphyutils.standardization import PreProcessingUtil
from .framingham import framingham_risk_score
ORDINAL = "ORDINAL"  # not using
NOMINAL = "NOMINAL"
INTERVAL = "INTERVAL"

PCA = "PCA"
LDA = "LDA"


class Helper:
    
    @staticmethod
    def get_criterion_data(df, threshold_unique_ordinal=8):
        """
        Analyze target data frame for rendering criterion table
        Pre-set threshold is used to determine type of number in data frame
        
            
        """
        
        arr_columns = []
        for col in df.columns:
            print(col)
            col_series = df[col]
            unique_val = col_series.unique()
            n_unique = len(unique_val)
            data_type = col_series.dtype
            min = 0
            max = 0
            number_type = '';
            nominal_values = []
            
#             if data_type in [np.int64, np.float64] and n_unique <= threshold_unique_ordinal:
#                 # Set as ordinal number
#                 number_type = ORDINAL
#                 min = Helper.cast_number_for_json(data_type, col_series.min())
#                 max = Helper.cast_number_for_json(data_type, col_series.max())
                
            if data_type in [np.int64, np.float64]:  # and n_unique > threshold_unique_ordinal:
                # Set as interval number
                number_type = INTERVAL
                min = Helper.cast_number_for_json(data_type, col_series.min())
                max = Helper.cast_number_for_json(data_type, col_series.max())
                
            elif data_type == 'object':
                # Set as nominal
                number_type = NOMINAL
                nominal_values = list(np.sort(unique_val))
                
            # Append object to array for result
            arr_columns.append({'column_name': col, 'number_type': number_type,
                                'nominal_values': nominal_values,
                                'min': min,
                                'max': max})
        
        return arr_columns
    
    @staticmethod
    def cast_number_for_json(data_type, number):
        if data_type == np.int64:
            return int(number)
        
        elif data_type == np.float64:
            return float(number)

    @staticmethod
    def startify_mean(df_source, df_target, arr_sel_source_col, arr_sel_target_col, arr_numtypes, arr_criterion, arr_bin, arr_groupby, is_calc_framingham):
        """
        Get number type and related criterion defind by user, group by to process data
        df_source: Dataframe for Source data such as radiomics data, it must be only number so that we can take mean values.
        df_target: Dataframe for Target info that we want to find correlation with radiomics
        arr_num_types: Array of Type of number indicates how to process data. E.g. INTERVAL, NOMINAL, ORDINAL
        arr_bin: Array of bin corresponding to number type. Only valid for ORDINAL
        arr_groupby: Array of group by condition
        
        Result structure:
            Result will be formed for bar plotting in plotly for x, y, trace name (combination of stratification columns).
            The selection of multiple radiomics feature is allowed then the result is array of each trace in plotly.
            arr_traces: [{trace_name: "Name of group", 
                          x: ['bar1 label', 'bar2 label', ...],
                          y: [999,9999,...]}] # mean value of result
        """
        # Result object
        arr_traces = []
        
        # Select data based on condition
        # Join all data together to filter
#         len_source_col = df_source.shape[1]  
#         len_target_col = df_target.shape[1] 
        
        # Select only the selected source columns 
#         arr_source_col_idx = feature_indexes.split(",")
        int_source_col_idx = list(map(int, arr_sel_source_col))
        df_selected_source = df_source.iloc[:, int_source_col_idx]
        arr_selected_source_col = list(df_selected_source.columns)
        
        int_target_col_idx = list(map(int, arr_sel_target_col))
        df_selected_target = df_target.iloc[:, int_target_col_idx]
        arr_selected_target_col = list(df_selected_target.columns)
        
        df_strat_res = df_selected_source.join(df_selected_target)
        arr_columns = list(df_selected_target.columns)
        
        df_strat_res = Helper.get_filtered_data(df_strat_res, int_target_col_idx, arr_columns, arr_numtypes, arr_criterion)
        
        if df_strat_res.shape[0] == 0:
            raise Exception("Cannot plot result due to no data remain after filtering by current selected condition.")
        
        # Loop through all target columns to filter data
#         for idx in range(0, len_target_col):
#             
#             col_name = arr_columns[idx]
#             numtype = arr_numtypes[idx]  # INTERVAL, ORDINAL, NOMINAL
#             # Cond vals are in format of cond1&cond2_val1,cond2_val2&cond3
#             # single number, pair of number, Text like Female, Male
#             str_cond_vals = arr_criterion[idx]  
#             
#             # For number value column "interval", process as range
#             if numtype == INTERVAL or  numtype == ORDINAL:
#                 cond_vals = str_cond_vals.split(",")
#                 from_val = int(cond_vals[0])
#                 to_val = int(cond_vals[1])
#                 
#                 df_strat_res = df_strat_res.loc[(df_strat_res[col_name] >= from_val) & (df_strat_res[col_name] <= to_val)]
#                 
#             elif numtype == NOMINAL:
#                 # Find data where match with conds
#                 cond_vals = str_cond_vals.split(",")
#                 print(cond_vals)
#                 df_strat_res = df_strat_res[df_strat_res[col_name].isin(cond_vals)]
# 
#             print("Shape result data: ", df_strat_res.shape)
                
        # Group by
        # Group data by level and bin value
        arr_selected_groupby = []
        arr_new_groupby = []
        idx_selected_groupby = 1
        
        arr_sorted_index = np.argsort(arr_groupby)
        len_groupby = len(arr_groupby)
        for idx in range(0, len_groupby):
            sorted_idx = arr_sorted_index[idx]
            groupby = arr_groupby[sorted_idx]
            if groupby == "":
                continue
            
            col_name = arr_columns[sorted_idx]
            arr_selected_groupby.append(col_name)
            # bin value, valid only for INTERVAL and ORDINAL 
            numtype = arr_numtypes[sorted_idx]
            
            new_groupby_column = ""
            if numtype == INTERVAL or numtype == ORDINAL:
                step_bin = int(arr_bin[sorted_idx])
                
                bin_range = arr_criterion[sorted_idx].split(",")
                start_num = int(bin_range[0])
                stop_num = int(bin_range[1])

                arr_step_bin = np.arange(start_num, stop_num + 1, step_bin)
            
#                 arr_bin_tuple = []
                group_names = []
                # create first bin to handle the lowest data
                # if number starts from 50 and step is 5, 
                # the first bin is 44 - 49
#                 arr_bin_tuple.append((arr_step_bin[0] - step_bin - 1, arr_step_bin[0] - 1))
            
                for from_val in arr_step_bin:
                    # The number that matched with start value is not included in result
                    # but end number is include
                    # if target range is 50 - 54, bin needs to be defined as 49 - 54 
#                     arr_bin_tuple.append((from_val - 1, from_val + step_bin - 1))
                    group_names.append(col_name + str(from_val) + "-" + str(from_val + step_bin - 1))
                    # ex. (-6, -1], (-1, 4], (4, 9], (9, 14], (14, 19] ... (29, 34], (34, 39], (39, 44], (44, 49], (49, 54]]
#                 bins = pd.IntervalIndex.from_tuples(arr_bin_tuple)
             
                bins = len(arr_step_bin)
                # Group by
                group, outbins = pd.cut(df_strat_res[col_name], bins, labels=group_names, retbins=True)
                new_col_name = "G" + str(idx_selected_groupby)
                df_strat_res[new_col_name] = group
                arr_new_groupby.append(new_col_name)
                idx_selected_groupby = idx_selected_groupby + 1
            elif numtype == NOMINAL:
                    arr_new_groupby.append(col_name)
            
            # trace = {'trace_name': '', 'x': , 'y':}
            
            # group2 = pd.cut(df_strat_res[COL_EXC], excer_bin, labels=np.arange(0, len(excer_bin) - 1))
            # print(len(group1))
            # print(group2)
             
#         print(df_strat_res.head(10))
        
        if len(arr_new_groupby) > 0:
            df_groupped = df_strat_res.groupby(arr_new_groupby)
            groups = df_groupped.groups
#             print(groups.keys())
            
            # Initialize array to store selected radiomics column by group of stratified data
            len_group = len(groups.keys())
    
            arr_all_y_vals = np.zeros(shape=(len(arr_selected_source_col), len_group))
            idx_arr_x = 0  # index of x bar in sub group
            # Loop through all sub-groups (smallest group)
            arr_x_labels = []
            arr_y_vals = []
            arr_n_group_member = []
            arr_fmh_avg_score = np.zeros(shape=(len(arr_selected_source_col), len_group))
            
            # In case of categorical groupkeys = dict_keys(['Current', 'Never'])
            # 2 Level (Cate => Interval) ==> 
            for group_keys in groups.keys():
                print("key:", group_keys)
                
                # Generate label for x in chat
                str_label_key = ""
                idx_gb_col = 0
                
                if isinstance(group_keys, str):
                    str_label_key = group_keys 

                elif isinstance(group_keys, pd.Interval):
                    str_label_key = str(group_keys.left + 1) + "-" + str(group_keys.right)
                else:     
                    for key in group_keys:
                        type_key = type(key)
                        str_label_key = str_label_key + arr_selected_groupby[idx_gb_col] + ":"
                        if isinstance(key, str):
                            str_label_key = str_label_key + key + " | "
                        elif isinstance(key, pd.Interval):  
                            # +1 for left because the label that want to display and how pd.cut works are different.
                            # pd.cut does not include left but we display left as included in range
                            str_label_key = str_label_key + str(key.left + 1) + "-" + str(key.right) + " | "
                        idx_gb_col = idx_gb_col + 1  
                # Label of each bar
                arr_x_labels.append(str_label_key)
                
                # If data in group is empty, skip calc mean
                groupped_data = Helper.get_group(df_groupped, group_keys)
                if groupped_data.shape[0] > 1:
                    # Add number of member in group to display on chart
                    arr_n_group_member.append("#Member: " + str(groupped_data.shape[0]))
                    group_mean = groupped_data.mean()
                        
                    # Add mean value to each selected source column in radiomics
                    for s_idx in range(0, len(arr_selected_source_col)):
                        sel_col = arr_selected_source_col[s_idx]
                        group_mean_val = group_mean[sel_col]
                        arr_all_y_vals[s_idx][idx_arr_x] = group_mean_val
                        
                        # Add Framingham Risk Score
                        if is_calc_framingham == True:
                            avg_risk_percent, avg_score = framingham_risk_score(groupped_data)
                            arr_fmh_avg_score[s_idx][idx_arr_x] = avg_risk_percent
                
                idx_arr_x = idx_arr_x + 1
            
        # Prepare trace data for plot
        for s_idx in range(0, len(arr_selected_source_col)):
            trace = dict()
            trace['trace_name'] = arr_selected_source_col[s_idx]
            trace['x_labels'] = arr_x_labels
            # change ndarray to list to prevent json problem
            trace['y_values'] = list(arr_all_y_vals[s_idx]) 
            trace['n_group_member'] = list(arr_n_group_member)
            trace['framingham_risk_score'] = list(arr_fmh_avg_score[s_idx])
            arr_traces.append(trace)
        
        return arr_traces

    @staticmethod
    def get_stratify_3d_data(df_source, df_target, pca_feature_indexes, target_label_index, \
                                              arr_numtypes, arr_criterion, reduce_dim_algorithm):
        """
            Filter data by criterion and do PCA for 3d
            reduce_dim_algorithm: Only PCA is implemented for this phase
        """
        
        # Select only the selected source columns in radiomics
        df_selected_source = Helper.get_selected_features(df_source, pca_feature_indexes)
        
        # Use length to split result between source and label later
        len_selected_source = len(df_selected_source.columns)
        
        df_strat_source = df_selected_source.join(df_target)
        
        # df_data, arr_criterion_columns, arr_numtypes, arr_criterion
        arr_criterion_columns = list(df_target.columns)
        df_start_res = Helper.get_filtered_data(df_strat_source, arr_criterion_columns,
                                                arr_numtypes, arr_criterion)
        
        X = df_start_res.iloc[:, 0:len_selected_source]
        y = df_start_res[[df_target.columns.values[int(target_label_index)]]]
        # Select target columns
#         df_selected_source = df_source.iloc[:, arr_int_source_col_idx]
#         arr_selected_source_col = list(df_selected_source.columns)
        
        # Standardize data
        X_scaled = PreProcessingUtil.standardize(X)
        
        # When 3 features are selected, skip doing PCA and directly return result from filtering and standard scalar.
        if len_selected_source == 3:
            return X_scaled, y
        else:
            dim_3d = []
            pca_helper = PcaUtil()
            if reduce_dim_algorithm == PCA:
                # Get X transformed by PCA
                dim_3d = pca_helper.reduce_dimension(X_scaled, n_components=3)
                
            elif reduce_dim_algorithm == LDA:
                X_transformed = pca_helper.reduce_dimension(X_scaled, n_components=3)
                dim_3d = LdaUtil.reduce_dimension(X_transformed, y.values.ravel(), n_components=3)
        
        return dim_3d, y
    
    @staticmethod
    def get_group(g, key):
        try:
            if key in g.groups: 
                return g.get_group(key)
            else:
                return pd.DataFrame()
        except KeyError: 
            return pd.DataFrame()
    
    @staticmethod
    def get_filtered_data(df_data, int_target_col_idx, arr_criterion_columns, arr_numtypes, arr_criterion):
        """
        Filter data by specifying conditions, type of number (range or specific)
        """
        # Loop through all target columns to filter data
        len_target_col = len(int_target_col_idx)
        for idx in range(0, len_target_col):
            # Get index of row in table criterion because only select target column will be processed.
            # idx = int_target_col_idx[iter_idx]
            col_name = arr_criterion_columns[idx]
            numtype = arr_numtypes[idx]  # INTERVAL, ORDINAL, NOMINAL
            # Cond vals are in format of cond1&cond2_val1,cond2_val2&cond3
            # single number, pair of number, Text like Female, Male
            str_cond_vals = arr_criterion[idx]  
            
            # For number value column "interval", process as range
            if numtype == INTERVAL or  numtype == ORDINAL:
                cond_vals = str_cond_vals.split(",")
                from_val = float(cond_vals[0])
                to_val = float(cond_vals[1])
                
                df_data = df_data.loc[(df_data[col_name] >= from_val) & (df_data[col_name] <= to_val)]
                
            elif numtype == NOMINAL:
                # Find data where match with conds
                cond_vals = str_cond_vals.split(",")
                print(cond_vals)
                df_data = df_data[df_data[col_name].isin(cond_vals)]

            print("Shape result data: ", col_name, df_data.shape)
        return df_data

    @staticmethod
    def get_selected_features(df_data, feature_indexes):
        arr_source_col_idx = feature_indexes.split(",")
        arr_int_source_col_idx = list(map(int, arr_source_col_idx))
        df_selected_source = df_data.iloc[:, arr_int_source_col_idx]
        return df_selected_source
        
