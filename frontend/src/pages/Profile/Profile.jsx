import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch((e) => setError(e.toString()));
  }, []);

  return (
    <div className="add-location-page">
      <div className="add-location-header">Профіль користувача</div>
      <div className="profile-info-form add-location-form">
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!user ? (
          <div>Завантаження...</div>
        ) : (
          <>
            <div className="form-row">
              <label>Імʼя</label>
              <div>{user.username || user.name || "-"}</div>
            </div>
            <div className="form-row">
              <label>Пошта</label>
              <div>{user.email}</div>
            </div>
            <div className="form-row">
              <label>Роль</label>
              <div>{user.role}</div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => navigate("/edit-profile")}
              >
                Редагувати профіль
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
