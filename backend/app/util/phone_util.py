import re

PHONE_REGEX = re.compile(r'^\+?[0-9]{9,15}$')


def validate_phone_number(value: str) -> str:
    value = value.strip()
    if not PHONE_REGEX.match(value):
        raise ValueError(
            "Invalid phone number. Use digits only, optionally starting with '+', 9-15 digits long."
        )
    return value
