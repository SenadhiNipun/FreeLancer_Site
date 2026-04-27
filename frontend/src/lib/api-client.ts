
function formatValidationError(detail: any): string {
  if (!Array.isArray(detail)) return String(detail);

  const fieldMap: Record<string, string> = {
    'password': 'Password',
    'verify_password': 'Confirm Password',
    'confirm_password': 'Confirm Password',
    'email': 'Email Address',
    'mobile_number': 'Mobile Number',
    'whatsapp_number': 'WhatsApp Number',
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'city': 'City',
    'country': 'Country',
  };

  return detail.map((err: any) => {
    // Get the field name, usually the last part of loc array
    // Pydantic errors usually look like loc: ['body', 'password']
    const field = err.loc[err.loc.length - 1];
    const friendlyField = fieldMap[field] || field;
    
    // Clean up message - sometimes it says "String should have..." 
    // We want "Password should have..."
    let msg = err.msg;
    if (msg.startsWith('String ') || msg.startsWith('Value ')) {
      msg = msg.replace(/^(String|Value)\s/, `${friendlyField} `);
    } else {
      msg = `${friendlyField}: ${msg}`;
    }

    return msg;
  }).join(', ');
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const isClient = typeof window !== 'undefined';
  const token = isClient ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (isClient) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      let errorMessage = 'Something went wrong';
      
      if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = formatValidationError(data.detail);
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error(`API Request Failed: ${options.method || 'GET'} ${url}`, error);
    throw error;
  }
}
