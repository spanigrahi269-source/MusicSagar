from app.database import SessionLocal
from app.models import User

db = SessionLocal()
users = db.query(User).all()

print(f"Total users in database: {len(users)}")
print()

for user in users:
    print(f"ID: {user.id}")
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"Created: {user.created_at}")
    print(f"Theme: {user.theme}")
    print("-" * 40)

db.close()
