import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import { getLocation, editLocation, getFeatures } from "../../api";

export default function AdminLocationEdit({ language = "ua" }) {
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
  const [initialForm, setInitialForm] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const translations = {
    ua: {
      pageTitle: "Редагування локації",
      loading: "Завантаження...",
      loadError: "Помилка завантаження локації",
      saveError: "Помилка збереження",
      photoLabel: "Фото",
      photoUrlPlaceholder: "Вставте посилання на фото",
      photoDescriptionPlaceholder: "Опис фото",
      nameLabel: "Назва",
      addressLabel: "Адреса",
      descriptionLabel: "Опис",
      accessibilityLabel: "Доступність",
      cancelButton: "Скасувати",
      saveButton: "Зберегти",
      noChanges: "Ви не внесли жодних змін",
    },
    en: {
      pageTitle: "Edit Location",
      loading: "Loading...",
      loadError: "Error loading location",
      saveError: "Error saving",
      photoLabel: "Photo",
      photoUrlPlaceholder: "Insert photo link",
      photoDescriptionPlaceholder: "Photo description",
      nameLabel: "Name",
      addressLabel: "Address",
      descriptionLabel: "Description",
      accessibilityLabel: "Accessibility",
      cancelButton: "Cancel",
      saveButton: "Save",
      noChanges: "You have not made any changes",
    },
  };

  const t = translations[language];

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

        const loadedForm = {
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
        };
        setForm(loadedForm);
        setInitialForm(loadedForm);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || t.loadError);
        setLoading(false);
      });
  }, [id, t.loadError]);

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

    if (initialForm) {
      const arraysAreEqual = (a, b) => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
      };

      const noChanges =
        initialForm.photo === form.photo &&
        initialForm.photoDescription === form.photoDescription &&
        initialForm.name === form.name &&
        initialForm.address === form.address &&
        initialForm.description === form.description &&
        arraysAreEqual(initialForm.accessibility, form.accessibility);

      if (noChanges) {
        setError(t.noChanges);
        return;
      }
    }

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
      setError(e.message || t.saveError);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>{t.loading}</div>;
  if (error && !initialForm)
    return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div className="add-location-page">
      <div className="add-location-header">{t.pageTitle}</div>
      <form
        className="add-location-form"
        style={{ maxWidth: 700, marginTop: 32 }}
        onSubmit={handleSubmit}
      >
        <div className="form-row">
          <label>{t.photoLabel}</label>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <input
              type="text"
              placeholder={t.photoUrlPlaceholder}
              value={form.photo}
              onChange={(e) =>
                setForm((f) => ({ ...f, photo: e.target.value }))
              }
              style={{ width: "97%", marginBottom: 8 }}
            />
            <textarea
              placeholder={t.photoDescriptionPlaceholder}
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
          <label>{t.nameLabel}</label>
          <textarea
            rows={2}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="form-row">
          <label>{t.addressLabel}</label>
          <textarea
            rows={2}
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
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="form-row">
          <label style={{ alignSelf: "flex-start" }}>{t.accessibilityLabel}</label>
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
        {error && (
          <div style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
            {error}
          </div>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            {t.cancelButton}
          </button>
          <button type="submit" className="submit-btn">
            {t.saveButton}
          </button>
        </div>
      </form>
    </div>
  );
}
