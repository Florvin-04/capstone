import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import Products from "./Pages/Products/Products";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import DetailedProduct from "./Pages/DetailedProduct/DetailedProduct";
import Cart from "./Pages/Cart/Cart";
import Checkout from "./Pages/Checkout/Checkout";
import Orders from "./Pages/Orders/Orders";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./Pages/NotFound/NotFound";
import { useGlobalContext } from "./AppContext/AppContext";
import OrdersLayout from "./Components/Layout/OrdersLayout";
import AllOrders from "./Pages/Orders/AllOrders";
import ToShipOrders from "./Pages/Orders/ToShipOrders";
import ToRecieve from "./Pages/Orders/ToRecieve";
import CancelledOrders from "./Pages/Orders/CancelledOrders";
import Completed from "./Pages/Orders/Completed";
import Pending from "./Pages/Orders/PendingOrders";

function App() {
  const { isCartShown } = useGlobalContext();

  const [isActive, setIsActive] = useState(false);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  window.addEventListener("scroll", () => {
    window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
  });

  return (
    <>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<Layout />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route
              path="products"
              element={<Products />}
            />
            <Route
              path="products/:id"
              element={<DetailedProduct />}
            />

            {/* <Route
              path="/cart"
              element={<Cart />}
            /> */}

            <Route
              path="checkout"
              element={<Checkout />}
            />

            {/* <Route
              path="/orders"
              element={<Orders />}
            /> */}

            <Route
              path="orders"
              element={<Orders />}
            >
              <Route
                index
                element={<AllOrders />}
              />
              <Route
                path="pending"
                element={<Pending />}
              />
              <Route
                path="to-ship"
                element={<ToShipOrders />}
              />
              <Route
                path="to-receive"
                element={<ToRecieve />}
              />
              <Route
                path="cancelled"
                element={<CancelledOrders />}
              />
              <Route
                path="completed"
                element={<Completed />}
              />
            </Route>
          </Route>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="*"
            element={<Navigate to="/404" />}
          />

          <Route
            path="/404"
            element={<NotFound />}
          />
        </Routes>
        <div className={`${isCartShown && "isOpenCart"} `}>
          <Cart />
        </div>

        <button
          className={`scroll-up ${isActive ? "active" : ""}`}
          onClick={scrollToTop}
        >
          <svg
            width="40px"
            height="40px"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#000000"
          >
            <path
              d="M3.685 18.783l7.88-14.008a.5.5 0 01.87 0l7.88 14.008a.5.5 0 01-.617.71l-7.517-2.922a.5.5 0 00-.362 0l-7.517 2.923a.5.5 0 01-.617-.711z"
              stroke="#000000"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </>
  );
}

export default App;
