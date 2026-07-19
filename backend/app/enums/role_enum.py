from enum import Enum

class RoleEnum(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"
    WRITER = "WRITER"
