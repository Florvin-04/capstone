import React, { useState, useEffect } from "react";

import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
import { CartProduct } from "../../Components/CartProduct/CartProduct";

export const Cart = () => {
  const { route, loggedInID } = useGlobalContext();

  const [cartData, setCartData] = useState([]);

  const [loading, setLoading] = useState(true);

  // function getTotal(){

  //   cartData.forEach((data) => {
  //     console.log(data);
  //   });
  // }
  // useEffect(() => {
  // }, [loggedInID]);

  useEffect(() => {
    // setLoading(true);
    axios
      .get(`${route}/cart`, {
        params: { user_id: loggedInID },
      })
      .then((response) => {
        if (response.data.Status === "success") {
          // setCartData(response.data.Result);
          setLoading(false);
          console.log(response);
          setCartData(response.data.Result);
        } else {
          console.log(response.data.Message);
        }
      })
      .catch((err) => console.log(err));
  }, [loggedInID]);

 

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>Cart</div>
      {cartData.map((product) => {
        return (
          <CartProduct
            key={product.product_id}
            {...product}
          />
        );
      })}
    </>
  );
};
