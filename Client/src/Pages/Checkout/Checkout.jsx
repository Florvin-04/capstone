import React, { useEffect, useState, useRef } from "react";
import "./Checkout.scss";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
import CheckoutProduct from "../../Components/CheckoutProduct/CheckoutProduct";
import Address from "../../Components/Address/Address";
import AddNewAddress from "../../Components/AddNewAddress/AddNewAddress";

const Checkout = () => {
  const {
    // setAddresses,
    addresses,
    getTotal,
    formState,
    loggedInID,
    route,
    getAddress,
  } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [chekedProduct, setChekedProduct] = useState({
    ids: [...formState.checkout_cart.map((item) => item.id)],
    items: {},
  });
  const [chosenAddress, setChosenAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState({
    address: "",
    contactPerson: "",
    phoneNumber: "",
    zipCode: "",
  });
  const [checkoutData, setCheckoutData] = useState([]);
  const [forms, setForms] = useState("chooseAddress");
  const modalRef = useRef();

  const fetchDeliveryAddress = async () => {
    try {
      const response = await axios.get(`${route}/user-delivery-address`, {
        params: { user_id: loggedInID },
      });

      if (response.data.Status === "success") {
        console.log(response.data);

        setCurrentAddress({
          address: response.data.Result?.deliveryAddress,
          contactPerson: response.data.Result?.contact_person,
          phoneNumber: response.data.Result?.phone_number,
          zipCode: response.data.Result?.zip_code,
        });
      } else {
        console.log(response.data.Message);
      }
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
    fetchDeliveryAddress();
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

  function handleChangeAddress(e) {
    const target = e.target;
    setChosenAddress(target.value);
  }

  async function handleSubmitAddressForm(e) {
    e.preventDefault();
    if (forms === "chooseAddress") {
      await updateDeliveryAddress();
      fetchDeliveryAddress();
    }

    if (forms === "newAddress") {
      console.log("submit new");
    }
    // setCurrentAddress(chosenAddress);
  }

  const updateDeliveryAddress = async () => {
    try {
      const response = await axios.post(`${route}/update-delivery-address`, {
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
              {addresses.map((address, idx) => {
                return (
                  <Address
                    key={idx}
                    address={address}
                    idx={idx}
                    handleChangeAddress={handleChangeAddress}
                    chosenAddress={chosenAddress}
                  />
                );
              })}
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
                    modalRef.current.close();
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

        {forms === "newAddress" && <AddNewAddress setForms={setForms} />}
      </dialog>

      <section className="checkout__section">
        Checkout Page
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
              Addess {currentAddress.address} | {currentAddress.zipCode}
            </p>
          </div>
        </div>
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
      </section>
    </>
  );
};

export default Checkout;
