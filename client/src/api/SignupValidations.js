import Validations from "./Validations";

export default class SignupValidations {
  constructor(name, username, password, profile) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.profile = profile;
    this.errors = {};
  }

  checkValidations() {
    if (this.name === "") {
      this.errors.name = "Name cannot be empty.";
    } else if (!Validations.checkName(this.name)) {
      this.errors.name =
        "Name must contain only letters and spaces, and cannot have numbers or special characters.";
    }

    if (this.username === "") {
      this.errors.username = "Email cannot be empty.";
    } else if (!Validations.checkEmail(this.username)) {
      this.errors.username = "Invalid email.";
    }

    if (this.password === "") {
      this.errors.password = "Password cannot be empty.";
    } else if (!Validations.checkPassword(this.password)) {
      this.errors.password =
        "Password must be at least 6 characters long and contain at least one letter, one special character, and one number.";
    }

    if (this.profile == 0) {
      this.errors.profile =
        'Profile cannot be empty.';
    }

    return this.errors;
  }
}
