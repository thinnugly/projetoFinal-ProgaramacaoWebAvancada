import { createRouter, createWebHistory } from "vue-router";
import store from "../store/store";
import Swal from "sweetalert2";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomePage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "Error404",
    component: () => import("@/views/Error404Page.vue"),
  },
  {
    path: "/dashboard",
    name: "DashboardPage",
    component: () => import("@/views/DashboardPage.vue"),
  },
  {
    path: "/admin/users",
    name: "ListUsers",
    component: () => import("@/views/users/ListUsers.vue"),
  },
  {
    path: "/admin/users/add",
    name: "AddUser",
    component: () => import("@/views/users/AddUser.vue"),
  },
  {
    path: "/admin/users/:userId",
    name: "EditUser",
    component: () => import("@/views/users/EditUser.vue"),
  },
  {
    path: "/tasks",
    name: "ListTasks",
    component: () => import("@/views/tasks/ListTasks.vue"),
  },
  {
    path: "/tasks/add",
    name: "AddTask",
    component: () => import("@/views/tasks/AddTask.vue"),
  },
  {
    path: "/tasks/:taskId",
    name: "EditTask",
    component: () => import("@/views/tasks/EditTask.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["auth/isUserLoggedIn"];
  const user = store.getters["auth/getProfile"];
  const isAdmin = user && user.auth && user.auth.profile === "admin";

  if (to.name === "ListUsers" || to.name === "AddUser" || to.name  === "EditUser") {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Access Denied",
        text: "You must be logged in to access this page.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        next("/");
      });
      return;
    }

    if (!isAdmin) {
      Swal.fire({
        title: "Access Denied",
        text: "You do not have permission to access this page.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        next("/dashboard");
      });
      return;
    }
  } else if (to.name === "DashboardPage" && !isAuthenticated) {
    Swal.fire({
      title: "Access Denied",
      text: "Please log in to access the dashboard.",
      icon: "warning",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      next("/");
    });
    return;
  } else if (to.name === "Home" && isAuthenticated) {
    return next({ name: "DashboardPage" });
  } else if (to.name === "ListTasks" || to.name === "EditTask") {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Access Denied",
        text: "You must be logged in to access this page.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        next("/");
      });
      return;
    }
    
  } else if (to.name === "AddTask") {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Access Denied",
        text: "You must be logged in to access this page.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        next("/");
      });
      return;
    }

    if (!isAdmin) {
      Swal.fire({
        title: "Access Denied",
        text: "You do not have permission to access this page.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        next("/dashboard");
      });
      return;
    }
  }

  next();
});


export default router;
