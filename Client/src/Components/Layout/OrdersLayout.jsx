import React from "react";
import { Outlet } from "react-router-dom";
import OrdersNavStatus from "../OrdersNavStatus/OrdersNavStatus";

function OrdersLayout() {
  return (
    <>
      <h2>My Purchases</h2>
      <OrdersNavStatus />
      <Outlet />
    </>
  );
}

export default OrdersLayout;
