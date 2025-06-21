import React, { useEffect, useState } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getLocation, updateLocation, deleteLocation, getFeatures } from "../../api";

export default function AdminAddRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

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
        setError(e.message || "Помилка завантаження");
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      await updateLocation(id, { approved: true });
      navigate("/admin-page", { state: { activeTab: "add" } });
    } catch (e) {
      setError(e.message || "Помилка при схваленні локації");
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
      setError(e.message || "Помилка при видаленні локації");
    } finally {
      setRejecting(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Завантаження...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!location) return <div style={{ padding: 40 }}>Заявку не знайдено</div>;

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
      <div className="add-location-header">Заявка на додавання локації</div>
      <div
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
      >
        <div className="form-row">
          <label>Фото</label>
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
            <span>Немає фото</span>
          )}
        </div>
        <div className="form-row">
          <label>Назва</label>
          <div>{location.name}</div>
        </div>
        <div className="form-row">
          <label>Адреса</label>
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
          <label>Опис</label>
          <div>{location.description}</div>
        </div>
        <div className="form-row">
          <label>Доступність</label>
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
              <span>Немає даних</span>
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
          {approving ? "Обробка..." : "Схвалити"}
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
          {rejecting ? "Обробка..." : "Відхилити"}
        </button>
      </div>
    </div>
  );
}
