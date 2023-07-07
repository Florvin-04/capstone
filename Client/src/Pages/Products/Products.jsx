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
          <>
            <p key={product.id}> {product.title}</p>
            <p>{product.description}</p>
            <img
              src={`${route}/uploads/${product.image}`}
              alt=""
            />
          </>
        );
      })}
    </div>
  );
};

export default Products;
