import React from "react";
import "./CheckoutProduct.scss";
import { useGlobalContext } from "../../AppContext/AppContext";

const CheckoutProduct = ({ product, chekedProduct }) => {
  const { route, toPHCurrency } = useGlobalContext();
  return (
    <div className="checkoutCard__wrapper">
      <div className="checkoutCard">
        <img
          src={`${route}/uploads/${product.image}`}
          alt=""
          width={100}
        />

        <div className="checkoutCard__description">
          <div>
            <p className="checkoutCard__description--category">{product.category}</p>
            <p className="checkoutCard__description--title">{product.title}</p>
          </div>
          <div>
            <p className="checkoutCard__description--price">₱{product.price.toLocaleString()}</p>
            <p className="checkoutCard__description--quantity">x{product.quantity}</p>
          </div>
        </div>
      </div>

      <p className="checkoutCard__subtotal">
       Subtotal: {toPHCurrency(chekedProduct.items[product.id].subtotal)}
      </p>
    </div>
  );
};

export default CheckoutProduct;
