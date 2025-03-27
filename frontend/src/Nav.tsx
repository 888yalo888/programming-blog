import axios from "axios";
import { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { Link } from "react-router";

function Nav() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/profile", { withCredentials: true });
        console.log("profile response", response.data.user);
        setProfile(response.data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <nav>
        <Link to="/">Site Name</Link>
        <ul>
          <li>
            <Link to="/create-article">Write an article</Link>
          </li>
          {isloading ? (
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
