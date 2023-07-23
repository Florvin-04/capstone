import { useEffect } from "react";
import "./Register.scss";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { registerSchema } from "../../Validation/Validation";
import { useGlobalContext } from "../../AppContext/AppContext";

// const onSubmit = async (values, actions) => {

//   console.log("Submit");
//   // console.log(values.email);
//   await new Promise((resolve) => {
//     setTimeout(resolve, 1000);
//   });

//   axios
//     .post("http://localhost:8081/register", {
//       email: values.email,
//       firstName: values.firstName,
//       lastName: values.lastName,
//       password: values.password,
//       // email: values.email,
//     })
//     .then((response) => {
//       if (response.data.Status === "success") {
//         console.log(response.data.Message);
//         actions.resetForm();
//         navigate("/login");
//       } else {
//         console.log(response.data.Message);
//       }
//     })
//     .catch((err) => console.log(err));
// };

const Register = () => {
  const { isAutorize, route } = useGlobalContext();

  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    console.log("Submit");
    // console.log(values.email);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    axios.defaults.withCredentials = true;

    try {
      const response = await axios.post(`${route}/register`, {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        // email: values.email,
      });

      if (response.data.Status === "success") {
        console.log(response.data.Message);
        actions.resetForm();
        navigate("/login");
      } else {
        console.log(response.data.Message);
      }
    } catch (error) {
      console.log(error);
    }

    // axios
    //   .post(`${route}/register`, {
    //     email: values.email,
    //     firstName: values.firstName,
    //     lastName: values.lastName,
    //     password: values.password,
    //     // email: values.email,
    //   })
    //   .then((response) => {
    //     if (response.data.Status === "success") {
    //       console.log(response.data.Message);
    //       actions.resetForm();
    //       navigate("/login");
    //     } else {
    //       console.log(response.data.Message);
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: registerSchema,
      onSubmit,
    });

  // useEffect(() => {
  //   console.log(values);
  // }, [values]);

  // console.log(errors);

  return (
    <section className="register">
      <div>
        <header className="register__header">

        <h2>Register</h2>
        <img src="/logo.svg" alt="" />
        </header>
        <form
          className="rergister--form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div>
            <div className="input__form--container">
              <input
                className={errors?.email && touched.email && "error__input"}
                placeholder=""
                type="email"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label
                className={errors?.email && touched.email && "lable__error"}
                htmlFor="email"
              >
                Email
              </label>
            </div>
            {errors?.email && touched.email && (
              <p style={{ color: "red", fontSize: ".9rem" }}>{errors.email}</p>
            )}
          </div>

          <div>
            <div className="input__form--container">
              <input
                className={errors?.firstName && touched.firstName && "error__input"}
                placeholder=""
                type="text"
                name="firstName"
                id="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label
                className={errors?.firstName  && touched.firstName && "lable__error"}
                htmlFor="firstName"
              >
                First Name:{" "}
              </label>
            </div>
            {errors?.firstName && touched.firstName && (
              <p style={{ color: "red", fontSize: ".9rem" }}>{errors.firstName}</p>
            )}
          </div>

          <div>
            <div className="input__form--container">
              <input
                className={errors?.lastName && touched.lastName && "error__input"}
                placeholder=""
                type="text"
                name="lastName"
                id="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label
                className={errors?.lastName && touched.lastName && "lable__error"}
                htmlFor="lastName"
              >
                Last Name:{" "}
              </label>
            </div>
            {errors?.lastName && touched.lastName && (
              <p style={{ color: "red", fontSize: ".9rem" }}>{errors.lastName}</p>
            )}
          </div>

          <div>
            <div className="input__form--container">
              <input
                className={errors?.password && touched.password && "error__input"}
                placeholder=""
                type="password"
                name="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label
                className={errors?.password &&  touched.password &&"lable__error"}
                htmlFor="password"
              >
                Password:{" "}
              </label>
            </div>
            {errors?.password && touched.password && (
              <p style={{ color: "red", fontSize: ".9rem" }}>{errors.password}</p>
            )}
          </div>

          <div>
            <div className="input__form--container">
              <input
                className={errors?.confirmPassword && touched.confirmPassword && "error__input"}
                placeholder=""
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label
                className={errors?.confirmPassword && touched.confirmPassword && "lable__error"}
                htmlFor="confirmPassword"
              >
                Confirm Password:{" "}
              </label>
            </div>
            {errors?.confirmPassword && touched.confirmPassword && (
              <p style={{ color: "red", fontSize: ".9rem" }}>{errors.confirmPassword}</p>
            )}
          </div>

          <button
            className="register--btn"
            disabled={isSubmitting}
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="login__link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
