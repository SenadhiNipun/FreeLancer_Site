from backend.app.config.database import engine, Base

from backend.app.entity import (
    RoleEntity,
    UserEntity,
    UserProfileEntity,
    WriterProfileEntity
)

print("Checking database connection and entity mapping...")

Base.metadata.create_all(bind=engine)

print("SUCCESS: No errors in entity definitions.")