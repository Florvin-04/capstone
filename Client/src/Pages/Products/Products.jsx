import React, { useState, useRef } from "react";
import "./Products.scss";
import { useGlobalContext } from "../../AppContext/AppContext";
import CardProduct from "../../Components/CardProduct/CardProduct";

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

  // useEffect(() => {
  //   const uniqueCategories = new Set(products.map((item) => item.category));
  //   console.log(uniqueCategories);
  //   setCategories(["All", ...uniqueCategories]);
  // }, [loggedInID, products]);
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

    console.log(filters);

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

  return (
    <section className="products__container">
      <h1>Products</h1>
      <div className="">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              name="filterByName"
              id="filterByName"
              value={filters.filterByName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <input
              placeholder="Min Price"
              type="text"
              name="minPrice"
              id="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <input
              placeholder="Max Price"
              type="text"
              name="maxPrice"
              id="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="price__sort">
            <p>{filters.priceSort || "sort"}</p>
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

          <div className="category_sort">
            <p>Category</p>
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

          <button>Submit</button>
          <button
            type="button"
            onClick={handleReset}
          >
            Reset Filter
          </button>
        </form>

        <div className="products">
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
