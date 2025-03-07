export default class Validations {
  // Validação para email
  static checkEmail(email) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$/.test(email)) {
      return true;
    }
    return false;
  }

  // Validação para nome
  static checkName(name) {
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/; // Permite apenas letras e espaços
    return nameRegex.test(name);
  }

  // Validação para senha
  static checkPassword(password) {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
    // A regex exige pelo menos uma letra, um número, um caractere especial e no mínimo 6 caracteres.
    return passwordRegex.test(password);
  }

  static minLength(name, minLength) {
    if (name.length < minLength) {
      return false;
    }
    return true;
  }

  static maxLength(name, maxLength) {
    if (name.length > maxLength) {
      return false;
    }
    return true;
  }

  static verifyDate(date) {
    if (!date) return false;

    // Converter para um objeto Date
    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) return false; // Verifica se a data é válida

    // Extrai apenas a parte da data (YYYY-MM-DD)
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    // Obtém a data de hoje no mesmo formato
    const todayString = new Date().toISOString().split("T")[0];

    return selectedDateString >= todayString; // Verifica se a data é hoje ou no futuro
  }
 
}
