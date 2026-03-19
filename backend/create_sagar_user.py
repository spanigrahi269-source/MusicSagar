"""
Simple script to create the sagar user
Run this from the backend directory: python create_sagar_user.py
"""
import sys
from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import get_password_hash

def main():
    print("=" * 60)
    print("Creating User: sagar")
    print("=" * 60)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = SessionLocal()
    
    try:
        # Check if user exists
        existing = db.query(User).filter(
            (User.email == "sagar@example.com") | (User.username == "sagar")
        ).first()
        
        if existing:
            print("\n❌ User already exists!")
            print(f"   Username: {existing.username}")
            print(f"   Email: {existing.email}")
            print(f"   ID: {existing.id}")
            print("\n✅ You can login with:")
            print("   Email: sagar@example.com")
            print("   Password: Sagar@269")
        else:
            # Create user
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
            
            print("\n✅ User created successfully!")
            print(f"   ID: {user.id}")
            print(f"   Username: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Created: {user.created_at}")
            print("\n🎵 You can now login with:")
            print("   Email: sagar@example.com")
            print("   Password: Sagar@269")
    
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    
    finally:
        db.close()
    
    print("=" * 60)

if __name__ == "__main__":
    main()
