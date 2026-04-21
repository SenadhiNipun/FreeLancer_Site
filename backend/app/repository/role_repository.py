from sqlalchemy.orm import Session

from backend.app.entity.role_entity import RoleEntity


class RoleRepository:

    @staticmethod
    def get_role_by_name(db: Session, role_name: str) -> RoleEntity | None:
        return (
            db.query(RoleEntity)
            .filter(RoleEntity.name == role_name)
            .first()
        )