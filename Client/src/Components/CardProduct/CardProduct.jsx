import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";

const CardProduct = (product) => {
  const { route } = useGlobalContext();
  return (
    <>
      <Link to={`${product.id}`}>
        <h2>{product.id}</h2>
        <p> {product.title}</p>
        <p>{product.description}</p>
        <img
          src={`${route}/uploads/${product.image}`}
          alt=""
        />
      </Link>
    </>
  );
};

export default CardProduct;
