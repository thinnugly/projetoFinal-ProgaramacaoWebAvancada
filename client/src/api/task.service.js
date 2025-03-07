import API_URL from "./config.js";

export const taskService = {
  async getTasks(token) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized. Token is missing or malformed");
    }
    if (response.status === 204) {
      console.log("No tasks registed.");
      return []; 
    }

    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async getOne(token, id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      console.log("No task registed.");
      return []; 
    }

    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async addTask(token, payload) {
    const response = await fetch(`${API_URL}/tasks`, {
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
  async editTask(token, payload) {
    const response = await fetch(`${API_URL}/tasks/${payload._id}`, {
      method: 'PUT',
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
  async removeTask(token, id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
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
      return "No tasks registed.";
    case 400:
      return "Bad request. Please check the input fields.";
    case 401:
      return "Unauthorized. Token is missing or malformed.";
    case 403:
      return "Username or password incorrect.";
    case 406:
      return "Not aceptable. Invalid field.";
    case 409:
      return "A task with the same title already exists.";
    case 500:
      return "Internal Server Error. Please try again later.";
    default:
      return "An unexpected error occurred.";
  }
}
