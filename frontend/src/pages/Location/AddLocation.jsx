import React, { useState, useEffect } from "react";
import "../../styles/Location.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { addLocation, getFeatures } from "../../api";
import { useNavigate } from "react-router-dom";

function LocationPickerMap({ value, onChange }) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return value ? <Marker position={value} /> : null;
}

export default function AddLocation() {
  const [showMap, setShowMap] = useState(false);
  const [marker, setMarker] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
    features: [],
    photos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [featuresList, setFeaturesList] = useState([]);
  const [photoURL, setPhotoURL] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const navigate = useNavigate();

  const handleCheckbox = (featureId) => {
    setForm((f) => ({
      ...f,
      features: f.features.includes(featureId)
        ? f.features.filter((id) => id !== featureId)
        : [...f.features, featureId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    if (!photoURL) {
      setError("Введіть посилання на фото");
      setLoading(false);
      return;
    }
    if (!photoDescription || photoDescription.length < 10) {
      setError("Опис фото має містити не менше 10 символів");
      setLoading(false);
      return;
    }
    const userSession = localStorage.getItem("inclusive-way-google-jwt");
    let userId = null;
    try {
      userId = JSON.parse(userSession)?.id;
    } catch {}
    try {
      await addLocation({
        name: form.name,
        address: form.address,
        latitude: marker ? marker[0] : null,
        longitude: marker ? marker[1] : null,
        description: form.description,
        approved: false,
        verified: false,
        createdAt: new Date().toISOString(),
        features: form.features,
        photos: [
          {
            imageURL: photoURL,
            description: photoDescription,
            uploadedAt: new Date().toISOString(),
          },
        ],
        createdBy: userId,
      });
      setSuccess(true);
      setForm({
        name: "",
        address: "",
        description: "",
        features: [],
        photos: [],
      });
      setMarker(null);
      setPhotoURL("");
      setPhotoDescription("");
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeatures()
      .then(setFeaturesList)
      .catch(() => setFeaturesList([]));
  }, []);

  return (
    <div
      className="add-location-page"
      style={{ overflowY: "auto", maxHeight: "100vh" }}
    >
      <div className="add-location-header">Заявка на додавання локації</div>
      <form className="add-location-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Фото</label>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <input
              type="text"
              placeholder="Вставте посилання на фото"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              style={{ width: "97%", marginBottom: 8 }}
            />
            <textarea
              placeholder="Опис фото"
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              rows={2}
              style={{ width: "95%" }}
            />
          </div>
        </div>
        <div className="form-row">
          <label>Назва</label>
          <textarea
            rows={2}
            placeholder="Введіть назву"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="form-row">
          <label>Адреса</label>
          <textarea
            rows={2}
            placeholder="Введіть адресу"
            value={form.address}
            onChange={(e) =>
              setForm((f) => ({ ...f, address: e.target.value }))
            }
          />
        </div>
        <div className="form-row">
          <label>Опис</label>
          <textarea
            rows={2}
            placeholder="Введіть опис"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="form-row">
          <label>Розташування</label>
          <button
            type="button"
            className="add-location-btn"
            onClick={() => setShowMap((v) => !v)}
          >
            {showMap ? "Сховати" : "Додати"}
          </button>
        </div>
        {showMap && (
          <div style={{ margin: "18px 0 28px 0" }}>
            <MapContainer
              center={marker || [50.4501, 30.5234]}
              zoom={13}
              style={{
                width: "100%",
                height: 260,
                borderRadius: 12,
                boxShadow: "0 2px 8px #0001",
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPickerMap value={marker} onChange={setMarker} />
            </MapContainer>
            <div style={{ marginTop: 8, color: "#334059", fontSize: 15 }}>
              {marker
                ? `Вибрано: ${marker[0].toFixed(5)}, ${marker[1].toFixed(5)}`
                : "Клікніть по мапі, щоб поставити мітку"}
            </div>
          </div>
        )}
        <div className="form-row">
          <label style={{ alignSelf: "flex-start" }}>Доступність</label>
          <div className="accessibility-checkboxes">
            {featuresList.map((f) => (
              <label key={f.id}>
                <input
                  type="checkbox"
                  checked={form.features.includes(f.id)}
                  onChange={() => handleCheckbox(f.id)}
                />{" "}
                {f.name}
              </label>
            ))}
          </div>
        </div>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 10 }}>
            Локацію додано!
          </div>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Скасувати
          </button>
          <button type="submit" className="submit-btn">
            Надіслати
          </button>
        </div>
      </form>
    </div>
  );
}
