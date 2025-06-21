// Сторінка для подання заявки на додавання нової локації

import React, { useState, useEffect } from "react";
import "../../styles/Location.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { addLocation, getFeatures } from "../../api";
import { useNavigate } from "react-router-dom";

// Допоміжний компонент для карти, що обробляє кліки для встановлення маркера
function LocationPickerMap({ value, onChange }) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return value ? <Marker position={value} /> : null;
}

export default function AddLocation({ language = "ua" }) {
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

  // Об'єкт з перекладами для інтернаціоналізації
  const translations = {
    ua: {
      title: "Заявка на додавання локації",
      photoLabel: "Фото",
      photoUrlPlaceholder: "Вставте посилання на фото",
      photoDescriptionPlaceholder: "Опис фото",
      nameLabel: "Назва",
      namePlaceholder: "Введіть назву",
      addressLabel: "Адреса",
      addressPlaceholder: "Введіть адресу",
      descriptionLabel: "Опис",
      descriptionPlaceholder: "Введіть опис",
      locationLabel: "Розташування",
      hideMap: "Сховати",
      addMap: "Додати",
      locationSelected: "Вибрано:",
      clickToSetMarker: "Клікніть по мапі, щоб поставити мітку",
      accessibilityLabel: "Доступність",
      cancel: "Скасувати",
      submit: "Надіслати",
      successMessage: "Локацію успішно додано!",
      errorPhotoUrl: "Будь ласка, введіть посилання на фото",
      errorPhotoDescription: "Будь ласка, введіть опис фото",
      errorName: "Будь ласка, введіть назву",
      errorAddress: "Будь ласка, введіть адресу",
      errorDescription: "Будь ласка, введіть опис",
      errorLocation: "Будь ласка, додайте розташування на мапі",
      errorFeatures: "Будь ласка, оберіть хоча б один тег доступності",
    },
    en: {
      title: "Add Location Request",
      photoLabel: "Photo",
      photoUrlPlaceholder: "Insert photo link",
      photoDescriptionPlaceholder: "Photo description",
      nameLabel: "Name",
      namePlaceholder: "Enter name",
      addressLabel: "Address",
      addressPlaceholder: "Enter address",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Enter description",
      locationLabel: "Location",
      hideMap: "Hide",
      addMap: "Add",
      locationSelected: "Selected:",
      clickToSetMarker: "Click on the map to set a marker",
      accessibilityLabel: "Accessibility",
      cancel: "Cancel",
      submit: "Submit",
      successMessage: "Location added successfully!",
      errorPhotoUrl: "Please enter a photo link",
      errorPhotoDescription: "Please enter a photo description",
      errorName: "Please enter a name",
      errorAddress: "Please enter an address",
      errorDescription: "Please enter a description",
      errorLocation: "Please add a location on the map",
      errorFeatures: "Please select at least one accessibility tag",
    },
  };

  const t = translations[language];

  const handleCheckbox = (featureId) => {
    setForm((f) => ({
      ...f,
      features: f.features.includes(featureId)
        ? f.features.filter((id) => id !== featureId)
        : [...f.features, featureId],
    }));
  };

  // Обробник відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Валідація полів форми
    if (!photoURL.trim()) {
      setError(t.errorPhotoUrl);
      setLoading(false);
      return;
    }
    if (!photoDescription.trim()) {
      setError(t.errorPhotoDescription);
      setLoading(false);
      return;
    }
    if (!form.name.trim()) {
      setError(t.errorName);
      setLoading(false);
      return;
    }
    if (!form.address.trim()) {
      setError(t.errorAddress);
      setLoading(false);
      return;
    }
    if (!form.description.trim()) {
      setError(t.errorDescription);
      setLoading(false);
      return;
    }
    if (!marker) {
      setError(t.errorLocation);
      setLoading(false);
      return;
    }
    if (form.features.length === 0) {
      setError(t.errorFeatures);
      setLoading(false);
      return;
    }

    const userSession = localStorage.getItem("inclusive-way-google-jwt");
    let userId = null;
    try {
      userId = JSON.parse(userSession)?.id;
    } catch {}
    try {
      // Виклик API для додавання нової локації
      const resp = await addLocation({
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
            imageUrl: photoURL,
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
      console.log("Here, catch");
      console.log(e);

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
      <div className="add-location-header">{t.title}</div>
      {/* Форма для додавання нової локації */}
      <form className="add-location-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>{t.photoLabel}</label>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <input
              type="text"
              placeholder={t.photoUrlPlaceholder}
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              style={{ width: "97%", marginBottom: 8 }}
            />
            <textarea
              placeholder={t.photoDescriptionPlaceholder}
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              rows={2}
              style={{ width: "95%" }}
            />
          </div>
        </div>
        <div className="form-row">
          <label>{t.nameLabel}</label>
          <textarea
            rows={2}
            placeholder={t.namePlaceholder}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="form-row">
          <label>{t.addressLabel}</label>
          <textarea
            rows={2}
            placeholder={t.addressPlaceholder}
            value={form.address}
            onChange={(e) =>
              setForm((f) => ({ ...f, address: e.target.value }))
            }
          />
        </div>
        <div className="form-row">
          <label>{t.descriptionLabel}</label>
          <textarea
            rows={2}
            placeholder={t.descriptionPlaceholder}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        {/* Карта для вибору розташування */}
        <div className="form-row">
          <label>{t.locationLabel}</label>
          <button
            type="button"
            className="add-location-btn"
            onClick={() => setShowMap((v) => !v)}
          >
            {showMap ? t.hideMap : t.addMap}
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
                ? `${t.locationSelected} ${marker[0].toFixed(
                    5
                  )}, ${marker[1].toFixed(5)}`
                : t.clickToSetMarker}
            </div>
          </div>
        )}
        <div className="form-row">
          <label style={{ alignSelf: "flex-start" }}>
            {t.accessibilityLabel}
          </label>
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
            {t.successMessage}
          </div>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            {t.cancel}
          </button>
          <button type="submit" className="submit-btn">
            {t.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
