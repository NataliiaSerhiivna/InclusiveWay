import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api";
import { getLocations } from "../../api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [userLocations, setUserLocations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("inclusive-way-google-jwt");
    getProfile("")
      .then(setUser)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;
    getLocations({ limit: 1000 })
      .then((data) => {
        const locations = data?.locations || data || [];
        setUserLocations(locations.filter((loc) => loc.createdBy === user.id));
      })
      .catch(() => setUserLocations([]));
  }, [user]);

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
            <div className="profile-locations-block">
              <div
                className="profile-locations-title"
                style={{ fontWeight: 600, fontSize: 18, color: "#334059" }}
              >
                Додані Вами локації:
              </div>
              <ul className="profile-locations-list">
                {userLocations.length === 0 ? (
                  <li style={{ color: '#888' }}>Ви ще не додали жодної локації</li>
                ) : (
                  userLocations.map((loc) => (
                    <li key={loc.id}>
                      <b>{loc.name}</b> — {loc.address}
                    </li>
                  ))
                )}
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
          </>
        )}
      </div>
    </div>
  );
}
