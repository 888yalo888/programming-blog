import axios from "axios";
import { useContext, useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { Link } from "react-router";
import {UserProfile} from './types/DtoTypes';
import ProfileContext from "../context/ProfileContext";

function Nav() {
  // const [profile, setProfile] = useState<UserProfile | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [isloading, setIsLoading] = useState<boolean>(true);

  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "ProfileContext must be used within a ProfileContextProvider"
    );
  }

  const { profile, isLoading } = context;

  const signIn = () => {
    window.open("http://localhost:3000/api/auth/google", "_self");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logged out");
      window.location.href = "http://localhost:5173";
    } catch (err) {
      console.log("Logged out", err.response?.data || err.message);
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await axios.get("/profile", { withCredentials: true });
  //       console.log("profile response", response.data.user);
  //       setProfile(response.data.user);
  //       console.log(response.data)
  //     } catch (err: any) {
  //       setError(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // }, []);

  return (
    <>
      <nav>
        <Link to="/">Site Name</Link>
        <ul>
          {profile?.role === "admin" && (
            <li>
              <Link to="/create-article">Write an article</Link>
            </li>
          )}
          {isLoading ? (
            <div> page is Loading</div>
          ) : profile ? (
            <li>
              <button onClick={handleLogout}>Log out</button>
            </li>
          ) : (
            <li>
              <GoogleButton onClick={signIn} />
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Nav;
