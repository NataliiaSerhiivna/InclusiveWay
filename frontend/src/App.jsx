import React, { useEffect, useState } from "react";
import "./styles/App.css";
import MapComponent from "./components/MapComponent";
import "leaflet-routing-machine";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Routes, Route } from "react-router-dom";
import AddLocation from "./pages/Location/AddLocation";
import EditLocation from "./pages/Location/EditLocation";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import AdminPage from "./pages/Admin/AdminPage";
import AdminAddRequest from "./pages/Admin/AdminAddRequest";
import AdminEditRequest from "./pages/Admin/AdminEditRequest";
import AdminLocation from "./pages/Admin/AdminLocation";
import AdminLocationEdit from "./pages/Admin/AdminLocationEdit";
import { authCallback, getLocations } from "./api";
import { getFeatures } from "./api";

const localhostGoogleJwtKey = "inclusive-way-google-jwt";

function App() {
  const [markers, setMarkers] = useState([]);
  const [search, setSearch] = useState("");
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [selecting, setSelecting] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const [user, setUser] = useState(undefined);
  const [featuresList, setFeaturesList] = useState([]);
  const [filters, setFilters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userSession = localStorage.getItem(localhostGoogleJwtKey);
    console.log(userSession);

    setUser(JSON.parse(userSession || null));
  }, []);
  useEffect(() => {
    (async () => {
      if (user && !user.id) {
        const dbUser = await authCallback({
          username: user.name,
          email: user.email,
          password: user.sub,
        });
        setUser(dbUser);
      }
    })();
  }, [user]);

  useEffect(() => {
    getLocations({ limit: 1000 }).then((data) => {
      let locations = data?.locations || data || [];
      if (filters.length > 0) {
        locations = locations.filter((loc) => {
          const locFeatureIds = Array.isArray(loc.features)
            ? loc.features.map((f) => (typeof f === "object" ? f.id : f))
            : [];
          return filters.every((f) => locFeatureIds.includes(f));
        });
      }
      setMarkers(
        locations.map((loc) => {
          if (loc.name === "Золоті ворота") {
            console.log("Фото для Золоті ворота:", loc.photos);
          }
          return {
            lat: loc.latitude,
            lng: loc.longitude,
            label: loc.name,
            address: loc.address,
            description: loc.description,
            tags: (loc.features || []).map((id) => {
              const f = featuresList.find(
                (f) => f.id === id || (typeof id === "object" && f.id === id.id)
              );
              return f ? f.name : id.name || id;
            }),
            image:
              loc.photos &&
              (loc.photos[0]?.imageURL || loc.photos[0]?.image_url),
            comments: (loc.comments || []).map((c) => ({
              userId: c.userId,
              author: c.author || c.email || `User #${c.userId}`,
              text: c.text || c.content || "",
            })),
            id: loc.id,
          };
        })
      );
    });
  }, [featuresList, filters]);

  useEffect(() => {
    getFeatures()
      .then(setFeaturesList)
      .catch(() => setFeaturesList([]));
  }, []);

  const handleMapClick = (point) => {
    setMarkers([...markers, point]);
  };

  const handleMarkerClick = (point) => {
    if (selecting === "start") {
      setStartPoint(point);
      setSelecting(null);
    } else if (selecting === "end") {
      setEndPoint(point);
      setSelecting(null);
    } else {
      setSelectedLocation(point);
    }
  };

  const buildRoute = () => {
    if (!startPoint || !endPoint) return;
    setRoutePoints([
      { lat: startPoint.lat, lng: startPoint.lng },
      { lat: endPoint.lat, lng: endPoint.lng },
    ]);
  };

  const clearRoute = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRoutePoints([]);
  };

  const handleFilterChange = (id) => {
    setFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const params = { searchString: search, limit: 1000 };
    if (filters.length > 0) params.features = filters.join(",");
    const data = await getLocations(params);
    const found = (data?.locations || data || []).map((loc) => ({
      lat: loc.latitude,
      lng: loc.longitude,
      label: loc.name,
      address: loc.address,
      description: loc.description,
      tags: (loc.features || []).map((id) => {
        const f = featuresList.find((f) => f.id === id);
        return f ? f.name : id;
      }),
      image: loc.photos && loc.photos[0]?.imageURL,
      comments: loc.comments || [],
      id: loc.id,
    }));
    setMarkers(found);
    if (found.length === 1) {
      setMapCenter([found[0].lat, found[0].lng]);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="header">
                <div className="logo">InclusiveWay</div>
                <div className="header-btns">
                  {user && (
                    <button
                      className="add-location-btn"
                      onClick={() => navigate("/add-location-request")}
                    >
                      Заявка на додавання локації
                    </button>
                  )}
                  <button className="lang-btn">UA</button>
                  {user === null && (
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const userSession = jwtDecode(
                          credentialResponse.credential
                        );
                        localStorage.setItem(
                          localhostGoogleJwtKey,
                          JSON.stringify(userSession)
                        );
                        setUser(userSession);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  )}
                  {user && (
                    <>
                      <button
                        className="login-btn"
                        onClick={() => {
                          localStorage.removeItem(localhostGoogleJwtKey);
                          setUser(null);
                        }}
                      >
                        Вийти
                      </button>
                      <button
                        className="profile-btn"
                        onClick={() => navigate("/profile")}
                      >
                        Профіль
                      </button>
                    </>
                  )}
                </div>
              </header>
              <div className="app-main-layout">
                <div className="left-content">
                  <div className="search-section">
                    <form
                      onSubmit={handleSearch}
                      style={{ display: "flex", gap: 16, width: "100%" }}
                    >
                      <input
                        className="search-input"
                        style={{ width: 320, minWidth: 220, maxWidth: 400 }}
                        placeholder="Пошук..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        className="search-btn"
                        type="submit"
                        style={{ width: 130, minWidth: 100 }}
                      >
                        Знайти
                      </button>
                    </form>
                  </div>
                  <div className="route-section">
                    <div className="route-title">Побудова маршруту</div>
                    <div className="route-buttons">
                      <button
                        className="select-start-btn"
                        onClick={() => setSelecting("start")}
                      >
                        Обрати початок маршруту
                      </button>
                      <button
                        className="select-end-btn"
                        onClick={() => setSelecting("end")}
                      >
                        Обрати кінець маршруту
                      </button>
                      <div className="route-buttons-row">
                        <button
                          className="build-route-btn"
                          onClick={buildRoute}
                        >
                          Побудувати маршрут
                        </button>
                        <button
                          className="clear-route-btn"
                          onClick={clearRoute}
                        >
                          Очистити
                        </button>
                      </div>
                    </div>
                    <div className="route-info">
                      {startPoint && (
                        <div>
                          <b>Початок:</b> {startPoint.label}
                        </div>
                      )}
                      {endPoint && (
                        <div>
                          <b>Кінець:</b> {endPoint.label}
                        </div>
                      )}
                      {selecting === "start" && (
                        <div>
                          Клікніть по маркеру на карті для вибору початку
                        </div>
                      )}
                      {selecting === "end" && (
                        <div>Клікніть по маркеру на карті для вибору кінця</div>
                      )}
                    </div>
                  </div>
                  <div className="filters-section">
                    <div className="filters-title">Фільтри доступності</div>
                    <div className="filters-grid">
                      {featuresList.map((f) => (
                        <label className="filter-checkbox" key={f.id}>
                          <input
                            type="checkbox"
                            checked={filters.includes(f.id)}
                            onChange={() => handleFilterChange(f.id)}
                          />{" "}
                          {f.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="map-area">
                  <MapComponent
                    markers={markers}
                    setMarkers={setMarkers}
                    selectedPoints={{ startPoint, endPoint }}
                    setSelectedPoints={({ start, end }) => {
                      setStartPoint(start);
                      setEndPoint(end);
                    }}
                    routePoints={routePoints}
                    onMapClick={handleMapClick}
                    onMarkerClick={handleMarkerClick}
                    user={user}
                    center={mapCenter}
                  />
                </div>
              </div>
            </>
          }
        />
        <Route path="/add-location-request" element={<AddLocation />} />
        <Route path="/edit-location-request" element={<EditLocation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/admin-page" element={<AdminPage />} />
        <Route path="/admin-add-request/:id" element={<AdminAddRequest />} />
        <Route path="/admin-edit-request/:id" element={<AdminEditRequest />} />
        <Route path="/admin-location/:id" element={<AdminLocation />} />
        <Route
          path="/admin-location/:id/edit"
          element={<AdminLocationEdit />}
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
