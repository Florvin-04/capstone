import React, { useState, useEffect } from "react";

import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";

export const Cart = () => {
  const { route, loggedInID } = useGlobalContext();

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    axios
      .get(`${route}/cart`, {
        params: { user_id: loggedInID },
      })
      .then((response) => {
        if (response.data.Status === "success") {
          // setCartData(response.data.Result);
          console.log(response);
        } else {
          console.log(response.data.Message);
        }
      })
      .catch((err) => console.log(err));
  }, [loggedInID]);
  return (
    <>
      <div>Cart</div>
      {/* {cartData.map(product => {
        return (
        <div>
            <p>{product.user_id}</p>
        </div>
        )
      })} */}
    </>
  );
};
