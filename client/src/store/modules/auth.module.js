import { authService } from "@/api/auth.service.js";

// Action types
export const AUTH_LOGIN = 'authLogin';
export const AUTH_LOGOUT = 'authLogout';
export const AUTH_REGISTER = 'authRegister';

// Mutation types
export const AUTH_LOGIN_SUCCESS = 'authLoginSuccess';
export const AUTH_LOGOUT_SUCCESS = 'authLogoutSuccess';
export const AUTH_REGISTER_SUCCESS = 'authRegisterSuccess';
export const SET_MESSAGE = 'setMessage';

import { STORAGE_ACCESS_TOKEN, STORAGE_USER_PROFILE } from "../constants";

// states
const state = {
  message: "",
  token: localStorage.getItem(STORAGE_ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_ACCESS_TOKEN) || "",
  profile: JSON.parse(localStorage.getItem(STORAGE_USER_PROFILE) || sessionStorage.getItem(STORAGE_USER_PROFILE) || "{}"),
};

// gettersAuthorization
const getters = {
  isUserLoggedIn: (state) => {
    return state.token !== "";
  },
  getProfileName: (state) => state.profile.name,
  getUserType: (state) => state.profile.type,
  getProfile: (state) => state.profile,
  getMessage: (state) => state.message,
};

// actions
const actions = {
  [AUTH_LOGIN]: async ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      authService
        .login(payload)
        .then((res) => {
          commit(AUTH_LOGIN_SUCCESS, {
            token: res.token,
            profile: res.profile,
          });
          commit(SET_MESSAGE, `Welcome, ${res.profile.name}!`);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  [AUTH_LOGOUT]: async ({ commit }) => {
    return new Promise((resolve) => {
      commit(AUTH_LOGOUT_SUCCESS);
      commit(SET_MESSAGE, "Logout realizado com sucesso!");
  
      localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_USER_PROFILE);
      sessionStorage.removeItem(STORAGE_ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_USER_PROFILE);
  
      resolve();
    });
  },
  [AUTH_REGISTER]: async ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      authService
        .register(payload)
        .then((res) => {
          commit(
            SET_MESSAGE,
            `The user ${res.body.name} has been successfully added!`
          );
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }  
};

// mutations
export const mutations = {
  [AUTH_LOGIN_SUCCESS]: (state, data) => {
    state.token = data.token;
    localStorage.setItem(STORAGE_ACCESS_TOKEN, data.token);
    sessionStorage.setItem(STORAGE_ACCESS_TOKEN, data.token);
    state.profile = data.profile;
    localStorage.setItem(STORAGE_USER_PROFILE, JSON.stringify(data.profile));
    sessionStorage.setItem(STORAGE_USER_PROFILE, JSON.stringify(data.profile));
  },

  [AUTH_LOGOUT_SUCCESS]: (state) => {
    state.token = "";
    state.profile = {};
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_USER_PROFILE); 
  },

  [AUTH_REGISTER_SUCCESS]: (state, data) => {
    state.register = data;
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
