<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link class="navbar-brand" to="/" style="margin-left: 5px">TASK MANAGEMENT</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
              <li v-if="isAdmin" class="nav-item">
                  <router-link class="nav-link" to="/admin/users">Users</router-link>
              </li>
              <li class="nav-item active">
                  <router-link class="nav-link" to="/tasks">Tasks</router-link>
              </li>
          </ul>

          <div class="ms-auto d-flex align-items-center">
              <div class="nav-item dropdown me-3">
                  <a class="nav-link position-relative" href="#" id="notificationDropdown" data-bs-toggle="dropdown"
                      aria-haspopup="true" aria-expanded="false" @click="markNotificationsAsRead">
                      <font-awesome-icon :icon="['fas', 'bell']" />
                      <span v-if="unreadNotifications > 0"
                          class="badge bg-danger position-absolute top-0 start-100 translate-middle">
                          {{ unreadNotifications }}
                      </span>
                  </a>
                  <div class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                      <template v-if="recentNotifications.length > 0">
                          <a v-for="(notification, index) in recentNotifications" :key="index" class="dropdown-item" href="#">
                              <div class="d-flex flex-column">
                                  <span>{{ notification.message }}</span>
                                  <small class="text-muted">{{ notification.timestamp }}</small>
                              </div>
                          </a>
                      </template>
                      <span v-else class="dropdown-item text-muted">Without notifications</span>
                  </div>
              </div>

              <ul class="navbar-nav">
                  <li class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown"
                          aria-haspopup="true" aria-expanded="false">
                          Welcome, {{ getProfileName }} ({{
                              getProfile?.auth?.profile || "Usuário"
                          }})
                      </a>
                      <div class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                          <a class="dropdown-item" href="">Profile</a>
                          <a class="dropdown-item" href="" @click="onLogout()">Logout</a>
                      </div>
                  </li>
              </ul>
          </div>
      </div>
  </nav>
</template>

<script>
import { AUTH_LOGOUT } from "@/store/modules/auth.module.js";
import { mapGetters } from "vuex";
import router from "@/router";
// import { io } from "socket.io-client";

export default {
  name: "NavbarPage",
  data() {
      return {
          notifications: [],
          socket: null,
      };
  },
  computed: {
      getProfileName() {
          return this.$store.getters["auth/getProfileName"];
      },
      isAuthenticated() {
          return this.$store.getters["auth/isUserLoggedIn"];
      },
      getProfile() {
          return this.$store.getters["auth/getProfile"];
      },
      unreadNotifications() {
          return this.notifications.filter(notification => !notification.read).length;
      },
      recentNotifications() {
          return this.notifications.slice(0, 5); // Exibe apenas as 5 notificações mais recentes
      },
      isAdmin() {
          return (
              this.getProfile &&
              this.getProfile.auth &&
              this.getProfile.auth.profile === "admin"
          );
      },
      ...mapGetters("auth", ["getMessage"]),
  },
  methods: {
      onLogout() {
          this.$store
              .dispatch(`auth/${AUTH_LOGOUT}`)
              .then(() => {
                  router.push({ name: "Home" });
              })
              .catch((err) => {
                  this.$swal({
                      title: "Erro",
                      text: `${err.message}`,
                      icon: "error",
                      timer: 3000,
                      showConfirmButton: false,
                  });
              });
      },
      // async fetchNotifications() {
      //     try {
      //         const response = await this.$http.get("/notifications");
      //         this.notifications = response.data;
      //     } catch (error) {
      //         console.error("Error fetching notifications:", error);
      //     }
      // },
      // markNotificationsAsRead() {
      //     this.notifications = this.notifications.map(notification => ({
      //         ...notification,
      //         read: true,
      //     }));
      // },
      // connectSocket() {
      //     const userId = this.getProfile?._id;
      //     if (!userId) return;

      //     this.socket = io("https://projetofinal-progaramacaowebavancada.onrender.com", {
      //         auth: { userId },
      //     });

      //     this.socket.on("newNotification", (data) => {
      //         this.notifications.unshift(data);
      //     });
      // },
  },
  created() {
      // this.fetchNotifications();
      // this.connectSocket();
  },
  beforeUnmount() {
      if (this.socket) {
          this.socket.disconnect();
      }
  },
};
</script>

<style scoped>
.badge {
  font-size: 0.75rem;
  padding: 0.25em 0.5em;
}
</style>