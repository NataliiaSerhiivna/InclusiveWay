import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getPendingLocations,
  getEditRequests,
  getLocations,
  getUsers,
} from "../../api";

export default function AdminPage({ language = "ua", toggleLanguage }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "add");
  const navigate = useNavigate();
  const [editRoleId, setEditRoleId] = useState(null);
  const [users, setUsers] = useState([]);
  const [addRequests, setAddRequests] = useState([]);
  const [editRequests, setEditRequests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translations = {
    ua: {
      logout: "Вийти",
      profile: "Профіль",
      tabs: {
        add: "Заявки на додавання локацій",
        edit: "Заявки на редагування локацій",
        locations: "Локації",
        users: "Користувачі",
      },
      listTitles: {
        add: "Заявки на додавання локацій",
        edit: "Заявки на редагування локацій",
        locations: "Всі локації",
        users: "Всі користувачі",
      },
      loading: "Завантаження...",
      noAddRequests: "Немає заявок",
      noEditRequests: "Немає заявок",
      noLocations: "Немає локацій",
      noUsers: "Немає користувачів",
      userRole: "Роль:",
      roleRegistered: "Зареєстрований користувач",
      roleAdmin: "Адміністратор",
    },
    en: {
      logout: "Logout",
      profile: "Profile",
      tabs: {
        add: "Add Location Requests",
        edit: "Edit Location Requests",
        locations: "Locations",
        users: "Users",
      },
      listTitles: {
        add: "Add Location Requests",
        edit: "Edit Location Requests",
        locations: "All Locations",
        users: "All Users",
      },
      loading: "Loading...",
      noAddRequests: "No requests",
      noEditRequests: "No requests",
      noLocations: "No locations",
      noUsers: "No users",
      userRole: "Role:",
      roleRegistered: "Registered User",
      roleAdmin: "Administrator",
    },
  };

  const t = translations[language];

  const translateRole = (role) => {
    if (role === "Зареєстрований користувач") return t.roleRegistered;
    if (role === "Адміністратор") return t.roleAdmin;
    return role;
  };

  useEffect(() => {
    if (activeTab === "add") {
      setLoading(true);
      getPendingLocations({ limit: 100 })
        .then((data) => {
          const list = Array.isArray(data) ? data : data.locations || [];
          setAddRequests(list);
          setLoading(false);
          setError("");
        })
        .catch((e) => {
          console.log(e);
          setError(e.message);
          setAddRequests([]);
          setLoading(false);
        });
    } else if (activeTab === "edit") {
      setLoading(true);
      getEditRequests({ limit: 100 })
        .then((data) => {
          setEditRequests(Array.isArray(data) ? data : data.requests || []);
          setLoading(false);
          setError("");
        })
        .catch((e) => {
          setError(e.message);
          setEditRequests([]);
          setLoading(false);
        });
    } else if (activeTab === "locations") {
      setLoading(true);
      getLocations({ limit: 100 })
        .then((data) => {
          const list = Array.isArray(data) ? data : data.locations || [];
          setLocations(list);
          setLoading(false);
          setError("");
        })
        .catch((e) => {
          setError(e.message);
          setLocations([]);
          setLoading(false);
        });
    } else if (activeTab === "users") {
      setLoading(true);
      getUsers({ limit: 100 })
        .then((data) => {
          const list = Array.isArray(data) ? data : data.users || [];
          setUsers(list);
          setLoading(false);
          setError("");
        })
        .catch((e) => {
          setError(e.message);
          setUsers([]);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    setEditRoleId(null);
  };

  return (
    <div
      className="add-location-page"
      style={{ overflowY: "auto", maxHeight: "100vh" }}
    >
      <div className="admin-page">
        <div className="header">
          <div className="logo">InclusiveWay</div>
          <div className="header-btns">
            <button className="lang-btn" onClick={toggleLanguage}>
              {language === "ua" ? "EN" : "UA"}
            </button>
            <button
              className="login-btn"
              onClick={() => {
                localStorage.removeItem("inclusive-way-google-jwt");
                navigate("/", { replace: true });
                window.location.reload();
              }}
            >
              {t.logout}
            </button>
            <button
              className="profile-btn"
              onClick={() => navigate("/profile")}
            >
              {t.profile}
            </button>
          </div>
        </div>
        <div
          className="admin-content"
          style={{
            maxWidth: 700,
            margin: "40px auto 0 auto",
            padding: 24,
          }}
        >
          <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
            <button
              className={`admin-tab-btn${activeTab === "add" ? " active" : ""}`}
              onClick={() => setActiveTab("add")}
            >
              {t.tabs.add}
            </button>
            <button
              className={`admin-tab-btn${
                activeTab === "edit" ? " active" : ""
              }`}
              onClick={() => setActiveTab("edit")}
            >
              {t.tabs.edit}
            </button>
            <button
              className={`admin-tab-btn${
                activeTab === "locations" ? " active" : ""
              }`}
              onClick={() => setActiveTab("locations")}
            >
              {t.tabs.locations}
            </button>
            <button
              className={`admin-tab-btn${
                activeTab === "users" ? " active" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              {t.tabs.users}
            </button>
          </div>
          {activeTab === "add" && (
            <div className="admin-list-block">
              <h3>{t.listTitles.add}</h3>
              {loading ? (
                <div>{t.loading}</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : addRequests.length === 0 ? (
                <div>{t.noAddRequests}</div>
              ) : (
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
              )}
            </div>
          )}
          {activeTab === "edit" && (
            <div className="admin-list-block">
              <h3>{t.listTitles.edit}</h3>
              {loading ? (
                <div>{t.loading}</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : editRequests.length === 0 ? (
                <div>{t.noEditRequests}</div>
              ) : (
                <ul>
                  {editRequests.map((req) => (
                    <li
                      key={req.id}
                      style={{ marginBottom: 12, cursor: "pointer" }}
                      onClick={() => navigate(`/admin-edit-request/${req.id}`)}
                    >
                      <span>
                        <b>{req.location?.name || req.name}</b>
                        <span style={{ marginLeft: 8 }}>&mdash;</span>
                        <span style={{ marginLeft: 8 }}>
                          {req.location?.address || req.address}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeTab === "locations" && (
            <div
              className="admin-list-block"
              onClick={() => {
                console.log(error);
                console.log(locations);
              }}
            >
              <h3>{t.listTitles.locations}</h3>
              {loading ? (
                <div>{t.loading}</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : locations.length === 0 ? (
                <div>{t.noLocations}</div>
              ) : (
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
              )}
            </div>
          )}
          {activeTab === "users" && (
            <div className="admin-list-block">
              <h3>{t.listTitles.users}</h3>
              {loading ? (
                <div>{t.loading}</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : users.length === 0 ? (
                <div>{t.noUsers}</div>
              ) : (
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
                          {(user.name || user.username || "").trim() ||
                            user.email}
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
                          style={{
                            color: "#334059",
                            fontSize: 15,
                            marginTop: 2,
                          }}
                        >
                          <span style={{ fontWeight: 700 }}>{t.userRole}</span>{" "}
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
                                {t.roleRegistered}
                              </option>
                              <option value="Адміністратор">
                                {t.roleAdmin}
                              </option>
                            </select>
                          ) : (
                            <span style={{ fontWeight: 400 }}>
                              {translateRole(user.role)}
                            </span>
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
