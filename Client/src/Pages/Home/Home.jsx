import React, { useEffect, useState } from "react";
import "./Home.scss";
// import banner from "../../../public/images/bg_hero.svg";
import hero_photo from "/images/woman_hero.png";
import { useGlobalContext } from "../../AppContext/AppContext";
import CardProduct from "../../Components/CardProduct/CardProduct";
import PageLoading from "../../Components/Loaders/PageLoading";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { products, generateRandomProducts } = useGlobalContext();
  // console.log(products);
  const navigate = useNavigate();

  const [randomProducts, setRandomProducts] = useState({
    men: [],
    women: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const mens = products.filter((product) => product.category === "women's clothing");
  // console.log(mens);

  useEffect(() => {
    const womenGenerated = generateRandomProducts("women's clothing");
    const menGenerated = generateRandomProducts("men's clothing");
    if (products.length > 0) {
      setIsLoading(false);
      setRandomProducts((prevData) => ({
        ...prevData,
        men: menGenerated,
        women: womenGenerated,
      }));
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="page__loading">
        <PageLoading />;
      </div>
    );
  }

  return (
    <>
      <div className="home__page">
        <section className="hero__container">
          <div className="content__wrapper container">
            <div>
              <img
                src={hero_photo}
                alt="banner"
              />
            </div>
            <div>
              <p className="hero__title">
                Discover Your Signature Look: Shop With TrendEase Today
              </p>
              <p className="hero__description">
                Find the perfect outfit that speaks to your individuality. Explore TrendEase's diverse range of styles to create your one-of-a-kind fashion statement.
              </p>
              <button
                className="hero__button"
                onClick={() => navigate("/products")}
              >
                Shop Now
              </button>
            </div>
          </div>
        </section>

        <section className="featured_products womens container">
          <h2>Women's newly arrived product</h2>
          <div className="featured_product">
            {randomProducts.women.map((product) => {
              return (
                <CardProduct
                  key={product.id}
                  {...product}
                />

                // <>
                // <p>{product.title}</p>
                // </>
              );
            })}
          </div>
          <div className="featured_button">
            <button
              className=""
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>
          </div>
        </section>

        <section className="featured_products mens container">
          <h2>Men's newly arrived product</h2>
          <div className="featured_product">
            {randomProducts.men.map((product) => {
              return (
                <CardProduct
                  key={product.id}
                  {...product}
                />

                // <>
                // <p>{product.title}</p>
                // </>
              );
            })}
          </div>
          <div className="featured_button">
            <button
              className=""
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>
          </div>
        </section>

        <section className="discount container">
          <div className="discount__header">
            <p>Be part of our family</p>
            <p>Get this exclusive deals</p>
          </div>
          <div className="company__traits">
            <div>
              <img
                src="/images/settings.png"
                alt=""
              />
              <p>PEEK ON OUR NEWEST COLLECTIONS</p>
            </div>

            <div>
              <img
                src="/images/cart.png"
                alt=""
              />
              <p>QUICK & CHECKOUT</p>
            </div>

            <div>
              <img
                src="/images/bag.png"
                alt=""
              />
              <p>DEALS EXCLUSIVELY FOR YOU</p>
            </div>

            <div>
              <img
                src="/images/return.png"
                alt=""
              />
              <p>HASSLE-FREE EXCHANGES IN STORE</p>
            </div>

            <div>
              <img
                src="/images/shipping.png"
                alt=""
              />
              <p>FREE SHIPPING</p>
            </div>

            <div>
              <img
                src="/images/Gift.png"
                alt=""
              />
              <p>FIRST DIBS ON WELCOME GIFT</p>
            </div>
          </div>
          <div className="discount__price">
            <button onClick={() => navigate("/login")}>Get Your 15% Off</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
