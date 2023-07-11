import React, { useState } from "react";
import "./CartProduct.scss";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";

export const CartProduct = (product) => {
  const { route, loggedInID } = useGlobalContext();

  const [loading, seLoading] = useState(false);
  const [formState, setFormState] = useState(product.quantity);
  const [updatedQuantity, setUpdatedQuantity] = useState(product.quantity);

  function handleChange(e) {
    const target = e.target;

    const { value } = target;

    if (value < 0 || isNaN(value)) {
      return;
    }

    // if(value === ""){
    //     return 1
    // }
    setFormState(value);
  }

  function handleBlur(e) {
    if (updateCart == "") {
      console.log("Empty");
      return;
    }
    handleSubmit(e);
  }
//TODO, FRONTEND UPDATE
  function handleSubmit(e) {
    e.preventDefault();
    seLoading(true);

    axios
      .post(`${route}/update-cart`, {
        cartID: product.id,
        quantity: formState,
        action: "subtract",
      })
      .then((response) => {
        if (response.data.Status === "success") {
        //   console.log("submit");
        //   console.log(response.data.cart.quantity);

          setTimeout(() => {
            seLoading(false);
            setUpdatedQuantity(response.data.cart.quantity);
          }, 1000);
        } else {
          console.log(response);
          console.log(response.data.Message);
        }
      })
      .catch((err) => console.log("Frontend Error", err));

    console.log("Submit");
  }

  return (
    <div className="cartProduct__container">
      <div className="cartProduct__container--description">
        <img
          src={`${route}/uploads/${product.image}`}
          alt=""
        />
        <div className="cartProduct__name--container">
          <p className="cartProduct__name">{product.title}</p>
          <p className="cartProduct__price">
            ₱{product.price} <span>x{updatedQuantity}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="updateCart"
              id="updateCart"
              value={formState}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
            />
          </form>
        </div>
      </div>

      <p className="cartSubtotal">
        Subtotal: ₱{(product.price * updatedQuantity).toLocaleString()}
      </p>
    </div>
  );
};
