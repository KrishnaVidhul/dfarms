#!/usr/bin/env python3
"""
Create a super admin user in the database.
Usage: python create_super_admin.py
"""

import os
import psycopg2
import hashlib

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_super_admin():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("ERROR: DATABASE_URL environment variable not set")
        return
    
    username = "admin"
    password = "password"
    role = "super_admin"
    
    password_hash = hash_password(password)
    
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        existing = cursor.fetchone()
        
        if existing:
            print(f"User '{username}' already exists. Updating password and role...")
            cursor.execute(
                "UPDATE users SET password_hash = %s, role = %s WHERE username = %s",
                (password_hash, role, username)
            )
        else:
            print(f"Creating new super admin user '{username}'...")
            cursor.execute(
                "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)",
                (username, password_hash, role)
            )
        
        conn.commit()
        print(f"✓ Super admin '{username}' created/updated successfully!")
        print(f"  Username: {username}")
        print(f"  Password: {password}")
        print(f"  Role: {role}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    create_super_admin()
