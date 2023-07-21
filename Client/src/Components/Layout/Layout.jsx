import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default Layout;
