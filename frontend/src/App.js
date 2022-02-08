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

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
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
                onClick={() => handleMarkerClick(pin._id)}/>
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
      </ReactMapGL>
    </div>
  );
}

export default App;
