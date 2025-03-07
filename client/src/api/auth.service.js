import API_URL from './config.js'; 

export const authService = {
  async login(payload) {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      const token = response.headers.get('Authorization');
      const profile = data.body; 
      return { token, profile };
    } else {
      throw new Error(handleResponses(response.status));
    }
  },
  async register(payload) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
};

function handleResponses(status) {
  switch (status) {
    case 400:
      return 'Bad request. Please check the input fields.';
    case 401:
      return 'Unauthorized. Please check your credentials.';
    case 403:
      return 'Username or password incorrect.';
    case 406:
      return 'Not aceptable. Invalid field.';
    case 409:
      return 'Username already exists. Please choose a different username.';
    case 500:
      return 'Internal Server Error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
}
