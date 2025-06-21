// Модуль для взаємодії з API backend

const API_BASE = "http://localhost:8080"; // URL-адреса API

// Обробка callback після аутентифікації
export async function authCallback(data) {
  return request("/auth", { method: "POST", body: data });
}
// Реєстрація нового користувача
export async function signup(data) {
  return request("/signup", { method: "POST", body: data });
}
// Вхід користувача в систему
export async function login(data) {
  return request("/login", { method: "POST", body: data });
}

// Отримання списку локацій з можливістю фільтрації через параметри
export async function getLocations(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/locations?${query}`);
}
// Отримання конкретної локації за її id
export async function getLocation(id) {
  return request(`/locations/${id}`);
}
// Додавання локації
export async function addLocation(data) {
  return request("/locations", { method: "POST", body: data });
}
// Редагування локації
export async function editLocation(id, data) {
  return request(`/locations/${id}`, { method: "PATCH", body: data });
}
// Видалення локації
export async function deleteLocation(id) {
  return request(`/locations/${id}`, { method: "DELETE" });
}
// Отримання списку локацій, що очікують на схвалення
export async function getPendingLocations(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/locations/pending?${query}`, {});
}

// Отримання списку всіх характеристик доступності
export async function getFeatures() {
  const response = await request("/features");
  return response;
}
// Оновлення списку характеристик для конкретної локації
export async function updateLocationFeatures(id, features) {
  return request(`/locations/${id}/features`, {
    method: "PUT",
    body: { features },
  });
}

// Додавання фотографії до локації
export async function addLocationPhoto(id, photo) {
  return request(`/locations/${id}/photos`, {
    method: "POST",
    body: photo,
  });
}
// Видалення фотографії
export async function deletePhoto(id) {
  return request(`/photos/${id}`, { method: "DELETE" });
}

// Отримання коментарів для конкретної локації
export async function getComments(locationId) {
  return request(`/locations/${locationId}/comments`);
}
// Додавання нового коментаря до локації
export async function addComment(locationId, comment) {
  return request(`/locations/${locationId}/comments`, {
    method: "POST",
    body: comment,
  });
}

// Отримання даних профілю користувача
export async function getProfile() {
  return request("/profile", {});
}
// Оновлення даних профілю користувача
export async function updateProfile(data) {
  return request("/profile", { method: "PATCH", body: data });
}

// Отримання списку всіх користувачів
export async function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/users?${query}`, {});
}

// Отримання списку заявок на редагування
export async function getEditRequests(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/location-edit-requests?${query}`, {});
}

// Створення нової заявки на редагування
export async function addEditRequest(data) {
  return request("/location-edit-requests", {
    method: "POST",
    body: data,
  });
}
// Отримання конкретної заявки на редагування за її id
export async function getEditRequest(id) {
  const response = await request(`/location-edit-requests/${id}`);
  console.log("Edit request response:", response);

  if (!response) {
    throw new Error("Заявку не знайдено");
  }

  return {
    request: response.validatedChanges,
    location: response.currentLocation,
  };
}
// Схвалення заявки на редагування
export async function applyEditRequest(id, data) {
  return request(`/location-edit-requests/${id}`, {
    method: "POST",
    body: data,
  });
}
// Відхилення заявки на редагування
export async function rejectEditRequest(id) {
  return request(`/location-edit-requests/${id}`, { method: "DELETE" });
}

// Оновлення даних локації
export const updateLocation = async (id, data) => {
  return request(`/locations/${id}`, {
    method: "PATCH",
    body: data,
  });
};

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const options = {
    method,
    headers,
    credentials: "include",
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(API_BASE + path, options);

  let data;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    if (res.status === 401) {
      const userSession = localStorage.getItem("inclusive-way-google-jwt");
      if (userSession) {
        setTimeout(() => window.location.reload(), 500);
        return;
      }
    }
    throw new Error((data && data.message) || data || res.statusText);
  }
  if (res.status === 204) return null;
  return data;
}
