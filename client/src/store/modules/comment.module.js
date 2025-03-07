import { commentService } from "@/api/comment.service.js";

// Action types
export const FETCH_COMMENTS = "fetchComments";
export const ADD_COMMENT = "addComment";

// Mutation types
export const SET_MESSAGE = "setMessage";
export const SET_COMMENTS = "set_comments";

// states
const state = {
  comments: [],
  message: "",
};

const getters = {
  getComments: (state) => state.comments,
  getCommentById: (state) => (id) => state.comments.find((comment) => comment._id === id),
  getMessage: (state) => state.message,
};

// actions
export const actions = {
  [FETCH_COMMENTS]: async ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      commentService.getComments(rootState.auth.token, id).then(
        (res) => {
          commit(SET_COMMENTS, res.body);
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
  [ADD_COMMENT]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      commentService.addComment(rootState.auth.token, payload).then(
        (res) => {
          commit(
            SET_MESSAGE,
            `The comment has been successfully added!`
          );
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
};

// mutations
export const mutations = {
  [SET_COMMENTS]: (state, comments) => {
    state.comments = comments;
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
