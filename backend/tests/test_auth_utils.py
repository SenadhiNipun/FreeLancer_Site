from app.util.password_util import hash_password, verify_password
from app.util.jwt_util import create_access_token, decode_access_token

print("Testing password utility...")
password = "mysecret123"
hashed_password = hash_password(password)
print("Hashed password created:", hashed_password)

is_valid = verify_password("mysecret123", hashed_password)
print("Password verification result:", is_valid)

print("\nTesting JWT utility...")
token = create_access_token({
    "sub": "test@example.com",
    "user_id": 1,
    "role": "USER"
})
print("Generated token:", token)

decoded_payload = decode_access_token(token)
print("Decoded payload:", decoded_payload)
