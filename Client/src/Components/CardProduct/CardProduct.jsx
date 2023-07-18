import React from "react";
import "./CardProduct.scss";
import { Link, NavLink } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";

const CardProduct = (product) => {
  const { route,toPHCurrency } = useGlobalContext();
  return (
    <>
      <NavLink
        to={`${product.id}`}
        className="cardProduct"
      >
        <div className="cardProduct__image--container">
          <img
            src={`${route}/uploads/${product.image}`}
            alt=""
          />
        </div>
        <p className="cardProduct__info--category">{product.category}</p>
        <div className="cardProduct__info">
          <p className="cardProduct__info--title">{product.title}</p>
          <p className="cardProduct__info--price">{toPHCurrency(product.price)}</p>
        </div>
      </NavLink>
    </>
  );
};

export default CardProduct;
