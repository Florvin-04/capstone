import { useEffect, useState } from "react";
import "./Header.scss";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
  const { loggedInName, loggedInID, isAutorize } = useGlobalContext();
  const navigate = useNavigate();
  // const [isAutorize, setIsAuthorize] = useState(false);

  // axios.defaults.withCredentials = true;
  // useEffect(() => {
  //   axios.get("http://localhost:8081").then((response) => {
  //     if (response.data.Status === "success") {
  //       console.log(response);
  //       setIsAuthorize(true);
  //     } else {
  //       setIsAuthorize(false);
  //     }
  //   });
  // }, []);

  // axios.defaults.withCredentials = true;
  function handleLogout() {
    axios
      .get("http://localhost:8081/logout")
      .then((response) => {
        if (response.data.Status === "success") {
          localStorage.removeItem("reciept_items");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <header className="header">
        <Link to="/">
          <img
            src="./logo.png"
            alt="Logo"
          />
        </Link>
        <nav className="navigation">
          <ul className="navigation__list">
            <li className="navigation__list--item">
              <NavLink
                to="/products"
                className="navigation__list--item"
              >
                products
              </NavLink>
            </li>
            <li className="navigation__list--item">
              <NavLink
                to="/cart"
                className="navigation__list--item"
              >
                <FaShoppingCart />
              </NavLink>
            </li>
          </ul>

          {isAutorize ? (
            <>
              <div className="user__profile">
                <FaUser />
                {/* {loggedInName.first_name} {loggedInName.last_name} {loggedInID} */}
                <span>{loggedInName.first_name}</span>
                <div className="user__profile--info">
                  <div>
                    <NavLink to="/orders">My purchase</NavLink>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
