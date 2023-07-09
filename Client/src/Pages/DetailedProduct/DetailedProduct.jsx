import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";

const DetailedProduct = () => {
  const { products, route, loggedInID } = useGlobalContext();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  function handleChange(e) {
    const target = e.target;
    const { name, value, type, checked } = target;

    if (isNaN(value) || value <= 0) {
      return;
    }

    setQuantity(value);
  }

  function handleSubmit(e, productID) {
    e.preventDefault();

    // console.log(Number(quantity));
    // console.log(productID);
    // console.log(loggedInID);
    // console.log("Submit");
    axios.defaults.withCredentials = true;
    axios
      .post(`${route}/add-to-cart`, {
        product_id: id,
        user_id: loggedInID,
        quantity: quantity,
      })
      .then((response) => {
        if (response.data.Status === "success") {
          console.log(response.data.Message);
        } else {
          console.log(response.data.Message);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div>
        {products
          .filter((productId) => productId.id == id)
          .map((product) => {
            return (
              <div key={product.id}>
                <p>{product.title}</p>
                <img
                  src={`${route}/uploads/${product.image}`}
                  alt=""
                />
                <form onSubmit={(e) => handleSubmit(e, product.id)}>
                  <div>
                    <input
                      type="text"
                      name="quantity"
                      id="quantity"
                      onChange={handleChange}
                      value={quantity}
                    />
                  </div>
                  <button type="submit">Add to Cart</button>
                </form>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default DetailedProduct;
