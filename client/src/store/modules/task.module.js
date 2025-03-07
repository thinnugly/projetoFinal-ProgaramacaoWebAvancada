import { taskService } from "@/api/task.service.js";

// Action types
export const FETCH_TASK = "fetchTask";
export const FETCH_TASKS = "fetchTasks";
export const ADD_TASK = "addTask";
export const EDIT_TASK = "editTask";
export const REMOVE_TASK = "removeTask";

// Mutation types
export const SET_MESSAGE = "setMessage";
export const SET_TASKS = "set_tasks";

// states
const state = {
  tasks: [],
  message: "",
};

const getters = {
  getTasks: (state) => state.tasks,
  getTaskById: (state) => (id) => state.tasks.find((task) => task._id === id),
  getMessage: (state) => state.message,
};

// actions
export const actions = {
  [FETCH_TASKS]: async ({ commit, rootState }) => {
    return new Promise((resolve, reject) => {
      taskService
        .getTasks(rootState.auth.token)
        .then((res) => {
          commit(SET_TASKS, res.body);
          resolve(res);
        })
        .catch((err) => {
          commit(SET_MESSAGE, "Error retrieving tasks.");
          reject(err);
        });
    });
  },

  [FETCH_TASK]: async ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      taskService
        .getOne(rootState.auth.token, id)
        .then((task) => {
          commit(SET_TASKS, [task]);
          resolve(task);
        })
        .catch((err) => {
          commit(SET_MESSAGE, "Error retrieving task.");
          reject(err);
        });
    });
  },

  [ADD_TASK]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      taskService.addTask(rootState.auth.token, payload).then(
        (res) => {
          commit(
            SET_MESSAGE,
            `The task ${res.body.title} has been successfully added!`
          );
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
  [EDIT_TASK]: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      taskService.editTask(rootState.auth.token, payload).then(
        (res) => {
          commit(
            SET_MESSAGE,
            `The task ${res.body.title} has been successfully updated!`
          );
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
  [REMOVE_TASK]: ({ commit, rootState }, id) => {
    return new Promise((resolve, reject) => {
      taskService.removeTask(rootState.auth.token, id).then(
        (res) => {
          commit(SET_MESSAGE, `The task has been successfully removed!`);
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  },
};

// mutations
export const mutations = {
  [SET_TASKS]: (state, tasks) => {
    state.tasks = tasks;
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
