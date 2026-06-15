import os
import pg8000


def create_db(user, password, host, port, dbname):
    try:
        conn = pg8000.connect(user=user, password=password, host=host, port=port, database="postgres")
        # Ensure autocommit so CREATE DATABASE is allowed outside a transaction
        try:
            conn.autocommit = True
        except Exception:
            pass
        cur = conn.cursor()
        cur.execute(f"SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
        if cur.fetchone():
            print(f"Database '{dbname}' already exists")
        else:
            cur.execute(f"CREATE DATABASE {dbname}")
            print(f"Database '{dbname}' created successfully")
        cur.close()
        conn.close()
    except Exception as e:
        print("Error creating database:", e)


if __name__ == '__main__':
    user = os.getenv('PGUSER', 'postgres')
    password = os.getenv('PGPASSWORD', 'postgres')
    host = os.getenv('PGHOST', 'localhost')
    port = int(os.getenv('PGPORT', '5432'))
    dbname = os.getenv('PGNAME', 'usuarios')

    print(f"Trying to create DB '{dbname}' on {host}:{port} as {user}")
    create_db(user, password, host, port, dbname)
