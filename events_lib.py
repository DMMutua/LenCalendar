import os
import psycopg2
from psycopg2 import sql
from calendar import monthrange

# DB Re-configuration
DB_NAME = "db_name_here"
DB_USER = "db_user_here"
DB_PASSWORD = "db_password_here"
DB_HOST = "localhost" # localhost
DB_PORT = "5432" # 5432


def connect():
    """Connect to PostgreSQL DBMS"""
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
        return connection, cursor

    except psycopg2.Error as error:
        print(f"Error: {error}")
        return None, None
    

def save(start, end, txt, color, bg, id=None):
    """Save or Update Events"""
    connection, cursor = connect()
    if connection is None or cursor is None:
        return False
    
    try:
        data = (start, end, txt, color, bg,)
        if id is None: 
            sql_query = sql.SQL("INSERT INTO events (start, end, text, color, bg) VALUES (%s, %s, %s, %s, %s)")
        else:
            sql_query = sql.SQL("UPDATE events SET start=%s, end=%s, text=%s, color=%s, bg=%s WHERE id=%s")
            data = data + (id,)

        cursor.execute(sql_query, data)
        connection.commit()
        return True
    except psycopg2.Error as error:
        print(f"Error: {error}")
        return False
    finally:
        if connection:
            cursor.close()
            connection.close()


def delete(id):
    """Delete Events"""
    connection, cursor = connect()
    if connection is None or cursor is None:
        return False
    
    try:
        sql_query = sql.SQL("DELETE FROM events WHERE id=%s")
        cursor.execute(sql_query, (id,))
        connection.commit()
        return True
    except psycopg2.Error as error:
        print(f"Error: {error}")
        return False
    finally:
        if connection:
            cursor.close()
            connection.close()


def get(month, year):
    """Get Events"""
    connection, cursor = connect()
    if connection is None or cursor is None:
        return False
    
    try:
        days_in_month = str(monthrange(year, month)[1])
        month = month if month > 10 else "0" + str(month)
        date_ym = str(year) + "-" + str(month) + "-"
        start = date_ym + "01 00:00:00"
        end = date_ym + days_in_month + " 23:59:59"

        cursor.execute(
            "SELECT * FROM events WHERE ((start BETWEEN %s AND %s) OR (end BETWEEN %s AND %s) OR (start <= %s AND end >= %s))",
            (start, end, start, end, start, end)
        )
        rows = cursor.fetchall()
        if len(rows) == 0:
            return None
        
        # s & e : start & end date
        # c & b : text & background color
        # t : event text
        data = {}
        for r in rows:
            data[r[0]] = {
                "s": r[1], "e": r[2],
                "t": r[3], "c": r[4],
                "b": r[5]
            }
        return data
    except psycopg2.Error as error:
        print(f"Error: {error}")
        return None

    finally:
        if connection:
            cursor.close()
            connection.close()