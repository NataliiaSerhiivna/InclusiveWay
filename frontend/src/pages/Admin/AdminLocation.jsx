import React, { useEffect, useState } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import { getLocation, deleteLocation, getFeatures } from "../../api";

export default function AdminLocation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([getLocation(id), getFeatures()])
      .then(([locationData, featuresData]) => {
        setLocation(locationData);
        setAllFeatures(featuresData);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Помилка завантаження локації");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю локацію?")) return;
    setDeleting(true);
    setError("");
    try {
      await deleteLocation(id);
      navigate("/admin-page");
    } catch (e) {
      setError(e.message || "Помилка видалення локації");
    }
    setDeleting(false);
  };

  if (loading) return <div style={{ padding: 40 }}>Завантаження...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!location) return <div style={{ padding: 40 }}>Локацію не знайдено</div>;

  return (
    <div className="add-location-page" style={{ overflowY: "auto", height: "calc(100vh - 100px)" }}>
      <div
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
      >
        <div className="form-row" style={{ justifyContent: "center" }}>
          {(() => {
            let photoUrl = null;
            if (location.photos && location.photos[0]) {
              const p = location.photos[0];
              photoUrl =
                p.imageUrl || p.imageUrl || p.image_url || p.url || null;
            }
            return photoUrl ? (
              <img
                src={photoUrl}
                alt={location.name}
                style={{
                  width: "100%",
                  maxWidth: 500,
                  height: 260,
                  objectFit: "cover",
                  borderRadius: 16,
                  boxShadow: "0 2px 8px #0001",
                  marginBottom: 24,
                }}
              />
            ) : null;
          })()}
        </div>
        <div className="form-row" style={{ marginBottom: 10 }}>
          <label>Назва</label>
          <div>{location.name}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 10 }}>
          <label>Адреса</label>
          <div>{location.address}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 18 }}>
          <label>Опис</label>
          <div>{location.description}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 24 }}>
          <label>Доступність</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {(location.features || [])
              .map((featureId) => {
                if (!allFeatures) return null;
                const feature = allFeatures.find((f) => f.id === featureId);
                return feature ? feature.name : null;
              })
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "#17ccff",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "7px 18px",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
        <div className="form-row">
          <label>Коментарі</label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
            }}
          >
            {location.comments && location.comments.length > 0 ? (
              location.comments.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f7fbff",
                    borderRadius: 10,
                    padding: "10px 18px",
                    boxShadow: "0 1px 4px #0001",
                  }}
                >
                  <b>{c.author || c.email || `User #${c.userId}`}:</b>{" "}
                  <span>{c.text || c.content || ""}</span>
                </div>
              ))
            ) : (
              <span style={{ color: "#888" }}>Коментарів ще немає</span>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            marginTop: 40,
          }}
        >
          <button
            style={{
              background: "#0296d6",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 20,
              fontWeight: 700,
              minWidth: 200,
              padding: "14px 0",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={() => navigate(`/admin-location/${location.id}/edit`)}
          >
            Редагувати
          </button>
          <button
            style={{
              background: "#ff5c45",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 20,
              fontWeight: 700,
              minWidth: 200,
              padding: "14px 0",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Видалення..." : "Видалити"}
          </button>
        </div>
      </div>
      {error && <div style={{ color: "red", marginTop: 20 }}>{error}</div>}
    </div>
  );
}
