import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
export const AppContext = createContext(null);

const savedCheckoutCart = localStorage.getItem("reciept_items");

export const AppProvider = ({ children }) => {
  const location = useLocation();
  const route = "http://localhost:8081";
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [loggedInName, setLoggedInName] = useState({
    first_name: "",
    last_name: "",
  });
  const [loggedInID, setLoggedInID] = useState("");

  const [loading, setLoading] = useState(false);

  const [isAutorize, setIsAuthorize] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState({
    checkout_cart: JSON.parse(savedCheckoutCart) || [],
  });

  useEffect(() => {
    localStorage.setItem("reciept_items", JSON.stringify(checkoutItems.checkout_cart));
  }, [checkoutItems]);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    // get all products
    axios
      .get(`${route}/products`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setProducts(res.data.Result);
        } else {
          console.log(res.data.Message);
        }
      })
      .catch((err) => console.log(err));

    //get authetication logged in

    axios.get("http://localhost:8081").then((response) => {
      if (response.data.Status === "success") {
        // console.log(response.data);
        setLoggedInName((prevData) => ({
          ...prevData,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        }));
        setLoggedInID(response.data.id);
        setIsAuthorize(true);
      } else {
        setIsAuthorize(false);
      }
    });
  }, []);

  async function getAddress() {
    try {
      const response = await axios.get(`${route}/user-address`, {
        params: { user_id: loggedInID },
      });

      if (response.data.Status === "success") {
        console.log(response);
        setAddresses(response.data.Result);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getTotal() {
    let total = 0;

    checkoutItems.checkout_cart.forEach((item) => {
      total += item.subtotal;
    });

    return toPHCurrency(total);
  }

  function toPHCurrency(number) {
    const currencyOptions = {
      style: "currency",
      currency: "PHP",
      currencyDisplay: "symbol",
    };

    return Number(number).toLocaleString("en-PH", currencyOptions);
  }

  return (
    <AppContext.Provider
      value={{
        products,
        route,
        loggedInName,
        loggedInID,
        isAutorize,
        checkoutItems,
        setCheckoutItems,
        getTotal,
        loading,
        setLoading,
        cartData,
        setCartData,
        getAddress,
        addresses,
        setAddresses,
        toPHCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
