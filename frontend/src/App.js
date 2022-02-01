import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { Room, Star } from '@mui/icons-material';
import './App.css';

function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        <Marker
          latitude={48.858093} 
          longitude={2.294694} 
          offsetLeft={-20} 
          offsetTop={-10}>
          <Room style={{fontSize: viewport.zoom * 7, color: "slateblue"}}/>
        </Marker>
        <Popup
          latitude={48.858093}
          longitude={2.294694}
          closeButton={true}
          closeOnClick={false}
          anchor="left" >
          <div className="card">
            <label>Place</label>
            <h4 className="place">Eiffel Tower</h4>
            <label>Review</label>
            <p className="description">Beautiful place</p>
            <label>Rating</label>
            <div className="stars">  
              <Star className="star" />
              <Star className="star" />
              <Star className="star" />
              <Star className="star" />
              <Star className="star" />
            </div>
            <label>Information</label>
            <span className="username">Created By <b>Germancete</b></span>
            <span className="date">1 hour ago</span>
          </div>
        </Popup>
      </ReactMapGL>
    </div>
  );
}

export default App;
