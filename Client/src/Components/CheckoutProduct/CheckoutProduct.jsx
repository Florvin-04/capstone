import React from "react";
import "./CheckoutProduct.scss";
import { useGlobalContext } from "../../AppContext/AppContext";

const CheckoutProduct = ({ product, chekedProduct }) => {
  const { route, toPHCurrency } = useGlobalContext();
  // console.log(chekedProduct);
  // console.log(product.quantity);
  // console.log(product.id);
  return (
    <div className="checkoutCard__wrapper">
      <div>
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
              <p className="checkoutCard__description--price">{toPHCurrency(product.price)}</p>
              <p className="checkoutCard__description--quantity">x{product.quantity}</p>
            </div>
          </div>
        </div>

        <p className="checkoutCard__subtotal">
          Subtotal: {toPHCurrency(chekedProduct?.items[product.id]?.subtotal)}
        </p>
      </div>
    </div>
  );
};

export default CheckoutProduct;
