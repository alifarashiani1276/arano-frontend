import axios from "axios";
import { PROJECTS } from "../data/projects";

// VITE_USE_MOCK=false  ->  GET {VITE_BASE_URL}/projects (Rails)
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// نگاشت پاسخ API (snake_case) به شکل موردنیاز UI.
// اگر نام فیلدهای ریلز فرق کرد، فقط همین تابع را تغییر دهید.
export function normalizeProject(raw) {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    category: raw.category ?? "web",
    categoryLabel: raw.categoryLabel ?? raw.category_label ?? "پروژه",
    technologies: raw.technologies ?? raw.tech_stack ?? [],
    image: raw.image ?? raw.image_url ?? null,
    url: raw.url ?? raw.project_url ?? null,
    year: raw.year ?? "",
    featured: Boolean(raw.featured),
  };
}

export async function getProjects() {
  if (USE_MOCK) return PROJECTS.map(normalizeProject);

  const { data } = await axios.get(`${BASE_URL}/projects`);
  const list = Array.isArray(data) ? data : (data.projects ?? []);
  return list.map(normalizeProject);
}
