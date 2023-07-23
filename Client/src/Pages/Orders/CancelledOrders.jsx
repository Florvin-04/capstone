import { useEffect, useState } from "react";
import { useGlobalContext } from "../../AppContext/AppContext";
import OrderProduct from "../../Components/OrderProduct/OrderProduct";
import PageLoading from "../../Components/Loaders/PageLoading";

function CancelledOrders() {
  const { orders, getOrders, loggedInID } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(true);

  function filteredOrders() {
    return orders.filter((order) => order.status === "Cancelled");
  }

  useEffect(() => {
    getOrders();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [loggedInID]);

  if (isLoading) {
    return (
      <div className="page__loading">
        <PageLoading />
      </div>
    );
  }

  return (
    <>
      <div className="orders__item--container">
        {filteredOrders().map((order, idx) => {
          return (
            <OrderProduct
              key={order.order_id}
              {...order}
            />
          );
        })}
      </div>
    </>
  );
}

export default CancelledOrders;
