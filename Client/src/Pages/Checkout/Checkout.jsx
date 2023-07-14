import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
import CheckoutProduct from "../../Components/CheckoutProduct/CheckoutProduct";

const Checkout = () => {
  const { getTotal, formState, loggedInID, route } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [chekedProduct, setChekedProduct] = useState({
    ids: [...formState.checkout_cart.map((item) => item.id)],
    items: {},
  });

  // const IDS = [...formState.checkout_cart.map((item) => item.id)];

  const [checkoutData, setCheckoutData] = useState([]);

  const fetchCartData = async () => {
    try {
      const response = await axios.get(`${route}/cart`, {
        params: { user_id: loggedInID },
      });

      if (response.data.Status === "success") {
        setCheckoutData(response.data.Result);
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
  }, [loggedInID]);

  useEffect(() => {
    let result = {};

    formState.checkout_cart.forEach((item) => {
      result[item.id] = { quantity: item.quantity, subtotal: item.subtotal };
    });

    setChekedProduct((prevData) => ({
      ...prevData,
      items: result,
    }));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>Checkout Page</div>

      {checkoutData.map((product) => {
        if (chekedProduct.ids.includes(product.id)) {
          return (
            <CheckoutProduct
              key={product.id}
              product={product}
              chekedProduct={chekedProduct}
            />
          );
        }
      })}
      <p>total: {getTotal()}</p>
    </>
  );
};

export default Checkout;
