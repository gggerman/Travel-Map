import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { Room, Star } from '@mui/icons-material';
import axios from 'axios';
import { Register } from './components/Register';
import { Login } from './components/Login';
import TimeAgo from 'timeago-react';
import './App.css';

import mapboxgl from 'mapbox-gl';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/pins`);
        setPins(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getPins();
  }, [])

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude, longitude})
  }

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      longitude,
      latitude
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      description,
      rating,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER}/pins`, newPin);
      setPins([...pins, response.data]);
      setNewPlace(null);
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={handleAddClick}
      >
        {pins.map((pin, index) => (
          <>
            <Marker
              latitude={pin.latitude} 
              longitude={pin.longitude} 
              offsetLeft={-viewport.zoom * 3.5} 
              offsetTop={-viewport.zoom * 7}>
              <Room 
                style={{fontSize: viewport.zoom * 7, color: pin.username === currentUser ? "tomato" : "slateblue", cursor: "pointer"}}
                onClick={() => handleMarkerClick(pin._id, pin.latitude, pin.longitude)}/>
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.latitude}
                longitude={pin.longitude}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="description">{pin.description}</p>
                  <label>Rating</label>
                  <div className="stars">  
                    {Array(pin.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">Created By <b>{pin.username}</b></span>
                  <span className="date">
                    <TimeAgo
                      datetime={pin.createdAt}
                    />
                  </span>
                </div>
              </Popup>
              )
            }
            </>
          ))}
          {newPlace && (
            <Popup
              latitude={newPlace.latitude}
              longitude={newPlace.longitude}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={() => setNewPlace(null)}
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input 
                    placeholder="Enter a title" 
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Review</label>
                  <textarea 
                    placeholder="Tell us something about this place."
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className="submitButton" type="submit">Add Pin</button>
                </form>
              </div>
            </Popup>
          )}
          {currentUser ? (
            <button className="button logout" onClick={handleLogout}>Log Out</button>
          ) : (
            <div className="buttons">
              <button className="button login" onClick={() => setShowLogin(true)}>Log In</button>
              <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
            </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister}/>}
          {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      </ReactMapGL>
    </div>
  );
}

export default App;