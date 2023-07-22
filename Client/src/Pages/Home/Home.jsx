import React, { useEffect, useState } from "react";
import "./Home.scss";
import banner from "../../../public/images/bg_hero.svg";
import hero_photo from "../../../public/images/woman_hero.png";
import { useGlobalContext } from "../../AppContext/AppContext";
import CardProduct from "../../Components/CardProduct/CardProduct";
import PageLoading from "../../Components/Loaders/PageLoading";
const Home = () => {
  const { products, generateRandomProducts } = useGlobalContext();
  // console.log(products);

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
                Discover Your Signature Look: Shop [Clothing Store Name] Today
              </p>
              <p className="hero__description">
                Find the perfect outfit that speaks to your individuality. Explore [Clothing Store
                Name]'s diverse range of styles to create your one-of-a-kind fashion statement.
              </p>
              <button className="hero__button">Shop Now</button>
            </div>
          </div>
        </section>

        <section className="featured_products mens container">
          <h2>Women's newly arrived product</h2>
          <div className="">
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
        </section>

        <section className="featured_products mens container">
          <h2>Men's newly arrived product</h2>
          <div className="">
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
        </section>
      </div>
    </>
  );
};

export default Home;
