import React, { useState, useEffect } from "react";
import "../../styles/Location.css";
import { getEditRequest, getLocation, addEditRequest, getFeatures } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

export default function EditLocation() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
    features: [],
    photo: null,
  });
  const [allFeatures, setAllFeatures] = useState([]);
  const [photoURL, setPhotoURL] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [locationLoaded, setLocationLoaded] = useState(false);

  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    getFeatures().then(setAllFeatures).catch(() => setAllFeatures([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    getLocation(id)
      .then((data) => {
        setForm((f) => ({
          ...f,
          name: data.name || "",
          address: data.address || "",
          description: data.description || "",
          features: data.features || [],
        }));
        if (data.photos && data.photos.length > 0) {
          const photoObj = data.photos[0];
          setPhotoURL(
            photoObj.imageUrl || photoObj.imageUrl || photoObj.image_url || ""
          );
          setPhotoDescription(photoObj.description || "");
        }
        setLocationLoaded(true);
      })
      .catch(() => setLocationLoaded(true));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getEditRequest(id)
      .then((data) => {
        const payload = data.payload;
        setForm((f) => ({
          ...f,
          name: payload.name || f.name,
          address: payload.address || f.address,
          description: payload.description || f.description,
          features: payload.features || f.features,
        }));
        if (payload.photosToAdd && payload.photosToAdd.length > 0) {
          setPhotoURL(payload.photosToAdd[0].imageUrl || photoURL);
          setPhotoDescription(
            payload.photosToAdd[0].description || photoDescription
          );
        }
      })
      .catch(() => {});
  }, [id, locationLoaded]);

  console.log(form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address) {
      alert("Назва та адреса не можуть бути порожніми");
      return;
    }
    if (!form.description || form.description.length < 10) {
      alert("Опис має містити не менше 10 символів");
      return;
    }
    if (form.features.length === 0) {
      alert("Оберіть хоча б одну опцію доступності");
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
        comment: "Заявка на редагування локації",
        payload,
      });
      navigate(-1);
    } catch (e) {
      if (e && e.message) {
        alert(e.message);
      } else if (typeof e === "object") {
        alert(JSON.stringify(e, null, 2));
      } else {
        alert(e || "Помилка при створенні заявки");
      }
    }
  };

  const handleFeatureChange = (featureId) => {
    setForm(prevForm => {
      const features = prevForm.features.includes(featureId)
        ? prevForm.features.filter(id => id !== featureId)
        : [...prevForm.features, featureId];
      return { ...prevForm, features };
    });
  };

  return (
    <div className="add-location-page">
      <div className="add-location-header">Заявка на редагування локації</div>
      <form className="add-location-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Фото</label>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <input
              type="text"
              placeholder=""
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              style={{ width: "97%", marginBottom: 8 }}
            />
            <textarea
              placeholder=""
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
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
            {allFeatures.map(feature => (
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
