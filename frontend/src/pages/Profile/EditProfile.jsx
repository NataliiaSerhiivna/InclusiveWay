import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import { updateProfile } from "../../api";
import { getProfile } from "../../api";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({
          name: data.username || data.name || "",
          email: data.email || "",
          role: data.role || "Зареєстрований користувач",
        });
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await updateProfile({ username: form.name, email: form.email });
      setSuccess(true);
      const updated = await getProfile();
      setForm({
        name: updated.username || updated.name || "",
        email: updated.email || "",
        role: updated.role || "Зареєстрований користувач",
      });
      navigate('/profile');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-location-page">
      <div className="add-location-header">Редагування профілю користувача</div>
      <form className="add-location-form" onSubmit={handleSubmit}>
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
        {error && <div style={{color: 'red', marginBottom: 10}}>{error}</div>}
        {success && <div style={{color: 'green', marginBottom: 10}}>Профіль оновлено!</div>}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/profile')}>
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
