import { useState } from "react";
import axios from "axios";
const Login = () => {
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const target = e.target;
    setError("");
    const { value, type, name, checked } = target;

    setLoginState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8081/login", loginState)
      .then((response) => {
        if (response.data.Status === "Success") {
          console.log("Logged  In");
        } else {
          setError(response.data.Message);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("submit");

    setLoginState({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <form
        className="login--form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="input__form--container">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            value={loginState.email}
            onChange={handleChange}
            // onBlur={handleBlur}
          />

          {/* {errors?.email && touched.email && <p>{errors.email}</p>} */}
        </div>

        <div className="input__form--container">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={loginState.password}
            onChange={handleChange}
            // onBlur={handleBlur}
          />
          {/* {errors?.firstName && touched.firstName && <p>{errors.firstName}</p>} */}
        </div>

        {error && <p>{error}</p>}

        <button
          // disabled={isSubmitting}
          type="submit"
        >
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
