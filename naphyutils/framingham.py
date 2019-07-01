import numpy as np
from naphyutils.biz_exception import BizValidationExption
from decimal import Decimal, ROUND_HALF_UP


class FraminghamRiskScore:
    FMH_GENDER = "sex"
    FMH_AGE = "age"
    FMH_CHO = "cholesterol"
    FMH_SMOKE = "smoking status"
    FMH_HDL = "HDL"
    FMH_BLOOD_PRESSURE = "systolic blood pressure"
    FMH_IS_TREATED_BLOOD_PRESSURE = "treatment blood pressure" 
    FMH_DIABETE = "diabetes"
    FMH_BMI = "body mass index"
    FMH_COLUMNS = [FMH_GENDER, FMH_AGE, FMH_CHO,
                   FMH_SMOKE, FMH_HDL, FMH_BLOOD_PRESSURE, FMH_IS_TREATED_BLOOD_PRESSURE]
    
    FMH_CVD_COLUMNS = [FMH_GENDER, FMH_AGE, FMH_BLOOD_PRESSURE, FMH_SMOKE,
                       FMH_IS_TREATED_BLOOD_PRESSURE, FMH_BMI, FMH_DIABETE]
    COEF_M_NO_TRT_AGE = 3.11296
    COEF_M_NO_TRT_SBP = 1.85508
    COEF_M_TRT_SBP = 1.92672
    COEF_M_NO_TRT_SMOKE = 0.70953
    COEF_M_NO_TRT_ฺBMI = 0.79277
    COEF_M_NO_TRT_DIABETE = 0.5316
    
    COEF_F_NO_TRT_AGE = 2.72107
    COEF_F_NO_TRT_SBP = 2.81291
    COEF_F_TRT_SBP = 2.88267
    COEF_F_NO_TRT_SMOKE = 0.61868
    COEF_F_NO_TRT_ฺBMI = 0.51125
    COEF_F_NO_TRT_DIABETE = 0.77763
    FEMALE = 0
    MALE = 1 
    
    @staticmethod
    def framingham_cvd_score_gender(df_data, cal_features_col_name):
        """
            Input data is split into 2 group based on gender Male and Female
            then Framingham CVS Risk Score and value of radiomics is calulate
        """
        # Split data for male and female
        df_female = df_data[df_data[FraminghamRiskScore.FMH_GENDER] == FraminghamRiskScore.FEMALE]
        df_male = df_data[df_data[FraminghamRiskScore.FMH_GENDER] == FraminghamRiskScore.MALE]
        
        female_avg_risk_score, female_radiomics_mean = FraminghamRiskScore.framingham_cvd_score(df_female, cal_features_col_name)
        male_avg_risk_score, male_radiomics_mean = FraminghamRiskScore.framingham_cvd_score(df_female, cal_features_col_name)
        
        result = dict()
        result['female_avg_risk_score'] = female_avg_risk_score
        result['female_radiomics_mean'] = female_radiomics_mean
        
        result['male_avg_risk_score'] = male_avg_risk_score
        result['male_radiomics_mean_fem'] = male_radiomics_mean
        return result
    
    @staticmethod
    def framingham_cvd_score(df_data, cal_features_col_name):
        """
        Calculate framingham cvd risk score in 10 year for specified group data
        and calculate mean for target radiomics feature 
        
        Input radiomics and framingham risk factors
            df_group: data to be calculate FHM CVD
            cal_features_col_name: target radiomics feature column name
        """
        
        FraminghamRiskScore.validate_csv_column_for_framingham(df_data, FraminghamRiskScore.FMH_CVD_COLUMNS)
            
        n_rows = df_data.shape[0]
        sum_risk_score = 0
        for row_idx in range(0, n_rows):
            sex, age, blood_pressure, smoking_status, treat_bp, bmi, diabete = FraminghamRiskScore.get_cvd_factors(df_data, row_idx)
            sum_risk_score = sum_risk_score + FraminghamRiskScore.framingham_cvd_risk_score(sex, age, blood_pressure, smoking_status, treat_bp, bmi, diabete)
        
        temp_avg_risk_score = (sum_risk_score / n_rows) 
        # Format to prevent floating point error ex. 7.00000000001
        avg_risk_score = Decimal(str(temp_avg_risk_score)).quantize(Decimal('1.1'), rounding=ROUND_HALF_UP)
        # Take mean of target radiomics of group
        n_features = len(cal_features_col_name)
        avg_score = []
        radiomics_mean = []
        radiomics_feature = []
        for f_idx in range(0, n_features):
            feature_name = cal_features_col_name[f_idx]
            mean_val = df_data[feature_name].mean()
            avg_score.append(avg_risk_score)
            radiomics_mean.append(mean_val)
            radiomics_feature.append(feature_name)
            # radiomics_mean.append({'feature_name': feature_name, "feature_mean_value": mean_val, "framingham_mean_score": avg_risk_score})
        # Label x axis, x, y value
        return radiomics_feature, avg_score, radiomics_mean 
    
    @staticmethod
    def validate_cvd_columns(df):
        """
            Validate the existence of required columns before calculating Framingham Risk Score.
        """
        arr_columns = df.columns.values
        arr_errors = []
        for col in FraminghamRiskScore.FMH_CVD_COLUMNS:
            if col not in arr_columns:
                arr_errors.append(col)
        if len(arr_errors) > 0:
            missing_cols = ",".join(arr_errors)
            raise BizValidationExption("Framingham Risk Score", "Cannot be calculated due to missing of columns: " + missing_cols + " in selected data.")  
    
    @staticmethod
    def get_cvd_factors(df, row_idx):
    
        gender = df.iloc[row_idx][FraminghamRiskScore.FMH_GENDER]
        age = int(df.iloc[row_idx][FraminghamRiskScore.FMH_AGE])
        blood_pressure = int(df.iloc[row_idx][FraminghamRiskScore.FMH_BLOOD_PRESSURE])
        smoke = df.iloc[row_idx][FraminghamRiskScore.FMH_SMOKE]
        trt_bp = df.iloc[row_idx][FraminghamRiskScore.FMH_IS_TREATED_BLOOD_PRESSURE] 
        bmi = float(df.iloc[row_idx][FraminghamRiskScore.FMH_BMI])
        diabete = int(df.iloc[row_idx][FraminghamRiskScore.FMH_DIABETE])
        
        return gender, age, blood_pressure, smoke, trt_bp, bmi, diabete
    
     # https://en.wikipedia.org/wiki/Framingham_Risk_Score#cite_note-1
     # https://www.framinghamheartstudy.org/fhs-risk-functions/cardiovascular-disease-10-year-risk/
    @staticmethod
    def framingham_cvd_risk_score(sex, age, sbp, smoking_status, treat_bp, bmi, diabete):
        """
            Sex: 1 for female, 2 for male
            Age: Integer number
            sbp: Value of systolic blood pressure
            smoking_status: 0 for No, and 1 for yes
            treat_bp: Treate blood pressure, 0 for No, 1 for Yes
            bmi: float value of body mass index
            diabete: 0 for not having diabetes, 1 for having diabetes
        """
        # Validation of data type
        if not sex in [0, 1]:
            raise BizValidationExption(FraminghamRiskScore.FMH_GENDER, "Data type must be integer and  0 for Female or 1 for Male")
    
        if not isinstance(age, np.int):
            raise BizValidationExption(FraminghamRiskScore.FMH_AGE, "Data type has to be integer.")
        
        if not isinstance(sbp, np.int):
            raise BizValidationExption(FraminghamRiskScore.FMH_BLOOD_PRESSURE, "Data type has to be number.")
    
        if not smoking_status in [0, 1]:
            raise BizValidationExption(FraminghamRiskScore.FMH_SMOKE, "Data type has to be number. 0 for not smoking, 1 for smoking")
         
        if (isinstance(treat_bp, int) and not treat_bp in [0, 1]) \
            or (isinstance(treat_bp, str) and not treat_bp in ['0', '1']):
            raise BizValidationExption(FraminghamRiskScore.FMH_IS_TREATED_BLOOD_PRESSURE, "Data type has 0 for not treated for blood pressure or 1.")
        
        if not isinstance(bmi, np.float) and not isinstance(bmi, np.int):
            raise BizValidationExption(FraminghamRiskScore.FMH_IS_TREATED_BLOOD_PRESSURE, "Data has 0 for not treated for blood pressure or 1.")
        
        if not diabete in [0, 1]:
            raise BizValidationExption(FraminghamRiskScore.FMH_DIABETE, "Data has 0 for not having diabete otherwise 1.")
        
        # M Value
        ln_age = np.log(age)
        ln_bmi = np.log(bmi)
        ln_sbp = np.log(sbp)
        sum_product = None
        risk_score = None
        if sex == FraminghamRiskScore.FEMALE:
            # ln_sbp = np.log(110)
            sum_product = ln_age * FraminghamRiskScore.COEF_F_NO_TRT_AGE + smoking_status * FraminghamRiskScore.COEF_F_NO_TRT_SMOKE \
                          +ln_bmi * FraminghamRiskScore.COEF_F_NO_TRT_ฺBMI + diabete * FraminghamRiskScore.COEF_F_NO_TRT_DIABETE
            if treat_bp == 0:
                sum_product = sum_product + ln_sbp * FraminghamRiskScore.COEF_F_NO_TRT_SBP
            else:
                sum_product = sum_product + ln_sbp * FraminghamRiskScore.COEF_F_TRT_SBP
            
            # 1-POWER(0.94833,EXP(F26-26.0145)) 
            risk_score = (1 - np.power(0.94833, np.exp(sum_product - 26.0145))) * 100
            
        elif sex == FraminghamRiskScore.MALE:
            
            sum_product = ln_age * FraminghamRiskScore.COEF_M_NO_TRT_AGE + smoking_status * FraminghamRiskScore.COEF_M_NO_TRT_SMOKE \
                          +ln_bmi * FraminghamRiskScore.COEF_M_NO_TRT_ฺBMI + diabete * FraminghamRiskScore.COEF_M_NO_TRT_DIABETE
            
            if treat_bp == 0:
                sum_product = sum_product + ln_sbp * FraminghamRiskScore.COEF_M_NO_TRT_SBP
            else:
                sum_product = sum_product + ln_sbp * FraminghamRiskScore.COEF_M_TRT_SBP
            
             # risk =1-POWER(0.88431,EXP(D26-23.9388))
            risk_score = (1 - np.power(0.88431, np.exp(sum_product - 23.9388))) * 100
                
        return risk_score

    @staticmethod
    def validate_csv_column_for_framingham(df, columns):
        """
            Validate the existence of required columns before calculating Framingham Risk Score.
        """
    
        arr_columns = df.columns.values
        arr_errors = []
        for col in columns:
            if col not in arr_columns:
                arr_errors.append(col)
        if len(arr_errors) > 0:
            missing_cols = ",".join(arr_errors)
            raise BizValidationExption("Framingham Risk Score", "Cannot be calculated due to missing of columns: " + missing_cols + " in selected data.")  
    
    @staticmethod
    def get_row_factor_data(df, row_idx):
        gender = df.iloc[row_idx][FraminghamRiskScore.FMH_GENDER]
        age = int(df.iloc[row_idx][FraminghamRiskScore.FMH_AGE])
        cho = int(df.iloc[row_idx][FraminghamRiskScore.FMH_CHO])
        smoke = df.iloc[row_idx][FraminghamRiskScore.FMH_SMOKE]
        hdl = int(df.iloc[row_idx][FraminghamRiskScore.FMH_HDL])
        blood_pressure = int(df.iloc[row_idx][FraminghamRiskScore.FMH_BLOOD_PRESSURE])
        is_treated_blood_pressure = int(df.iloc[row_idx][FraminghamRiskScore.FMH_IS_TREATED_BLOOD_PRESSURE])
        return gender, age, cho, smoke, hdl, blood_pressure, is_treated_blood_pressure

    @staticmethod
    def get_fmh_10year_risk_percent(gender, points):
            
        # Find 10-year risk in %
        risk_percent = None
        if gender == 1:
            # Female
            """
            10-year risk in %: 
            Points total: 
            Under 9 points: <1%. 
            9-12 points: 1%. 
            13-14 points: 2%. 
            15 points: 3%. 
            16 points: 4%. 
            17 points: 5%. 
            18 points: 6%. 
            19 points: 8%. 
            20 points: 11%. 
            21=14%, 22=17%, 
            23=22%, 
            24=27%, 
            >25= Over 30%
            """
            if points < 9:
                risk_percent = 0.5
            elif 9 <= points <= 12:
                risk_percent = 1
            elif 13 <= points <= 14:
                risk_percent = 2
            elif points == 15:
                risk_percent = 3
            elif points == 16:
                risk_percent = 4
            elif points == 17:
                risk_percent = 5
            elif points == 18:
                risk_percent = 6
            elif points == 19:
                risk_percent = 8
            elif points == 20:
                risk_percent = 11
            elif points == 21:
                risk_percent = 14
            elif points == 22:
                risk_percent = 3
            elif points == 23:
                risk_percent = 22
            elif points == 24:
                risk_percent = 27
            elif points >= 25:
                risk_percent = 30
            
        if gender == 2:
            """
            Male
            10-year risk in %: Points total: 0 point: <1%. 1-4 points: 1%. 
            5-6 points: 2%. 7 points: 3%. 8 points: 4%. 9 points: 5%. 
            10 points: 6%. 11 points: 8%. 12 points: 10%. 13 points: 12%. 
            14 points: 16%. 15 points: 20%. 16 points: 25%. 
            17 points or more: Over 30%
            """
            if points < 0:
                risk_percent = 0.5
            elif 1 <= points <= 4:
                risk_percent = 1
            elif 5 <= points <= 6:
                risk_percent = 2
            elif points == 7:
                risk_percent = 3
            elif points == 8:
                risk_percent = 4
            elif points == 9:
                risk_percent = 5
            elif points == 10:
                risk_percent = 6
            elif points == 11:
                risk_percent = 8
            elif points == 12:
                risk_percent = 10
            elif points == 13:
                risk_percent = 12
            elif points == 14:
                risk_percent = 16
            elif points == 15:
                risk_percent = 20
            elif points == 16:
                risk_percent = 25
            elif points >= 17:
                risk_percent = 30
    
        return risk_percent
    
    @staticmethod
    def get_fmh_risk_score_female(point):
        """
            Points total: 
            Under 9 points: <1%, 9-12 points: 1%. 
            13-14 points: 2, 15 points: 3%. 
            16 points: 4%, 17 points: 5%. 
            18 points: 6%, 19 points: 8%. 
            20 points: 11%, 21=14%, 
            22=17%, 23=22%, 24=27%, >25= Over 30%
        """
        risk_percent = 0
        if point < 9:
            risk_percent = 0.5
        elif 9 <= point <= 12:
            risk_percent = 1
        elif 13 <= point <= 14:
            risk_percent = 2
        elif point == 15:
            risk_percent = 3
        elif point == 16:
            risk_percent = 4
        elif point == 17:
            risk_percent = 5
        elif point == 18:
            risk_percent = 6
        elif point == 19:
            risk_percent = 8
        elif point == 20:
            risk_percent = 11
        elif point == 21:
            risk_percent = 14
        elif point == 22:
            risk_percent = 17
        elif point == 23:
            risk_percent = 22
        elif point == 24:
            risk_percent = 27
        elif point >= 25:
            risk_percent = 30
        
        return risk_percent
    
    @staticmethod
    def get_fmh_risk_score_male(point):
        """
            Points total: 0 point: <1%. 
            1-4 points: 1%. 5-6 points: 2%. 
            7 points: 3%.   8 points: 4%. 
            9 points: 5%.   10 points: 6%. 
            11 points: 8%.  12 points: 10%. 
            13 points: 12%. 14 points: 16%. 
            15 points: 20%. 16 points: 25%. 
            17 points or more: Over 30%
        """
        risk_percent = 0
        if point < 9:
            risk_percent = 0.5
        elif 1 <= point <= 4:
            risk_percent = 1
        elif 5 <= point <= 6:
            risk_percent = 2
        elif point == 7:
            risk_percent = 3
        elif point == 8:
            risk_percent = 4
        elif point == 9:
            risk_percent = 5
        elif point == 10:
            risk_percent = 6
        elif point == 11:
            risk_percent = 8
        elif point == 12:
            risk_percent = 10
        elif point == 13:
            risk_percent = 12
        elif point == 14:
            risk_percent = 16
        elif point == 15:
            risk_percent = 20
        elif point == 16:
            risk_percent = 25
        elif point >= 17:
            risk_percent = 30
            
        return risk_percent
    
    @staticmethod
    def get_male_fhm_point(age, cholesterol, smoke, hdl, blood_pressure, is_treated_blood_pressure):
        total_point = 0
        point_age = 0
        point_cho = 0
        point_smoke = 0
        point_hdl = 0
        point_blood_pressure = 0
        # Male score
        """Age: 
        20–34 years: Minus 9 points. 
        35–39 years: Minus 4 points. 
        40–44 years: 0 points. 
        45–49 years: 3 points. 
        50–54 years: 6 points. 
        55–59 years: 8 points. 
        60–64 years: 10 points. 
        65–69 years: 11 points. 
        70–74 years: 12 points. 
        75–79 years: 13 points.
        """
        if 20 <= age <= 34:
            point_age = 9
        elif 35 <= age <= 39:
            point_age = 4
        elif 40 <= age <= 44:
            point_age = 0
        elif 45 <= age <= 49:
            point_age = 3
        elif 50 <= age <= 54:
            point_age = 6
        elif 55 <= age <= 59:
            point_age = 8
        elif 60 <= age <= 64:
            point_age = 10
        elif 65 <= age <= 69:
            point_age = 11
        elif 70 <= age <= 74:
            point_age = 12
        elif 75 <= age <= 79:
            point_age = 13
        
        if cholesterol < 160:
            # point = 0 for all age ranges
            point_cho = 0  
        elif 20 <= age <= 39:
            """
            Age 20–39 years: 
            Under 160: 0 points. 
            160-199: 4 points. 
            200-239: 7 points. 
            240-279: 9 points. 
            280 or higher: 11 points.   
            """
            if 160 <= cholesterol <= 199:
                point_cho = 4               
            elif 200 <= cholesterol <= 239:
                point_cho = 7                     
            elif 240 <= cholesterol <= 279:
                point_cho = 9
            elif cholesterol >= 280:
                point_cho = 11 
     
        elif 40 <= age <= 49: 
            """
            Age 40–49 years: 
            Under 160: 0 points. 
            160-199: 3 points. 
            200-239: 5 points. 
            240-279: 6 points. 
            280 or higher: 8 points
            """  
            if 160 <= cholesterol <= 199:
                point_cho = 3               
            elif 200 <= cholesterol <= 239:
                point_cho = 5                     
            elif 240 <= cholesterol <= 279:
                point_cho = 6
            elif cholesterol >= 280:
                point_cho = 8 
                    
        elif 50 <= age <= 59:    
            """
            Age 50–59 years: 
            Under 160: 0 points. 
            160-199: 2 points. 
            200-239: 3 points. 
            240-279: 4 points. 
            280 or higher: 5 points. 
            """
            if 160 <= cholesterol <= 199:
                point_cho = 2               
            elif 200 <= cholesterol <= 239:
                point_cho = 3                     
            elif 240 <= cholesterol <= 279:
                point_cho = 4
            elif cholesterol >= 280:
                point_cho = 5
    
        elif 60 <= age <= 69: 
            """
            Age 60–69 years: 
            Under 160: 0 points. 
            160-199: 1 point. 
            200-239: 1 point. 
            240-279: 2 points. 
            280 or higher: 3 points.
            """
            if 160 <= cholesterol <= 199:
                point_cho = 1               
            elif 200 <= cholesterol <= 239:
                point_cho = 1                  
            elif 240 <= cholesterol <= 279:
                point_cho = 2
            elif cholesterol >= 280:
                point_cho = 3 
                    
        elif 70 <= age <= 79: 
            """
            Age 70–79 years: Under 160: 0 points. 
            160-199: 0 points. 
            200-239: 0 points. 
            240-279: 1 point. 
            280 or higher: 1 point.
            """
            if 160 <= cholesterol <= 199:
                point_cho = 0               
            elif 200 <= cholesterol <= 239:
                point_cho = 0                   
            elif 240 <= cholesterol <= 279:
                point_cho = 1
            elif cholesterol >= 280:
                point_cho = 1 
    #     else:
    #         raise BizValidationExption("cholesterol", "Data for calculating points of cholesterol is invalid. It must be number not " + str(smoke))
                
        # Smoker
        """
        Age 20–39 years: 8 points. 
        Age 40–49 years: 5 points. 
        Age 50–59 years: 3 points. 
        Age 60–69 years: 1 point. 
        Age 70–79 years: 1 point.    
        """
        if smoke == 1:
            if 20 <= age <= 39:
                point_smoke = 8               
            if 40 <= age <= 49:
                point_smoke = 5               
            if 50 <= age <= 59:
                point_smoke = 3               
            if 60 <= age <= 69:
                point_smoke = 1               
            if 70 <= age <= 79:
                point_smoke = 1              
        elif smoke == 0:
            point_smoke = 0
            
        # HDL
        """
        60 or higher: Minus 1 point. 
        50-59: 0 points. 
        40-49: 1 point. 
        Under 40: 2 points.
        """
        if hdl >= 60:
            point_hdl = -1
        if 50 <= hdl <= 59:
            point_hdl = 0
        if 40 <= hdl <= 49:
            point_hdl = 1
        if hdl < 40:
            point_hdl = 2
            
        # Blood pressure
        """
            Untreated: 
            Under 120: 0 points. 
            120-129: 0 points. 
            130-139: 1 point. 
            140-159: 1 point. 
            160 or higher: 2 points. 
            
            Treated: 
            Under 120: 0 points. 
            120-129: 1 point. 
            130-139: 2 points. 
            140-159: 2 points. 
            160 or higher: 3 points.
        """
        if blood_pressure < 120:
            point_blood_pressure = 0
        elif is_treated_blood_pressure == 0:
            # Untreated
            if 120 <= blood_pressure <= 129:
                point_blood_pressure = 0
            elif 130 <= blood_pressure <= 139:
                point_blood_pressure = 1
            elif 140 <= blood_pressure <= 159:
                point_blood_pressure = 1
            elif blood_pressure >= 160:
                point_blood_pressure = 2       
        elif is_treated_blood_pressure == 1:
            # Treated
            if 120 <= blood_pressure <= 129:
                point_blood_pressure = 1
            elif 130 <= blood_pressure <= 139:
                point_blood_pressure = 2
            elif 140 <= blood_pressure <= 159:
                point_blood_pressure = 2
            elif blood_pressure >= 160:
                point_blood_pressure = 3
        
        total_point = point_age + point_cho + point_smoke + point_blood_pressure   
        return  total_point
    
    @staticmethod
    def get_female_fhm_point(age, cholesterol, smoke, hdl, blood_pressure, is_treated_blood_pressure):
        total_point = 0
        point_age = 0
        point_cho = 0
        point_smoke = 0
        point_hdl = 0
        point_blood_pressure = 0
        # Female score
        if 20 <= age <= 34:
            point_age = -7
        elif 35 <= age <= 39:
            point_age = -3
        elif 40 <= age <= 44:
            point_age = 0
        elif 45 <= age <= 49:
            point_age = 3
        elif 50 <= age <= 54:
            point_age = 6
        elif 55 <= age <= 59:
            point_age = 8
        elif 60 <= age <= 64:
            point_age = 10
        elif 65 <= age <= 69:
            point_age = 12
        elif 70 <= age <= 74:
            point_age = 14
        elif 75 <= age <= 79:
            point_age = 16
        
        if cholesterol < 160:
            # point = 0 for all age ranges
            point_cho = 0  
        elif 20 <= age <= 39:
            """
            160-199: 4 points. 
            200-239: 8 points. 
            240-279: 11 points. 
            280 or higher: 13 points.     
            """
            if 160 <= cholesterol <= 199:
                point_cho = 4               
            elif 200 <= cholesterol <= 239:
                point_cho = 8                     
            elif 240 <= cholesterol <= 279:
                point_cho = 11
            elif cholesterol >= 280:
                point_cho = 13  
                
        elif 40 <= age <= 49:
            """
                Age 40–49 years: 
                Under 160: 0 points. 
                160-199: 3 points. 
                200-239: 6 points. 
                240-279: 8 points. 
                280 or higher: 10 points   
            """
            if 160 <= cholesterol <= 199:
                point_cho = 3            
            elif 200 <= cholesterol <= 239:
                point_cho = 6                    
            elif 240 <= cholesterol <= 279:
                point_cho = 8
            elif cholesterol >= 280:
                point_cho = 10             
        elif 50 <= age <= 59:    
            """          
            Age 50–59 years:  
            160-199: 2 points. 
            200-239: 4 points. 
            240-279: 5 points. 
            280 or higher: 7 points.
            """
            if 160 <= cholesterol <= 199:
                point_cho = 2               
            elif 200 <= cholesterol <= 239:
                point_cho = 4                     
            elif 240 <= cholesterol <= 279:
                point_cho = 5
            elif cholesterol >= 280:
                point_cho = 7 
    
        elif 60 <= age <= 69: 
            """
                Age 60–69 years: 
                Under 160: 0 points.
                160-199: 1 point. 
                200-239: 2 points. 
                240-279: 3 points. 
                280 or higher: 4 points
            """
            if 160 <= cholesterol <= 199:
                point_cho = 1               
            elif 200 <= cholesterol <= 239:
                point_cho = 2                   
            elif 240 <= cholesterol <= 279:
                point_cho = 3
            elif cholesterol >= 280:
                point_cho = 4  
                    
        elif 70 <= age <= 79: 
            """
                Age 70–79 years: Under 160: 0 points. 
                160-199: 1 point. 
                200-239: 1 point. 
                240-279: 2 points. 
                280 or higher: 2 points.
            """
            if 160 <= cholesterol <= 199:
                point_cho = 1               
            elif 200 <= cholesterol <= 239:
                point_cho = 1                   
            elif 240 <= cholesterol <= 279:
                point_cho = 1
            elif cholesterol >= 280:
                point_cho = 2 
                
        # Smoker
        """
            Age 20–39 years: 9 points.
            Age 40–49 years: 7 points.
            Age 50–59 years: 4 points.
            Age 60–69 years: 2 points.
            Age 70–79 years: 1 point.     
        """
        if smoke == 1:
            if 20 <= age <= 39:
                point_smoke = 9               
            if 40 <= age <= 49:
                point_smoke = 7               
            if 50 <= age <= 59:
                point_smoke = 4               
            if 60 <= age <= 69:
                point_smoke = 2               
            if 70 <= age <= 79:
                point_smoke = 1              
        else:
            point_smoke = 0
            
        # HDL
        """
        60 or higher: Minus 1 point. 
        50-59: 0 points. 
        40-49: 1 point. 
        Under 40: 2 points.
        """
        if hdl >= 60:
            point_hdl = -1
        if 50 <= hdl <= 59:
            point_hdl = 0
        if 40 <= hdl <= 49:
            point_hdl = 1
        if hdl < 40:
            point_hdl = 2
            
        # Blood pressure
        """
        Untreated: 
        Under 120: 0 points. 
        120-129: 1 point. 
        130-139: 2 points. 
        140-159: 3 points. 
        160 or higher: 4 points. 
        
        Treated: Under 120: 0 points. 
        120-129: 3 points. 
        130-139: 4 points. 
        140-159: 5 points. 
        160 or higher: 6 points.
        """
        if blood_pressure < 120:
            point_blood_pressure = 0
        elif is_treated_blood_pressure == 0:
            if 120 <= blood_pressure <= 129:
                point_blood_pressure = 1
            elif 130 <= blood_pressure <= 139:
                point_blood_pressure = 2
            elif 140 <= blood_pressure <= 159:
                point_blood_pressure = 3
            elif blood_pressure >= 160:
                point_blood_pressure = 4       
        elif is_treated_blood_pressure == 1:
            if 120 <= blood_pressure <= 129:
                point_blood_pressure = 3
            elif 130 <= blood_pressure <= 139:
                point_blood_pressure = 4
            elif 140 <= blood_pressure <= 159:
                point_blood_pressure = 5
            elif blood_pressure >= 160:
                point_blood_pressure = 6
        
        total_point = point_age + point_cho + point_smoke + point_blood_pressure   
        return  total_point

# row1 = {'gender': 1, 'age': 36, 'total cholesterol': 220, 'smoker': 0, 'Systolic blood pressure': 80, 'HDL': 140}
# rows_list = []
# rows_list.append(row1)
# test_col = [FMH_GENDER, FMH_AGE, FMH_CHO,
#                FMH_SMOKE, FMH_HDL, FMH_BLOOD_PRESSURE]
# df = pd.DataFrame(rows_list, columns=test_col)
# avg_score = framingham_risk_score(df)
# print(avg_score)
