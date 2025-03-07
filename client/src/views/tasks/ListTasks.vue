<template>
  <NavbarPage />
  <div class="container mt-5">
    <b-row>
      <b-col>
        <base-button
          type="submit"
          @click="addTask()"
          style="margin-left: 20px"
          v-if="isAdmin"
        >
          <font-awesome-icon :icon="['fas', 'plus']" class="me-2" />
          ADD A NEW TASK
        </base-button>
      </b-col>
    </b-row>
    <div v-if="tasksList.length > 0">
      <div
        class="cards-container"
        v-if="currentPageUsers && currentPageUsers.length > 0"
      >
        <div
          v-for="task in currentPageUsers"
          :key="task.id"
          class="card"
          :class="{ 'disabled-card': isDisabled(task.status) }"
          @click="!isDisabled(task.status) && getTask(task._id)"
        >
          <h3 class="text-start" style="color: #023e8a">{{ task.title }}</h3>
          <p class="text-start">{{ task.description }}</p>
          <div class="row">
            <div class="col-md-6 text-start">
              <p>
                Due Date: <strong>{{ formatDueDate(task.due) }}</strong>
              </p>
              <p>
                Employee:
                <strong>{{
                  getUserName()(isAdmin ? task.attachedTo : getProfile._id)
                }}</strong>
              </p>
            </div>
            <div class="col-md-6 text-end">
              <p>
                Priority: <strong>{{ task.priority }}</strong>
              </p>
              <p>
                Status: <strong>{{ task.status }} </strong>
              </p>
            </div>
          </div>

          <hr class="divider" />
          <div class="btn-group">
            <button type="button" class="btn btn-outline-success btn-sm mr-2">
              <font-awesome-icon :icon="['fas', 'eye']" class="me-2" />VIEW
            </button>

            <div class="dropdown dropup btn-group" @click.stop>
              <button
                class="btn btn-outline-primary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <font-awesome-icon :icon="['fas', 'edit']" class="me-2" />EDIT
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li v-if="isAdmin || !isAdmin">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.stop="changeStatus(task._id, 'IN_PROGRESS')"
                    >IN PROGRESS</a
                  >
                </li>
                <li v-if="isAdmin || !isAdmin">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.stop="changeStatus(task._id, 'REVIEW')"
                    >REVIEW</a
                  >
                </li>
                <li v-if="isAdmin || !isAdmin">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.stop="changeStatus(task._id, 'DONE')"
                    >DONE</a
                  >
                </li>
                <li v-if="isAdmin">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.stop="changeStatus(task._id, 'BLOCKED')"
                    >BLOCKED</a
                  >
                </li>
                <li v-if="isAdmin">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.stop="changeStatus(task._id, 'CANCELLED')"
                    >CANCELLED</a
                  >
                </li>
              </ul>
            </div>

            <button
              @click.stop="removeTask(task._id)"
              type="button"
              class="btn btn-outline-danger btn-sm"
              v-if="isAdmin"
            >
              <font-awesome-icon
                :icon="['fas', 'trash-alt']"
                class="me-2"
              />DELETE
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p style="color: gray; font-size: 0.875rem; margin-top: 10px">No tasks yet.</p>
    </div>

    <b-row>
      <b-col class="d-flex justify-content-center">
        <base-button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-2" />
          Previous
        </base-button>
        <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
        <base-button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          <font-awesome-icon :icon="['fas', 'arrow-right']" class="me-2" />

          Next
        </base-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NavbarPage from "@/components/UI/NavbarPage.vue";
import {
  FETCH_TASKS,
  REMOVE_TASK,
  EDIT_TASK,
} from "@/store/modules/task.module.js";
import { FETCH_USERS } from "@/store/modules/user.module.js";
import { mapGetters } from "vuex";
import { format } from "date-fns";
export default {
  name: "ListTasks",
  components: {
    NavbarPage,
  },
  data() {
    return {
      tasks: [],
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
    ...mapGetters("task", ["getTasks", "getMessage"]),
    ...mapGetters("user", ["getUsers", "getMessage"]),
    totalPages() {
      return Math.ceil(this.tasks.length / this.itemsPerPage);
    },
    currentPageUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tasks.slice(start, end);
    },
    getProfile() {
      return this.$store.getters["auth/getProfile"];
    },
    users() {
      return this.getUsers;
    },
    isAdmin() {
        return (
          this.getProfile &&
          this.getProfile.auth &&
          this.getProfile.auth.profile === "admin"
        );
      },
    tasksList() {
      return this.getTasks || [];
    },
  },
  methods: {
    fetchTasks() {
      this.$store
        .dispatch(`task/${FETCH_TASKS}`)
        .then(() => {
          if (this.getTasks) {
            this.tasks = this.getTasks.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
          } else {
            console.warn("No task retreived.");
          }
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
    fetchUsers() {
      this.$store
        .dispatch(`user/${FETCH_USERS}`)
        .then(() => {
          this.users = this.getUsers;
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
    formatDueDate(dueDate) {
      return format(new Date(dueDate), "MMM, d. yyyy");
    },
    getUserName() {
      return (userId) => {
        const user = this.users.find((u) => u._id === userId);
        return user ? user.name : "Unknown User";
      };
    },
    addTask() {
      this.$router.push("/tasks/add");
    },
    getTask(taskId) {
      this.$router.push(`/tasks/${taskId}`);
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
    removeTask(id) {
      this.$swal({
        title: "Are you sure you want to remove the user?",
        text: "If yes, click OK",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch(`task/${REMOVE_TASK}`, id).then(() => {
            this.$swal("Task removed!", this.getMessage, "success");
            this.fetchTasks();
          });
        } else {
          this.$swal("Removal cancelled!", "Information", "info");
        }
      });
    },
    isDisabled(status) {
      if (!this.isAdmin) {
        return (
          status === "BLOCKED" || status === "CANCELLED" || status === "DONE"
        );
      }
    },
    changeStatus(taskId, status) {
      const taskData = {
        _id: taskId,
        status: status,
        updatedBy: this.getProfile._id,
      };
      this.$store
        .dispatch(`task/${EDIT_TASK}`, taskData)
        .then(() => {
          this.fetchTasks();
          this.$swal({
            title: "Success",
            text: "Task status updated successfully!",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          this.$swal("Error", err.message, "error");
        });
    },
  },
  created() {
    this.fetchTasks();
    this.fetchUsers();
  },
};
</script>

<style scoped>
.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  overflow: visible;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.disabled-card {
  opacity: 0.6;
  pointer-events: none;
}

.disabled-card .btn {
  cursor: not-allowed;
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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards-container {
    grid-template-columns: repeat(1, 1fr);
  }
}

.btn-group .dropdown-menu {
  position: absolute;
  z-index: 1000;
  top: 100%;
  left: 0;
  margin-top: 0.125rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-group .dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
}

.btn-group .dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropup .dropdown-toggle::after {
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0;
  border-right: 0.3em solid transparent;
  border-bottom: 0.3em solid;
  border-left: 0.3em solid transparent;
}

.dropup .dropdown-menu {
  top: auto;
  bottom: 100%;
  margin-bottom: 0.125rem;
}
</style>
