"""Initialize fresh database with sagar user"""
from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import get_password_hash

print("Creating fresh database...")

# Drop all tables and recreate
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

print("Tables created successfully!")

# Create sagar user
db = SessionLocal()

try:
    hashed_pwd = get_password_hash("Sagar@269")
    user = User(
        username="sagar",
        email="sagar@example.com",
        hashed_password=hashed_pwd,
        theme="dark"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    print("\nUser created successfully!")
    print(f"ID: {user.id}")
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print("\nLogin credentials:")
    print("Email: sagar@example.com")
    print("Password: Sagar@269")
    
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
