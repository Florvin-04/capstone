import React, { useEffect, useState, useRef } from "react";
import "./Checkout.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import CheckoutProduct from "../../Components/CheckoutProduct/CheckoutProduct";
import Address from "../../Components/Address/Address";
import AddUpdateAddress from "../../Components/AddNewAddress/AddUpdateAddress";
import PageLoading from "../../Components/Loaders/PageLoading";

const initialAddressValues = {
  address: "",
  contactPerson: "",
  phoneNumber: "",
  zipCode: "",
};

const paymentMethod = [
  { method: "Cash On Delivery", available: true },
  { method: "Gcash", available: false },
  { method: "Link Bank Account", available: false },
  { method: "Credit / Debit Card", available: false },
  { method: "E-wallet", available: true },
];

const Checkout = () => {
  const navigate = useNavigate();
  const {
    addresses,
    getTotal,
    checkoutItems,
    loggedInID,
    route,
    getAddress,
    fetchCartData,
    cartData,
  } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [chekedProduct, setChekedProduct] = useState({
    ids: [...checkoutItems.checkout_cart.map((item) => item.id)],
    items: {},
  });

  const [errorMessage, setErrorMessage] = useState({
    noAddress: "",
  });

  const [chosenAddress, setChosenAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState({
    ...initialAddressValues,
  });
  const [chosentPaymentMethod, setChosentPaymentMethod] = useState("");

  const [editAddress, setEditAddress] = useState({});
  const [checkoutData, setCheckoutData] = useState([]);
  const [forms, setForms] = useState("chooseAddress");
  const modalRef = useRef();

  const displayDeliveryAddress = async () => {
    try {
      const response = await axios.get(`${route}/user-delivery-address`, {
        params: {
          user_id: loggedInID,
        },
      });

      if (response.data.Status === "success") {
        console.log(response.data.Message);

        setCurrentAddress({
          address: response.data.Result?.deliveryAddress,
          contactPerson: response.data.Result?.contact_person,
          phoneNumber: response.data.Result?.phone_number,
          zipCode: response.data.Result?.zip_code,
        });

        return;
      }

      if (response.data.Status === "no result") {
        console.log(response.data.Message);
        return;
      }
      return response.data.Message;
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchCartData = async () => {
  //   try {
  //     const response = await axios.get(`${route}/cart`, {
  //       params: { user_id: loggedInID },
  //     });

  //     if (response.data.Status === "success") {
  //       setCheckoutData(response.data.Result);
  //       setLoading(false);
  //     } else {
  //       console.log(response.data.Message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    displayDeliveryAddress();
    fetchCartData();

    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }, [loggedInID]);

  useEffect(() => {
    let result = {};

    checkoutItems.checkout_cart.forEach((item) => {
      result[item.id] = { subtotal: item.subtotal };
    });

    setChekedProduct((prevData) => ({
      ...prevData,
      items: result,
    }));
  }, []);

  function handleChangeAddress(e) {
    const target = e.target;
    setChosenAddress(target.value);
  }

  async function handleSubmitAddressForm(e) {
    e.preventDefault();

    if (chosenAddress === "") {
      return;
    }
    setErrorMessage((prevData) => ({
      ...prevData,
      noAddress: "",
    }));

    await updateDeliveryAddress();
    hasCurrentAddress();
    displayDeliveryAddress();
    modalRef.current.close();
    // setCurrentAddress(chosenAddress);
  }

  const updateDeliveryAddress = async () => {
    try {
      const response = await axios.post(`${route}/add-update-delivery-address`, {
        user_id: loggedInID,
        new_delivery_address: chosenAddress,
      });

      if (response.data.Status === "success") {
        console.log(response.data.Message);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function placeOrder() {
    if (hasCurrentAddress() === "false") {
      setErrorMessage((prevData) => ({
        ...prevData,
        noAddress: "Add a delivery Address to Proceed",
      }));
      return;
    }

    try {
      const response = await axios.post(`${route}/place-order`, {
        items: [...checkoutItems.checkout_cart.map((item) => item.id)],
        addressInfo: currentAddress,
        payment_method: chosentPaymentMethod,
      });

      if (response.data.Status === "success") {
        console.log(response.data.Message);
        localStorage.removeItem("reciept_items");

        await new Promise((resolve) => {
          // setLoading(true);
          setTimeout(resolve, 2000);
        });

        navigate("/orders");
        window.location.reload();

        return;
      }
      console.log(response.data.Message);
      return;
    } catch (error) {
      console.log("frontend", error);
    }
  }

  function hasCurrentAddress() {
    return Object.values(currentAddress).some((value) => value === "") ? "false" : "true";
  }

  // console.log(hasCurrentAddress());

  if (loading) {
    return (
      <div className="page__loading">
        <PageLoading />
      </div>
    );
  }

  return (
    <>
      {/* css in cartProduct */}
      <dialog
        ref={modalRef}
        className="cart_modal changeAddress__modal"
      >
        <form onSubmit={handleSubmitAddressForm}>
          {forms === "chooseAddress" && (
            <div>
              <h2>My Address</h2>
              {addresses.length > 0 ? (
                addresses.map((address, idx) => {
                  return (
                    <Address
                      key={idx}
                      address={address}
                      idx={idx}
                      handleChangeAddress={handleChangeAddress}
                      chosenAddress={chosenAddress}
                      setForms={setForms}
                      setEditAddress={setEditAddress}
                    />
                  );
                })
              ) : (
                <h2>No address</h2>
              )}

              <button
                className="addNewAddress--btn"
                type="button"
                onClick={() => setForms("newAddress")}
              >
                + New Address
              </button>

              <div className="modal__submit--addressBtn">
                <button
                  className="changeAddress__btn--cancel"
                  type="button"
                  onClick={() => {
                    document.body.classList.remove("modal-open");
                    modalRef.current.close();
                    setForms("chooseAddress");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="changeAddress__btn--submit"
                  type="sbmit"
                  onClick={() => {
                    document.body.classList.remove("modal-open");
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>

        {(forms === "newAddress" || forms === "editAddress") && (
          <AddUpdateAddress
            setForms={setForms}
            forms={forms}
            editAddress={editAddress}
          />
        )}
      </dialog>

      <section className="checkout__section">
        <h2 className="page__title">Checkout</h2>
        {hasCurrentAddress() === "false" ? (
          <button
            onClick={() => {
              getAddress();
              document.body.classList.add("modal-open");
              modalRef.current.showModal();
            }}
          >
            Add Delivery Adress
          </button>
        ) : (
          <div className="shippingAddress">
            <h2>Shipping Address</h2>

            <button
              className="changeAddress"
              onClick={() => {
                getAddress();
                document.body.classList.add("modal-open");
                modalRef.current.showModal();
              }}
            >
              Change Address
            </button>
            <div className="shippingAddress__information">
              <p>
                Contact Person:{" "}
                <span>
                  {currentAddress.contactPerson} | {currentAddress.phoneNumber}
                </span>
              </p>
              <p>
                Delivery Address:{" "}
                <span>
                  {currentAddress.address} | {currentAddress.zipCode}
                </span>
              </p>
              {/* {chosentPaymentMethod} */}
              <div className="shipping__method">
                <p>Shipping Method: </p>
                <div className="shipping__method--options">
                  {paymentMethod.map((payment, idx) => {
                    return (
                      <div key={idx}>
                        <input
                          hidden
                          disabled={!payment.available}
                          type="radio"
                          name="shipping_method"
                          value={payment.method}
                          id={payment.method}
                          checked={chosentPaymentMethod === `${payment.method}`}
                          onChange={(e) => setChosentPaymentMethod(e.target.value)}
                        />

                        <label htmlFor={payment.method}>{payment.method}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="checkoutProduct__wrapper">
          {cartData.map((product) => {
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
          <div className="place__order--wrapper">
            <p>Total: {getTotal()}</p>
            <button onClick={placeOrder}>Place Order</button>
            {errorMessage.noAddress && <p>{errorMessage.noAddress}</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
