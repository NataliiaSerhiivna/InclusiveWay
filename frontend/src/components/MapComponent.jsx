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

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      const newPoint = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        label: "Custom Point",
      };
      onMapClick(newPoint);
    },
  });
  return null;
};

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

function CenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(center) && center.length === 2) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);
  return null;
}

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
}) => {
  const [showCommentForm, setShowCommentForm] = useState({});
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [usernamesMap, setUsernamesMap] = useState({}); // userId -> username
  const navigate = useNavigate();

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
      center={center || [50.4501, 30.5234]}
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
          <Popup>
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
                {point.address || "Адреса невідома"}
              </div>
              <div style={{ marginBottom: 10, color: "#575757", fontSize: 17 }}>
                {point.description || "Опис відсутній"}
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
                    Теги відсутні
                  </span>
                )}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  Коментарі:
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
                      >
                        <b>
                          {usernamesMap[comment.userId] ||
                            `User #${comment.userId}`}
                          :
                        </b>{" "}
                        {comment.text}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#bdbdbd", fontSize: 14 }}>
                      Коментарів ще немає
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
                      Додати коментар
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
                          placeholder="Ваш коментар..."
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
                              setCommentError(
                                "Щоб додати коментар, увійдіть у систему."
                              );
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
                              if (typeof token !== "string") token = undefined;
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
                              setCommentSuccess("Коментар додано!");
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
                          Опублікувати коментар
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
                  Редагувати локацію
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {routePoints.length > 1 && <RoutingMachine waypoints={routePoints} />}
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
};

export default MapComponent;
