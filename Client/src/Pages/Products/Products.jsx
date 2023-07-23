import React, { useState, useRef, useEffect } from "react";
import "./Products.scss";
import { useGlobalContext } from "../../AppContext/AppContext";
import CardProduct from "../../Components/CardProduct/CardProduct";
import PageLoading from "../../Components/Loaders/PageLoading";

const filterInitialValues = {
  filterByName: "",
  minPrice: "",
  maxPrice: "",
  priceSort: "",
  categorySort: "",
};

const Products = () => {
  const { products, route, setProductFilter, loggedInID } = useGlobalContext();

  const [categories, setCategories] = useState(["all", "men's clothing", "women's clothing"]);

  const [loading, setLoading] = useState(true);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const formRef = useRef(null);
  const [filters, setFilters] = useState(filterInitialValues);

  function handleChange(e) {
    const target = e.target;

    const { value, type, checked, name } = target;

    if (name === "minPrice" && (isNaN(value) || value < 0)) {
      return;
    }

    setFilters((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsShowFilter(false);

    setProductFilter((prevData) => ({
      ...prevData,
      search: filters.filterByName,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      priceSort: filters.priceSort,
      categorySort: filters.categorySort,
    }));
  }

  function handleBlur(e) {
    handleSubmit(e);
  }

  function handleReset(e) {
    e.preventDefault();
    setFilters(filterInitialValues);
    // formRef.current.submit();
    formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="page__loading">
        <PageLoading />
      </div>
    );
  }

  return (
    <section className="products__container container">
      <h2 className="page__title">Products</h2>
      <div className="">
        <form
          className={`filter--form ${isShowFilter && "show"}`}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="filters">
            <button
              type="button"
              onClick={() => setIsShowFilter(true)}
            >
              Add Filters
            </button>
            <button
              type="button"
              className="close__filter"
              onClick={() => setIsShowFilter(false)}
            >
              X
            </button>
            <div className="text__filters">
              <div className="filter__input">
                <p>Search Products</p>
                <input
                  placeholder="search products"
                  type="text"
                  name="filterByName"
                  id="filterByName"
                  value={filters.filterByName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className="filter__input price__range">
                <p>Price Range</p>
                <input
                  placeholder="Min Price"
                  type="text"
                  size={8}
                  name="minPrice"
                  id="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <input
                  placeholder="Max Price"
                  type="text"
                  size={8}
                  name="maxPrice"
                  id="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="radioBtn__filters">
              <div className="filter__input">
                <p>Price Sort</p>
                <div className="options">
                  <div>
                    <input
                      type="radio"
                      name="priceSort"
                      id="low"
                      value="ASC"
                      checked={filters.priceSort == "ASC"}
                      onChange={handleChange}
                    />
                    <label htmlFor="low">Low to High</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="priceSort"
                      id="high"
                      value="DESC"
                      checked={filters.priceSort == "DESC"}
                      onChange={handleChange}
                    />
                    <label htmlFor="high">High to Low</label>
                  </div>
                </div>
              </div>

              <div className="filter__input">
                <p>By Category</p>
                {categories.map((item) => {
                  return (
                    <div key={item}>
                      <input
                        type="radio"
                        name="categorySort"
                        id={item}
                        value={item}
                        checked={filters.categorySort == item}
                        onChange={handleChange}
                      />
                      <label htmlFor={item}>{item}</label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="filter__buttons">
              <button
                className="resetBtn__filter"
                type="button"
                onClick={handleReset}
              >
                Reset Filter
              </button>
              <button className="submitBtn__filter">Submit</button>
            </div>
          </div>
        </form>

        <div className="products">
          {products.length === 0 && (
            <div className="no-item-found">
              <p>No Item Found</p>
            </div>
          )}
          {products.map((product) => {
            return (
              <CardProduct
                key={product.id}
                {...product}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
