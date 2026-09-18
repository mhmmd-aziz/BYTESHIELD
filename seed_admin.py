from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import User, hash_password, Base

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/byteshield"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_admin():
    db = SessionLocal()
    
    admin_user = db.query(User).filter(User.username == "admin").first()
    if admin_user:
        print("[INFO] Admin user already exists.")
    else:
        new_admin = User(username="admin", password_hash=hash_password("admin123"))
        db.add(new_admin)
        db.commit()
        print("[SUCCESS] Admin user created with username 'admin' and password 'admin123'.")
    db.close()

if __name__ == "__main__":
    seed_admin()
