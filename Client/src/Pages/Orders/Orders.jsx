import React, { useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
function Orders() {
  const { loggedInID, route } = useGlobalContext();

  async function getOrders() {
    try {
      const response = await axios.get(`${route}/orders`, {
        params: {
          user_id: loggedInID,
        },
      });

      if (response.data.Status == "success") {
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

  return (
    <>
      <div>Orders</div>
    </>
  );
}

export default Orders;
