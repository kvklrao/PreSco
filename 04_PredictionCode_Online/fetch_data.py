import sqlalchemy
import pandas as pd

from connection_str import STR
from query import query_str, full_query_str


def fetch_data(study_id):

    chunk_size = 20
    sql_str = query_str.format(study_id)
    dfs = []

    engine = sqlalchemy.create_engine(STR)

    for chunk in pd.read_sql_query(sql_str, engine, chunksize=chunk_size):
        dfs.append(chunk)

    asha_data_df = pd.concat(dfs)

    return asha_data_df

def fetch_data_full(study_id):

    chunk_size = 20

    #
    # DB Params
    #

    engine = sqlalchemy.create_engine(STR)

    #
    # Read the result set
    #

    offset = 0
    dfs = []
    sql_str = full_query_str.format(study_id)

    for chunk in pd.read_sql_query(sql_str, engine, chunksize=chunk_size):
        dfs.append(chunk)

    inital_df = pd.concat(dfs)

    return inital_df
