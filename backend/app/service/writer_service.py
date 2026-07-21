from sqlalchemy.orm import Session
from app.model.writer_profile_response import WriterProfileResponse, PublicReviewModel
from app.model.update_writer_profile_request import UpdateWriterProfileRequest
from app.repository.writer_repository import WriterRepository
from app.repository.review_repository import ReviewRepository
from app.exceptions.exception import NotFoundException

class WriterService:

    @staticmethod
    def get_public_profile(db: Session, user_id: int) -> WriterProfileResponse:
        user = WriterRepository.get_user_with_writer_profile(db, user_id)
        if not user:
            raise NotFoundException(detail="User not found")

        writer_profile = user.writer_profile
        user_profile = user.user_profile
        
        quals = []
        expertise = []
        completed_count = 0
        avg_rating = 4.9
        reviews_list = []
        
        city = None
        country = None
        bio = None
        experience_years = None
        education_level = None
        institution_name = None
        academic_category = None
        specialization = None
        
        if writer_profile:
            # Count completed projects
            completed_count = WriterRepository.get_completed_project_count(db, user_id)

            # Build qualifications list
            quals = [q.qualification_name for q in writer_profile.qualifications]

            # Build expertise list (tags)
            if writer_profile.specialization:
                expertise.append(writer_profile.specialization.name)
            if writer_profile.academic_category:
                expertise.append(writer_profile.academic_category.name)

            # Fetch actual reviews
            review_entities = ReviewRepository.get_reviews_by_writer(db, user_id)

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

            city = writer_profile.city
            country = writer_profile.country
            bio = writer_profile.bio
            experience_years = writer_profile.experience_years
            education_level = writer_profile.education_level.name if writer_profile.education_level else None
            institution_name = writer_profile.institution_name
            academic_category = writer_profile.academic_category.name if writer_profile.academic_category else None
            specialization = writer_profile.specialization.name if writer_profile.specialization else None
        elif user_profile:
            # For non-writers (e.g. customers), pull basic info from user_profile
            bio = "Client Profile"
            if user_profile.address:
                parts = user_profile.address.split(",")
                if len(parts) >= 2:
                    city = parts[0].strip()
                    country = parts[1].strip()
                else:
                    city = user_profile.address

        if not expertise:
            expertise = ["Academic Writing", "Research"]

        profile_img = user_profile.profile_image_url if user_profile else None
        profile_id = writer_profile.id if writer_profile else (user_profile.id if user_profile else user.id)

        return WriterProfileResponse(
            id=profile_id,
            user_id=user.id,
            first_name=user.first_name or "",
            last_name=user.last_name or "",
            email=user.email,
            phone=user.mobile_number,
            city=city,
            country=country,
            bio=bio,
            experience_years=experience_years,
            education_level=education_level,
            institution_name=institution_name,
            academic_category=academic_category,
            specialization=specialization,
            qualifications=quals,
            expertise=expertise,
            completed_projects=completed_count,
            rating=avg_rating,
            profile_image_url=profile_img,
            reviews=reviews_list
        )

    @staticmethod
    def update_profile(db: Session, user_id: int, request: UpdateWriterProfileRequest):
        user = WriterRepository.get_user_with_writer_profile(db, user_id)
        if not user:
            raise NotFoundException(detail="User not found")

        # Update User fields
        if request.first_name is not None:
            user.first_name = request.first_name
        if request.last_name is not None:
            user.last_name = request.last_name
        if request.phone is not None:
            user.mobile_number = request.phone

        writer_profile = user.writer_profile
        if not writer_profile:
            # For non-writers (e.g. customers), update UserProfileEntity
            from app.entity.user_profile_entity import UserProfileEntity
            from app.repository.user_repository import UserRepository
            user_profile = user.user_profile
            if not user_profile:
                user_profile = UserProfileEntity(user_id=user_id)
                user_profile = UserRepository.save_user_profile(db, user_profile)

            if request.phone is not None:
                user_profile.phone_number = request.phone
                
            # Combine city and country into address
            if request.city is not None or request.country is not None:
                c = request.city if request.city is not None else (user_profile.address.split(",")[0].strip() if user_profile.address and "," in user_profile.address else "")
                co = request.country if request.country is not None else (user_profile.address.split(",")[1].strip() if user_profile.address and "," in user_profile.address else "")
                if c and co:
                    user_profile.address = f"{c}, {co}"
                elif c:
                    user_profile.address = c
                elif co:
                    user_profile.address = co

            WriterRepository.save_user_and_profile(db, user, user_profile)
            return WriterService.get_public_profile(db, user_id)

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
            WriterRepository.delete_qualifications(db, writer_profile.id)
            WriterRepository.add_qualifications(db, writer_profile.id, request.qualifications)

        WriterRepository.save_user_and_writer_profile(db, user, writer_profile)

        return WriterService.get_public_profile(db, user_id)
