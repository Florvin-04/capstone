import { useEffect, useState } from "react";
import "./Header.scss";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
  const { loggedInName, loggedInID, isAutorize, showCart, cartData, route } = useGlobalContext();
  const navigate = useNavigate();

  const [itemsInCart, setItemsInCart] = useState();
  const [isActive, setIsActive] = useState();
  const location = useLocation();
  // console.log(location);
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

  window.addEventListener("scroll", () => {
    window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
  });

  useEffect(() => {
    setItemsInCart(cartData.length);
  }, [cartData]);

  // axios.defaults.withCredentials = true;
  function handleLogout() {
    axios
      .get(`${route}/logout`)
      .then((response) => {
        if (response.data.Status === "success") {
          localStorage.removeItem("reciept_items");
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <header
        className={`header ${location.pathname == "/" && "home"} ${isActive ? "active" : ""}`}
      >
        <div className="container">
          <Link to="/">
            <img
              className="logo"
              width={40}
              src="/logo.svg"
              alt="Logo"
            />
          </Link>
          <nav className="navigation">
            <ul className="navigation__list">
              <li className="navigation__list--item">
                <NavLink
                  to="/products"
                  className="navigation__list--link products-link"
                >
                  Products
                </NavLink>
              </li>
              <li className="navigation__list--item">
                <button
                  className="navigation__list--link cart-btn"
                  onClick={showCart}
                >
                  <sup>{itemsInCart}</sup>
                  <FaShoppingCart />
                </button>
              </li>
            </ul>

            {isAutorize ? (
              <>
                <div className="user__profile">
                  <FaUser />
                  {/* {loggedInName.first_name} {loggedInName.last_name} {loggedInID} */}
                  <span>{loggedInName.first_name}</span>
                  <div className="user__profile--info">
                    <NavLink
                      className="purchases"
                      to="/orders"
                    >
                      My purchase
                    </NavLink>
                    <button
                      className="logout--btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                className="login--btn"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
