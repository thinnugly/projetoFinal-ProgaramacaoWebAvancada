<template>
  <NavbarPage />
  <div class="container mt-5">
    <b-row>
      <b-col>
        <base-button type="submit" @click="back()">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="me-2" />
          BACK TO USERS LIST
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
          <form @submit.prevent="onSignup()">
            <div class="mb-3">
              <label for="name" class="form-label"
                >Name: <strong style="color: red"> *</strong></label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="Enter your name. eg: Renato Madeia Muiambo"
                v-model.trim="auth.name"
              />
              <div class="text-danger mt-2" v-if="errors.name">
                {{ errors.name }}
              </div>
            </div>

            <div class="mb-3">
              <label for="email" class="form-label"
                >Email Address: <strong style="color: red"> *</strong></label
              >
              <input
                type="text"
                class="form-control"
                id="email"
                placeholder="Enter your email. eg: renatomuiambo24@gmail.com"
                v-model.trim="auth.username"
              />
              <div class="text-danger mt-2" v-if="errors.username">
                {{ errors.username }}
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label"
                >Password: <strong style="color: red"> *</strong></label
              >
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Enter your password"
                v-model.trim="auth.password"
              />
              <div class="text-danger mt-2" v-if="errors.password">
                {{ errors.password }}
              </div>
            </div>

            <div class="mb-3">
              <label for="profile" class="form-label"
                >Profile: <strong style="color: red"> *</strong></label
              >
              <select v-model="auth.profile" class="form-control" id="profile">
                <option value>-- SELECT A PROFILE --</option>
                <option value="admin">ADMINISTRATOR</option>
                <option value="employee">EMPLOYEE</option>
              </select>
              <div class="text-danger mt-2" v-if="errors.profile">
                {{ errors.profile }}
              </div>
            </div>

            <div>
              <base-button type="submit">
                <font-awesome-icon :icon="['fas', 'user-plus']" class="me-2" />
                REGISTER
              </base-button>
            </div>
          </form>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SignupValidations from "../../api/SignupValidations";
import NavbarPage from "@/components/UI/NavbarPage.vue";
import { ADD_USER } from "@/store/modules/user.module.js";
import { mapGetters } from "vuex";
import router from "@/router";
export default {
  name: "AuthRegister",
  components: {
    NavbarPage,
  },
  data() {
    return {
      auth: {
        name: "",
        username: "",
        password: "",
        profile: "",
      },
      errors: {

      },
    };
  },
  computed: {
    ...mapGetters("user", ["getMessage"]),
    isAuthenticated() {
      return this.$store.getters["auth/isUserLoggedIn"];
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
  },
  methods: {
    onSignup() {
      let validations = new SignupValidations(
        this.auth.name,
        this.auth.username,
        this.auth.password,
        this.auth.profile
      );

      this.errors = validations.checkValidations();
      if (Object.keys(this.errors).length) {
        return false;
      }

      const userData = {
        name: this.auth.name,
        auth: {
          username: this.auth.username,
          password: this.auth.password,
          profile: this.auth.profile,
        },
      };

      this.$store
        .dispatch(`user/${ADD_USER}`, userData)
        .then(() => {
          this.auth.name = "";
          this.auth.username = "";
          this.auth.password = "";
          this.auth.profile = "";

          this.$swal({
            title: "Register",
            text: this.getMessage,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
          router.push({ name: 'ListUsers' });
        })
        .catch((err) => {
          this.$swal({
            title: "Error",
            text: `${err.message}`,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
        });
    },
    back() {
      this.$router.push("/admin/users");
    },
  },
};
</script>

<style scoped>
h4 {
  text-align: center;
}
</style>
