<template>
  <NavbarPage />
  <div class="container mt-5">
    <b-row>
      <b-col>
        <base-button type="submit" @click="back()">
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-2" />
          BACK TO TASKS LIST
        </base-button>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col>
        <div
          class="card shadow p-4"
          style="max-width: 1500px; margin-top: 30px"
        >
          <p style="color: red; font-size: 0.875rem">
            Fields with * are mandatory.
          </p>
          <form @submit.prevent="onSubmit()">
            <div class="mb-3">
              <label for="title" class="form-label"
                >Title: <strong style="color: red"> *</strong></label
              >
              <input
                type="text"
                class="form-control"
                id="title"
                placeholder="Enter the title. eg: Develop the frontend"
                v-model.trim="task.title"
              />
              <div class="text-danger mt-2" v-if="errors.title">
                {{ errors.title }}
              </div>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label"
                >Description: <strong style="color: red"> *</strong></label
              >
              <textarea
                type="text"
                class="form-control"
                id="description"
                placeholder="Enter the description. eg: Create the authentication page"
                v-model.trim="task.description"
              ></textarea>
              <div class="text-danger mt-2" v-if="errors.description">
                {{ errors.description }}
              </div>
            </div>

            <div class="mb-3">
              <label for="date" class="form-label">
                Due Date: <strong style="color: red"> *</strong>
              </label>
              <Datepicker
                v-model="task.due"
                id="date"
                :class="{ 'is-invalid': errors.due }"
                :format="'MMM, d. yyyy'"
                placeholder="Select a due date"
              />
              <div class="text-danger mt-2" v-if="errors.due">
                {{ errors.due }}
              </div>
            </div>

            <div class="mb-3">
              <label for="priority" class="form-label"
                >Priority: <strong style="color: red"> *</strong></label
              >
              <select
                v-model="task.priority"
                class="form-control"
                id="priority"
              >
                <option value="">-- SELECT AN PRIORITY --</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
              <div class="text-danger mt-2" v-if="errors.priority">
                {{ errors.priority }}
              </div>
            </div>

            <div class="mb-3">
              <label for="attachedTo" class="form-label"
                >Employee: <strong style="color: red"> *</strong></label
              >
              <select
                v-model="task.attachedTo"
                class="form-control"
                id="attachedTo"
              >
                <option value="">-- SELECT AN EMPLOYEE --</option>
                <option
                  v-for="user in users.filter(
                    (user) => user.auth.profile === 'employee'
                  )"
                  :key="user._id"
                  :value="user._id"
                >
                  {{ user.name }} ({{ user.auth.username }})
                </option>
              </select>
              <div class="text-danger mt-2" v-if="errors.attachedTo">
                {{ errors.attachedTo }}
              </div>
            </div>

            <div>
              <base-button type="submit">
                <font-awesome-icon :icon="['fas', 'save']" class="me-2" />
                SAVE
              </base-button>
            </div>
          </form>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NavbarPage from "@/components/UI/NavbarPage.vue";
import { ADD_TASK } from "@/store/modules/task.module.js";
import { mapGetters } from "vuex";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import TaskValidations from "@/api/TaskValidations";
import { FETCH_USERS } from "@/store/modules/user.module.js";
import { format } from "date-fns";

export default {
  name: "AddTask",
  components: {
    NavbarPage,
    Datepicker,
  },
  data() {
    return {
      task: {
        title: "",
        description: "",
        due: null,
        attachedTo: "",
        priority: "",
      },
      errors: {},
    };
  },
  computed: {
    ...mapGetters("user", ["getUsers"]),
    ...mapGetters("task", ["getMessage"]),
    users() {
      return this.getUsers;
    },
  },
  methods: {
    onSubmit() {
      const validations = new TaskValidations(
        this.task.title,
        this.task.description,
        this.task.due,
        this.task.attachedTo,
        this.task.priority,
      );

      this.errors = validations.checkValidations();
      if (Object.keys(this.errors).length > 0) {
        return false;
      }

      const formattedDue = format(new Date(this.task.due), "yyyy-MM-dd");

      const taskData = {
        title: this.task.title,
        description: this.task.description,
        due: formattedDue, 
        attachedTo: this.task.attachedTo,
        priority: this.task.priority,
      };

      this.$store
        .dispatch(`task/${ADD_TASK}`, taskData)
        .then(() => {
          this.$swal({
            title: "Success",
            text: "Task added successfully!",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
          this.$router.push("/tasks");
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
    back() {
      this.$router.push("/tasks");
    },
  },
  created() {
    this.$store.dispatch(`user/${FETCH_USERS}`);
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

.card {
  margin: 0 auto;
  max-width: 800px;
}
</style>
