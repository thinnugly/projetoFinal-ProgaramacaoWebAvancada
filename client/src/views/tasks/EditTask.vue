<template>
  <NavbarPage />
  <div class="container mt-5">
    <b-row>
      <b-col>
        <base-button type="submit" @click="back()" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-2" />
          BACK TO TASKS LIST
        </base-button>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-start">
      <b-col>
        <div v-if="task" class="card card_info shadow p-4" style="max-width: 100%; margin-top: 30px">
          <h3 class="text-start" style="color: #023e8a">{{ task.title }}</h3>
          <p class="text-start">{{ task.description }}</p>

          <div class="row align-items-center">
            <div class="col-md-5 text-start">
              <p>
                Due Date: <strong>{{ formatDueDate(task.due) }}</strong>
              </p>
              <p>
                Employee:
                <strong>{{
                  getUserName()(isAdmin ? task.attachedTo : getProfile._id)
                }}</strong>
              </p>
              <p>
                Created By:
                <strong>{{ getUserName()(task.createdBy) }}</strong>
              </p>
              <p>
                Updated By:
                <strong>{{ getUserName()(task.updatedBy) }}</strong>
              </p>
            </div>

            <div class="col-md-1 d-flex justify-content-center">
              <div class="divider-vertical"></div>
            </div>

            <div class="col-md-5 text-end">
              <p>
                Priority: <strong>{{ task.priority }}</strong>
              </p>
              <p>
                Status: <strong>{{ task.status }} </strong>
              </p>
              <p>
                Created At: <strong>{{ formatDate(task.createdAt) }}</strong> -
                created
                <small>{{ timeAgo(task.createdAt) }}</small>
              </p>
              <p>
                Updated At: <strong>{{ formatDate(task.updatedAt) }}</strong> -
                Updated
                <small>{{ timeAgo(task.updatedAt) }}</small>
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <p style="color: gray; font-size: 0.875rem; margin-top: 10px">No tasks yet.</p>
        </div>
      </b-col>
    </b-row>

    <div class="card mb-3 text-start shadow" style="max-width: 80%; margin-top: 10px">
      <div class="card-body">
        <h5 class="card-title">Publish your comment</h5>
        <h6 class="card-subtitle mb-2 text-muted">
          <form @submit.prevent="onSubmit()">
            <div class="mb-3">
              <textarea class="form-control" id="description"
                placeholder="Enter the comment. eg: Create the authentication page" rows="5"
                v-model.trim="comment.message"></textarea>
              <div class="text-danger mt-2" v-if="errors.message">
                {{ errors.message }}
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <base-button type="submit">
                <font-awesome-icon :icon="['fas', 'save']" class="me-2" />
                PUBLISH COMMENT
              </base-button>
            </div>
          </form>
        </h6>
      </div>
    </div>

    <div v-if="sortedComments.length">
      <div v-for="comment in sortedComments" :key="comment._id" class="comment-box">
        <div class="card mb-3 text-start shadow" style="max-width: 80%; margin-top: 10px">
          <div class="card-body">
            <h5 class="card-title">
              <strong>{{ getUserName()(comment.user) }}</strong>
            </h5>
            <h6 class="card-subtitle mb-2 text-muted">
              {{ formatDueDate(comment.createdAt) }} - commented at
              <small>{{ timeAgo(comment.createdAt) }}</small>
            </h6>
            <p class="card-text">{{ comment.message }}</p>
          </div>
        </div>
      </div>
    </div>
    <p v-else style="color: gray; font-size: 0.875rem; margin-top: 10px">
      No comments yet.
    </p>
  </div>
</template>

<script>
import NavbarPage from "@/components/UI/NavbarPage.vue";
import { mapGetters } from "vuex";
import "@vuepic/vue-datepicker/dist/main.css";
import { format } from "date-fns";
import { FETCH_COMMENTS, ADD_COMMENT } from "@/store/modules/comment.module.js";
import { FETCH_USERS } from "@/store/modules/user.module.js";
// import { FETCH_TASK } from "@/store/modules/task.module";
import CommentValidations from "@/api/CommentValidations.js";

export default {
  name: "AddTask",
  components: {
    NavbarPage,
  },
  data() {
    return {
      comment: {
        taskId: "",
        message: "",
      },
      task: null,
      comments: [],
      errors: {},
    };
  },
  computed: {
    ...mapGetters("user", ["getUsers"]),
    ...mapGetters("comment", ["getComments", "getMessage"]),
    ...mapGetters("task", ["getTaskById"]),
    users() {
      return this.getUsers;
    },
    getProfile() {
      return this.$store.getters["auth/getProfile"];
    },
    isAdmin() {
      return (
        this.getProfile &&
        this.getProfile.auth &&
        this.getProfile.auth.profile === "admin"
      );
    },
    sortedComments() {
      return (this.comments || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
  },
  methods: {
    onSubmit() {
      const validations = new CommentValidations(this.comment.message);

      this.errors = validations.checkValidations();
      if (Object.keys(this.errors).length > 0) {
        return false;
      }

      const commentData = {
        taskId: this.$route.params.taskId,
        message: this.comment.message,
      };
      this.$store
        .dispatch(`comment/${ADD_COMMENT}`, commentData)
        .then(() => {
          this.comment.message = "";
          this.fetchComments();
          this.$swal({
            title: "Success",
            text: "Comment added successfully!",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          this.$swal({
            title: "Error",
            text: error.message,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
        });
    },
    fetchTask() {
      const taskId = this.$route.params.taskId;
      this.task = this.getTaskById(taskId);

      // Se a tarefa não estiver no Vuex, busque-a da API
      // if (!this.task) {
      //   this.$store
      //     .dispatch(`task/${FETCH_TASK}`, taskId)
      //     .then(() => {
      //       this.task = this.getTaskById(taskId); // Atualiza a tarefa após buscar da API
      //     })
      //     .catch((error) => {
      //       console.error("Error fetching task:", error);
      //     });
      // }
    },
    fetchComments() {
      this.$store
        .dispatch(`comment/${FETCH_COMMENTS}`, this.$route.params.taskId)
        .then(
          () => {
            this.comments = this.getComments || [];
          },
          (err) => {
            this.$swal({
              title: "Erro",
              text: `${err.message}`,
              icon: "error",
              timer: 3000,
              showConfirmButton: false,
            });
          }
        );
    },
    formatDueDate(dueDate) {
      return format(new Date(dueDate), "MMM, d. yyyy");
    },
    getUserName() {
      return (userId) => {
        const user = this.users.find((u) => u._id === userId);
        return user ? user.name : "";
      };
    },
    back() {
      this.$router.push("/tasks");
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
  },
  created() {
    this.fetchTask();
    this.$store.dispatch(`user/${FETCH_USERS}`);
    this.fetchComments();
  },
};
</script>

<style scoped>
h4 {
  text-align: center;
}

.is-invalid {
  border-color: #dc3545;
}

.text-danger {
  font-size: 0.875rem;
  color: #dc3545;
}

.card_info {
  margin: 0 auto;
  max-width: 1500px;
}

.divider {
  border: none;
  height: 1px;
  background: #ccc;
  margin: 10px 0;
}

.divider-vertical {
  width: 2px;
  height: 100%;
  background-color: #ccc;
}
</style>
