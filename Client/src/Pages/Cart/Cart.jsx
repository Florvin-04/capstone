import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
import { CartProduct } from "../../Components/CartProduct/CartProduct";

const Cart = () => {
  const { route, loggedInID, formState, getTotal, cartData, setCartData } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setLoading(false);
  // }, []);
  const fetchCartData = async () => {
    try {
      const response = await axios.get(`${route}/cart`, {
        params: { user_id: loggedInID },
      });

      if (response.data.Status === "success") {
        setCartData(response.data.Result);
        setLoading(false);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [loggedInID, loading]);

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
            // {...product}
            product={product}
            setLoadingCart={setLoading}
          />
        );
      })}
      <p>{getTotal()}</p>
      <button
        onClick={() => {
          navigate("/checkout");
        }}
      >
        Checkout
      </button>
    </>
  );
};

export default Cart;
