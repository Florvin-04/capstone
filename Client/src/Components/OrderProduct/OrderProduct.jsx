import React from "react";
import "./OrderProduct.scss";
import { useGlobalContext } from "../../AppContext/AppContext";

function OrderProduct(order) {
  const { route, toPHCurrency } = useGlobalContext();
  return (
    <>
      <div
        key={order.id}
        className="orderProduct"
      >
        <header className="orderProduct__header">
          <p className="order__id">
            <span>Order ID: </span>
            <span>{order.order_id}</span>
          </p>
          <p className="order__status">{order.status}</p>
        </header>
        <div className="orderProduct__container">
          <div className="image--container">
            <img
              width="100px"
              src={`${route}/uploads/${order.image}`}
              alt=""
            />
          </div>

          <div className="orderProduct__container--description">
            <div>
              <p className="orderProduct__category">{order.category}</p>
              <p className="orderProduct__title">{order.title}</p>
            </div>
            <div>
              <p className="orderProduct__price">{toPHCurrency(order.price)}</p>
              <p className="orderProduct__quantity">x{order.quantity}</p>
              <p className="orderProduct__subtotal">{toPHCurrency(order.quantity * order.price)}</p>
            </div>
          </div>
        </div>
        <div className="orderProduct__footer">
          <div>
            <p className="contact__person">
              <span>Contact Person:</span>
              <span>
                {order.contact_person} | {order.phone_number}
              </span>
            </p>
            <p>
              <span>Adddress:</span> <span>{order.delivery_address}</span>
            </p>
          </div>
          <div>
            <p className="orderPaymentMethod">{order.payment_method}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderProduct;
