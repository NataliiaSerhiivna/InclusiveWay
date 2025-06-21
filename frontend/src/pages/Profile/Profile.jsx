import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api";

export default function Profile({ language = "ua" }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const translations = {
    ua: {
      title: "Профіль користувача",
      loading: "Завантаження...",
      nameLabel: "Імʼя",
      emailLabel: "Пошта",
      roleLabel: "Роль",
      editProfileButton: "Редагувати профіль",
    },
    en: {
      title: "User Profile",
      loading: "Loading...",
      nameLabel: "Name",
      emailLabel: "Email",
      roleLabel: "Role",
      editProfileButton: "Edit Profile",
    },
  };

  const t = translations[language];

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch((e) => setError(e.toString()));
  }, []);

  return (
    <div className="add-location-page">
      <div
        className="add-location-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <button
          onClick={() => {
            if (user?.role === "admin") {
              navigate("/admin-page");
            } else {
              navigate("/");
            }
          }}
          style={{
            position: "absolute",
            left: "20px",
            background: "none",
            border: "none",
            fontSize: "30px",
            cursor: "pointer",
            padding: "0 15px",
            color: "white",
          }}
        >
          &larr;
        </button>
        {t.title}
      </div>
      <div className="profile-info-form add-location-form">
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!user ? (
          <div>{t.loading}</div>
        ) : (
          <>
            <div className="form-row">
              <label>{t.nameLabel}</label>
              <div>{user.username || user.name || "-"}</div>
            </div>
            <div className="form-row">
              <label>{t.emailLabel}</label>
              <div>{user.email}</div>
            </div>
            <div className="form-row">
              <label>{t.roleLabel}</label>
              <div>{user.role}</div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => navigate("/edit-profile")}
              >
                {t.editProfileButton}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
