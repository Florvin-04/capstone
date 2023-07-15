import React from "react";
import "./CheckoutProduct.scss";
import { useGlobalContext } from "../../AppContext/AppContext";

const CheckoutProduct = ({ product, chekedProduct }) => {
  const { route } = useGlobalContext();
  return (
    <>
      <div className="checkoutCard">
        <img
          src={`${route}/uploads/${product.image}`}
          alt=""
          width={100}
        />

        <div className="checkoutCard__description">
          <p className="checkoutCard__description--category">{product.category}</p>
          <div>
            <p className="checkoutCard__description--title">{product.title}</p>
            <div>
              <p className="checkoutCard__description--price">₱{product.price.toLocaleString()}</p>
              <p className="checkoutCard__description--quantity">x{product.quantity}</p>
              <p className="checkoutCard__description--price">
                ₱{chekedProduct.items[product.id].subtotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p></p>
    </>
  );
};

export default CheckoutProduct;
