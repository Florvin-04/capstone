import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const route = "http://localhost:8081";
  const [products, setProducts] = useState([]);

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

  return <AppContext.Provider value={{ products, route }}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
