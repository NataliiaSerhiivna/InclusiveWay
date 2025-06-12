import React, { useState } from "react";
import "../../styles/Location.css";

export default function EditLocation() {
  const [form, setForm] = useState({
    name: "Кінотеатр Планета Кіно",
    address: "просп. Оболонський, 1Б, Київ",
    description: "Сучасний кінотеатр з доступною інфраструктурою.",
    accessibility: {
      ramp: false,
      elevator: false,
      rails: false,
      toilet: false,
      baby: false,
      wideDoors: false,
      helpButton: false,
      parking: false,
    },
    photo: null,
  });

  return (
    <div className="add-location-page">
      <div className="add-location-header">Заявка на редагування локації</div>
      <form className="add-location-form">
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
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label>Адреса</label>
          <textarea
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label>Опис</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label style={{ alignSelf: "flex-start" }}>Доступність</label>
          <div className="accessibility-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.ramp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      ramp: e.target.checked,
                    },
                  })
                }
              />{" "}
              Пандус
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.elevator}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      elevator: e.target.checked,
                    },
                  })
                }
              />{" "}
              Ліфт
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.rails}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      rails: e.target.checked,
                    },
                  })
                }
              />{" "}
              Рейки для візків
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.toilet}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      toilet: e.target.checked,
                    },
                  })
                }
              />{" "}
              Доступна вбиральня
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.baby}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      baby: e.target.checked,
                    },
                  })
                }
              />{" "}
              Стіл для пеленання
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.wideDoors}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      wideDoors: e.target.checked,
                    },
                  })
                }
              />{" "}
              Широкі двері
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.helpButton}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      helpButton: e.target.checked,
                    },
                  })
                }
              />{" "}
              Кнопка виклику допомоги
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.accessibility.parking}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accessibility: {
                      ...form.accessibility,
                      parking: e.target.checked,
                    },
                  })
                }
              />{" "}
              Парковка для людей з інвалідністю
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
