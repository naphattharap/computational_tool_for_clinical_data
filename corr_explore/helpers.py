import numpy as np
import pandas as pd
from random import randint
from services.naphyutils.pca import PcaUtil, LdaUtil
from services.naphyutils.standardization import PreProcessingUtil
from naphyutils.standardization import EncodingCategoricalFeatures
from naphyutils.framingham import FraminghamRiskScore
from naphyutils.biz_exception import BizValidationExption
# from . import framingham 
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

    """
    @staticmethod
    def stratify(df_source, df_target, sel_source_col_idx, sel_target_col_idx, arr_numtypes, arr_criterion_name, arr_criterion_value, arr_grouby, arr_bin):
       
        # Select only selected column in source data
        df_selected_source = df_source.iloc[:, sel_source_col_idx]
        arr_selected_source_col = list(df_selected_source.columns)
        
        # Select only selected column in target data
        df_selected_target = df_target.iloc[:, sel_target_col_idx]
        arr_selected_target_col = list(df_selected_target.columns)
        
        # Join data together for source and target for filtering
        df_data = df_selected_source.join(df_selected_target)
        
        arr_target_col_name = list(df_selected_target.columns)
        
        #  ==== Filter data based on settings criterion
        df_filtered_res = Helper.get_filtered_data(df_data, sel_target_col_idx, arr_numtypes, arr_criterion_name, arr_criterion_value)
        
        if df_filtered_res.shape[0] == 0:
            raise Exception("Cannot plot result due to no data remain after filtering by current selected condition.")
             
        # ========== Group data: Stratification ==========
        # == Prepare group column and split for bin
        # Group by
        # Group data by level and bin value
        arr_selected_groupby = []
        arr_new_groupby = []
        idx_selected_groupby = 1
        
        # Sort order of group by 1, 2, 3 ...
        arr_sorted_index = np.argsort(arr_groupby)
        len_groupby = len(arr_groupby)
        # Group data and store it back to dataframe
        for idx in range(0, len_groupby):
            sorted_idx = arr_sorted_index[idx]
            groupby = arr_groupby[sorted_idx]
            if groupby == "":
                continue
            
            col_name = arr_columns[sorted_idx]
            arr_selected_groupby.append(col_name)
            
            # Check type of number  
            numtype = arr_numtypes[sorted_idx]
            new_groupby_column = ""
            
            if numtype == INTERVAL or numtype == ORDINAL:
                # bin value is required and valid only for INTERVAL and ORDINAL
                # Calc bin
                step_bin = int(arr_bin[sorted_idx])
                bin_range = arr_criterion[sorted_idx].split(",")
                start_num = float(bin_range[0])
                stop_num = float(bin_range[1])

                arr_step_bin = np.arange(start_num, stop_num + 1, step_bin)
                # For axis label
                group_names = []
                for from_val in arr_step_bin:
                    group_names.append(col_name + str(from_val) + "-" + str(from_val + step_bin - 1))
             
                # Cut bin group
                bins = len(arr_step_bin)
                group, outbins = pd.cut(df_strat_res[col_name], bins, labels=group_names, retbins=True)
                # Set temporary group column
                new_col_name = "G" + str(idx_selected_groupby)
                df_strat_res[new_col_name] = group
                # Keep group by column
                arr_new_groupby.append(new_col_name)
                # Increment index for new group by column name
                idx_selected_groupby = idx_selected_groupby + 1
                
            elif numtype == NOMINAL:
                    arr_new_groupby.append(col_name)
        
        # == Group data
        if len(arr_new_groupby) > 0:
            df_groupped = df_strat_res.groupby(arr_new_groupby)
            groups = df_groupped.groups
         
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
    
        return groupped_data
        
    """

    @staticmethod
    def startify_mean_del(df_source, df_target, sel_source_col_indexes, select_target_column_indexes, arr_numtypes, arr_criterion_name, arr_criterion_value, arr_groupby, arr_bin):
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
        groupped_data = Helper.stratify(df_source, df_target, sel_source_col_indexes, select_target_column_indexes, arr_numtypes, arr_criterion_name, arr_criterion_value)
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
#                         if is_calc_framingham == True:
#                             avg_risk_percent, avg_score = framingham_risk_score(groupped_data)
#                             arr_fmh_avg_score[s_idx][idx_arr_x] = avg_risk_percent
        
        idx_arr_x = idx_arr_x + 1
            
        # Prepare trace data for plot
        for s_idx in range(0, len(arr_selected_source_col)):
            trace = dict()
            trace['trace_name'] = arr_selected_source_col[s_idx]
            trace['x_labels'] = arr_x_labels
            # change ndarray to list to prevent json problem
            trace['y_values'] = list(arr_all_y_vals[s_idx]) 
            trace['n_group_member'] = list(arr_n_group_member)
#             trace['framingham_risk_score'] = list(arr_fmh_avg_score[s_idx])
            arr_traces.append(trace)
        
        return arr_traces

    @staticmethod
    def startify_mean(df_source, df_target, source_col_indexes, target_col_indexes, arr_numtypes, arr_criterion_value, arr_bin, arr_groupby, target_calculation):
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

        # int_source_col_idx = list(map(int, arr_sel_source_col))
        df_selected_source = df_source.iloc[:, source_col_indexes]
        arr_selected_source_col = list(df_selected_source.columns)
        
        # int_target_col_idx = list(map(int, arr_sel_target_col))
        df_selected_target = df_target.iloc[:, target_col_indexes]
        arr_selected_target_col = list(df_selected_target.columns)
        
        df_data = df_selected_source.join(df_selected_target)
        # arr_criterion_col_name = list(df_selected_target.columns)
        
        df_strat_res = Helper.get_filtered_data(df_data, arr_numtypes, arr_selected_target_col, arr_criterion_value)
        
        if df_strat_res.shape[0] == 0:
            raise Exception("Cannot plot result due to no data remain after filtering by current selected condition.")
                
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
            
            col_name = arr_selected_target_col[sorted_idx]
            arr_selected_groupby.append(col_name)
            # bin value, valid only for INTERVAL and ORDINAL 
            numtype = arr_numtypes[sorted_idx]
            
            new_groupby_column = ""
            if numtype == INTERVAL or numtype == ORDINAL:
                step_bin = int(arr_bin[sorted_idx])
                
                bin_range = arr_criterion_value[sorted_idx].split(",")
                start_num = float(bin_range[0])
                stop_num = float(bin_range[1])

                arr_step_bin = np.arange(start_num, stop_num + 1, step_bin)
                group_names = []
            
                for from_val in arr_step_bin:
                    group_names.append(col_name + str(from_val) + "-" + str(from_val + step_bin - 1))
                
                bins = len(arr_step_bin)
                # =========== Group Data ==============
                group, outbins = pd.cut(df_strat_res[col_name], bins, labels=group_names, retbins=True)
                new_col_name = "G" + str(idx_selected_groupby)
                df_strat_res[new_col_name] = group
                arr_new_groupby.append(new_col_name)
                idx_selected_groupby = idx_selected_groupby + 1
            elif numtype == NOMINAL:
                    arr_new_groupby.append(col_name)

        # ========== End of generating key for group by ==========
        # ========================================================
        
         # ========== If group data is valid then loop through all groups for calc data ==========
        # To store result from FHS calc
        arr_fmh_male = []
        arr_fmh_female = []
        if len(arr_new_groupby) > 0:
            df_groupped = df_strat_res.groupby(arr_new_groupby)  # Group data by column G1, G2 (our new column)
            groups = df_groupped.groups
            
            # Initialize array to store selected radiomics column by group of stratified data
            len_group = len(groups.keys())
    
            arr_all_y_vals = np.zeros(shape=(len(arr_selected_source_col), len_group))
            idx_arr_x = 0  # index of x bar in sub group
            # Loop through all sub-groups (smallest group)
            arr_x_labels = []
            arr_y_vals = []
            arr_n_group_member = []
            arr_fmh_traces = []
            # In case of categorical groupkeys = dict_keys(['Current', 'Never'])
            # 2 Level (Cate => Interval) ==> 
            for group_keys in groups.keys():
                print("key:", group_keys)
                
                # Generate label for x in chart
                str_label_key = ""
                if isinstance(group_keys, str):
                    str_label_key = group_keys
                    
                elif isinstance(group_keys, int):
                     str_label_key = str_label_key + str(group_keys) + "|"
                else:
                    for key in group_keys:
                        # str_label_key = str_label_key + group_keys + "|"
                        str_label_key = str_label_key + str(key) + "|"

                # Label of each bar
                arr_x_labels.append(str_label_key)
                
                # If data in group is empty, skip calc mean
                groupped_data = Helper.get_group(df_groupped, group_keys)
                if groupped_data.shape[0] > 0:
                    n_members = groupped_data.shape[0]
                    print("Group member: " + str(n_members))
                    # Add number of member in group to display on chart
                    arr_n_group_member.append("#Member: " + str(groupped_data.shape[0]))
                        
                    # Add mean value to each selected source column in radiomics
                    if target_calculation == "mean":
                        group_mean = groupped_data.mean()
                        for s_idx in range(0, len(arr_selected_source_col)):
                            sel_col = arr_selected_source_col[s_idx]
                            group_mean_val = group_mean[sel_col]
                            arr_all_y_vals[s_idx][idx_arr_x] = group_mean_val
                    
                    if target_calculation == "framingham":
                        # Add Framingham Risk Score
                        try:
                            radiomics_feature, fmh_avg_score, radiomics_mean = FraminghamRiskScore.framingham_cvd_score(groupped_data, arr_selected_source_col)
                            current_sex = ""
                            if (isinstance(group_keys, int) and group_keys == 0) or (isinstance(group_keys, tuple) and group_keys[0] == 0):
                                current_sex = 0
                            elif (isinstance(group_keys, int) and group_keys == 1)or (isinstance(group_keys, tuple) and group_keys[0] == 1):
                                current_sex = 1
                            elif (isinstance(group_keys, str) and group_keys == "sex0.0-0.0") or  group_keys[0] == "sex0.0-0.0":
                                current_sex = 0
                            elif (isinstance(group_keys, str) and group_keys == "sex1.0-1.0") or  group_keys[0] == "sex1.0-1.0":
                                current_sex = 1
                             
                            if current_sex == 0:
                                 arr_fmh_female.append({"feature_names": radiomics_feature, "score": fmh_avg_score,
                                            "feature_mean_value": radiomics_mean, "sex": current_sex,
                                            'n_members': n_members, "x_label": str_label_key})
                            elif current_sex == 1:
                                arr_fmh_male.append({"feature_names": radiomics_feature, "score": fmh_avg_score,
                                            "feature_mean_value": radiomics_mean, "sex": current_sex,
                                            'n_members': n_members, "x_label": str_label_key})
                            
                        except BizValidationExption as be:
                            raise be
                        # arr_fmh_avg_score[s_idx][idx_arr_x] = avg_risk_percent
                    
                idx_arr_x = idx_arr_x + 1
                
        # Prepare trace data for plot
        if target_calculation == "mean":
            # Result object
            arr_traces = []
            for s_idx in range(0, len(arr_selected_source_col)):
                trace = dict()
                trace['trace_name'] = arr_selected_source_col[s_idx]
                trace['x_labels'] = arr_x_labels
                # change ndarray to list to prevent json problem
                trace['y_values'] = list(arr_all_y_vals[s_idx]) 
                trace['n_group_member'] = list(arr_n_group_member)
                arr_traces.append(trace)
            return arr_traces
         
         # Change structure of result
        if target_calculation == "framingham":
            # Result object
            arr_traces = dict()
            # 1. Loop through all features
            # 2. In each feature get score and mean value of stratified data
            # Get 2 group for male and female

            if len(arr_fmh_female) > 0:
                traces = Helper.get_fmh_trace_by_gender(arr_selected_source_col, arr_fmh_female, 0)
                arr_traces['traces_female'] = traces
            if len(arr_fmh_male) > 0:     
                traces = Helper.get_fmh_trace_by_gender(arr_selected_source_col, arr_fmh_male, 1)
                arr_traces['traces_male'] = traces 
                
            return arr_traces
         
#          # Group by sex + age
#         elif target_calculation == "framingham_x":
#             # Result object
#             arr_traces = [] 
#             for idx in range(0, len(arr_fmh)):
#                 trace = dict()
#                 trace['trace_name'] = arr_x_labels[idx]  # Stratfication group by level
#                 trace['x_labels'] = arr_fmh[idx]['score']  # FMH score
#                 trace['y_values'] = arr_fmh[idx]['feature_mean_value']  # radiomics
#                 trace['feature_names'] = arr_fmh[idx]['feature_names']
#                 trace['n_members'] = arr_fmh[idx]['n_members']
#                 trace['sex'] = arr_fmh[idx]['sex']
#                # trace['n_group_member'] = list(arr_n_group_member)
#                 arr_traces.append(trace)
#             return arr_traces
        
    @staticmethod
    def get_fmh_trace_by_gender(arr_selected_source_col, arr_fmh, sex):
        traces = []
        n_features = len(arr_selected_source_col)
        for f_idx in range(0, n_features):
            n_strat_group = len(arr_fmh)
            trace = dict()
            trace['trace_name'] = arr_selected_source_col[f_idx]
            x_values = []
            y_values = []
            x_labels = []
            x_text = []  # Mouseover
            for strat_idx in range(0, n_strat_group): 
                feature_score = arr_fmh[strat_idx]['score'][f_idx]
                x_values.append(feature_score)
                feature_amount = arr_fmh[strat_idx]['feature_mean_value'][f_idx]
                y_values.append(feature_amount)
                x_labels.append(arr_fmh[strat_idx]['x_label'])
                item_text = "Member: " + str(arr_fmh[strat_idx]['n_members']) + ", Score: " + str(feature_score)
                x_text.append(item_text)
           
            trace['y_values'] = y_values
            trace['x_labels'] = x_labels
            trace['x_values'] = x_values
            trace['x_text'] = x_text
            trace['sex'] = sex
            traces.append(trace)
        return traces

    @staticmethod
    def get_reduced_dim_data(df_source, df_target, feature_indexes,
                             target_label_index, arr_target_filter_col,
                             arr_numtypes, arr_criterion, reduce_dim_algorithm, n_components):
        """
            Filter data by criterion and do PCA for 3d
            reduce_dim_algorithm: Only PCA is implemented for this phase
        """
        
        # Select only the selected source columns in radiomics
        df_selected_source = Helper.get_selected_columns_data(df_source, feature_indexes)
        df_selected_target = Helper.get_selected_columns_data(df_target, arr_target_filter_col)
        # Use length to split result between source and label later
        len_selected_source = len(df_selected_source.columns)
        
        df_data = df_selected_source.join(df_selected_target)
        
        # df_data, arr_criterion_columns, arr_numtypes, arr_criterion
        arr_criterion_columns = list(df_selected_target.columns)
        # get_filtered_data(df_data, target_col_indexes, arr_numtypes, arr_criterion_column_names, arr_criterion_value):
        df_start_res = Helper.get_filtered_data(df_data, arr_numtypes, arr_criterion_columns, arr_criterion)
        
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
                dim_3d, pca = pca_helper.reduce_dimension(X_scaled, n_components=n_components)
                
            elif reduce_dim_algorithm == LDA:
                new_y = None
                # LDA support only 1 target, so this encode only one target
                col_y = y.columns.values
                label_type = y.loc[:, col_y[0]].dtype
                if label_type == 'object':
                    encoder = EncodingCategoricalFeatures()
                    new_y = encoder.label_encoder(y.loc[:, col_y[0]].values)
                    
                elif label_type in [np.float64]:
                    raise BizValidationExption("Target Label", "Data type cannot be float number.")
                else:
                    new_y = y
                    
                if isinstance(new_y, pd.core.frame.DataFrame):
                    new_y = y.values
                    
                n_labels = len(np.unique(new_y))
                if n_labels <= 3:
                    raise BizValidationExption("LDA", "To reduce dimension by LDA to 3 dimensions, number of classes must be greater than 3.")
                
                # Dont specify , n_components=n_components in PCA because the result is different
                X_transformed, pca = pca_helper.reduce_dimension(X_scaled)
                dim_3d = LdaUtil.reduce_dimension(X_transformed, new_y.ravel(), n_components=n_components)
        
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
    def get_filtered_data(df_data, arr_numtypes, arr_criterion_column_names, arr_criterion_value):
        """
        Filter data by specifying conditions, type of number (range or specific)
        
        int_target_col_idx: Colunmn index in criterion table to filter data
        """
#         if len(target_col_indexes) != len(arr_criterion_column_names):
#             raise Exception("Test non equal data in helpes")
        
        # Loop through all target columns to filter data
        len_target_col = len(arr_criterion_column_names)
        for idx in range(0, len(arr_criterion_column_names)):
            # Get index of row in table criterion because only select target column will be processed.
            # idx = int_target_col_idx[iter_idx]
            col_name = arr_criterion_column_names[idx]
            # col_idx = int(target_col_indexes[idx])
            numtype = arr_numtypes[idx]  # INTERVAL, ORDINAL, NOMINAL
            # Cond vals are in format of cond1&cond2_val1,cond2_val2&cond3
            # single number, pair of number, Text like Female, Male
            str_cond_vals = arr_criterion_value[idx]  
            
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
    def get_selected_columns_data(df_data, str_column_indexes):
        if isinstance(str_column_indexes, str):
            str_column_indexes = str_column_indexes.split(",")
        arr_int_col_idx = list(map(int, str_column_indexes))
        df_selected_data = df_data.iloc[:, arr_int_col_idx]
        return df_selected_data
    
    @staticmethod
    def sort_max_min(arr_col_names, arr_col_values):
            min_max_idx = np.argsort(arr_col_values)
            max_min_idx = min_max_idx[::-1]
            arr_name = []
            arr_value = []
            for idx in max_min_idx:
                arr_name.append(arr_col_names[idx])
                arr_value.append(arr_col_values[idx])
            
            return arr_name, arr_value    
