import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { json, useLocation } from "react-router-dom";
import axios from "axios";
export const AppContext = createContext(null);

const savedCheckoutCart = localStorage.getItem("reciept_items");

export const AppProvider = ({ children }) => {
  const location = useLocation();
  const route = "http://localhost:8081";
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    priceSort: "",
    categorySort: "",
  });

  const [cartData, setCartData] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [discount, setDiscount] = useState(0);

  const [loggedInName, setLoggedInName] = useState({
    first_name: "",
    last_name: "",
  });
  const [loggedInID, setLoggedInID] = useState("");

  const [loading, setLoading] = useState(false);

  const [isAutorize, setIsAuthorize] = useState(false);
  const [isCartShown, setIsCartShown] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState({
    checkout_cart: JSON.parse(savedCheckoutCart) || [],
  });

  function showCart() {
    document.body.classList.add("modal-open");
    setIsCartShown(true);
  }

  function hideCart() {
    document.body.classList.remove("modal-open");
    setIsCartShown(false);
  }

  useEffect(() => {
    localStorage.setItem("reciept_items", JSON.stringify(checkoutItems.checkout_cart));
  }, [checkoutItems]);
  axios.defaults.withCredentials = true;

  async function getProducts() {
    try {
      const response = await axios.get(`${route}/products`, {
        params: {
          filters: productFilter,
        },
      });

      if (response.data.Status === "Success") {
        // console.log(JSON.stringify(response.data.Result));
        setProducts(response.data.Result);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProducts();
  }, [loggedInID, productFilter]);

  useEffect(() => {
    // axios
    //   .get(`${route}/products`)
    //   .then((res) => {
    //     if (res.data.Status === "Success") {
    //       setProducts(res.data.Result);
    //     } else {
    //       console.log(res.data.Message);
    //     }
    //   })
    //   .catch((err) => console.log(err));

    //get authetication logged in

    axios.get(`${route}`).then((response) => {
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

  const fetchCartData = async () => {
    // setIsCartLoading(true);
    try {
      const response = await axios.get(`${route}/cart`, {
        params: { user_id: loggedInID },
      });

      if (response.data.Status === "success") {
        // console.log(response);
        setCartData(response.data.Result);
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        // setIsCartLoading(false);
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error.Message);
    }
  };

  async function getOrders() {
    try {
      const response = await axios.get(`${route}/orders`, {
        params: {
          user_id: loggedInID,
        },
      });

      if (response.data.Status == "success") {
        setOrders(response.data.Result);
        return;
      }
      console.log(response.data.Message);
      return;
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    fetchCartData();
  }, [loggedInID]);

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

    const discount_by = total * 0.15;
    return toPHCurrency(total - discount_by);
  }

  // function getTotal() {
  //   let total = 0;

  //   checkoutItems.checkout_cart.forEach((item) => {
  //     total += item.subtotal;
  //   });

  //   const discount_by = total * 0.15;
  //   return toPHCurrency(total - discount_by);
  // }

  function toPHCurrency(number) {
    const currencyOptions = {
      style: "currency",
      currency: "PHP",
      currencyDisplay: "symbol",
    };

    return Number(number).toLocaleString("en-PH", currencyOptions);
  }

  function generateRandomProducts(category) {
    const shuffledProducts = products
      .filter((product) => product.category === category)
      .sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, 4);
    return selectedProducts;
  }

  return (
    <AppContext.Provider
      value={{
        generateRandomProducts,
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
        fetchCartData,
        isCartShown,
        hideCart,
        showCart,
        setProductFilter,
        orders,
        setOrders,
        getOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
