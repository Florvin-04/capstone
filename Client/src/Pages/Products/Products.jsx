import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";
import CardProduct from "../../Components/CardProduct/CardProduct";

const Products = () => {
  const { products, route } = useGlobalContext();

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => {
        return (
          <CardProduct
            key={product.id}
            {...product}
          />
        );
      })}
    </div>
  );
};

export default Products;
