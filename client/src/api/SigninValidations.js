import Validations from "./Validations";

export default class SigninValidations {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.errors = {};
  }

  checkValidations() {
 
    if (this.username === "") {
      this.errors.username = "Email cannot be empty.";
    }else if (!Validations.checkEmail(this.username)) {
      this.errors.username = "Invalid email.";
    }

    if (this.password  === "") {
      this.errors.password = "Password cannot be empty.";
    }else if (!Validations.minLength(this.password, 6)) {
      this.errors.password =
        "Password must be at least 6 characters long.";
    }
 
    return this.errors;
  }
}
