import { useState, useRef } from "react";
import { Room, Cancel } from "@mui/icons-material";
import axios from "axios";
import "./login.css";

export const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await axios.post("/users/login", user);
      myStorage.setItem("user", response.data.username);
      setCurrentUser(response.data.username);
      setShowLogin(false);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        LamaPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="loginButton">Login</button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};
