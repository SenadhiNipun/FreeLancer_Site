import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import mysql.connector
from app.config.config import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DB

def reset_db():
    try:
        conn = mysql.connector.connect(
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            host=MYSQL_HOST,
            port=MYSQL_PORT
        )
        cursor = conn.cursor()
        print(f"Dropping database {MYSQL_DB}...")
        cursor.execute(f"DROP DATABASE IF EXISTS {MYSQL_DB}")
        print(f"Creating database {MYSQL_DB}...")
        cursor.execute(f"CREATE DATABASE {MYSQL_DB}")
        conn.commit()
        cursor.close()
        conn.close()
        print("Database reset successfully!")
    except Exception as e:
        print(f"Error resetting database: {e}")

if __name__ == "__main__":
    reset_db()
