import sys
import pandas as pd
from numpy import log as ln
import os.path
import json
import csv
from pathlib import Path
import time
from datetime import datetime


# Reads state file
def read_states():
    print("Reading the file for the states' data")
    file_to_check = Path("source/states_all_data.csv")
    if file_to_check.exists():
        df = pd.read_csv(file_to_check, header=4, sep=",")
        # print(df.iloc[2][1])
        df = df.replace(r'""', 'null', regex=True)
        df = df.replace(r'"', '', regex=True)
        # df.to_csv("results\states.csv", index=False)

        return df
    else:
        sys.exit("The file cannot be found at read_states()")


# Reads covid file
def read_covid_file():
    print("Reading the file for covid data")
    file_to_check = Path("source/daily_covid.csv")
    if file_to_check.exists():
        df = pd.read_csv(file_to_check, header=0, sep=",")
        # print(df.iloc[2][1])

        return df
    else:
        sys.exit("The file cannot be found at read_covid_file()")


def read_covid_all_states_file():
    print("Reading the file for covid data")
    file_to_check = Path("source/covid_all_states.csv")
    if file_to_check.exists():
        df = pd.read_csv(file_to_check, header=0, sep=",")
        # print(df.iloc[2][1])

        return df
    else:
        sys.exit("The file cannot be found at read_covid_all_states_file()")


# Covid data is daily and state data is quarterly.
# Therefore, converts Covid-19 daily data into quarterly by using 90 day exponential moving average.
def convert_covid_to_monthly():
    print("")


# Normalizes covid data
def norm_covid_data(df):
    new_df = df.copy(deep=True)

    print("Normalizing Covid data.")
    for i in range(len(df)):
        try:
            value = float(df.iloc[i][22])
        except ValueError:
            # print("Not a number")
            value = 1.00
        if float(value) <= 1.0001:
            value = 0.0
        else:
            value = ln(float(value))

        new_df.at[i, df.columns[22]] = value
        if i % (int(len(df) / 100 * 10)) == 0:
            progress = int(i / len(df) * 100)
            print(f"Normalizing Covid data. {progress}%")
            time.sleep(0.25)
    print("Covid data normalization is complete.")
    return new_df


def norm_covid_data_all_states(df):
    new_df = df.copy(deep=True)
    print("Normalizing Covid data.")
    for i in range(len(df)):
        try:
            value = float(df.iloc[i][22])
        except ValueError:
            # print("Not a number")
            value = 1.00
        if float(value) <= 1.0001:
            value = 0.0
        else:
            value = ln(float(value))

        new_df.at[i, df.columns[22]] = value
        if i % (int(len(df) / 100 * 10)) == 0:
            progress = int(i / len(df) * 100)
            print(f"Normalizing Covid data for all states. {progress}%")
            time.sleep(0.25)
    print("Covid data for all states normalization is complete.")
    return new_df


# Converts a pandas dataframe into a json file.
def convert_to_json(df, filename):
    df.to_json(f'results\{filename}.json', orient='records')
    print(f"Json file is created at path: results\{filename}.json")
    time.sleep(0.5)


# Normalization of the states data.
def norm_states_data(df):
    new_df = df.copy(deep=True)
    min = 9999999999999999;
    max = 0.0;
    states_name_list = new_df.GeoName.unique()
    industry_name_list = new_df.Description.unique()

    # Create a column for normalized values with default value 0.

    for i in range(len(df)):
        # k starts at 4 because the first 4 columns are informative string values.

        for k in range(4, len(df.columns)):
            # value = df.iloc[i][k]
            t_d = new_df.loc[(new_df["GeoName"] == df.iloc[i][1]) & (new_df["Description"] == df.iloc[i][3])]
            # print(t_d)
            t_max = 0
            for z in range(4, 67):
                try:
                    tv = float(t_d.iloc[0][z])
                except ValueError:
                    tv = 0
                if t_max < tv:
                    t_max = tv
                    # print(f"t_max = {t_max}")

            try:
                value = float(df.iloc[i][k])
                if value > max:
                    max = value
                if value < min and min > 1.0:
                    min = value
            except ValueError:
                # print("Not a number")
                value = 0.00

            # if float(value) <= 1.0001:
            if t_max != 0:
                value2 = (float(value) / t_max) * 100
                if value2 > 100:
                    print("ERROR at Normalizing state data. This should not happen.")
                    print(f"normed value: {value2} at i:{i} and k:{k}")
            else:
                value2 = 0

            if t_max != 0:
                value = (float(value) / t_max) * 3
                if value > 3:
                    print("ERROR at Normalizing state data. This should not happen.")
                    print(f"normed value: {value} at i:{i} and k:{k}")
            else:
                value = 0
            '''
            if float(value) <= 2.7201:
                value = 0.0
            else:
                value = ln(ln(float(value)))
            '''
            n_name = "n" + str(df.columns[k])
            new_df.at[i, n_name] = value

            n_name2 = "nh" + str(df.columns[k])
            new_df.at[i, n_name2] = value2

        if i % (int(len(df) / 100 * 5)) == 0:
            progress = int(i / len(df) * 100)
            print(f"Normalizing states data. {progress}%")
    print(f"Min: {min} % Max: {max}")

    print("States data normalization is complete.")
    return new_df


def agg_data(df):
    # TODO: Aggregate covid and states' data for the line chart.
    print("At agg_data")
    new_df = df.copy(deep=True)
    df_agg = pd.DataFrame(columns=["date", "state", "positive", "positiveIncrease", "positive_n", "positiveIncrease_n"])
    print("Aggregating Covid data.")
    temp_sum1 = 0
    # Counter for 90 days(quarters).
    counter = 0

    calc_q = False

    q1 = "2020-03-31"
    q2 = "2020-06-30"
    q3 = "2020-09-30"
    q4 = "2020-12-31"
    begin_i = 0
    end_i = 0
    quarter_c = 0
    states_name_list = new_df.state.unique()

    new_df = new_df.iloc[::-1].reset_index()

    for k in range(len(new_df)):

        if (new_df.at[k, "date"] == q1 or new_df.at[k, "date"] == q2 or new_df.at[k, "date"] == q3 or new_df.at[
            k, "date"] == q4) and new_df.at[k, "state"] == "WA":
            calc_q = True
            end_i = k
            # print(new_df.at[k, "date"])
        if calc_q:
            # print(begin_i)
            # print(end_i)
            temp_df = new_df[begin_i:end_i]
            quarter_c += 1
            for i in range(len(states_name_list)):
                t_s = temp_df.loc[new_df["state"] == states_name_list[i]].sum()
                t_d = temp_df.loc[new_df["state"] == states_name_list[i]]
                t_d = t_d.reset_index()
                df_agg.at[counter, "state"] = states_name_list[i]
                dates = new_df.at[k, "date"].split("-")
                to_w = dates[0] + ":Q" + str(quarter_c)
                df_agg.at[counter, "date"] = to_w
                # print(t_d)
                df_agg.at[counter, "positive"] = t_d.at[len(t_d) - 1, "positive"]
                df_agg.at[counter, "positiveIncrease"] = t_s.at["positiveIncrease"]
                # t_max = new_df.loc[new_df['positive'].idxmax()]
                # t_max2 = new_df.loc[new_df['positiveIncrease'].idxmax()]
                t_max_1 = df.loc[df["state"] == states_name_list[i]]
                t_max = t_max_1["positive"].max()
                # max: 23.459.909
                # print(t_max)
                # max: 71.734
                # print(t_max2)

                # Normalize between 0-3. Min=0 Max= 23.459.909
                df_agg.at[counter, "positive_n"] = 3 * (t_d.at[len(t_d) - 1, "positive"] / t_max)
                # Normalize between 0-100. Min=0 Max= 23.459.909
                df_agg.at[counter, "positive_nh"] = 100 * (t_d.at[len(t_d) - 1, "positive"] / t_max)

                '''
                if t_d.at[len(t_d) - 1, "positive"] > 2.7201:
                    df_agg.at[counter, "positive_n"] = ln(ln(t_d.at[len(t_d) - 1, "positive"]))
                else:
                    df_agg.at[counter, "positive_n"] = 0
                if t_s.at["positiveIncrease"] > 2.7201:
                    df_agg.at[counter, "positiveIncrease_n"] = ln(ln(t_s.at["positiveIncrease"]))
                else:
                    df_agg.at[counter, "positiveIncrease_n"] = 0
                '''
                # print(t_s)
                # print(df_agg)
                counter += 1

            begin_i = k
            calc_q = False


    print("Covid data for all states aggregation is complete.")
    return df_agg


if __name__ == '__main__':
    # Read files
    # pandas df1 = read files for covid
    # pandas df2 = read files for states
    df_states = read_states()
    convert_to_json(df_states, "states")
    cdf = read_covid_file()
    c_all_df = read_covid_all_states_file()

    # Normalize covid with log
    # Normalize states with log
    normed_states_data = norm_states_data(df_states)
    normed_covid_data = norm_covid_data(cdf)
    normed_covid_all_states_data = norm_covid_data_all_states(c_all_df)
    aggregated_c_data = agg_data(c_all_df)
    # print(normed_states_data)
    # print(normed_covid_data.iloc[:, 22])

    print("Exporting dataframes to json files.")
    time.sleep(0.5)
    convert_to_json(normed_states_data, "n_states")
    convert_to_json(normed_covid_data, "n_covid")
    convert_to_json(normed_covid_all_states_data, "n_covid_all")
    convert_to_json(aggregated_c_data, "agg_covid")

    print("Run complete.")
    time.sleep(1)
    # Turn csv files to json
