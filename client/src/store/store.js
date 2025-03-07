import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'; 
import moduleAuth from './modules/auth.module';
import moduleUser from './modules/user.module';
import moduleTask from './modules/task.module';
import moduleComment from './modules/comment.module';

const store = createStore({
  modules: {
    auth: moduleAuth,
    user: moduleUser,
    task: moduleTask,
    comment: moduleComment,
  },
  plugins: [createPersistedState()],
});

export default store;