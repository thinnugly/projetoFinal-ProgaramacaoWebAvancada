import { userService } from "@/api/user.service.js";

// Action types
export const FETCH_USER = "fetchUser";
export const FETCH_USERS = "fetchUsers";
export const ADD_USER = "addUser";
export const EDIT_USER = "editUser";
export const REMOVE_USER = "removeUser";

// Mutation types
export const SET_MESSAGE = "setMessage";
export const SET_USERS = "set_users";
export const SET_USER = "set_user";

// states
const state = {
  users: [],
  user: null,
  message: "",
};

const getters = {
  getUsers: (state) => state.users,
  getUsersById: (state) => (id) => state.users.find((user) => user._id === id),
  getUserNameById: (state) => (id) => {
    const user = state.users.find((user) => user._id === id);
    return user ? user.name : "User not found";
  },
  getMessage: (state) => state.message,
  getUser: (state) => state.user,
};

// actions
export const actions = {
  [FETCH_USERS]: async ({ commit, rootState }) => {
    return new Promise((resolve, reject) => {
      userService.getUsers(rootState.auth.token).then(
        (res) => {
          commit(SET_USERS, res.body);
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
  [FETCH_USER]: async ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      userService
        .getOne(rootState.auth.token, id)
        .then((user) => {
          commit(SET_USER, user);
          resolve(user);
        })
        .catch((err) => {
          commit(SET_MESSAGE, "Error retrieving user.");
          reject(err);
        });
    });
  },
  [ADD_USER]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      userService.addUser(rootState.auth.token, payload).then(
        (res) => {
          commit(
            SET_MESSAGE,
            `The user ${res.body.name} has been successfully added!`
          );
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
  [EDIT_USER]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      userService.editUser(rootState.auth.token, payload).then(
        (res) => {
          commit(
            SET_MESSAGE,
            `The user ${res.body.name} has beensuccessfully updated!`
          );
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
  [REMOVE_USER]: ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      userService.removeUser(rootState.auth.token, id).then(
        (res) => {
          commit(SET_MESSAGE, `The user has been successfully removed!`);
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
};

// mutations
export const mutations = {
  [SET_USERS]: (state, users) => {
    state.users = users;
  },
  [SET_USER]: (state, user) => {
    state.user = user;
  },
  [SET_MESSAGE]: (state, message) => {
    state.message = message;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
