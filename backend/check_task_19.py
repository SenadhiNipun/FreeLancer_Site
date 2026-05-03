from app.config.database import SessionLocal
from app.entity.task_entity import TaskEntity
from app.entity.task_assignment_entity import TaskAssignmentEntity

db = SessionLocal()
task_id = 19
task = db.query(TaskEntity).filter(TaskEntity.id == task_id).first()

if task:
    print(f"Task: {task.title}, Status: {task.task_status}")
    print(f"Assignments count: {len(task.assignments)}")
    for a in task.assignments:
        print(f"Assignment ID: {a.id}, Status: {a.assignment_status}, Writer ID: {a.writer_id}")
        if a.writer:
            print(f"Writer: {a.writer.first_name} {a.writer.last_name}")
    
    # Check the property
    print(f"Task.writer property: {task.writer}")
else:
    print("Task not found")

db.close()
