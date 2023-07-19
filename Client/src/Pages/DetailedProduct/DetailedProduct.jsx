import React, { useEffect, useState } from "react";
import "./DetailedProduct.scss";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";
import Loaders from "../../Components/Loaders/Loaders";
import { BsCartPlus } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

const DetailedProduct = () => {
  const { products, route, loggedInID, fetchCartData, toPHCurrency } =
    useGlobalContext();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const target = e.target;
    const { name, value, type, checked } = target;

    if (isNaN(value) || value <= 0 || value >= 101) {
      return;
    }

    setQuantity(Number(value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    // setIsCartLoading(true)

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    console.log("submit");

    axios.defaults.withCredentials = true;
    // toast.promise(
    //   axios
    //     .post(`${route}/add-to-cart`, {
    //       product_id: id,
    //       user_id: loggedInID,
    //       quantity: quantity,
    //     })
    //     .then(async (response) => {
    //       if (response.data.Status === "success") {
    //         console.log(response.data.Message);
    //         console.log("cart data load");
    //         await fetchCartData();
    //         setQuantity(1);
    //       } else {
    //         console.log(response.data.Message);
    //       }
    //     })
    //     .catch((err) => console.log(err)),
    //   {
    //     pending: "Adding To Cart",
    //     success: "Item Added To Cart",
    //     error: "Error",
    //   },
    //   { autoClose: 1500 }
    // );
    // setIsCartLoading(false)

    try {
      const response = await axios.post(`${route}/add-to-cart`, {
        product_id: id,
        user_id: loggedInID,
        quantity: quantity,
      });

      if (response.data.Status === "success") {
        console.log(response.data.Message);
        await fetchCartData();
        setQuantity(1);
      }
    } catch (error) {
      console.log(err);
    }

    // axios
    //   .post(`${route}/add-to-cart`, {
    //     product_id: id,
    //     user_id: loggedInID,
    //     quantity: quantity,
    //   })
    //   .then((response) => {
    //     if (response.data.Status === "success") {
    //       console.log(response.data.Message);
    //       setQuantity(1);
    //     } else {
    //       console.log(response.data.Message);
    //     }
    //   })
    //   .catch((err) => console.log(err));
    setIsLoading(false);
  }

  return (
    <>
      <ToastContainer />
      <div>
        {products
          .filter((productId) => productId.id == id)
          .map((product) => {
            return (
              <div
                key={product.id}
                className="detailedProduct"
              >
                <div className="detailedProduct__img--container">
                  <img
                    src={`${route}/uploads/${product.image}`}
                    alt=""
                  />
                </div>

                <div className="detailedProduct__info">
                  <div>
                    <p className="detailedProduct__info--category">{product.category}</p>
                    <p className="detailedProduct__info--title">{product.title}</p>
                    <p className="detailedProduct__info--description">{product.description}</p>
                    <p className="detailedProduct__info--price">{toPHCurrency(product.price)}</p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form__buttons">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => (prev >= 100 ? prev : prev + 1))}
                      >
                        <svg
                          width="12"
                          height="12"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs>
                            <path
                              d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z"
                              id="b"
                            />
                          </defs>
                          <use
                            fill="#06c179"
                            fillRule="nonzero"
                            xlinkHref="#b"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        size="4"
                        onChange={handleChange}
                        value={quantity}
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => (prev <= 1 ? prev : prev - 1))}
                      >
                        <svg
                          width="12"
                          height="4"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs>
                            <path
                              d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z"
                              id="a"
                            />
                          </defs>
                          <use
                            fill="#06c179"
                            fillRule="nonzero"
                            xlinkHref="#a"
                          />
                        </svg>
                      </button>

                    </div>

                    <div className="form__submit--btn">
                      <button
                        disabled={isLoading}
                        type="submit"
                        className="submit_btn"
                      >
                        {isLoading ? (
                          <>
                            <Loaders
                              width="20px"
                              height="20px"
                              thickness="3px"
                            />
                            <span>Add to Cart</span>
                          </>
                        ) : (
                          <>
                            <BsCartPlus />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                      <button disabled={isLoading}>Buy Now</button>
                    </div>
                  </form>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default DetailedProduct;
