// Сторінка адміністратора для перегляду інформації про конкретну локацію, переходу до її редагування або видалення

import React, { useEffect, useState } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import { getLocation, deleteLocation, getFeatures } from "../../api";

export default function AdminLocation({ language = "ua" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Об'єкт з перекладами для інтернаціоналізації
  const translations = {
    ua: {
      pageTitle: "Деталі локації",
      loading: "Завантаження...",
      loadError: "Помилка завантаження локації",
      notFound: "Локацію не знайдено",
      deleteConfirm: "Ви впевнені, що хочете видалити цю локацію?",
      deleteError: "Помилка видалення локації",
      nameLabel: "Назва",
      addressLabel: "Адреса",
      descriptionLabel: "Опис",
      accessibilityLabel: "Доступність",
      commentsLabel: "Коментарі",
      noComments: "Коментарів ще немає",
      editButton: "Редагувати",
      deleteButton: "Видалити",
      deletingButton: "Видалення...",
    },
    en: {
      pageTitle: "Location Details",
      loading: "Loading...",
      loadError: "Error loading location",
      notFound: "Location not found",
      deleteConfirm: "Are you sure you want to delete this location?",
      deleteError: "Error deleting location",
      nameLabel: "Name",
      addressLabel: "Address",
      descriptionLabel: "Description",
      accessibilityLabel: "Accessibility",
      commentsLabel: "Comments",
      noComments: "No comments yet",
      editButton: "Edit",
      deleteButton: "Delete",
      deletingButton: "Deleting...",
    },
  };

  const t = translations[language];

  // Завантаження даних локації
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
        setError(e.message || t.loadError);
        setLoading(false);
      });
  }, [id, t.loadError]);

  // Обробник видалення локації
  const handleDelete = async () => {
    if (!window.confirm(t.deleteConfirm)) return;
    setDeleting(true);
    setError("");
    try {
      await deleteLocation(id);
      navigate("/admin-page");
    } catch (e) {
      setError(e.message || t.deleteError);
    }
    setDeleting(false);
  };

  if (loading) return <div style={{ padding: 40 }}>{t.loading}</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!location) return <div style={{ padding: 40 }}>{t.notFound}</div>;

  return (
    <div
      className="add-location-page"
      style={{ overflowY: "auto", height: "calc(100vh - 100px)" }}
    >
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
          onClick={() =>
            navigate("/admin-page", { state: { activeTab: "locations" } })
          }
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
        {t.pageTitle}
      </div>
      {/* Інформація про локацію */}
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
          <label>{t.nameLabel}</label>
          <div>{location.name}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 10 }}>
          <label>{t.addressLabel}</label>
          <div>{location.address}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 18 }}>
          <label>{t.descriptionLabel}</label>
          <div>{location.description}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 24 }}>
          <label>{t.accessibilityLabel}</label>
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
          <label>{t.commentsLabel}</label>
          {/* Секція з коментарями до локації */}
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
              <span style={{ color: "#888" }}>{t.noComments}</span>
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
            {t.editButton}
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
            {deleting ? t.deletingButton : t.deleteButton}
          </button>
        </div>
      </div>
      {error && <div style={{ color: "red", marginTop: 20 }}>{error}</div>}
    </div>
  );
}
