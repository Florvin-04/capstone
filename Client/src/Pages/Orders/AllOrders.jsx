import React, { useEffect, useState } from "react";
import "./Orders.scss";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import OrderProduct from "../../Components/OrderProduct/OrderProduct";
import PageLoading from "../../Components/Loaders/PageLoading";

function AllOrders() {
  const { loggedInID, route, orders, setOrders, getOrders } = useGlobalContext();
  //   const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  //   async function getOrders() {
  //     try {
  //       const response = await axios.get(`${route}/orders`, {
  //         params: {
  //           user_id: loggedInID,
  //         },
  //       });

  //       if (response.data.Status == "success") {
  //         setOrders(response.data.Result);
  //         return;
  //       }
  //       console.log(response.data.Message);
  //       return;
  //     } catch (error) {
  //       console.log(error.response);
  //     }
  //   }

  useEffect(() => {
    getOrders();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [loggedInID]);

  if (isLoading) {
    return (
      <div className="page__loading">
        <PageLoading />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <p>No Orders Yet</p>
        <button onClick={() => navigate("/products")}>Shop Now</button>
      </div>
    );
  }

  return (
    <>
      <div className="orders__item--container">
        {orders.map((order, idx) => {
          return (
            <OrderProduct
              key={order.order_id}
              {...order}
            />
          );
        })}
      </div>
    </>
  );
}

export default AllOrders;
