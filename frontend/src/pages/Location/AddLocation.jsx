import React, { useState } from "react";
import "../../styles/Location.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

  return (
    <div className="add-location-page">
      <div className="add-location-header">Заявка на додавання локації</div>
      <form className="add-location-form">
        <div className="form-row">
          <label>Фото</label>
          <button type="button" className="add-file-btn">
            Додати файл
          </button>
        </div>
        <div className="form-row">
          <label>Назва</label>
          <textarea rows={2} placeholder="Введіть назву" />
        </div>
        <div className="form-row">
          <label>Адреса</label>
          <textarea rows={2} placeholder="Введіть адресу" />
        </div>
        <div className="form-row">
          <label>Опис</label>
          <textarea rows={2} placeholder="Введіть опис" />
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
            <label>
              <input type="checkbox" /> Пандус
            </label>
            <label>
              <input type="checkbox" /> Ліфт
            </label>
            <label>
              <input type="checkbox" /> Рейки для візків
            </label>
            <label>
              <input type="checkbox" /> Доступна вбиральня
            </label>
            <label>
              <input type="checkbox" /> Стіл для пеленання
            </label>
            <label>
              <input type="checkbox" /> Широкі двері
            </label>
            <label>
              <input type="checkbox" /> Кнопка виклику допомоги
            </label>
            <label>
              <input type="checkbox" /> Парковка для людей з інвалідністю
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn">
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
