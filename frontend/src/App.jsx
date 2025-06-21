// Головний компонент веб-платформи

import React, { useEffect, useState } from "react";
import "./styles/App.css";
import MapComponent from "./components/MapComponent";
import "leaflet-routing-machine";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Routes, Route, redirect } from "react-router-dom";
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

// Ключ для зберігання JWT токена Google в localStorage
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
  const [language, setLanguage] = useState("ua");

  const navigate = useNavigate();

  // Об'єкт з перекладами для інтернаціоналізації
  const translations = {
    ua: {
      logo: "InclusiveWay",
      addLocationRequest: "Заявка на додавання локації",
      profile: "Профіль",
      logout: "Вийти",
      searchPlaceholder: "Пошук...",
      searchButton: "Знайти",
      buildRouteTitle: "Побудова маршруту",
      selectStart: "Обрати початок маршруту",
      selectEnd: "Обрати кінець маршруту",
      buildRouteButton: "Побудувати маршрут",
      clearRoute: "Очистити",
      startPoint: "Початок:",
      endPoint: "Кінець:",
      selectStartHint: "Клікніть по маркеру на карті для вибору початку",
      selectEndHint: "Клікніть по маркеру на карті для вибору кінця",
      filtersTitle: "Фільтри доступності",
    },
    en: {
      logo: "InclusiveWay",
      addLocationRequest: "Add location request",
      profile: "Profile",
      logout: "Logout",
      searchPlaceholder: "Search...",
      searchButton: "Find",
      buildRouteTitle: "Route building",
      selectStart: "Select start point",
      selectEnd: "Select end point",
      buildRouteButton: "Build route",
      clearRoute: "Clear",
      startPoint: "Start:",
      endPoint: "End:",
      selectStartHint: "Click on a marker on the map to select the start",
      selectEndHint: "Click on a marker on the map to select the end",
      filtersTitle: "Accessibility Filters",
    },
  };

  // Функція для зміни мови
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ua" ? "en" : "ua"));
  };

  const t = translations[language];

  // Обробка сесії користувача
  useEffect(() => {
    const userSession = localStorage.getItem(localhostGoogleJwtKey);
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
        if (dbUser.role === "admin" && user.redirect) {
          navigate("/admin-page");
        }
        setUser(dbUser);
      }
    })();
  }, [user]);

  // Фільтрація локацій
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
              (loc.photos[0]?.imageUrl || loc.photos[0]?.image_url),
            comments: (loc.comments || []).map((c) => ({
              ...c,
              userId: c.userId,
              author: c.userName,
              text: c.text || c.content || "",
            })),
            id: loc.id,
          };
        })
      );
    });
  }, [featuresList, filters]);

  // Завантаження списку характеристик
  useEffect(() => {
    getFeatures()
      .then(setFeaturesList)
      .catch(() => setFeaturesList([]));
  }, []);

  // Обробник кліку по карті
  const handleMapClick = (point) => {
    const dbMarkers = markers.filter((m) => m.id);
    setMarkers([...dbMarkers, point]);
  };

  // Обробник кліку по маркеру
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

  // Побудова маршруту
  const buildRoute = () => {
    if (!startPoint || !endPoint) return;
    setRoutePoints([
      { lat: startPoint.lat, lng: startPoint.lng },
      { lat: endPoint.lat, lng: endPoint.lng },
    ]);
  };

  // Очищення маршруту
  const clearRoute = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRoutePoints([]);
  };

  // Обробник зміни фільтрів
  const handleFilterChange = (id) => {
    setFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (search === "") {
      handleSearch();
    }
  }, [search]);

  // Обробник пошуку локацій
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
      image: loc.photos && loc.photos[0]?.imageUrl,
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
      {/* Налаштування маршрутизації додатку */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Хедер додатку */}
              <header className="header">
                <div className="logo">{t.logo}</div>
                <div className="header-btns">
                  {user && (
                    <button
                      className="add-location-btn"
                      onClick={() => navigate("/add-location-request")}
                    >
                      {t.addLocationRequest}
                    </button>
                  )}
                  <button className="lang-btn" onClick={toggleLanguage}>
                    {language === "ua" ? "EN" : "UA"}
                  </button>
                  {/* Кнопка входу через Google */}
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
                        setUser({ ...userSession, redirect: true });
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  )}
                  {/* Кнопки профілю та виходу */}
                  {user && (
                    <>
                      <button
                        className="profile-btn"
                        onClick={() => navigate("/profile")}
                      >
                        {t.profile}
                      </button>
                      <button
                        className="login-btn"
                        onClick={() => {
                          localStorage.removeItem(localhostGoogleJwtKey);
                          setUser(null);
                        }}
                      >
                        {t.logout}
                      </button>
                    </>
                  )}
                </div>
              </header>
              {/* Основний макет сторінки */}
              <div className="app-main-layout">
                {/* Ліва панель з елементами керування */}
                <div className="left-content">
                  {/* Секція пошуку */}
                  <div className="search-section">
                    <form
                      onSubmit={handleSearch}
                      style={{ display: "flex", gap: 16, width: "100%" }}
                    >
                      <input
                        className="search-input"
                        style={{ width: 320, minWidth: 220, maxWidth: 400 }}
                        placeholder={t.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        className="search-btn"
                        type="submit"
                        style={{ width: 130, minWidth: 100 }}
                      >
                        {t.searchButton}
                      </button>
                    </form>
                  </div>
                  {/* Секція побудови маршруту */}
                  <div className="route-section">
                    <div className="route-title">{t.buildRouteTitle}</div>
                    <div className="route-buttons">
                      <button
                        className="select-start-btn"
                        onClick={() => setSelecting("start")}
                      >
                        {t.selectStart}
                      </button>
                      <button
                        className="select-end-btn"
                        onClick={() => setSelecting("end")}
                      >
                        {t.selectEnd}
                      </button>
                      <div className="route-buttons-row">
                        <button
                          className="build-route-btn"
                          onClick={buildRoute}
                        >
                          {t.buildRouteButton}
                        </button>
                        <button
                          className="clear-route-btn"
                          onClick={clearRoute}
                        >
                          {t.clearRoute}
                        </button>
                      </div>
                    </div>
                    <div className="route-info">
                      {startPoint && (
                        <div>
                          <b>{t.startPoint}</b> {startPoint.label}
                        </div>
                      )}
                      {endPoint && (
                        <div>
                          <b>{t.endPoint}</b> {endPoint.label}
                        </div>
                      )}
                      {selecting === "start" && <div>{t.selectStartHint}</div>}
                      {selecting === "end" && <div>{t.selectEndHint}</div>}
                    </div>
                  </div>
                  {/* Секція фільтрів */}
                  <div className="filters-section">
                    <div className="filters-title">{t.filtersTitle}</div>
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
                {/* Область для відображення карти */}
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
                    language={language}
                  />
                </div>
              </div>
            </>
          }
        />
        {/* Маршрути для сторінок додатку */}
        <Route
          path="/add-location-request"
          element={<AddLocation language={language} />}
        />
        <Route
          path="/edit-location-request"
          element={<EditLocation language={language} />}
        />
        <Route path="/profile" element={<Profile language={language} />} />
        <Route
          path="/edit-profile"
          element={<EditProfile language={language} />}
        />
        <Route
          path="/admin-page"
          element={
            <AdminPage language={language} toggleLanguage={toggleLanguage} />
          }
        />
        <Route
          path="/admin-add-request/:id"
          element={<AdminAddRequest language={language} />}
        />
        <Route
          path="/admin-edit-request/:id"
          element={<AdminEditRequest language={language} />}
        />
        <Route
          path="/admin-location/:id"
          element={<AdminLocation language={language} />}
        />
        <Route
          path="/admin-location/:id/edit"
          element={<AdminLocationEdit language={language} />}
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
