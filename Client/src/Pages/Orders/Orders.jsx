import React, { useEffect, useState } from "react";
import "./Orders.scss";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import OrderProduct from "../../Components/OrderProduct/OrderProduct";
import PageLoading from "../../Components/Loaders/PageLoading";
import OrdersNavStatus from "../../Components/OrdersNavStatus/OrdersNavStatus";
function Orders() {
  const { loggedInID, route, isAutorize } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInID !== null && loggedInID === false) {
      navigate("/404");
    }
  }, [loggedInID]);

  // const [orders, setOrders] = useState();

  // const [isLoading, setIsLoading] = useState(true);

  // async function getOrders() {
  //   try {
  //     const response = await axios.get(`${route}/orders`, {
  //       params: {
  //         user_id: loggedInID,
  //       },
  //     });

  //     if (response.data.Status == "success") {
  //       setOrders(response.data.Result);
  //       setIsLoading(false);
  //       console.log(response);
  //       return;
  //     }
  //     console.log(response);
  //     return;
  //   } catch (error) {
  //     console.log(error.response);
  //   }
  // }

  // useEffect(() => {
  //   getOrders();
  // }, [loggedInID]);

  // if (isLoading) {
  //   return (
  //     <div className="page__loading">
  //       <PageLoading />;
  //     </div>
  //   );
  // }

  // setTimeout(() => {
  //   console.log(isAutorize);
  // }, 2000);

  // if (loggedInID == null) {
  //   return <p>loading</p>;
  // }
  // useEffect(() => {
  //   if (loggedInID == null) {
  //     navigate("/404");
  //   }
  //   console.log(loggedInID);
  // }, [loggedInID]);

  return (
    <div className="order__page container">
      <div>
        <h2 className="page__title">My Purchases</h2>
      </div>
      <OrdersNavStatus />
      <Outlet />

      {/* <div className="orders__item--container">
        {orders.map((order, idx) => {
          return (
            <OrderProduct
              key={order.order_id}
              {...order}
            />
          );
        })}
      </div> */}
    </div>
  );
}

export default Orders;
