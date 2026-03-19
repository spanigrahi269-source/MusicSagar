"""Automatically fix the search issue by simplifying the API key logic"""
import os

print("\n" + "="*60)
print("FIXING SEARCH ISSUE")
print("="*60 + "\n")

# Read the current youtube.py file
youtube_file = "backend/app/routers/youtube.py"

print(f"Reading {youtube_file}...")

with open(youtube_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the problematic line
old_line = "    YOUTUBE_API_KEY, key_name = get_youtube_api_key()"
new_lines = """    # Temporarily use KEY_1 directly (bypass rotation for debugging)
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY_1")
    key_name = "YOUTUBE_API_KEY_1"
    print(f"DEBUG: Using {key_name}, value: {YOUTUBE_API_KEY[:20] if YOUTUBE_API_KEY else 'NOT FOUND'}...")"""

if old_line in content:
    print("✅ Found the line to replace")
    content = content.replace(old_line, new_lines)
    
    # Write back
    with open(youtube_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ File updated successfully!")
    print("\nNow restart the backend:")
    print("  1. Press Ctrl+C in the backend terminal")
    print("  2. Run: uvicorn app.main:app --reload --port 8000")
    print("\nSearch should work after restart!")
else:
    print("❌ Could not find the line to replace")
    print("You may need to edit manually")

print("\n" + "="*60 + "\n")
