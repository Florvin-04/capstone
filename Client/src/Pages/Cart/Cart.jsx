import React, { useState, useEffect, useRef } from "react";
import "./Cart.scss";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
import { CartProduct } from "../../Components/CartProduct/CartProduct";
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
  const {
    route,
    loggedInID,
    formState,
    loading,
    getTotal,
    cartData,
    isCartShown,
    hideCart,
    showCart,
    checkoutItems,
    fetchCartData,
  } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setLoading(false);
  // }, []);
  // const fetchCartData = async () => {
  //   try {
  //     const response = await axios.get(`${route}/cart`, {
  //       params: { user_id: loggedInID },
  //     });

  //     if (response.data.Status === "success") {
  //       setCartData(response.data.Result);
  //       await new Promise((resolve) => {
  //         setTimeout(resolve, 1000);
  //       });
  //       setLoading(false);
  //     } else {
  //       console.log(response.data.Message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCartData();
  // }, [loggedInID, loading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section className={`cart__page ${isCartShown && "show"}`}>
      <header className="cart__page--header">
        <p>My Cart</p>
        <button
          className="hide_cart"
          onClick={hideCart}
        >
          X
        </button>
      </header>
      <div className="cart__parent">
        {cartData.map((product) => {
          return (
            <CartProduct
              key={product.product_id}
              // {...product}
              product={product}
              // setLoadingCart={setLoading}
            />
          );
        })}
      </div>
      {cartData.length === 0 && (
        <div className="empty_cart">
          <p>Your Cart is Empty</p>
          <button
            className="hide_cart"
            onClick={() => {
              hideCart();

              navigate("/products");
            }}
          >
            Shop Now!
          </button>
        </div>
      )}
      <footer className="cart__page--footer">
        {checkoutItems.checkout_cart.length !== 0 ? (
          <>
            <p className="cart_total">Total: {getTotal()}</p>
            <button
              // disabled
              onClick={() => {
                hideCart();
                if (location.pathname === "/checkout") {
                  window.location.reload();
                }
                navigate("/checkout");
              }}
            >
              Checkout
            </button>
          </>
        ) : (
          <p className="cart__empty--message">Select an Item to checkout</p>
        )}
      </footer>
    </section>
  );
};

export default Cart;
