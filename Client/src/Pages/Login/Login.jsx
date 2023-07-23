import { useEffect, useState } from "react";
import "./Login.scss";
import axios from "axios";
import { Route, useNavigate, Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAutorize, route } = useGlobalContext();

  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isAutorize) {
      navigate(`${location.state?.prevURL || "/"}`);
    }
  }, [isAutorize]);

  const handleChange = (e) => {
    const target = e.target;
    setError("");
    const { value, type, name, checked } = target;

    setLoginState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${route}/login`, loginState)
      .then((response) => {
        if (response.data.Status === "success") {
          console.log("Logged  In");

          setLoginState({
            email: "",
            password: "",
          });

          navigate(`${location.state?.prevURL || "/"}`);
          window.location.reload();
        } else {
          setError(response.data.Message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="login">
      <div>
        <header className="header__login">
          <img
            src="/logo.svg"
            alt=""
          />
          <h2>Login</h2>
        </header>
        <form
          className="login--form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="input__form--container">
            <input
              className={error && "error__input"}
              placeholder=""
              type="email"
              name="email"
              id="email"
              value={loginState.email}
              onChange={handleChange}
              // onBlur={handleBlur}
            />

            <label
              className={error && "login__errorMessage"}
              htmlFor="email"
            >
              Email{" "}
            </label>
            {/* {errors?.email && touched.email && <p>{errors.email}</p>} */}
          </div>

          <div className="input__form--container">
            <input
              className={error && "error__input"}
              placeholder=""
              type="password"
              name="password"
              id="password"
              value={loginState.password}
              onChange={handleChange}
              // onBlur={handleBlur}
            />
            <label
              className={error && "login__errorMessage"}
              htmlFor="password"
            >
              Password{" "}
            </label>
            {/* {errors?.firstName && touched.firstName && <p>{errors.firstName}</p>} */}
          </div>

          {error && <p className="login__errorMessage">{error}</p>}

          <button
            // disabled={isSubmitting}
            className="login__btn"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="signup__link">
          Need an Account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
