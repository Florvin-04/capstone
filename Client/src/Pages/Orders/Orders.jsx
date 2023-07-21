import React, { useEffect, useState } from "react";
import "./Orders.scss";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
import OrderProduct from "../../Components/OrderProduct/OrderProduct";
import PageLoading from "../../Components/Loaders/PageLoading";
function Orders() {
  const { loggedInID, route } = useGlobalContext();

  const [orders, setOrders] = useState();

  const [isLoading, setIsLoading] = useState(true);

  async function getOrders() {
    try {
      const response = await axios.get(`${route}/orders`, {
        params: {
          user_id: loggedInID,
        },
      });

      if (response.data.Status == "success") {
        setOrders(response.data.Result);
        setIsLoading(false);
        console.log(response);
        return;
      }
      console.log(response);
      return;
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    getOrders();
  }, [loggedInID]);

  if (isLoading) {
    return (
      <div className="page__loading">
        <PageLoading />;
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="page__title">My Orders</h2>
      </div>

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

export default Orders;
