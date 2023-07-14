import React from "react";
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
            <p className="checkoutCard__description--price">₱{product.price}</p>
            <p className="checkoutCard__description--quantity">
              x{chekedProduct.items[product.id].quantity}
            </p>
          </div>
        </div>
      </div>

      <p>
        {product.id} {chekedProduct.items[product.id].quantity}{" "}
        {chekedProduct.items[product.id].subtotal}
      </p>
    </>
  );
};

export default CheckoutProduct;
