// Сторінка адміністратора для перегляду, схвалення або відхилення заявок на редагування існуючих локацій

import React, { useEffect, useState } from "react";
import "../../styles/Admin.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEditRequest,
  applyEditRequest,
  rejectEditRequest,
  getFeatures,
} from "../../api";

export default function AdminEditRequest({ language = "ua" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [request, setRequest] = useState(null);
  const [location, setLocation] = useState(null);
  const [features, setFeatures] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Об'єкт з перекладами для інтернаціоналізації
  const translations = {
    ua: {
      pageTitle: "Заявка на редагування локації",
      requestNotFound: "Заявку не знайдено",
      loadError: "Помилка завантаження",
      approveError: "Помилка при схваленні",
      rejectError: "Помилка при відхиленні",
      featureTag: "Тег",
      loading: "Завантаження...",
      before: "Було:",
      photo: "Фото",
      name: "Назва",
      address: "Адреса",
      description: "Опис",
      accessibility: "Доступність",
      proposal: "Пропозиція:",
      approve: "Схвалити",
      reject: "Відхилити",
    },
    en: {
      pageTitle: "Edit Location Request",
      requestNotFound: "Request not found",
      loadError: "Loading error",
      approveError: "Error approving",
      rejectError: "Error rejecting",
      featureTag: "Tag",
      loading: "Loading...",
      before: "Before:",
      photo: "Photo",
      name: "Name",
      address: "Address",
      description: "Description",
      accessibility: "Accessibility",
      proposal: "Proposal:",
      approve: "Approve",
      reject: "Reject",
    },
  };

  const t = translations[language];

  // Завантаження даних заявки
  useEffect(() => {
    Promise.all([getEditRequest(id), getFeatures()])
      .then(([data, featuresList]) => {
        console.log("Отримані дані:", data);
        console.log("Отримані теги:", featuresList);

        if (!data || (!data.request && !data.location)) {
          throw new Error(t.requestNotFound);
        }

        setRequest(data.request);
        setLocation(data.location);
        setFeatures(featuresList);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Помилка при завантаженні:", e);
        setError(e.message || t.loadError);
        setLoading(false);
      });
  }, [id, t.loadError, t.requestNotFound]);

  // Обробник для схвалення заявки
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
      setError(e.message || t.approveError);
    }
    setActionLoading(false);
  };

  // Обробник для відхилення заявки
  const handleReject = async () => {
    setActionLoading(true);
    try {
      await rejectEditRequest(id);
      navigate("/admin-page");
    } catch (e) {
      setError(e.message || t.rejectError);
    }
    setActionLoading(false);
  };

  const getFeatureName = (featureId) => {
    const feature = features.find((f) => f.id === featureId);
    return feature ? feature.name : `${t.featureTag} ${featureId}`;
  };

  if (loading) return <div style={{ padding: 40 }}>{t.loading}</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (!request || !location)
    return <div style={{ padding: 40 }}>{t.requestNotFound}</div>;

  const payload = request.payload || {};

  console.log("Rendering with:", { request, location, payload });

  return (
    <div className="add-location-page">
      <div
        className="add-location-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <button
          onClick={() =>
            navigate("/admin-page", { state: { activeTab: "edit" } })
          }
          style={{
            position: "absolute",
            left: "20px",
            background: "none",
            border: "none",
            fontSize: "30px",
            cursor: "pointer",
            padding: "0 15px",
            color: "white",
          }}
        >
          &larr;
        </button>
        {t.pageTitle}
      </div>
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
          {/* Поточні дані локації */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 12,
                color: "#334059",
              }}
            >
              {t.before}
            </div>
            <div className="form-row">
              <label>{t.photo}</label>
              {location && location.photos && location.photos[0] && (
                <img
                  src={location.photos[0].imageUrl}
                  alt={t.before}
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
              <label>{t.name}</label>
              <div>{location && location.name}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>{t.address}</label>
              <div>{location && location.address}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 18 }}>
              <label>{t.description}</label>
              <div>{location && location.description}</div>
            </div>
            <div className="form-row">
              <label>{t.accessibility}</label>
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
          {/* Запропоновані зміни */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 12,
                color: "#334059",
              }}
            >
              {t.proposal}
            </div>
            <div className="form-row">
              <label>{t.photo}</label>
              {payload && payload.photosToAdd && payload.photosToAdd[0] && (
                <img
                  src={payload.photosToAdd[0].imageUrl}
                  alt={t.proposal}
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
              <label>{t.name}</label>
              <div>{payload && payload.name}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 10 }}>
              <label>{t.address}</label>
              <div>{payload && payload.address}</div>
            </div>
            <div className="form-row" style={{ marginBottom: 18 }}>
              <label>{t.description}</label>
              <div>{payload && payload.description}</div>
            </div>
            <div className="form-row">
              <label>{t.accessibility}</label>
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
          {t.approve}
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
          {t.reject}
        </button>
      </div>
    </div>
  );
}
