import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import { getLocation, editLocation, getFeatures } from "../../api";

export default function AdminLocationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    photo: "",
    photoDescription: "",
    name: "",
    address: "",
    description: "",
    accessibility: [],
  });
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([getLocation(id), getFeatures()])
      .then(([data, featuresData]) => {
        setAllFeatures(featuresData);
        const accessibilityNames = (data.features || [])
          .map((featureId) => {
            const feature = featuresData.find((f) => f.id === featureId);
            return feature ? feature.name : null;
          })
          .filter(Boolean);

        setForm({
          photo:
            (data.photos &&
              data.photos[0] &&
              (data.photos[0].imageUrl ||
                data.photos[0].imageUrl ||
                data.photos[0].image_url ||
                data.photos[0].url)) ||
            "",
          photoDescription:
            (data.photos && data.photos[0] && data.photos[0].description) || "",
          name: data.name || "",
          address: data.address || "",
          description: data.description || "",
          accessibility: accessibilityNames,
        });
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Помилка завантаження локації");
        setLoading(false);
      });
  }, [id]);

  const handleTagToggle = (tag) => {
    setForm((f) =>
      f.accessibility.includes(tag)
        ? { ...f, accessibility: f.accessibility.filter((t) => t !== tag) }
        : { ...f, accessibility: [...f.accessibility, tag] }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const features = allFeatures
        .map((feature) =>
          form.accessibility.includes(feature.name) ? feature.id : null
        )
        .filter((v) => v !== null);
      const photos = form.photo
        ? [
            {
              imageUrl: form.photo,
              description: form.photoDescription,
              uploadedAt: new Date().toISOString(),
            },
          ]
        : [];
      await editLocation(id, {
        name: form.name,
        address: form.address,
        description: form.description,
        features,
        photos,
      });
      navigate(-1);
    } catch (e) {
      setError(e.message || "Помилка збереження");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Завантаження...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div className="add-location-page">
      <div className="add-location-header">Редагування локації</div>
      <form
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
        onSubmit={handleSubmit}
      >
        <div className="form-row">
          <label>Фото</label>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <input
              type="text"
              placeholder="Вставте посилання на фото"
              value={form.photo}
              onChange={(e) =>
                setForm((f) => ({ ...f, photo: e.target.value }))
              }
              style={{ width: "97%", marginBottom: 8 }}
            />
            <textarea
              placeholder="Опис фото"
              value={form.photoDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, photoDescription: e.target.value }))
              }
              rows={2}
              style={{ width: "95%" }}
            />
          </div>
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
            {allFeatures.map((feature) => (
              <label key={feature.id}>
                <input
                  type="checkbox"
                  checked={form.accessibility.includes(feature.name)}
                  onChange={() => handleTagToggle(feature.name)}
                />{" "}
                {feature.name}
              </label>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
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
