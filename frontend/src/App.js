import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { Room, Star } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'timeago.js';
import './App.css';

function App() {
  const currentUser = "Germán";

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
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
        const response = await axios.get("/pins");
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

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map((pin, index) => (
          <>
            <Marker
              latitude={pin.latitude} 
              longitude={pin.longitude} 
              offsetLeft={-20} 
              offsetTop={-10}>
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
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                    <Star className="star" />
                  </div>
                  <label>Information</label>
                  <span className="username">Created By <b>{pin.username}</b></span>
                  <span className="date">{format(pin.createdAt)}</span>
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
                <form>
                  <label>Title</label>
                  <input type="text" placeholder="Enter a title"/>
                  <label>Review</label>
                  <textarea placeholder="Tell us something about this place."/>
                  <label>Rating</label>
                  <select>
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
          )
          }
      </ReactMapGL>
    </div>
  );
}

export default App;
