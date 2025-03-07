import Validations from "./Validations";

export default class CommentValidations {
    constructor(message) {
      this.message = message;
    
    }
  
    checkValidations() {
      const errors = {};
  
      if (!this.message) {
        errors.message = "Message cannot be empty.";
      } else if (!Validations.minLength(this.message, 3)) {
        errors.message = "Message must be at least 3 characters long.";
      } else if (!Validations.maxLength(this.message, 800)) {
        errors.message = "Message must be at least 800 characters long.";
      }

      return errors;
    }
  }