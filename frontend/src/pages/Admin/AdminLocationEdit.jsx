import React, { useState } from "react";
import "../../styles/Admin.css";
import { useParams } from "react-router-dom";

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
  },
];

export default function AdminLocationEdit() {
  const { id } = useParams();
  const loc = locations.find((l) => l.id === Number(id));
  const [form, setForm] = useState(
    loc
      ? {
          photo: loc.photo,
          name: loc.name,
          address: loc.address,
          description: loc.description,
          accessibility: loc.accessibility,
        }
      : {
          photo: "",
          name: "",
          address: "",
          description: "",
          accessibility: [],
        }
  );

  if (!loc) return <div style={{ padding: 40 }}>Локацію не знайдено</div>;

  const handleTagToggle = (tag) => {
    setForm((f) =>
      f.accessibility.includes(tag)
        ? { ...f, accessibility: f.accessibility.filter((t) => t !== tag) }
        : { ...f, accessibility: [...f.accessibility, tag] }
    );
  };

  return (
    <div className="add-location-page">
      <div className="add-location-header">Редагування локації</div>
      <form
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
      >
        <div className="form-row">
          <label>Фото</label>
          <button type="button" className="add-file-btn">
            Змінити файл
          </button>
        </div>
        <div className="form-row">
          <label>Назва</label>
          <textarea
            rows={2}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="form-row">
          <label>Адреса</label>
          <textarea
            rows={2}
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
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="form-row">
          <label style={{ alignSelf: "flex-start" }}>Доступність</label>
          <div className="accessibility-checkboxes">
            {allTags.map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={form.accessibility.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />{" "}
                {tag}
              </label>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn">
            Скасувати
          </button>
          <button type="submit" className="submit-btn">
            Зберегти
          </button>
        </div>
      </form>
    </div>
  );
}
