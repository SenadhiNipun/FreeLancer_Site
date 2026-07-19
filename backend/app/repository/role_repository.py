from sqlalchemy.orm import Session

from app.entity.role_entity import RoleEntity


class RoleRepository:

    @staticmethod
    def get_role_by_name(db: Session, role_name: str) -> RoleEntity | None:
        return (
            db.query(RoleEntity)
            .filter(RoleEntity.role_name == role_name)
            .filter(RoleEntity.is_delete == False)
            .first()
        )
