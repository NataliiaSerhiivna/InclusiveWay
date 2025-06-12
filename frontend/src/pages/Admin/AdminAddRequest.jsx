import React from "react";
import "../../styles/Admin.css";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const requests = [
  {
    id: 1,
    author: { name: "Олена Ковальчук", email: "olena.kovalchuk@gmail.com" },
    photo:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c7/ff/14/the-atmosphere-light.jpg?w=900&h=500&s=1",
    name: "Кавʼярня Lagom coffee",
    address: "вул. Січових Стрільців, 57, Київ",
    lat: 50.4587,
    lng: 30.5081,
    description: "Затишна кавʼярня зі зручностями для всіх.",
    accessibility: ["Пандус", "Доступна вбиральня"],
  },
  {
    id: 2,
    author: { name: "Іван Петренко", email: "ivan.petrenko@gmail.com" },
    photo: "https://rau.ua/wp-content/uploads/2021/12/dji_0935-1.jpg",
    name: "ТРЦ Respublika Park",
    address: "Кільцева дорога, 1, Київ",
    lat: 50.4017,
    lng: 30.3554,
    description:
      "Великий торговий центр з усіма зручностями для людей з інвалідністю.",
    accessibility: [
      "Пандус",
      "Ліфт",
      "Доступна вбиральня",
      "Парковка для людей з інвалідністю",
    ],
  },
];

const allTags = [
  "Пандус",
  "Ліфт",
  "Рейки для візків",
  "Доступна вбиральня",
  "Стіл для пеленання",
  "Широкі двері",
  "Кнопка виклику допомоги",
  "Парковка для людей з інвалідністю",
];

export default function AdminAddRequest() {
  const { id } = useParams();
  const req = requests.find((r) => r.id === Number(id));

  if (!req) return <div style={{ padding: 40 }}>Заявку не знайдено</div>;

  return (
    <div className="add-location-page">
      <div className="add-location-header">Заявка на додавання локації</div>
      <div
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
      >
        <div className="form-row">
          <label>Автор</label>
          <div>
            {req.author.name}{" "}
            <span style={{ fontSize: 15, marginLeft: 8 }}>
              {req.author.email}
            </span>
          </div>
        </div>
        <div className="form-row">
          <label>Фото</label>
          <img
            src={req.photo}
            alt={req.name}
            style={{
              width: 180,
              height: 120,
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
            }}
          />
        </div>
        <div className="form-row">
          <label>Назва</label>
          <div>{req.name}</div>
        </div>
        <div className="form-row">
          <label>Адреса</label>
          <div>{req.address}</div>
        </div>
        <div style={{ margin: "18px 0 28px 0" }}>
          <MapContainer
            center={[req.lat, req.lng]}
            zoom={16}
            style={{
              width: "100%",
              height: 220,
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[req.lat, req.lng]} />
          </MapContainer>
        </div>
        <div className="form-row">
          <label>Опис</label>
          <div>{req.description}</div>
        </div>
        <div className="form-row">
          <label>Доступність</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {req.accessibility.map((tag) => (
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
            ))}
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
          style={{
            background: "#00c853",
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
        >
          Схвалити
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
        >
          Відхилити
        </button>
      </div>
    </div>
  );
}
