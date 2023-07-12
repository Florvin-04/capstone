import React, { useState, useRef } from "react";
import "./CartProduct.scss";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";

export const CartProduct = ({ product, setLoadingCart }) => {
  const { route, loggedInID } = useGlobalContext();

  const [loading, seLoading] = useState(false);
  // const [formState, setFormState] = useState(product.quantity);

  const [formState, setFormState] = useState({
    checkout_cart: [],
    quantity: product.quantity,
  });

  const [updatedQuantity, setUpdatedQuantity] = useState(product.quantity);
  const modalRef = useRef();

  function handleChange(e, id = null) {
    const target = e.target;
    const { value, type, checked } = target;
    const { checkout_cart } = formState;

    if (value < 0 || (isNaN(value) && type !== "checkbox") || value > 100) {
      return;
    }

    const updateCart =
      checked && type == "checkbox"
        ? [...checkout_cart, id]
        : checkout_cart.filter((ids) => ids !== id);

    setFormState((prevData) => ({
      ...prevData,
      checkout_cart: updateCart,
      ...(type !== "checkbox" && { quantity: value }),
    }));
  }

  // function handleChange(e, id = null) {
  //   const target = e.target;
  //   const { value, type, checked } = target;
  //   const { checkout_cart } = formState;

  //   if (value < 0 || isNaN(value) || value > 100) {
  //     return;
  //   }

  //   let updateCart;
  //   if (checked) {
  //     updateCart = [...checkout_cart, id];
  //   } else {
  //     updateCart = checkout_cart.filter((productId) => productId !== id);
  //   }

  //   setFormState((prevData) => ({
  //     ...prevData,
  //     checkout_cart: updateCart,
  //   }));
  // }

  function handleBlur(e) {
    // if(updateCart)
    handleSubmit(e);
  }

  function handleSubmit(e, action = "update", id) {
    e.preventDefault();
    if (
      formState.quantity == "" ||
      formState.quantity == 0 ||
      (formState.quantity == updatedQuantity && action == "update")
    ) {
      setFormState((prevData) => ({
        ...prevData,
        quantity: updatedQuantity,
      }));
      return;
    }

    if (formState.quantity == 1 && action == "subtract") {
      console.log("delete", id);
      document.body.classList.add("modal-open");
      modalRef.current.showModal(id);
      return;
    }

    seLoading(true);

    axios
      .post(`${route}/update-cart`, {
        cartID: product.id,
        quantity: formState.quantity,
        action,
      })
      .then((response) => {
        if (response.data.Status === "success") {
          //   console.log("submit");
          //   console.log(response.data.cart.quantity);

          setTimeout(() => {
            seLoading(false);

            if (response.data.cart.action == "add") {
              setFormState((prevData) => ({
                ...prevData,
                quantity: Number(prevData.quantity) + 1,
              }));
            }

            if (response.data.cart.action == "subtract") {
              setFormState((prevData) => ({
                ...prevData,
                quantity: Number(prevData.quantity) - 1,
              }));
            }

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

  function handleDelete(id) {
    setLoadingCart(true);
    axios
      .delete(`${route}/remove-item-to-cart`, {
        data: {
          productID: id,
        },
      })
      .then((response) => {
        if (response.data.Status === "success") {
          console.log("Deleted");
          setLoadingCart(false);
        } else {
          console.log(response.data.Message);
        }
      })
      .catch((err) => console.log("frontent Error", err));
  }

  return (
    <>
      <dialog
        ref={modalRef}
        className="cart_modal"
      >
        My modal
        <button
          onClick={() => {
            document.body.classList.remove("modal-open");
            handleDelete(product.id);
            modalRef.current.close();
          }}
        >
          Delete Item
        </button>
        <button
          onClick={() => {
            document.body.classList.remove("modal-open");

            modalRef.current.close();
          }}
        >
          Cancel
        </button>
      </dialog>

      <input
        type="checkbox"
        name="checkout_cart"
        id={product.id}
        checked={formState.checkout_cart.includes(product.id)}
        onChange={(e) => handleChange(e, product.id)}
      />

      <label
        htmlFor={product.id}
        className="cartProduct__container"
      >
        <div className="cartProduct__container--description">
          <img
            src={`${route}/uploads/${product.image}`}
            alt=""
          />
          <div className="cartProduct__name--container">
            <div>
              <p className="cartProduct__name">{product.title}</p>
              <p className="cartProduct__price">₱{product.price}</p>
            </div>
            <div className="cart__updating--container">
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => handleSubmit(e, "add", product.id)}
                >
                  +
                </button>
                <input
                  type="text"
                  name="updateCart"
                  id="updateCart"
                  value={formState.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  size={3}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => handleSubmit(e, "subtract", product.id)}
                >
                  -
                </button>
              </form>
              <div>
                <button>ViewPoduct</button>
                <button
                  onClick={() => {
                    document.body.classList.add("modal-open");
                    modalRef.current.showModal();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="cartSubtotal">
          Subtotal: ₱{(product.price * updatedQuantity).toLocaleString()}
        </p>
      </label>
    </>
  );
};
