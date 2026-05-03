from app.config.database import SessionLocal
from app.entity.task_bid_entity import TaskBidEntity

db = SessionLocal()
task_id = 19
bids = db.query(TaskBidEntity).filter(TaskBidEntity.task_id == task_id, TaskBidEntity.bid_status == "ACCEPTED").all()

print(f"Accepted bids count: {len(bids)}")
for b in bids:
    print(f"Bid ID: {b.id}, Writer ID: {b.writer_id}")
    if b.writer:
        print(f"Writer: {b.writer.first_name} {b.writer.last_name}")

db.close()
