import { api } from "../lib/api";

// POST /consultations (عمومی، بدون توکن)
// payload: { first_name, last_name, phone, message }
export const sendConsultation = (payload) =>
  api.post("/consultations", payload).then((r) => r.data);
