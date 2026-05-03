import requests

url = "http://127.0.0.1:8000/api/v1/customer/tasks/29/files"
try:
    response = requests.post(url)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
