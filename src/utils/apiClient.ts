// API client utility for the frontend to interact with the backend

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class APIClient {
  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      // Redirect to login
      window.location.href = "/login";
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  }

  // Authentication
  login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  logout() {
    return this.request("/auth/logout", { method: "POST" });
  }

  getCurrentUser() {
    return this.request("/auth/me");
  }

  // Users
  getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/users${query ? "?" + query : ""}`);
  }

  getUserById(id) {
    return this.request(`/users/${id}`);
  }

  createUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  deleteUser(id) {
    return this.request(`/users/${id}`, { method: "DELETE" });
  }

  // Academic
  getAcademicYears() {
    return this.request("/academics/years");
  }

  createAcademicYear(data) {
    return this.request("/academics/years", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getClasses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/academics/classes${query ? "?" + query : ""}`);
  }

  createClass(data) {
    return this.request("/academics/classes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getSubjects() {
    return this.request("/academics/subjects");
  }

  createSubject(data) {
    return this.request("/academics/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getSections(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/academics/sections${query ? "?" + query : ""}`);
  }

  createSection(data) {
    return this.request("/academics/sections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  assignTeacherToSubject(data) {
    return this.request("/academics/assign-teacher", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  enrollStudentInClass(data) {
    return this.request("/academics/enroll-student", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Assignments
  getAssignments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/assignments${query ? "?" + query : ""}`);
  }

  createAssignment(data) {
    return this.request("/assignments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  submitAssignment(data) {
    return this.request("/assignments/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getSubmissions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/assignments/submissions${query ? "?" + query : ""}`);
  }

  gradeSubmission(data) {
    return this.request("/assignments/grade", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Attendance
  markAttendance(data) {
    return this.request("/attendance/mark", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getAttendance(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance${query ? "?" + query : ""}`);
  }

  getAttendanceSummary(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance/summary${query ? "?" + query : ""}`);
  }
}

export default new APIClient();
