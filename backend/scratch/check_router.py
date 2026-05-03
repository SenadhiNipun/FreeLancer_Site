import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from app.controller.task_controller import router
    print("Task router loaded successfully")
    for route in router.routes:
        print(f"Path: {route.path}, Methods: {route.methods}")
except Exception as e:
    print(f"Error loading task router: {e}")
    import traceback
    traceback.print_exc()
