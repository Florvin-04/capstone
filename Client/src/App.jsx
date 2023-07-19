import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import Products from "./Pages/Products/Products";
import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import DetailedProduct from "./Pages/DetailedProduct/DetailedProduct";
import Cart from "./Pages/Cart/Cart";
import Checkout from "./Pages/Checkout/Checkout";
import Orders from "./Pages/Orders/Orders";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className="container">
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
              path="/products"
              element={<Products />}
            />
            <Route
              path="/products/:id"
              element={<DetailedProduct />}
            />

            {/* <Route
              path="/cart"
              element={<Cart />}
            /> */}

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />
          </Route>

          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
        <Cart />
      </div>
    </>
  );
}

export default App;
