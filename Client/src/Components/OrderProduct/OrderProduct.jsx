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
          <p>Order ID: {order.order_id}</p>
          <p>{order.status}</p>
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
              <p>{toPHCurrency(order.price)}</p>
              <p>x{order.quantity}</p>
              <p>{toPHCurrency(order.quantity * order.price)}</p>
            </div>
          </div>
        </div>
        <div className="orderProduct__footer">
          <div>
            <p className="contact__person">
              Contact Person:{" "}
              <span>
                {order.contact_person} | {order.phone_number}
              </span>
            </p>
            <p>
              Adddress: <span>{order.delivery_address}</span>
            </p>
          </div>
          <div>
            <p>{order.payment_method}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderProduct;
