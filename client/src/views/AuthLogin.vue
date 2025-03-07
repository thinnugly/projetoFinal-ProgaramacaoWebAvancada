<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow p-4">
          <h3 class="text-center mb-4">Enter your personal details</h3>
          <p style="color: red; font-size: 0.875rem">
            Fields with * are mandatory.
          </p>
          <form @submit.prevent="onSignin()">
            <div class="mb-3">
              <label for="email" class="form-label">Email Address: <strong style="color: red"> *</strong></label>
              <input type="text" class="form-control" id="email"
                placeholder="Enter your email. eg: renatomuiambo24@gmail.com" v-model.trim="auth.username" />
              <div class="text-danger mt-2" v-if="errors.username">
                {{ errors.username }}
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password: <strong style="color: red"> *</strong></label>
              <input type="password" class="form-control" id="password" placeholder="Enter your password"
                v-model.trim="auth.password" />
              <div class="text-danger mt-2" v-if="errors.password">
                {{ errors.password }}
              </div>
            </div>

            <div>
              <base-button type="submit">
                <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="me-2" />
                LOGIN
              </base-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SigninValidations from "../api/SigninValidations.js";
import { AUTH_LOGIN } from "@/store/modules/auth.module.js";
import router from "@/router";
import { mapGetters } from "vuex";
export default {
  name: "AuthLogin",
  data() {
    return {
      auth: {
        username: "",
        password: "",
      },
      errors: {},
    };
  },
  computed: {
    ...mapGetters("auth", ["getMessage"]),
  },
  methods: {
    onSignin() {
      let validations = new SigninValidations(
        this.auth.username,
        this.auth.password
      );

      this.errors = validations.checkValidations();
      if (Object.keys(this.errors).length) {
        return false;
      }

      this.$store
        .dispatch(`auth/${AUTH_LOGIN}`, this.auth)
        .then(() => {
          this.$swal({
            title: "Login",
            text: this.getMessage,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
          router.push({ name: "ListTasks" });
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
  },
};
</script>

<style scoped>
h4 {
  text-align: center;
}
</style>
