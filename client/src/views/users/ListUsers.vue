<template>
  <NavbarPage />
  <div class="container mt-5">
    <b-row>
      <b-col>
        <base-button type="submit" @click="addUser()" style="margin-left: 20px">
          <font-awesome-icon :icon="['fas', 'user-plus']" class="me-2" />
          ADD A NEW USER
        </base-button>
      </b-col>
    </b-row>
    <div>
      <div class="cards-container" v-if="users && users.length > 0">
        <div v-for="user in currentPageUsers" :key="user.id" class="card" @click="getUser(user._id)">
          <h3 class="text-start" style="color: #023e8a;">{{ user.name }}</h3>
          <div class="row">
            <div class="col-md-6 text-start">
              <p>Email: <strong>{{ user.auth.username }}</strong></p>
              <p>
                Profile: <strong>{{
                  user.auth.profile === "admin" ? "Administrator" : "Employee"
                  }}</strong>
              </p>
            </div>
            <div class="col-md-6 text-end">
              <p>
                Status: <strong>{{ user.active === true ? "Active" : "Desactive" }}</strong>
              </p>
              <p>
                Created At: <strong>{{ formatDate(user.createdAt) }}</strong> -
                created
                <small>{{ timeAgo(user.createdAt) }}</small>
              </p>
            </div>
          </div>

          <hr class="divider" />
          <div class="btn-group">
            <button @click.stop="viewUser(user._id)" type="button" class="btn btn-outline-success btn-sm mr-2">
              <font-awesome-icon :icon="['fas', 'eye']" class="me-2" />VIEW
            </button>

            <button @click.stop="removeUser(user._id)" type="button" class="btn btn-outline-danger btn-sm">
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="me-2" />DELETE
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="color: gray; font-size: 0.875rem; margin-top: 10px">No users yet.</p>
      </div>
    </div>

    <b-row>
      <b-col class="d-flex justify-content-center">
        <base-button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-2" />
          Previous
        </base-button>
        <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
        <base-button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
          <font-awesome-icon :icon="['fas', 'arrow-right']" class="me-2" />

          Next
        </base-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NavbarPage from "@/components/UI/NavbarPage.vue";
import { FETCH_USERS, REMOVE_USER } from "@/store/modules/user.module.js";
import { mapGetters } from "vuex";
export default {
  name: "ListUsers",
  components: {
    NavbarPage,
  },
  data() {
    return {
      users: [],
      currentPage: 1,
      itemsPerPage: 6,
      auth: {
        name: "",
        username: "",
        password: "",
        profile: "",
      },
      errors: {},
    };
  },
  computed: {
    ...mapGetters("user", ["getUsers", "getMessage"]),
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
    },
    currentPageUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.users.slice(start, end);
    },
  },
  methods: {
    fetchUsers() {
      this.$store
        .dispatch(`user/${FETCH_USERS}`)
        .then(() => {
          this.users = this.getUsers.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
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
    changePage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      }
    },
    viewUser(id) {
      const user = this.users.find((user) => user._id === id);

      this.$swal({
        title:
          typeof user.name === "string" ? user.name.toUpperCase() : user.name,
        html: this.generateTemplateView(user),
      });
    },
    generateTemplateView(user) {
      let response = `
            <h4>Email: ${user.auth.username}</h4>
            <h5>Profile: ${user.auth.profile === "admin" ? "Administrator" : "Employee"
        }</h5>
            <p>Status: ${user.active === true ? "Active" : "Desactive"}</p>
            <p>Created At: ${this.formatDate(user.createdAt)} - created
                    <small>${this.timeAgo(user.createdAt)}</p>
            <p>Updated At: ${this.formatDate(user.updatedAt)} - updated
                    <small>${this.timeAgo(user.updatedAt)}</p>
        `;
      return response;
    },
    addUser() {
      this.$router.push("/admin/users/add");
    },
    getUser(userId) {
      this.$router.push(`/admin/users/${userId}`);
    },
    formatDate(d) {
      const newDate = new Date(Date.parse(d));
      return (
        newDate.getFullYear() +
        "-" +
        (newDate.getMonth() + 1) +
        "-" +
        newDate.getDate() +
        " " +
        newDate.getHours() +
        ":" +
        newDate.getMinutes() +
        ":" +
        newDate.getSeconds()
      );
    },
    timeAgo(d) {
      const now = new Date();
      const diffInSeconds = Math.floor((now - new Date(d)) / 1000);

      const minutes = Math.floor(diffInSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);

      if (years > 0) return `${years} year(s) ago`;
      if (months > 0) return `${months} month(s) ago`;
      if (days > 0) return `${days} day(s) ago`;
      if (hours > 0) return `${hours} hour(s) ago`;
      if (minutes > 0) return `${minutes} minute(s) ago`;
      return `${diffInSeconds} second(s) ago`;
    },
    removeUser(id) {
      this.$swal({
        title: "Are you sure you want to remove the user?",
        text: "If yes, click OK",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch(`user/${REMOVE_USER}`, id).then(() => {
            this.$swal("User removed!", this.getMessage, "success");
            this.fetchUsers();
          });
        } else {
          this.$swal("Removal cancelled!", "Information", "info");
        }
      });
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Agora terá 3 cards por linha */
  gap: 16px;
  justify-content: center;
  padding: 20px;
}

.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.divider {
  border: none;
  height: 1px;
  background: #ccc;
  margin: 10px 0;
}

.actions {
  display: flex;
  justify-content: space-between;
}

button:hover {
  background: #0056b3;
}

.delete {
  background: #dc3545;
}

.delete:hover {
  background: #b02a37;
}

/* Estilização da paginação */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}

.pagination button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(2,
        1fr);
    /* Para telas menores, 2 cards por linha */
  }
}

@media (max-width: 600px) {
  .cards-container {
    grid-template-columns: repeat(1,
        1fr);
    /* Para telas muito pequenas, 1 card por linha */
  }
}

.comment-box {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
