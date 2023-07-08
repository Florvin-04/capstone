import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../AppContext/AppContext";

const Products = () => {
  const { products, route } = useGlobalContext();
  // const [products, setProducts] = useState([]);

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => {
        return (
          <div key={product.id}>
            <h2>{product.id}</h2>
            <p> {product.title}</p>
            <p>{product.description}</p>
            <img
              src={`${route}/uploads/${product.image}`}
              alt=""
            />
          </div>
        );
      })}
    </div>
  );
};

export default Products;
