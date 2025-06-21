// Сторінка для редагування профілю користувача

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import { updateProfile } from "../../api";
import { getProfile } from "../../api";

export default function EditProfile({ language = "ua" }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [initialName, setInitialName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Об'єкт з перекладами для інтернаціоналізації
  const translations = {
    ua: {
      title: "Редагування профілю користувача",
      nameLabel: "Імʼя",
      emailLabel: "Пошта",
      roleLabel: "Роль",
      successMessage: "Профіль оновлено!",
      cancelButton: "Скасувати",
      submitButton: "Застосувати зміни",
      registeredUserRole: "Зареєстрований користувач",
      noChanges: "Ви не внесли жодних змін",
    },
    en: {
      title: "Edit User Profile",
      nameLabel: "Name",
      emailLabel: "Email",
      roleLabel: "Role",
      successMessage: "Profile updated!",
      cancelButton: "Cancel",
      submitButton: "Apply changes",
      registeredUserRole: "Registered user",
      noChanges: "You haven't made any changes",
    },
  };

  const t = translations[language];

  // Завантаження даних профілю користувача
  useEffect(() => {
    getProfile()
      .then((data) => {
        const currentName = data.username || data.name || "";
        setForm({
          name: currentName,
          email: data.email || "",
          role: data.role || t.registeredUserRole,
        });
        setInitialName(currentName);
      })
      .catch(() => {});
  }, [t.registeredUserRole]);

  // Обробник відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Перевірка, чи були зміни
    if (form.name.trim() === initialName.trim()) {
      setError(t.noChanges);
      return;
    }

    setLoading(true);
    try {
      // Виклик API для оновлення профілю
      await updateProfile({ username: form.name });
      setSuccess(true);
      const updated = await getProfile();
      setForm({
        name: updated.username || updated.name || "",
        email: updated.email || "",
        role: updated.role || t.registeredUserRole,
      });
      navigate(-1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-location-page">
      <div className="add-location-header">{t.title}</div>
      {/* Форма редагування профілю */}
      <form className="add-location-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>{t.nameLabel}</label>
          <textarea
            rows={1}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label>{t.emailLabel}</label>
          <div className="profile-field-static">{form.email}</div>
        </div>
        <div className="form-row">
          <label>{t.roleLabel}</label>
          <div className="profile-field-static">{form.role}</div>
        </div>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 10 }}>
            {t.successMessage}
          </div>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            {t.cancelButton}
          </button>
          <button type="submit" className="submit-btn">
            {t.submitButton}
          </button>
        </div>
      </form>
    </div>
  );
}
