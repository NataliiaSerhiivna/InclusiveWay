import React, { useEffect, useState } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEditRequest,
  applyEditRequest,
  rejectEditRequest,
  getFeatures,
} from "../../api";

export default function AdminEditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [request, setRequest] = useState(null);
  const [location, setLocation] = useState(null);
  const [features, setFeatures] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    Promise.all([getEditRequest(id), getFeatures()])
      .then(([data, featuresList]) => {
        console.log("Отримані дані:", data);
        console.log("Отримані теги:", featuresList);

        if (!data || (!data.request && !data.location)) {
          throw new Error("Заявку не знайдено");
        }

        setRequest(data.request);
        setLocation(data.location);
        setFeatures(featuresList);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Помилка при завантаженні:", e);
        setError(e.message || "Помилка завантаження");
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const requestData = {
        id: Number(id),
        locationId: request.locationId,
        requestedBy: request.requestedBy,
        comment: request.comment || null,
        payload: request.payload,
      };
      await applyEditRequest(id, requestData);
      navigate("/admin-page", { state: { activeTab: "edit" } });
    } catch (e) {
      setError(e.message || "Помилка при схваленні");
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await rejectEditRequest(id);
      navigate("/admin-page");
    } catch (e) {
      setError(e.message || "Помилка при відхиленні");
    }
    setActionLoading(false);
  };

  const getFeatureName = (featureId) => {
    const feature = features.find((f) => f.id === featureId);
    return feature ? feature.name : `Тег ${featureId}`;
  };

  if (loading) return <div style={{ padding: 40 }}>Завантаження...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!request || !location)
    return <div style={{ padding: 40 }}>Заявку не знайдено</div>;

  const payload = request.payload || {};

  console.log("Rendering with:", { request, location, payload });

  return (
    <div className="add-location-page">
      <div className="add-location-header">Заявка на редагування локації</div>
      <div
        className="add-location-form"
        style={{ maxWidth: 900, marginTop: 32 }}
      >
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
              {location && location.photos && location.photos[0] && (
                <img
                  src={location.photos[0].imageUrl}
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
              )}
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Назва</label>
              <div>{location && location.name}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Адреса</label>
              <div>{location && location.address}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 18 }}>
              <label>Опис</label>
              <div>{location && location.description}</div>
            </div>
            <div className="form-row">
              <label>Доступність</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(location.features || []).map((featureId) => (
                  <span
                    key={featureId}
                    style={{
                      background: "#17ccff",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "5px 14px",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {getFeatureName(featureId)}
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
              {payload && payload.photosToAdd && payload.photosToAdd[0] && (
                <img
                  src={payload.photosToAdd[0].imageUrl}
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
              )}
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Назва</label>
              <div>{payload && payload.name}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>Адреса</label>
              <div>{payload && payload.address}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 18 }}>
              <label>Опис</label>
              <div>{payload && payload.description}</div>
            </div>
            <div className="form-row">
              <label>Доступність</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(payload.features || []).map((featureId) => (
                  <span
                    key={featureId}
                    style={{
                      background: "#17ccff",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "5px 14px",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {getFeatureName(featureId)}
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
            cursor: actionLoading ? "not-allowed" : "pointer",
            opacity: actionLoading ? 0.7 : 1,
            transition: "background 0.2s",
          }}
          onClick={handleApprove}
          disabled={actionLoading}
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
            cursor: actionLoading ? "not-allowed" : "pointer",
            opacity: actionLoading ? 0.7 : 1,
            transition: "background 0.2s",
          }}
          onClick={handleReject}
          disabled={actionLoading}
        >
          Відхилити
        </button>
      </div>
    </div>
  );
}
