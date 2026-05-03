
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

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const isClient = typeof window !== 'undefined';
  let token = isClient ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 204 No Content or empty responses
    const contentType = response.headers.get("content-type");
    let data = {};
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      // If unauthorized and not already trying to refresh
      if (response.status === 401 && isClient && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            
            try {
              const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
              });

              if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                const newToken = refreshData.results.access_token;
                const newRefreshToken = refreshData.results.refresh_token;

                localStorage.setItem('token', newToken);
                localStorage.setItem('refresh_token', newRefreshToken);
                
                isRefreshing = false;
                onTokenRefreshed(newToken);
              } else {
                // Refresh failed
                isRefreshing = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/sign-in';
                throw new Error('Session expired');
              }
            } catch (refreshError) {
              isRefreshing = false;
              window.location.href = '/sign-in';
              throw refreshError;
            }
          }

          // Return a promise that waits for the token to be refreshed
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              // Retry the original request with the new token
              const newHeaders = { ...headers, 'Authorization': `Bearer ${newToken}` };
              resolve(apiClient(endpoint, { ...options, headers: newHeaders }));
            });
          });
        }
      }

      // If it's still 401 or 403 after refresh attempt (or no refresh token)
      if (response.status === 401 || response.status === 403) {
        if (isClient && !endpoint.includes('/auth/refresh')) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/sign-in';
        }
      }

      let errorMessage = 'Something went wrong';
      const errorData = data as any;
      
      if (errorData.results && Array.isArray(errorData.results)) {
        errorMessage = formatValidationError(errorData.results);
      } else if (errorData.message && errorData.message !== 'Validation failed') {
        errorMessage = errorData.message;
      } else if (errorData.detail) {
        errorMessage = formatValidationError(errorData.detail);
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    if (error.message !== 'Session expired') {
      console.error(`API Request Failed: ${options.method || 'GET'} ${url}`, error);
    }
    throw error;
  }
}

export function getFileUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
