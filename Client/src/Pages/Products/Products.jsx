import React, { useState, useEffect } from "react";
import "./Products.scss";
import { useGlobalContext } from "../../AppContext/AppContext";
import CardProduct from "../../Components/CardProduct/CardProduct";

const Products = () => {
  const { products, route } = useGlobalContext();

  return (
    <section className="">
      <h1>Products</h1>
      <div className="products">
        {products.map((product) => {
          return (
            <CardProduct
              key={product.id}
              {...product}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Products;
