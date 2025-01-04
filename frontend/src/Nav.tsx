import { Link } from "react-router";


function Nav() {
  return (
      <>
          <nav>
              <Link to="/">Site Name</Link>
              <ul>
                  <li>
                      <Link to="/create-article">Write an article</Link>
                  </li>
                  <li>
                      <button>Sign up</button>
                  </li>
                  <li>
                      <button>Log in</button>
                  </li>
              </ul>
          </nav>
      </>
  );
}

export default Nav