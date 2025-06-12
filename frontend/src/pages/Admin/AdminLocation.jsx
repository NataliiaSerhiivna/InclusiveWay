import React from "react";
import "../../styles/Admin.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const locations = [
  {
    id: 1,
    photo:
      "https://smartinfo.com.ua/crop/880x496/storage/photos/r/e/rest.Musafir.1.jpg",
    name: "Musafir",
    address: "вул. Богдана Хмельницького, 3Б, Київ",
    description:
      "Ресторан східної кухні з обмеженим доступом для інклюзивних відвідувачів.",
    accessibility: ["Доступна вбиральня"],
    comments: [
      {
        author: "Олена",
        text: "Дуже смачна кухня, але мало зручностей для інклюзивних людей.",
      },
      { author: "Ігор", text: "Потрібно більше пандусів і ширших дверей." },
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

export default function AdminLocation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = locations.find((l) => l.id === Number(id));

  if (!loc) return <div style={{ padding: 40 }}>Локацію не знайдено</div>;

  return (
    <div className="add-location-page">
      <div
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
      >
        <div className="form-row" style={{ justifyContent: "center" }}>
          <img
            src={loc.photo}
            alt={loc.name}
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
        </div>
        <div className="form-row" style={{ marginBottom: 10 }}>
          <label>Назва</label>
          <div>{loc.name}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 10 }}>
          <label>Адреса</label>
          <div>{loc.address}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 18 }}>
          <label>Опис</label>
          <div>{loc.description}</div>
        </div>
        <div className="form-row" style={{ marginBottom: 24 }}>
          <label>Доступність</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {loc.accessibility.map((tag) => (
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
            {loc.comments && loc.comments.length > 0 ? (
              loc.comments.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f7fbff",
                    borderRadius: 10,
                    padding: "10px 18px",
                    boxShadow: "0 1px 4px #0001",
                  }}
                >
                  <b>{c.author}:</b> <span>{c.text}</span>
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
            onClick={() => navigate(`/admin-location/${loc.id}/edit`)}
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
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
}
