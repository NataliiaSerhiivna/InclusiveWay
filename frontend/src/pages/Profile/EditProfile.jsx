import React, { useState } from "react";
import "../../styles/Profile.css";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "Іван Петренко",
    email: "ivan.petrenko@gmail.com",
    role: "Зареєстрований користувач",
  });

  return (
    <div className="add-location-page">
      <div className="add-location-header">Редагування профілю користувача</div>
      <form className="add-location-form">
        <div className="form-row">
          <label>Імʼя</label>
          <textarea
            rows={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label>Пошта</label>
          <textarea
            rows={2}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label>Роль</label>
          <textarea
            rows={2}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn">
            Скасувати
          </button>
          <button type="submit" className="submit-btn">
            Застосувати зміни
          </button>
        </div>
      </form>
    </div>
  );
}
