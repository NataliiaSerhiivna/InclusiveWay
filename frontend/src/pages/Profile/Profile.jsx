import React from "react";
import "../../styles/Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = {
    name: "Іван Петренко",
    email: "ivan.petrenko@gmail.com",
    role: "Зареєстрований користувач",
    locations: [
      "Кінотеатр Планета Кіно",
      "Кавʼярня Aroma Kava",
      "ТРЦ Ocean Plaza",
    ],
  };

  return (
    <div className="add-location-page">
      <div className="add-location-header">Профіль користувача</div>
      <div className="profile-info-form add-location-form">
        <div className="form-row">
          <label>Імʼя</label>
          <div>{user.name}</div>
        </div>
        <div className="form-row">
          <label>Пошта</label>
          <div>{user.email}</div>
        </div>
        <div className="form-row">
          <label>Роль</label>
          <div>{user.role}</div>
        </div>
        <div className="profile-locations-block">
          <div
            className="profile-locations-title"
            style={{ fontWeight: 600, fontSize: 18, color: "#334059" }}
          >
            Додані Вами локації:
          </div>
          <ul className="profile-locations-list">
            {user.locations.map((loc, i) => (
              <li key={i}>{loc}</li>
            ))}
          </ul>
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
      </div>
    </div>
  );
}
