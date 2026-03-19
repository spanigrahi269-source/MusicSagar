"""
Script to create a user in the Music Sagar database
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.database import SessionLocal, engine, Base
from backend.app.models import User
from backend.app.auth import get_password_hash

def create_user(username: str, email: str, password: str):
    """Create a new user in the database"""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.email == email) | (User.username == username)
        ).first()
        
        if existing_user:
            print(f"❌ User already exists!")
            print(f"   Username: {existing_user.username}")
            print(f"   Email: {existing_user.email}")
            return False
        
        # Hash the password
        hashed_password = get_password_hash(password)
        
        # Create new user
        new_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            theme="dark"
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"✅ User created successfully!")
        print(f"   ID: {new_user.id}")
        print(f"   Username: {new_user.username}")
        print(f"   Email: {new_user.email}")
        print(f"   Created at: {new_user.created_at}")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating user: {str(e)}")
        return False
        
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Creating User for Music Sagar")
    print("=" * 50)
    
    # User details
    username = "sagar"
    email = "sagar@example.com"
    password = "Sagar@269"
    
    print(f"\nUsername: {username}")
    print(f"Email: {email}")
    print(f"Password: {'*' * len(password)}")
    print()
    
    # Create the user
    success = create_user(username, email, password)
    
    if success:
        print("\n🎵 You can now login with these credentials!")
    
    print("=" * 50)
