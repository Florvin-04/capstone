import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const route = "http://localhost:8081";
  const [products, setProducts] = useState([]);
  const [loggedInName, setLoggedInName] = useState("");
  const [loggedInID, setLoggedInID] = useState("");

  const [loading, setLoading] = useState(false);

  const [isAutorize, setIsAuthorize] = useState(false);
  const [formState, setFormState] = useState({
    checkout_cart: [],
    subtotals: [],
    // quantity: product.quantity,
  });

  const [total, setTotal] = useState({});

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:8081").then((response) => {
      if (response.data.Status === "success") {
        // console.log(response);
        setLoggedInName(response.data.name);
        setLoggedInID(response.data.id);
        setIsAuthorize(true);
      } else {
        setIsAuthorize(false);
      }
    });
  }, []);
  // get all products
  useEffect(() => {
    axios
      .get(`${route}/products`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setProducts(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(formState);

  function getTotal() {
    const total = formState.subtotals.reduce((acc, currentVal) => {
      return acc + currentVal;
    }, 0);

    return total;
  }

  useEffect(() => {
    getTotal();
    console.log(formState);
    console.log("from global");
  }, [loading]);

  // const getTotal = useMemo(() => {
  //   const total = formState.subtotals.reduce((acc, currentVal) => {
  //     return acc + currentVal;
  //   }, 0);

  //   return total;
  // }, [loading]);

  return (
    <AppContext.Provider
      value={{
        products,
        route,
        loggedInName,
        loggedInID,
        isAutorize,
        formState,
        setFormState,
        total,
        setTotal,
        getTotal,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
