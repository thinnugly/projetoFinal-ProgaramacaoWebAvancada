import API_URL from "./config.js";

export const userService = {
  async getUsers(token) {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      console.log("No users registed.");
      return []; 
    }

    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async getOne(token, id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      console.log("No user registed.");
      return []; 
    }

    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async addUser(token, payload) {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async editUser(token, payload) {
    const response = await fetch(`${API_URL}/users/${payload._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async removeUser(token, id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    case 204:
      return "No users registed.";
    case 400:
        return 'Bad request. Please check the input fields.';
    case 401:
      return "Unauthorized. Token is missing or malformed.";
    case 403:
      return "Username or password incorrect.";
    case 406:
      return 'Not aceptable. Invalid field.';
    case 409:
        return 'Username already exists. Please choose a different username.';
    case 500:
      return "Internal Server Error. Please try again later.";
    default:
      return "An unexpected error occurred.";
  }
}
