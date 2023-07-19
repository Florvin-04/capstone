import React, { useState, useRef, useEffect, useMemo } from "react";
import "./CartProduct.scss";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export const CartProduct = ({ product, setLoadingCart }) => {
  const { route, setCheckoutItems, checkoutItems, toPHCurrency, fetchCartData } =
    useGlobalContext();

  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState(product.quantity);
  const [inputPreviousValue, setInputPreviousValue] = useState(product.quantity);

  const [subtotal, setSubtotal] = useState(0);
  const modalRef = useRef();

  useEffect(() => {
    setInputValue(product.quantity);
  }, [product]);

  function handleChange(e, id = null) {
    const target = e.target;
    const { value, type, checked } = target;
    const { checkout_cart } = checkoutItems;

    if (value < 0 || (isNaN(value) && type !== "checkbox") || value > 100) {
      return;
    }

    const updateCart =
      checked && type == "checkbox"
        ? [...checkout_cart, { id: id, subtotal: subtotal }]
        : checkout_cart.filter((item) => item.id != id);

    // const updateSubtotal =
    //   checked && type == "checkbox"
    //     ? [...subtotals, subtotal]
    //     : subtotals.filter((ids) => ids !== subtotal);

    setCheckoutItems((prevData) => ({
      ...prevData,
      checkout_cart: updateCart,
    }));

    if (type !== "checkbox") {
      setInputValue(value);
    }
  }

  useEffect(() => {
    // setLoadingCart(true)
    //  console.log(inputValue, updatedQuantity);
    const updatedSubtotal = product.price * inputValue;
    setSubtotal(updatedSubtotal);

    setCheckoutItems((prevData) => {
      const update = prevData.checkout_cart.map((item) => {
        if (item.id == product.id) {
          return { ...item, subtotal: updatedSubtotal, quantity: inputValue };
        }
        return item;
      });
      return { ...prevData, checkout_cart: update };
    });
  }, [loading, inputValue]);

  function handleBlur(e) {
    handleSubmit(e);
  }

  function handleSubmit(e, action = "update", id) {
    e.preventDefault();

    if (
      isNaN(inputValue) ||
      inputValue == "" ||
      inputValue == 0 ||
      (inputValue == inputPreviousValue && action == "update")
    ) {
      setInputValue(inputPreviousValue);
      return;
    }

    if (inputValue == 1 && action == "subtract") {
      console.log("delete", id);
      document.body.classList.add("modal-open");
      modalRef.current.showModal(id);
      return;
    }

    setLoading(true);

    axios
      .post(`${route}/update-cart`, {
        cartID: product.id,
        quantity: inputValue,
        action,
      })
      .then((response) => {
        if (response.data.Status === "success") {
          //   console.log("submit");
          //   console.log(response.data.cart.quantity);

          setTimeout(() => {
            setLoading(false);

            if (response.data.cart.action == "add") {
              setInputValue((prevData) => Number(prevData) + 1);
            }

            if (response.data.cart.action == "subtract") {
              setInputValue((prevData) => Number(prevData) - 1);
            }

            setInputPreviousValue(response.data.cart.quantity);
          }, 1000);
        } else {
          console.log(response);
          console.log(response.data.Message);
        }
      })
      .catch((err) => console.log("Frontend Error", err));

    console.log("Submit");
  }

  async function handleDelete(id) {
    setLoading(true);
    checkoutItems.checkout_cart.filter((item) => item.id != id);
    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
      toast.success(
        "Deleting Item",
        {
          position: toast.POSITION.TOP_CENTER,
        },
        { autoClose: 1000 }
      );
    });
    modalRef.current.close();

    // setLoadingCart(true);
    setCheckoutItems((prevData) => ({
      ...prevData,
      checkout_cart: prevData.checkout_cart.filter((item) => item.id != id),
    }));

    try {
      const response = await axios.delete(`${route}/remove-item-to-cart`, {
        data: {
          productID: id,
        },
      });

      if (response.data.Status === "success") {
        console.log("Deleted");
        await fetchCartData();
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log("frontent Error", err);
    }

    // axios
    //   .delete(`${route}/remove-item-to-cart`, {
    //     data: {
    //       productID: id,
    //     },
    //   })
    //   .then((response) => {
    //     if (response.data.Status === "success") {
    //       console.log("Deleted");
    //     } else {
    //       console.log(response.data.Message);
    //     }
    //   })
    //   .catch((err) => console.log("frontent Error", err));
  }

  return (
    <>
      <ToastContainer autoClose={1000} />
      <dialog
        ref={modalRef}
        className="cart_modal"
      >
        My modal
        <button
          disabled={loading}
          onClick={() => {
            document.body.classList.remove("modal-open");
            handleDelete(product.id);
          }}
        >
          Delete Item
        </button>
        <button
          disabled={loading}
          onClick={() => {
            document.body.classList.remove("modal-open");

            modalRef.current.close();
          }}
        >
          Cancel
        </button>
      </dialog>

      <input
        hidden
        className="checkout_cart"
        type="checkbox"
        name="checkout_cart"
        id={product.id}
        checked={checkoutItems.checkout_cart.some((item) => item.id == product.id)}
        onChange={(e) => {
          handleChange(e, product.id);
          // getsubtotal(product.id, subtotal);
        }}
      />

      <label
        htmlFor={product.id}
        className="cartProduct__container"
      >
        <div className="cartProduct__container--description">
          <div className="cartProduct__img--container">
            <img
              // width="150px"
              src={`${route}/uploads/${product.image}`}
              alt=""
            />
          </div>
          <div className="cartProduct__info">
            <p className="cartProduct__category">{product.category}</p>
            <div className="cartProduct__name--container">
              <div>
                <p className="cartProduct__name">{product.title}</p>
                {/* <p className="cartProduct__price">{toPHCurrency(product.price)}</p> */}
              </div>
              <div className="cartProduct__updating--container">
                <div>
                  <form onSubmit={handleSubmit}>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={(e) => handleSubmit(e, "add", product.id)}
                    >
                      <svg
                        width="12"
                        height="12"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <defs>
                          <path
                            d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z"
                            id="b"
                          />
                        </defs>
                        <use
                          fill="#06c179"
                          fillRule="nonzero"
                          xlinkHref="#b"
                        />
                      </svg>
                    </button>
                    <input
                      type="text"
                      name="updateCart"
                      id="updateCart"
                      value={inputValue}
                      // value={product.quantity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      size={1}
                    />
                    <button
                      type="button"
                      disabled={loading}
                      onClick={(e) => handleSubmit(e, "subtract", product.id)}
                    >
                      <svg
                        width="12"
                        height="4"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <defs>
                          <path
                            d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z"
                            id="a"
                          />
                        </defs>
                        <use
                          fill="#06c179"
                          fillRule="nonzero"
                          xlinkHref="#a"
                        />
                      </svg>
                    </button>
                  </form>

                  <p className="cartProduct__price">{toPHCurrency(product.price)}</p>
                  <p className="cartSubtotal">{toPHCurrency(subtotal)}</p>
                </div>
                {/* <div>
                  <button>ViewPoduct</button>
                  <button
                    className="cart__delete--btn"
                    onClick={() => {
                      document.body.classList.add("modal-open");
                      modalRef.current.showModal();
                    }}
                  >
                    Delete
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* <p className="cartSubtotal">{toPHCurrency(subtotal)}</p> */}
      </label>
    </>
  );
};
