import React from "react";
import "../../styles/Admin.css";
import { useParams } from "react-router-dom";

const currentLocation = {
  id: 1,
  photo:
    "https://smartinfo.com.ua/crop/880x496/storage/photos/r/e/rest.Musafir.1.jpg",
  name: "Musafir",
  address: "вул. Богдана Хмельницького, 3Б, Київ",
  description:
    "Ресторан східної кухні з обмеженим доступом для інклюзивних відвідувачів.",
  accessibility: ["Доступна вбиральня"],
};

const requests = [
  {
    id: 1,
    author: { name: "Іван Петренко", email: "ivan.petrenko@gmail.com" },
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_mN1wZE0_yZztORpHC7KB9io7-M8ZLIV45-PCvcVGijA7-eH7PIkgABZm2TvFGUFo8A&usqp=CAU",
    name: "Musafir",
    address: "вул. Богдана Хмельницького, 3Б, Київ",
    description: "Сучасний ресторан з доступною інфраструктурою.",
    accessibility: ["Пандус", "Доступна вбиральня", "Широкі двері"],
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

export default function AdminEditRequest() {
  const { id } = useParams();
  const req = requests.find((r) => r.id === Number(id));

  if (!req) return <div style={{ padding: 40 }}>Заявку не знайдено</div>;

  return (
    <div className="add-location-page">
      <div className="add-location-header">Заявка на редагування локації</div>
      <div
        className="add-location-form"
        style={{ maxWidth: 900, marginTop: 32 }}
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
        <div
          style={{
            display: "flex",
            gap: 40,
            width: "100%",
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 12,
                color: "#334059",
              }}
            >
              Було:
            </div>
            <div className="form-row">
              <label>Фото</label>
              <img
                src={currentLocation.photo}
                alt="Було"
                style={{
                  width: 140,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 10,
                  boxShadow: "0 2px 8px #0001",
                  marginBottom: 18,
                }}
              />
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Назва</label>
              <div>{currentLocation.name}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Адреса</label>
              <div>{currentLocation.address}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 18 }}>
              <label>Опис</label>
              <div>{currentLocation.description}</div>
            </div>
            <div style={{ height: 24 }}></div>
            <div className="form-row">
              <label>Доступність</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {currentLocation.accessibility.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#17ccff",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "5px 14px",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 12,
                color: "#334059",
              }}
            >
              Пропозиція:
            </div>
            <div className="form-row">
              <label>Фото</label>
              <img
                src={req.photo}
                alt="Стало"
                style={{
                  width: 140,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 10,
                  boxShadow: "0 2px 8px #0001",
                  marginBottom: 18,
                }}
              />
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Назва</label>
              <div>{req.name}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Адреса</label>
              <div>{req.address}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 18 }}>
              <label>Опис</label>
              <div>{req.description}</div>
            </div>
            <div style={{ height: 24 }}></div>
            <div className="form-row">
              <label>Доступність</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {req.accessibility.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#17ccff",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "5px 14px",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
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
