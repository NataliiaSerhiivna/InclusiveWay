import React, { useState, useEffect } from "react";
import "../../styles/Location.css";
import {
  getEditRequest,
  getLocation,
  addEditRequest,
  getFeatures,
} from "../../api";
import { useLocation, useNavigate } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

export default function EditLocation({ language = "ua" }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
    features: [],
    photo: null,
  });
  const [initialData, setInitialData] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [photoURL, setPhotoURL] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [locationLoaded, setLocationLoaded] = useState(false);

  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const translations = {
    ua: {
      title: "Заявка на редагування локації",
      photoLabel: "Фото",
      photoUrlPlaceholder: "Вставте посилання на фото",
      photoDescriptionPlaceholder: "Опис фото",
      nameLabel: "Назва",
      addressLabel: "Адреса",
      descriptionLabel: "Опис",
      accessibilityLabel: "Доступність",
      cancel: "Скасувати",
      submit: "Надіслати",
      alertNameAddress: "Назва та адреса не можуть бути порожніми",
      alertDescription: "Опис має містити не менше 10 символів",
      alertFeatures: "Оберіть хоча б одну опцію доступності",
      alertError: "Помилка при створенні заявки",
      commentDefault: "Заявка на редагування локації",
      noChanges: "Ви не внесли жодних змін",
    },
    en: {
      title: "Edit Location Request",
      photoLabel: "Photo",
      photoUrlPlaceholder: "Insert photo link",
      photoDescriptionPlaceholder: "Photo description",
      nameLabel: "Name",
      addressLabel: "Address",
      descriptionLabel: "Description",
      accessibilityLabel: "Accessibility",
      cancel: "Cancel",
      submit: "Submit",
      alertNameAddress: "Name and address cannot be empty",
      alertDescription: "Description must be at least 10 characters long",
      alertFeatures: "Please select at least one accessibility option",
      alertError: "Error creating request",
      commentDefault: "Location edit request",
      noChanges: "You haven't made any changes",
    },
  };

  const t = translations[language];

  useEffect(() => {
    getFeatures()
      .then(setAllFeatures)
      .catch(() => setAllFeatures([]));
  }, []);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const locationData = await getLocation(id);
        let pendingRequestPayload = {};
        try {
          const editRequest = await getEditRequest(id);
          pendingRequestPayload = editRequest.payload;
        } catch (e) {}

        const currentPhoto =
          locationData.photos && locationData.photos.length > 0
            ? locationData.photos[0]
            : {};
        const photoFromRequest =
          pendingRequestPayload.photosToAdd &&
          pendingRequestPayload.photosToAdd.length > 0
            ? pendingRequestPayload.photosToAdd[0]
            : {};

        const finalData = {
          name: pendingRequestPayload.name || locationData.name || "",
          address: pendingRequestPayload.address || locationData.address || "",
          description:
            pendingRequestPayload.description || locationData.description || "",
          features:
            pendingRequestPayload.features || locationData.features || [],
          photoURL:
            photoFromRequest.imageUrl ||
            currentPhoto.imageUrl ||
            currentPhoto.image_url ||
            "",
          photoDescription:
            photoFromRequest.description || currentPhoto.description || "",
        };

        setForm({
          name: finalData.name,
          address: finalData.address,
          description: finalData.description,
          features: finalData.features,
        });
        setPhotoURL(finalData.photoURL);
        setPhotoDescription(finalData.photoDescription);
        setInitialData(finalData);
        setLocationLoaded(true);
      } catch (err) {
        console.error("Failed to load location data:", err);
        setLocationLoaded(true);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (initialData) {
      const arraysAreEqual = (a, b) => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
      };

      const noChanges =
        initialData.name === form.name &&
        initialData.address === form.address &&
        initialData.description === form.description &&
        arraysAreEqual(initialData.features, form.features) &&
        initialData.photoURL === photoURL &&
        initialData.photoDescription === photoDescription;

      if (noChanges) {
        alert(t.noChanges);
        return;
      }
    }

    if (!form.name || !form.address) {
      alert(t.alertNameAddress);
      return;
    }
    if (!form.description || form.description.length < 10) {
      alert(t.alertDescription);
      return;
    }
    if (form.features.length === 0) {
      alert(t.alertFeatures);
      return;
    }
    const photosToAdd = photoURL
      ? [
          {
            imageUrl: photoURL,
            description: photoDescription,
            uploadedAt: new Date().toISOString(),
          },
        ]
      : [];
    const payload = {
      name: form.name,
      address: form.address,
      features: form.features,
      description: form.description,
      photosToAdd,
      photosToDelete: [],
    };
    try {
      await addEditRequest({
        locationId: Number(id),
        comment: t.commentDefault,
        payload,
      });
      navigate(-1);
    } catch (e) {
      if (e && e.message) {
        alert(e.message);
      } else if (typeof e === "object") {
        alert(JSON.stringify(e, null, 2));
      } else {
        alert(e || t.alertError);
      }
    }
  };

  const handleFeatureChange = (featureId) => {
    setForm((prevForm) => {
      const features = prevForm.features.includes(featureId)
        ? prevForm.features.filter((id) => id !== featureId)
        : [...prevForm.features, featureId];
      return { ...prevForm, features };
    });
  };

  return (
    <div className="add-location-page">
      <div className="add-location-header">{t.title}</div>
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
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label>{t.addressLabel}</label>
          <textarea
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label>{t.descriptionLabel}</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label style={{ alignSelf: "flex-start" }}>
            {t.accessibilityLabel}
          </label>
          <div className="accessibility-checkboxes">
            {allFeatures.map((feature) => (
              <label key={feature.id}>
                <input
                  type="checkbox"
                  checked={form.features.includes(feature.id)}
                  onChange={() => handleFeatureChange(feature.id)}
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
