import os
import sys
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv

# Load environment variables
load_dotenv('./backend/.env')

user = os.getenv('MYSQL_USER')
password = os.getenv('MYSQL_PASSWORD')
host = os.getenv('MYSQL_HOST')
port = os.getenv('MYSQL_PORT')
db_name = os.getenv('MYSQL_DB')

# Create engine
engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}')

def reset_database():
    inspector = inspect(engine)
    all_tables = inspector.get_table_names()
    
    print(f"WARNING: This will drop ALL {len(all_tables)} tables and delete all data!")
    print(f"Tables to be dropped: {all_tables}")
    confirm = input("Are you sure you want to proceed with a clean reset? (yes/no): ")
    
    if confirm.lower() == 'yes':
        with engine.connect() as connection:
            print("Dropping all tables...")
            connection.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
            for table in all_tables:
                try:
                    connection.execute(text(f"DROP TABLE IF EXISTS `{table}`;"))
                    print(f"Dropped table: {table}")
                except Exception as e:
                    print(f"Error dropping table {table}: {e}")
            connection.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
            connection.commit()
            
        print("\nAll tables dropped. Re-initializing schema from models...")
        
        # Add project root to path for imports
        current_dir = os.getcwd()
        if current_dir not in sys.path:
            sys.path.append(current_dir)
        
        # Re-initialize via SQLAlchemy
        from app.config.database import init_db
        init_db()
        
        # Seed default data
        from app.config.seed import seed_data
        seed_data()
        
        print("\nDatabase reset and seeded successfully!")
    else:
        print("Operation cancelled.")

if __name__ == "__main__":
    reset_database()
