import { api } from "../lib/api";

const data = (response) => response.data.data;

export const getUserDashboard = () =>
  api.get("/dashboard").then((response) => data(response));

export const getUserProjects = () =>
  api.get("/projects").then((response) => data(response).projects ?? []);

export const getUserProject = (id) =>
  api.get(`/projects/${id}`).then((response) => data(response).project);

export const createUserProject = (payload) =>
  api.post("/projects", payload).then((response) => data(response).project);

export const updateUserProject = (id, payload) =>
  api
    .put(`/projects/${id}`, payload)
    .then((response) => data(response).project);

export const deleteUserProject = (id) =>
  api.delete(`/projects/${id}`).then((response) => response.data);

export const getUserHistory = () =>
  api.get("/history").then((response) => data(response));

export const getUserConversations = () =>
  api
    .get("/conversations")
    .then((response) => data(response).conversations ?? []);

export const getUserConversation = (id) =>
  api
    .get(`/conversations/${id}`)
    .then((response) => data(response).conversation);

export const createUserConversation = (payload) =>
  api
    .post("/conversations", payload)
    .then((response) => data(response).conversation);

export const sendUserMessage = (id, message) =>
  api
    .post(`/conversations/${id}/messages`, { message })
    .then((response) => data(response).message);

export const getAdminDashboard = () =>
  api.get("/admin/dashboard").then((response) => data(response));

export const getAdminRequests = () =>
  api.get("/admin/requests").then((response) => data(response).requests ?? []);

export const approveAdminRequest = (id) =>
  api
    .patch(`/admin/requests/${id}/approve`)
    .then((response) => data(response).user);

export const rejectAdminRequest = (id) =>
  api
    .patch(`/admin/requests/${id}/reject`)
    .then((response) => data(response).user);

export const getAdminUsers = () =>
  api.get("/admin/users").then((response) => data(response).users ?? []);

export const getAdminUser = (id) =>
  api.get(`/admin/users/${id}`).then((response) => data(response).user);

export const toggleAdminUser = (id) =>
  api
    .patch(`/admin/users/${id}/toggle-active`)
    .then((response) => data(response).user);

export const changeUserRole = (id, role) =>
  api
    .patch(`/admin/users/${id}/role`, { role })
    .then((response) => data(response).user);

export const getAdmins = () =>
  api.get("/admin/admins").then((response) => data(response).admins ?? []);

export const getAdmin = (id) =>
  api.get(`/admin/admins/${id}`).then((response) => data(response).admin);

export const createAdmin = (phone) =>
  api.post("/admin/admins", { phone }).then((response) => data(response).admin);

export const toggleAdmin = (id) =>
  api
    .patch(`/admin/admins/${id}/toggle-active`)
    .then((response) => data(response).admin);

export const getAdminProjects = () =>
  api.get("/admin/projects").then((response) => data(response).projects ?? []);

export const getAdminProject = (id) =>
  api.get(`/admin/projects/${id}`).then((response) => data(response).project);

export const updateAdminProject = (id, payload) =>
  api
    .put(`/admin/projects/${id}`, payload)
    .then((response) => data(response).project);

export const updateAdminProjectStatus = (id, status) =>
  api
    .patch(`/admin/projects/${id}/status`, { status })
    .then((response) => data(response).project);

export const deleteAdminProject = (id) =>
  api.delete(`/admin/projects/${id}`).then((response) => response.data);

export const getAdminConversations = () =>
  api
    .get("/admin/conversations")
    .then((response) => data(response).conversations ?? []);

export const getAdminConversation = (id) =>
  api
    .get(`/admin/conversations/${id}`)
    .then((response) => data(response).conversation);

export const sendAdminMessage = (id, message) =>
  api
    .post(`/admin/conversations/${id}/messages`, { message })
    .then((response) => data(response).message);

export const closeAdminConversation = (id) =>
  api
    .patch(`/admin/conversations/${id}/close`)
    .then((response) => data(response).conversation);

export const getAdminProjectHistory = () =>
  api
    .get("/admin/history/projects")
    .then((response) => data(response).projects ?? []);

export const getAdminUserHistory = () =>
  api
    .get("/admin/history/users")
    .then((response) => data(response).users ?? []);

export const getAdminConsultations = () =>
  api
    .get("/admin/consultations")
    .then((response) => data(response).consultations ?? []);

export const getAdminConsultation = (id) =>
  api
    .get(`/admin/consultations/${id}`)
    .then((response) => data(response).consultation);

export const updateAdminConsultationStatus = (id, status) =>
  api
    .patch(`/admin/consultations/${id}/status`, { status })
    .then((response) => data(response).consultation);

export const getAdminProfile = () =>
  api.get("/admin/profile").then((response) => data(response).admin);

export const updateAdminProfile = (payload) =>
  api.put("/admin/profile", payload).then((response) => data(response).admin);

export const updateUserProfile = (payload) =>
  api.put("/profile", payload).then((response) => data(response).user);
