import React, { useEffect, useState } from "react";
import "./styles/App.css";
import MapComponent from "./components/MapComponent";
import "leaflet-routing-machine";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
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

const localhostGoogleJwtKey = "inclusive-way-google-jwt";

function App() {
  const [markers, setMarkers] = useState([
    {
      lat: 51.505,
      lng: -0.09,
      label: "Point A",
      address: "просп. Оболонський, 1Б, Київ",
      description: "Сучасний кінотеатр з доступною інфраструктурою.",
      tags: ["Пандус", "Ліфт", "Доступна вбиральня", "Кнопка виклику допомоги"],
    },
    {
      lat: 51.51,
      lng: -0.1,
      label: "Point B",
      address: "вул. Велика Васильківська, 100, Київ",
      description: "Великий торговий центр з усіма зручностями.",
      tags: ["Ліфт", "Доступна вбиральня"],
    },
    { lat: 51.51, lng: -0.12, label: "Point C" },
    {
      lat: 50.4501,
      lng: 30.5234,
      label: "Музей Ханенків",
      address: "вул. Терещенківська, 15, Київ",
      description: "Музей із зручною інфраструктурою для людей з інвалідністю.",
      tags: ["Пандус", "Доступна вбиральня"],
    },
    {
      lat: 50.489709,
      lng: 30.498204,
      label: "Кінотеатр Планета Кіно",
      address: "просп. Оболонський, 1Б, Київ",
      description: "Сучасний кінотеатр з доступною інфраструктурою.",
      tags: ["Пандус", "Ліфт", "Доступна вбиральня", "Кнопка виклику допомоги"],
      image:
        "https://cdn1.pokupon.ua/uploaded/merchant_page_images/230255/data/large1200/IMG_2667.jpg",
      comments: [
        {
          author: "Олександр",
          text: "Чудовий кінотеатр! Персонал завжди готовий допомогти.",
        },
        { author: "Ірина", text: "Зручний заїзд, широкі проходи. Рекомендую!" },
      ],
    },
    {
      lat: 50.4885,
      lng: 30.4958,
      label: "Сушія",
      address: "просп. Оболонський, 1Б, Київ",
      description: "Суші-ресторан з доступним входом.",
      tags: ["Пандус"],
    },
    {
      lat: 50.4877,
      lng: 30.4992,
      label: "Domino's Pizza",
      address: "просп. Оболонський, 1Б, Київ",
      description: "Піцерія з доступною інфраструктурою.",
      tags: ["Доступна вбиральня"],
    },
  ]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [selecting, setSelecting] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [user, setUser] = useState(undefined);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem(
        localhostGoogleJwtKey,
        JSON.stringify(tokenResponse)
      );
      setUser(tokenResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
    flow: "implicit",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userSession = localStorage.getItem(localhostGoogleJwtKey);
    setUser(JSON.parse(userSession || null));
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

  console.log(user);

  return (
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
                {(user === null || user === undefined) && (
                  <button className="login-btn" onClick={() => login()}>
                    Увійти
                  </button>
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
                  <input className="search-input" placeholder="Пошук..." />
                  <button className="search-btn">Знайти</button>
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
                      <button className="build-route-btn" onClick={buildRoute}>
                        Побудувати маршрут
                      </button>
                      <button className="clear-route-btn" onClick={clearRoute}>
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
                      <div>Клікніть по маркеру на карті для вибору початку</div>
                    )}
                    {selecting === "end" && (
                      <div>Клікніть по маркеру на карті для вибору кінця</div>
                    )}
                  </div>
                </div>
                <div className="filters-section">
                  <div className="filters-title">Фільтри доступності</div>
                  <div className="filters-grid">
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Пандус
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Ліфт
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Рейки для візків
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Доступна вбиральня
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Стіл для пеленання
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Широкі двері
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Кнопка виклику допомоги
                    </label>
                    <label className="filter-checkbox">
                      <input type="checkbox" /> Парковка для людей з
                      інвалідністю
                    </label>
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
      <Route path="/admin-location/:id/edit" element={<AdminLocationEdit />} />
    </Routes>
  );
}

export default App;
