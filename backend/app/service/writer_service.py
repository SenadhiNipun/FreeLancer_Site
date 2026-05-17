from sqlalchemy.orm import Session
from app.entity.user_entity import UserEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.task_entity import TaskEntity
from app.entity.task_assignment_entity import TaskAssignmentEntity
from app.entity.review_entity import ReviewEntity
from app.model.writer_profile_response import WriterProfileResponse, PublicReviewModel
from app.model.update_writer_profile_request import UpdateWriterProfileRequest
from app.entity.writer_qualification_entity import WriterQualificationEntity
from app.exceptions.exception import NotFoundException

class WriterService:

    @staticmethod
    def get_public_profile(db: Session, user_id: int) -> WriterProfileResponse:
        user = db.query(UserEntity).filter(UserEntity.id == user_id).first()
        if not user:
            raise NotFoundException(detail="Writer not found")

        writer_profile = user.writer_profile
        if not writer_profile:
            # Maybe the user is not a writer? 
            # We can still return a basic profile if needed, but for now expect writer_profile
            raise NotFoundException(detail="Writer profile not found for this user")

        # Count completed projects
        completed_count = db.query(TaskAssignmentEntity).join(TaskEntity).filter(
            TaskAssignmentEntity.writer_id == user_id,
            TaskEntity.task_status == "COMPLETED"
        ).count()

        # Build qualifications list
        quals = [q.qualification_name for q in writer_profile.qualifications]
        
        # Build expertise list (tags)
        expertise = []
        if writer_profile.specialization:
            expertise.append(writer_profile.specialization.name)
        if writer_profile.academic_category:
            expertise.append(writer_profile.academic_category.name)
        
        # Add some default tags if empty for UI consistency
        if not expertise:
            expertise = ["Academic Writing", "Research"]

        # Fetch actual reviews
        review_entities = db.query(ReviewEntity).filter(ReviewEntity.writer_id == user_id).all()
        
        reviews_list = []
        for r in review_entities:
            cust_name = "Anonymous Client"
            if r.customer:
                last_name_init = f" {r.customer.last_name[0]}." if r.customer.last_name else ""
                cust_name = f"{r.customer.first_name or 'Client'}{last_name_init}"
            reviews_list.append(PublicReviewModel(
                id=r.id,
                rating=r.rating,
                feedback=r.feedback,
                created_at=r.created_at,
                customer_name=cust_name
            ))

        # Calculate dynamic average rating
        if review_entities:
            avg_rating = sum(r.rating for r in review_entities) / len(review_entities)
        else:
            avg_rating = 4.9 # Default fallback rating

        return WriterProfileResponse(
            id=writer_profile.id,
            user_id=user.id,
            first_name=user.first_name or "",
            last_name=user.last_name or "",
            email=user.email,
            phone=user.mobile_number,
            city=writer_profile.city,
            country=writer_profile.country,
            bio=writer_profile.bio,
            experience_years=writer_profile.experience_years,
            education_level=writer_profile.education_level.name if writer_profile.education_level else None,
            institution_name=writer_profile.institution_name,
            academic_category=writer_profile.academic_category.name if writer_profile.academic_category else None,
            specialization=writer_profile.specialization.name if writer_profile.specialization else None,
            qualifications=quals,
            expertise=expertise,
            completed_projects=completed_count,
            rating=avg_rating,
            reviews=reviews_list
        )

    @staticmethod
    def update_profile(db: Session, user_id: int, request: UpdateWriterProfileRequest):
        user = db.query(UserEntity).filter(UserEntity.id == user_id).first()
        if not user:
            raise NotFoundException(detail="User not found")

        # Update User fields
        if request.first_name is not None:
            user.first_name = request.first_name
        if request.last_name is not None:
            user.last_name = request.last_name
        if request.phone is not None:
            user.mobile_number = request.phone
        # Email update might need verification, but for now we just allow it or keep it simple
        # if request.email is not None:
        #     user.email = request.email

        writer_profile = user.writer_profile
        if not writer_profile:
            # Create if doesn't exist? (Should exist for writers)
            writer_profile = WriterProfileEntity(user_id=user_id)
            db.add(writer_profile)
            db.flush()

        # Update Profile fields
        if request.city is not None:
            writer_profile.city = request.city
        if request.country is not None:
            writer_profile.country = request.country
        if request.bio is not None:
            writer_profile.bio = request.bio
        if request.experience_years is not None:
            writer_profile.experience_years = request.experience_years
        if request.institution_name is not None:
            writer_profile.institution_name = request.institution_name
        if request.academic_status is not None:
            writer_profile.academic_status = request.academic_status

        # Update Qualifications
        if request.qualifications is not None:
            # Clear old ones
            db.query(WriterQualificationEntity).filter(
                WriterQualificationEntity.writer_profile_id == writer_profile.id
            ).delete()
            # Add new ones
            for q_name in request.qualifications:
                db.add(WriterQualificationEntity(
                    writer_profile_id=writer_profile.id,
                    qualification_name=q_name
                ))

        db.commit()
        db.refresh(user)
        db.refresh(writer_profile)
        
        return WriterService.get_public_profile(db, user_id)
