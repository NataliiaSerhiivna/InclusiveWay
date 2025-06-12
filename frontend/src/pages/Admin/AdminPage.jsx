import React, { useState } from "react";
import "../../styles/Admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("add");
  const navigate = useNavigate();
  const [editRoleId, setEditRoleId] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Іван Петренко",
      email: "ivan.petrenko@gmail.com",
      role: "Зареєстрований користувач",
    },
    {
      id: 2,
      name: "Олена Шевченко",
      email: "olena.shevchenko@gmail.com",
      role: "Адміністратор",
    },
    {
      id: 3,
      name: "Олена Ковальчук",
      email: "olena.kovalchuk@gmail.com",
      role: "Зареєстрований користувач",
    },
  ]);

  const addRequests = [
    {
      id: 1,
      name: "Кавʼярня Lagom coffee",
      address: "вул. Січових Стрільців, 57, Київ",
    },
    { id: 2, name: "ТРЦ Respublika Park", address: "Кільцева дорога, 1, Київ" },
  ];
  const editRequests = [
    { id: 1, name: "Musafir", address: "вул. Богдана Хмельницького, 3Б, Київ" },
  ];
  const locations = [
    { id: 1, name: "Musafir", address: "вул. Богдана Хмельницького, 3Б, Київ" },
    {
      id: 2,
      name: "Кінотеатр Планета Кіно",
      address: "просп. Оболонський, 1Б, Київ",
    },
    {
      id: 3,
      name: "Кавʼярня Aroma Kava",
      address: "вул. Ярославів Вал, 13, Київ",
    },
    { id: 4, name: "ТРЦ Ocean Plaza", address: "вул. Антоновича, 176, Київ" },
  ];

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    setEditRoleId(null);
  };

  return (
    <div className="admin-page">
      <div className="header">
        <div className="logo">InclusiveWay</div>
        <div className="header-btns">
          <button className="lang-btn">UA</button>
          <button
            className="login-btn"
            onClick={() => {
              localStorage.removeItem("inclusive-way-google-jwt");
              navigate("/", { replace: true });
              window.location.reload();
            }}
          >
            Вийти
          </button>
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            Профіль
          </button>
        </div>
      </div>
      <div
        className="admin-content"
        style={{ maxWidth: 700, margin: "40px auto 0 auto", padding: 24 }}
      >
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          <button
            className={`admin-tab-btn${activeTab === "add" ? " active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            Заявки на додавання локацій
          </button>
          <button
            className={`admin-tab-btn${activeTab === "edit" ? " active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            Заявки на редагування локацій
          </button>
          <button
            className={`admin-tab-btn${
              activeTab === "locations" ? " active" : ""
            }`}
            onClick={() => setActiveTab("locations")}
          >
            Локації
          </button>
          <button
            className={`admin-tab-btn${activeTab === "users" ? " active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Користувачі
          </button>
        </div>
        {activeTab === "add" && (
          <div className="admin-list-block">
            <h3>Заявки на додавання локацій</h3>
            <ul>
              {addRequests.map((req) => (
                <li
                  key={req.id}
                  style={{ marginBottom: 12, cursor: "pointer" }}
                  onClick={() => navigate(`/admin-add-request/${req.id}`)}
                >
                  <span>
                    <b>{req.name}</b>
                    <span style={{ marginLeft: 8 }}>&mdash;</span>
                    <span style={{ marginLeft: 8 }}>{req.address}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "edit" && (
          <div className="admin-list-block">
            <h3>Заявки на редагування локацій</h3>
            <ul>
              {editRequests.map((req) => (
                <li
                  key={req.id}
                  style={{ marginBottom: 12, cursor: "pointer" }}
                  onClick={() => navigate(`/admin-edit-request/${req.id}`)}
                >
                  <span>
                    <b>{req.name}</b>
                    <span style={{ marginLeft: 8 }}>&mdash;</span>
                    <span style={{ marginLeft: 8 }}>{req.address}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "locations" && (
          <div className="admin-list-block">
            <h3>Всі локації</h3>
            <ul>
              {locations.map((loc) => (
                <li
                  key={loc.id}
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/admin-location/${loc.id}`)}
                >
                  <span>
                    <b>{loc.name}</b>
                    <span style={{ marginLeft: 8 }}>&mdash;</span>
                    <span style={{ marginLeft: 8 }}>{loc.address}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "users" && (
          <div className="admin-list-block">
            <h3>Всі користувачі</h3>
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#334059", fontWeight: 600 }}>
                      {user.name}{" "}
                      <span
                        style={{
                          color: "#334059",
                          fontSize: 15,
                          marginLeft: 8,
                        }}
                      >
                        {user.email}
                      </span>
                    </span>
                    <span
                      style={{ color: "#334059", fontSize: 15, marginTop: 2 }}
                    >
                      <span style={{ fontWeight: 700 }}>Роль:</span>{" "}
                      {editRoleId === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          style={{
                            marginLeft: 8,
                            fontSize: 15,
                            borderRadius: 6,
                            padding: "2px 10px",
                            fontWeight: 400,
                          }}
                        >
                          <option value="Зареєстрований користувач">
                            Зареєстрований користувач
                          </option>
                          <option value="Адміністратор">Адміністратор</option>
                        </select>
                      ) : (
                        <span style={{ fontWeight: 400 }}>{user.role}</span>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
