import axios from "axios";
import { Link } from "react-router";

function Nav() {
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
  return (
    <>
      <nav>
        <Link to="/">Site Name</Link>
        <ul>
          <li>
            <Link to="/create-article">Write an article</Link>
          </li>
          <li>
            <Link to="/auth">Sign up</Link>
          </li>
          <li>
            <Link to="/auth">Log in</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Log out</button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Nav;
