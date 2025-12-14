#!/usr/bin/env python3
"""
Create a super admin user in the database.
Usage: python create_super_admin.py
"""

import os
import psycopg2
import bcrypt

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

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
        
        # 1. Ensure Default Tenant Exists (Idempotent)
        cursor.execute("SELECT id FROM tenants WHERE name = 'Default Organization'")
        tenant_row = cursor.fetchone()

        if not tenant_row:
            print("Creating Default Organization tenant...")
            cursor.execute(
                "INSERT INTO tenants (name, plan_type) VALUES (%s, %s) RETURNING id",
                ('Default Organization', 'ENTERPRISE')
            )
            tenant_id = cursor.fetchone()[0]
        else:
            tenant_id = tenant_row[0]
            print(f"Using existing Default Organization tenant: {tenant_id}")

        # 2. Upsert User
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        existing = cursor.fetchone()
        
        if existing:
            print(f"User '{username}' already exists. Updating...")
            cursor.execute(
                """
                UPDATE users
                SET password_hash = %s, role = %s, tenant_id = %s
                WHERE username = %s
                """,
                (password_hash, role, tenant_id, username)
            )
        else:
            print(f"Creating new super admin user '{username}'...")
            cursor.execute(
                """
                INSERT INTO users (username, password_hash, role, tenant_id)
                VALUES (%s, %s, %s, %s)
                """,
                (username, password_hash, role, tenant_id)
            )
        
        conn.commit()
        print(f"✓ Super admin '{username}' synced successfully!")
        print(f"  Role: {role}")
        print(f"  Tenant ID: {tenant_id}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    create_super_admin()
