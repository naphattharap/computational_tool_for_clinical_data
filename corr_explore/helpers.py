import numpy as np
import pandas as pd

ORDINAL = "ORDINAL"
NOMINAL = "NOMINAL"
INTERVAL = "INTERVAL"


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
            
            if data_type in [np.int64, np.float64] and n_unique <= threshold_unique_ordinal:
                # Set as ordinal number
                number_type = ORDINAL
                min = Helper.cast_number_for_json(data_type, col_series.min())
                max = Helper.cast_number_for_json(data_type, col_series.max())
                
            elif data_type in [np.int64, np.float64] and n_unique > threshold_unique_ordinal:
                # Set as interval number
                number_type = INTERVAL
                min = Helper.cast_number_for_json(data_type, col_series.min())
                max = Helper.cast_number_for_json(data_type, col_series.max())
                
            elif data_type == 'object':
                # Set as nominal
                number_type = NOMINAL
                nominal_values = list(unique_val)
                
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
    def startify_mean(df_source, df_target, feature_indexes, arr_numtypes, arr_criterion, arr_bin, arr_groupby):
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
        len_source_col = df_source.shape[1]  
        len_target_col = df_target.shape[1] 
        
        # Select only the selected source columns 
        arr_source_col_idx = feature_indexes.split(",")
        int_source_col_idx = list(map(int, arr_source_col_idx))
        df_selected_source = df_source.iloc[:, int_source_col_idx]
        arr_selected_source_col = list(df_selected_source.columns)
        df_strat_res = df_selected_source.join(df_target)
        arr_columns = list(df_target.columns)
        
        # Loop through all target columns to filter data
        for idx in range(0, len_target_col):
            
            col_name = arr_columns[idx]
            numtype = arr_numtypes[idx]  # INTERVAL, ORDINAL, NOMINAL
            # Cond vals are in format of cond1&cond2_val1,cond2_val2&cond3
            # single number, pair of number, Text like Female, Male
            str_cond_vals = arr_criterion[idx]  
            
            # For number value column "interval", process as range
            if numtype == INTERVAL or  numtype == ORDINAL:
                cond_vals = str_cond_vals.split(",")
                from_val = int(cond_vals[0])
                to_val = int(cond_vals[1])
                
                df_strat_res = df_strat_res.loc[(df_strat_res[col_name] >= from_val) & (df_strat_res[col_name] <= to_val)]
                
            elif numtype == NOMINAL:
                # Find data where match with conds
                cond_vals = str_cond_vals.split(",")
                print(cond_vals)
                df_strat_res = df_strat_res[df_strat_res[col_name].isin(cond_vals)]
                
#             elif numtype == ORDINAL:
#                 # Data must be processed before stratifying
#                 df_strat_res = df_strat_res.loc[(df_strat_res[col_name] >= from_val) & (df_strat_res[col_name] < to_val)]
         
            print("Shape result data: ", df_strat_res.shape)
                
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

                arr_step_bin = np.arange(start_num, stop_num, step_bin)
            
                arr_bin_tuple = []
                # create first bin to handle the lowest data
                # if number starts from 50 and step is 5, 
                # the first bin is 44 - 49
                arr_bin_tuple.append((arr_step_bin[0] - step_bin - 1, arr_step_bin[0] - 1))
            
                for from_val in arr_step_bin:
                    # The number that matched with start value is not included in result
                    # but end number is include
                    # if target range is 50 - 54, bin needs to be defined as 49 - 54 
                    arr_bin_tuple.append((from_val - 1, from_val + step_bin - 1))
                    
                    # ex. [(40, 44), (45, 49), (50, 54), (55, 59), (60, 64), (65, 69), (70, 74)]
                    bins = pd.IntervalIndex.from_tuples(arr_bin_tuple)
             
                # Group by
                group = pd.cut(df_strat_res[col_name], bins, labels=np.arange(1, len(bins)))
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
             
        print(df_strat_res.head(10))
        
        if len(arr_new_groupby) > 0:
            df_groupped = df_strat_res.groupby(arr_new_groupby)
            groups = df_groupped.groups
            print(groups.keys())
            
            # Initialize array to store selected radiomics column by group of stratified data
            len_group = len(groups.keys())
    
            arr_all_y_vals = np.zeros(shape=(len(arr_selected_source_col), len_group))
            idx_arr_x = 0  # index of x bar in sub group
            # Loop through all sub-groups (smallest group)
            arr_x_labels = []
            arr_y_vals = []
            for group_keys in groups.keys():
                print("key:", group_keys)
                
                # Generate label for x in chat
                str_label_key = ""
                idx_gb_col = 0
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
                
                groupped_data = df_groupped.get_group(group_keys)
                group_mean = groupped_data.mean()
                
                # Add mean value to each selected source column in radiomics
                
                for s_idx in range(0, len(arr_selected_source_col)):
                    sel_col = arr_selected_source_col[s_idx]
                    group_mean_val = group_mean[sel_col]
                    arr_all_y_vals[s_idx][idx_arr_x] = group_mean_val
                
                idx_arr_x = idx_arr_x + 1
            
        # Prepare trace data for plot
        for s_idx in range(0, len(arr_selected_source_col)):
            trace = dict()
            trace['trace_name'] = arr_selected_source_col[s_idx]
            trace['x_labels'] = arr_x_labels
            # change ndarray to list to prevent json problem
            trace['y_values'] = list(arr_all_y_vals[s_idx]) 
            arr_traces.append(trace)
        
        return arr_traces
        
