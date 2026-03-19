"""
Database initialization script
Creates default user on first run
"""
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import User
from .auth import get_password_hash

def init_database():
    """Initialize database with default data"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if default user already exists
        existing_user = db.query(User).filter(User.email == "sagar@example.com").first()
        
        if not existing_user:
            try:
                # Create default user with password hashing
                hashed_pwd = get_password_hash("Sagar@269")
                default_user = User(
                    username="sagar",
                    email="sagar@example.com",
                    hashed_password=hashed_pwd
                )
                db.add(default_user)
                db.commit()
                print("✅ Default user 'sagar' created successfully!")
                print("   Email: sagar@example.com")
                print("   Password: Sagar@269")
            except Exception as hash_error:
                print(f"⚠️  Could not create default user: {hash_error}")
                print("   You can create a user via the signup page")
                db.rollback()
        else:
            print("ℹ️  Default user 'sagar' already exists")
    
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        db.rollback()
    
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
