from app.config.database import SessionLocal
from app.entity.task_file_entity import TaskFileEntity

db = SessionLocal()
task_id = 19
files = db.query(TaskFileEntity).filter(TaskFileEntity.task_id == task_id).all()

print(f"Task {task_id} files count: {len(files)}")
for f in files:
    print(f"File ID: {f.id}, Name: {f.file_name}, URL: {f.file_url}")

db.close()
