
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

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Fail loud instead of silently sending auth cookies/tokens over plain HTTP
// if NEXT_PUBLIC_API_URL is missing or misconfigured in a production build.
if (process.env.NODE_ENV === 'production' && !BASE_URL.startsWith('https://')) {
  throw new Error(
    `NEXT_PUBLIC_API_URL must be an https:// URL in production (got: "${BASE_URL}"). ` +
    'Refusing to start with an insecure API URL.'
  );
}

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

function subscribeTokenRefresh(cb: () => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

export async function apiClient(endpoint: string, options: RequestInit = {}): Promise<any> {
  const isClient = typeof window !== 'undefined';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
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
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
            });

            if (refreshRes.ok) {
              isRefreshing = false;
              onTokenRefreshed();
            } else {
              // Refresh failed
              isRefreshing = false;
              localStorage.removeItem('user');
              localStorage.removeItem('user_roles');
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
          subscribeTokenRefresh(() => {
            // Retry the original request; the refreshed cookie is sent automatically
            resolve(apiClient(endpoint, options));
          });
        });
      }

      // If it's still 401 or 403 after refresh attempt (or no refresh token)
      // Skip auto-redirect for auth endpoints so their callers can handle the error themselves
      if (response.status === 401 || response.status === 403) {
        if (
          isClient &&
          !endpoint.includes('/auth/refresh') &&
          !endpoint.includes('/auth/login')
        ) {
          localStorage.removeItem('user');
          localStorage.removeItem('user_roles');
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
