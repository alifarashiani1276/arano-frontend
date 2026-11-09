import { api } from "../lib/api";

const data = (response) => response.data.data;

// GET /comments (عمومی)  ->  { comments, meta, summary }
export const getComments = (params) =>
  api.get("/comments", { params }).then((response) => data(response));

// GET /comments/mine (کاربر تأییدشده)  ->  نظر خودش یا null
export const getMyComment = () =>
  api.get("/comments/mine").then((response) => data(response));

// payload: { body, rating }
export const createComment = (payload) =>
  api.post("/comments", payload).then((response) => data(response));

export const updateComment = (id, payload) =>
  api.put(`/comments/${id}`, payload).then((response) => data(response));

export const deleteComment = (id) =>
  api.delete(`/comments/${id}`).then((response) => response.data);
