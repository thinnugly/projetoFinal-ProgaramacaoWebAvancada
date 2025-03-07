import Validations from "./Validations";

export default class TaskValidations {
    constructor(title, description, due, attachedTo, priority) {
      this.title = title;
      this.description = description;
      this.due = due;
      this.attachedTo = attachedTo;
      this.priority = priority;
    }
  
    checkValidations() {
      const errors = {};
  
      if (!this.title) {
        errors.title = "Title cannot be empty.";
      } else if (!Validations.minLength(this.title, 3)) {
        errors.title = "Title must be at least 3 characters long.";
      } else if (!Validations.maxLength(this.title, 100)) {
        errors.title = "Title must be at least 100 characters long.";
      }
  
      if (!this.description) {
        errors.description = "Description cannot be empty.";
      } else if (!Validations.minLength(this.description, 5)) {
        errors.description = "Title must be at least 5 characters long";
      } else if (!Validations.maxLength(this.description, 200)) {
        errors.description = "Title must be at least 5 characters long.";
      }
  
      if (!this.due) {
        errors.due = "Due date cannot be empty.";
      } else if (!Validations.verifyDate(this.due)) {
        errors.due = "The due date must be today or in the future.";
      }
  
      if (!this.attachedTo) {
        errors.attachedTo = "Employee cannot be empty.";
      }

      if (!this.priority) {
        errors.priority = "Priority cannot be empty.";
      }
  
      return errors;
    }
  }