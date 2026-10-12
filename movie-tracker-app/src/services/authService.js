import api from "../api";

export const authService = {
  async register(username, email, password) {
    const response = await api.post("/user/register", {
      username,
      email,
      passwordHash: password,
    });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post("/user/login", {
      email,
      passwordHash: password,
    });
    return response.data;
  },

  saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
  },

  getUser() {
    return JSON.parse(localStorage.getItem("user") || "null");
  },

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  },

  isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  },
};
