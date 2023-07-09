import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const route = "http://localhost:8081";
  const [products, setProducts] = useState([]);
  const [loggedInName, setLoggedInName] = useState("");
  const [loggedInID, setLoggedInID] = useState("");

  const [isAutorize, setIsAuthorize] = useState(false);

  

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:8081").then((response) => {
      if (response.data.Status === "success") {
        // console.log(response);
        setLoggedInName(response.data.name)
        setLoggedInID(response.data.id)
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

  return (
    <AppContext.Provider
      value={{
        products,
        route,
        loggedInName,
        loggedInID,
        isAutorize
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
