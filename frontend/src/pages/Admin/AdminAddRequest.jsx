import React, { useEffect, useState } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getLocation, updateLocation, deleteLocation, getFeatures } from "../../api";

export default function AdminAddRequest({ language = "ua" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const translations = {
    ua: {
      loading: "Завантаження...",
      notFound: "Заявку не знайдено",
      loadError: "Помилка завантаження",
      approveError: "Помилка при схваленні локації",
      rejectError: "Помилка при видаленні локації",
      pageTitle: "Заявка на додавання локації",
      photoLabel: "Фото",
      noPhoto: "Немає фото",
      nameLabel: "Назва",
      addressLabel: "Адреса",
      descriptionLabel: "Опис",
      accessibilityLabel: "Доступність",
      noData: "Немає даних",
      approveButton: "Схвалити",
      rejectButton: "Відхилити",
      processing: "Обробка...",
    },
    en: {
      loading: "Loading...",
      notFound: "Request not found",
      loadError: "Loading error",
      approveError: "Error approving location",
      rejectError: "Error deleting location",
      pageTitle: "Add Location Request",
      photoLabel: "Photo",
      noPhoto: "No photo",
      nameLabel: "Name",
      addressLabel: "Address",
      descriptionLabel: "Description",
      accessibilityLabel: "Accessibility",
      noData: "No data",
      approveButton: "Approve",
      rejectButton: "Reject",
      processing: "Processing...",
    },
  };

  const t = translations[language];

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

  const handleApprove = async () => {
    try {
      setApproving(true);
      await updateLocation(id, { approved: true });
      navigate("/admin-page", { state: { activeTab: "add" } });
    } catch (e) {
      setError(e.message || t.approveError);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      await deleteLocation(id);
      navigate("/admin-page", { state: { activeTab: "add" } });
    } catch (e) {
      setError(e.message || t.rejectError);
    } finally {
      setRejecting(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>{t.loading}</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!location) return <div style={{ padding: 40 }}>{t.notFound}</div>;

  let photo = null;
  if (location.photos && location.photos[0]) {
    const p = location.photos[0];
    photo = p.imageUrl || p.imageUrl || p.image_url || p.url || null;
  }

  const lat = location.latitude;
  const lng = location.longitude;

  const accessibility = ((location.features || []).map((featureId) => {
      if (!allFeatures) return null;
      const feature = allFeatures.find((f) => f.id === featureId);
      return feature ? feature.name : null;
    })
    .filter(Boolean));

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
          onClick={() => navigate("/admin-page", { state: { activeTab: "add" } })}
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
      <div
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
      >
        <div className="form-row">
          <label>{t.photoLabel}</label>
          {photo ? (
            <img
              src={photo}
              alt={location.name}
              style={{
                width: 180,
                height: 120,
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
              }}
            />
          ) : (
            <span>{t.noPhoto}</span>
          )}
        </div>
        <div className="form-row">
          <label>{t.nameLabel}</label>
          <div>{location.name}</div>
        </div>
        <div className="form-row">
          <label>{t.addressLabel}</label>
          <div>{location.address}</div>
        </div>
        <div style={{ margin: "18px 0 28px 0" }}>
          {lat && lng && (
            <MapContainer
              center={[lat, lng]}
              zoom={16}
              style={{
                width: "100%",
                height: 220,
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} />
            </MapContainer>
          )}
        </div>
        <div className="form-row">
          <label>{t.descriptionLabel}</label>
          <div>{location.description}</div>
        </div>
        <div className="form-row">
          <label>{t.accessibilityLabel}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {accessibility.length > 0 ? (
              accessibility.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "#17ccff",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "6px 16px",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span>{t.noData}</span>
            )}
          </div>
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
          onClick={handleApprove}
          disabled={approving || rejecting}
          style={{
            background: "#00c853",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 20,
            fontWeight: 700,
            minWidth: 200,
            padding: "14px 0",
            cursor: approving || rejecting ? "default" : "pointer",
            transition: "background 0.2s",
            opacity: approving || rejecting ? 0.7 : 1,
          }}
        >
          {approving ? t.processing : t.approveButton}
        </button>
        <button
          onClick={handleReject}
          disabled={approving || rejecting}
          style={{
            background: "#ff5c45",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 20,
            fontWeight: 700,
            minWidth: 200,
            padding: "14px 0",
            cursor: approving || rejecting ? "default" : "pointer",
            transition: "background 0.2s",
            opacity: approving || rejecting ? 0.7 : 1,
          }}
        >
          {rejecting ? t.processing : t.rejectButton}
        </button>
      </div>
    </div>
  );
}
