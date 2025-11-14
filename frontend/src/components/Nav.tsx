import axios from '../utils/axios.ts'
import { useContext } from "react";
import { Link } from "react-router";
import ProfileContext from "../context/ProfileContext";
import WriteSvg from "../icons/WriteSvg.tsx";
import GoogleLogInSvg from "../icons/GoogleLogInSvg.tsx";

function Nav() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "ProfileContext must be used within a ProfileContextProvider"
    );
  }

  const { profile, isLoading } = context;

  const signIn = () => {
    window.open("http://localhost:3001/api/auth/google", "_self");
  };

  const handleLogout = async () => {
    try {
      await axios.get("/csrf-token");

      await axios.post(
        "http://localhost:3001/api/profile/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logged out");
      window.location.href = "http://localhost:5173";
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      console.log("Logged out", error.response?.data || error.message);
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
        <Link to="/" className="text-4xl font-bold text-gray-800">
          IT Drama
        </Link>
        <ul className="flex items-center space-x-4">
          {profile?.role === "admin" && (
            <li>
              <Link
                to="/create-article"
                className="flex items-center gap-2 border border-[#CFCFCF] rounded-[5px] px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                <WriteSvg />
                <span>Write</span>
              </Link>
            </li>
          )}
          {isLoading ? (
            <div className="text-gray-500"> page is Loading</div>
          ) : profile ? (
            <li>
              <button
                onClick={handleLogout}
                className="border border-[#CFCFCF] rounded-[5px] px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                Log out
              </button>
            </li>
          ) : (
            <li>
              <span
                onClick={signIn}
                className="cursor-pointer inline-flex items-center justify-center transition active:scale-95 active:shadow-inner focus:outline-none"
                tabIndex={0}
              >
                <GoogleLogInSvg />
              </span>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Nav;
