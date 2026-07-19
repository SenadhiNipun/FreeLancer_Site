from app.config.database import engine, Base

from app.entity import (
    RoleEntity,
    UserEntity,
    UserProfileEntity,
    WriterProfileEntity
)

print("Checking database connection and entity mapping...")

Base.metadata.create_all(bind=engine)

print("SUCCESS: No errors in entity definitions.")
