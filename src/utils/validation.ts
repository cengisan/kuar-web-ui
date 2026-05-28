export default class Validation {
  private name: string;
  private email: string;
  private password: string;

  constructor(name: string, email: string, password: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  isValidName(): boolean {
    const nameRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ0-9\s]+$/;
    return nameRegex.test(this.name);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  isValidPassword(): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;
    return passwordRegex.test(this.password);
  }
}

export function isValidEmail(email: string): boolean {
  return new Validation("", email, "").isValidEmail();
}

export function isValidPassword(password: string): boolean {
  return new Validation("", "", password).isValidPassword();
}
