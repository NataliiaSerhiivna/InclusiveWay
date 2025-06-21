// Компонент для відображення інтерактивної карти

"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useNavigate } from "react-router-dom";
import "../styles/MapComponent.css";
import { addComment, getComments, getUsers } from "../api";

// Компонент для обробки кліків на карті
const MapClickHandler = ({ onMapClick, customPointLabel }) => {
  useMapEvents({
    click(e) {
      const newPoint = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        label: customPointLabel,
      };
      onMapClick(newPoint);
    },
  });
  return null;
};

// Компонент для відображення маршруту на карті
const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints.map((p) => L.latLng(p.lat, p.lng)),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot",
      }),
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints]);

  return null;
};

// Компонент для центрування карти на заданих координатах
function CenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(center) && center.length === 2) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
}

// Основний компонент карти, що відображає маркери, маршрути та спливаючі вікна з інформацією про локації
const MapComponent = ({
  markers,
  setMarkers,
  selectedPoints,
  setSelectedPoints,
  routePoints,
  onMapClick,
  onMarkerClick,
  user,
  center,
  language = "ua",
}) => {
  const [showCommentForm, setShowCommentForm] = useState({});
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [usernamesMap, setUsernamesMap] = useState({});
  const navigate = useNavigate();

  // Об'єкт з перекладами для інтернаціоналізації
  const translations = {
    ua: {
      addressUnknown: "Адреса невідома",
      descriptionMissing: "Опис відсутній",
      tagsMissing: "Теги відсутні",
      comments: "Коментарі:",
      noComments: "Коментарів ще немає",
      addComment: "Додати коментар",
      yourCommentPlaceholder: "Ваш коментар...",
      publishComment: "Опублікувати коментар",
      loginToAddCommentError: "Щоб додати коментар, увійдіть у систему.",
      commentAddedSuccess: "Коментар додано!",
      editLocation: "Редагувати локацію",
      customPoint: "Користувацька точка",
      removePoint: "Прибрати точку",
    },
    en: {
      addressUnknown: "Address unknown",
      descriptionMissing: "No description",
      tagsMissing: "No tags",
      comments: "Comments:",
      noComments: "No comments yet",
      addComment: "Add a comment",
      yourCommentPlaceholder: "Your comment...",
      publishComment: "Publish comment",
      loginToAddCommentError: "Please log in to add a comment.",
      commentAddedSuccess: "Comment added successfully!",
      editLocation: "Edit location",
      customPoint: "Custom point",
      removePoint: "Remove point",
    },
  };

  const t = translations[language];

  useEffect(() => {
    getUsers({ limit: 1000 }).then((res) => {
      if (res && res.users) {
        const map = {};
        res.users.forEach((u) => {
          map[u.id] = u.username || u.email || `User #${u.id}`;
        });
        setUsernamesMap(map);
      }
    });
  }, []);

  return (
    <MapContainer
      center={center || [50.4501, 30.5234]} // Центр карти
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <CenterMap center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((point, idx) => (
        <Marker
          key={idx}
          position={[point.lat, point.lng]}
          eventHandlers={{
            click: () => onMarkerClick(point),
          }}
        >
          {/* Спливаюче вікно з інформацією про локацію*/}
          <Popup>
            {point.id ? (
              <div style={{ minWidth: 220, maxWidth: 320 }}>
                {point.image && (
                  <img
                    src={point.image}
                    alt={point.label}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 12,
                      marginBottom: 10,
                    }}
                  />
                )}
                <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
                  {point.label}
                </div>
                <div
                  style={{
                    fontStyle: "italic",
                    color: "#808c8c",
                    marginBottom: 8,
                    fontSize: 18,
                  }}
                >
                  {point.address || t.addressUnknown}
                </div>
                <div
                  style={{ marginBottom: 10, color: "#575757", fontSize: 17 }}
                >
                  {point.description || t.descriptionMissing}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(point.tags || []).length > 0 ? (
                    point.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#17ccff",
                          color: "#fff",
                          borderRadius: 12,
                          padding: "4px 12px",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#bdbdbd", fontSize: 13 }}>
                      {t.tagsMissing}
                    </span>
                  )}
                </div>
                {/* Секція коментарів */}
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}
                  >
                    {t.comments}
                  </div>
                  <div
                    style={{
                      maxHeight: 90,
                      overflowY: "auto",
                      background: "#f7fbff",
                      borderRadius: 8,
                      padding: "6px 8px",
                    }}
                  >
                    {point.comments && point.comments.length > 0 ? (
                      point.comments.map((comment, i) => (
                        <div
                          key={i}
                          style={{
                            marginBottom: 8,
                            fontSize: 14,
                            color: "#334059",
                          }}
                          onClick={() => console.log(comment)}
                        >
                          <b>{comment.userName}:</b> {comment.text}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "#bdbdbd", fontSize: 14 }}>
                        {t.noComments}
                      </div>
                    )}
                  </div>
                  {user && (
                    <>
                      <button
                        className="add-comment-btn"
                        style={{
                          marginTop: 10,
                          width: "100%",
                          background: "#00c853",
                          color: "#fff",
                          border: "none",
                          borderRadius: 12,
                          fontSize: 16,
                          fontWeight: 700,
                          height: 40,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setShowCommentForm({
                            ...showCommentForm,
                            [idx]: !showCommentForm[idx],
                          })
                        }
                      >
                        {t.addComment}
                      </button>
                      {showCommentForm[idx] && (
                        <div style={{ marginTop: 10 }}>
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={3}
                            style={{
                              width: "100%",
                              borderRadius: 8,
                              border: "1px solid #ccc",
                              padding: 8,
                              fontSize: 15,
                              resize: "none",
                              marginBottom: 8,
                            }}
                            placeholder={t.yourCommentPlaceholder}
                          />
                          <button
                            style={{
                              width: "100%",
                              background: "#17ccff",
                              color: "#fff",
                              border: "none",
                              borderRadius: 12,
                              fontSize: 16,
                              fontWeight: 700,
                              height: 40,
                              cursor: "pointer",
                            }}
                            onClick={async () => {
                              setCommentError("");
                              setCommentSuccess("");
                              if (!user) {
                                setCommentError(t.loginToAddCommentError);
                                return;
                              }
                              try {
                                let token = localStorage.getItem(
                                  "inclusive-way-google-jwt"
                                );
                                if (token) {
                                  try {
                                    const parsed = JSON.parse(token);
                                    token = undefined;
                                  } catch {}
                                }
                                if (typeof token !== "string")
                                  token = undefined;
                                await addComment(
                                  point.id,
                                  {
                                    content: commentText,
                                    createdAt: new Date().toISOString(),
                                  },
                                  token
                                );
                                const response = await getComments(point.id);
                                if (setMarkers) {
                                  setMarkers((prev) =>
                                    prev.map((m, i) =>
                                      i === idx
                                        ? {
                                            ...m,
                                            comments: response.comments.map(
                                              (c) => ({
                                                ...c,
                                                userId: c.userId,
                                                text: c.content,
                                              })
                                            ),
                                          }
                                        : m
                                    )
                                  );
                                }
                                setCommentText("");
                                setCommentSuccess(t.commentAddedSuccess);
                                setTimeout(
                                  () =>
                                    setShowCommentForm((f) => ({
                                      ...f,
                                      [idx]: false,
                                    })),
                                  1000
                                );
                              } catch (e) {
                                setCommentError(e.message);
                              }
                            }}
                          >
                            {t.publishComment}
                          </button>
                        </div>
                      )}
                      {commentError && (
                        <div style={{ color: "red", marginTop: 5 }}>
                          {commentError}
                        </div>
                      )}
                      {commentSuccess && (
                        <div style={{ color: "green", marginTop: 5 }}>
                          {commentSuccess}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {/* Кнопка для подання заявки на редагування локації*/}
                {point && user && (
                  <button
                    className="edit-location-btn"
                    style={{
                      marginTop: 12,
                      width: "100%",
                      background: "#0030C0",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 700,
                      height: 40,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/edit-location-request?id=${point.id}`)
                    }
                  >
                    {t.editLocation}
                  </button>
                )}
              </div>
            ) : (
              // Користувацька точка
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "10px",
                  }}
                >
                  {t.customPoint}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMarkers(markers.filter((m) => m.id));
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#ff4d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {t.removePoint}
                </button>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
      {routePoints.length > 1 && <RoutingMachine waypoints={routePoints} />}
      <MapClickHandler
        onMapClick={onMapClick}
        customPointLabel={t.customPoint}
      />
    </MapContainer>
  );
};

export default MapComponent;
