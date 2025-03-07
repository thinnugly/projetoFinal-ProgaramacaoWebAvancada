import API_URL from "./config.js";

export const commentService = {
  async getComments(token, id) {
    const response = await fetch(`${API_URL}/tasks/comment/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      console.log("No comments found for this task.");
      return []; 
    }
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response.status));
    }
  },
  async addComment(token, payload) {
    const response = await fetch(`${API_URL}/tasks/comment`, {
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
};

function handleResponses(status) {
  switch (status) {
    case 204:
      return "No comments found for this task.";
    case 400:
      return "Bad request. Please check the input fields.";
    case 401:
      return "Unauthorized. Token is missing or malformed.";
    case 403:
      return "You can only comment on tasks assigned to you.";
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
