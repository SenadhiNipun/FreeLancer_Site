# FocalId Backend Service

This project follows the official FocalId FastAPI folder structure.

## Folder Structure

- **app/config:** Configuration files.
- **app/controller:** API handlers/controllers.
- **app/entity:** ORM model classes (MySQL).
- **app/enums:** Constant enumerations.
- **app/exceptions:** Custom exception classes.
- **app/model:** Pydantic data models.
- **app/repository:** Database operations.
- **app/service:** Business logic.
- **app/util:** Utility classes.

## Getting Started

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/macOS: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the application:
   ```bash
   python main.py
   ```

## Tech Stack

- Python 3
- FastAPI
- MySQL
- Docker
