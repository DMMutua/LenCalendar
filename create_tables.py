import os
import configparser
import psycopg2
from psycopg2 import sql

# Read Config File for Credentials
config = configparser.ConfigParser()
config.read('./config.ini')

# DB Configuration
DB_NAME = config.get('credentials', 'DB_NAME')
DB_USER = config.get('credentials', 'DB_USER')
DB_PASSWORD = config.get('credentials', 'DB_PASSWORD')
DB_HOST = config.get('credentials', 'DB_HOST')
DB_PORT = config.get('credentials', 'DB_PORT')

# SQL File Path
SQL_FILE = "events_table.sql"

# Connect to PostgreSQL DBMS
try:
    connection = psycopg2.connect(
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = connection.cursor()
    print("SUCCESS: Connection to PostgreSQL DBMS")

    # Deletion of Old Tables if they exist
    drop_table_query = sql.SQL("DROP TABLE IF EXISTS {}").format(sql.Identifier('events'))
    cursor.execute(drop_table_query)
    connection.commit()
    print("SUCCESS: Old Table Deleted if existed")

    # Creation of New Table from SQL File
    with open(SQL_FILE, 'r') as f:
        cursor.execute(f.read())
        connection.commit()
    print("SUCCESS: New Table Created")

except psycopg2.Error as error:
    print(f"Error: {error}")

finally:
    if connection:
        cursor.close()
        connection.close()
        print("SUCCESS: PostgreSQL connection is closed")

print("SUCCESS: Table and Database Created")


# Path: lencalendar/create_tables.py