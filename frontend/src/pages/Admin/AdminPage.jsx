import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getPendingLocations,
  getEditRequests,
  getLocations,
  getUsers,
} from "../../api";

export default function AdminPage() {
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
            <button
              className="profile-btn"
              onClick={() => navigate("/profile")}
            >
              Профіль
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
              Заявки на додавання локацій
            </button>
            <button
              className={`admin-tab-btn${
                activeTab === "edit" ? " active" : ""
              }`}
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
              className={`admin-tab-btn${
                activeTab === "users" ? " active" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              Користувачі
            </button>
          </div>
          {activeTab === "add" && (
            <div className="admin-list-block">
              <h3>Заявки на додавання локацій</h3>
              {loading ? (
                <div>Завантаження...</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : addRequests.length === 0 ? (
                <div>Немає заявок</div>
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
              <h3>Заявки на редагування локацій</h3>
              {loading ? (
                <div>Завантаження...</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : editRequests.length === 0 ? (
                <div>Немає заявок</div>
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
              <h3>Всі локації</h3>
              {loading ? (
                <div>Завантаження...</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : locations.length === 0 ? (
                <div>Немає локацій</div>
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
              <h3>Всі користувачі</h3>
              {loading ? (
                <div>Завантаження...</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : users.length === 0 ? (
                <div>Немає користувачів</div>
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
                              <option value="Адміністратор">
                                Адміністратор
                              </option>
                            </select>
                          ) : (
                            <span style={{ fontWeight: 400 }}>{user.role}</span>
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
