import React, { useEffect, useState, useRef } from "react";
import "./Checkout.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import CheckoutProduct from "../../Components/CheckoutProduct/CheckoutProduct";
import Address from "../../Components/Address/Address";
import AddUpdateAddress from "../../Components/AddNewAddress/AddUpdateAddress";

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
  const { addresses, getTotal, checkoutItems, loggedInID, route, getAddress } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [chekedProduct, setChekedProduct] = useState({
    ids: [...checkoutItems.checkout_cart.map((item) => item.id)],
    items: {},
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
    displayDeliveryAddress();
    fetchCartData();
  }, [loggedInID]);

  useEffect(() => {
    let result = {};

    checkoutItems.checkout_cart.forEach((item) => {
      result[item.id] = { quantity: item.quantity, subtotal: item.subtotal };
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
          setLoading(true);
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
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* css in cartProduct */}
      <dialog
        ref={modalRef}
        className="cart_modal"
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
                type="button"
                onClick={() => setForms("newAddress")}
              >
                New Address
              </button>
              <div>
                <button
                  type="sbmit"
                  onClick={() => {
                    document.body.classList.remove("modal-open");
                  }}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    document.body.classList.remove("modal-open");
                    modalRef.current.close();
                    setForms("chooseAddress");
                  }}
                >
                  Cancel
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
        Checkout Page
        {hasCurrentAddress() === "false" ? (
          <button 
            onClick={() => {
              getAddress();
              document.body.classList.add("modal-open");
              modalRef.current.showModal();
            }}
          >
            address
          </button>
        ) : (
          <div className="shippingAddress">
            <h2>Shipping Address</h2>
            <button
              onClick={() => {
                getAddress();
                document.body.classList.add("modal-open");
                modalRef.current.showModal();
              }}
            >
              address
            </button>
            <div className="shippingAddress__information">
              <p>
                Contact Person: {currentAddress.contactPerson} | {currentAddress.phoneNumber}
              </p>
              <p>
                Addess: {currentAddress.address} | {currentAddress.zipCode}
              </p>
              <p>Shipping Method: Cash on Delivery</p>
              {chosentPaymentMethod}
              <div className="shipping__method">
                {paymentMethod.map((payment, idx) => {
                  return (
                    <div key={idx}>
                      <input
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
        )}

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
        <button onClick={placeOrder}>Place Order</button>
      </section>
    </>
  );
};

export default Checkout;
