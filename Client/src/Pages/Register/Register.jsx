import { useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { registerSchema } from "../../Validation/Validation";

const onSubmit = async (values, actions) => {
  console.log("Submit");
  // console.log(values.email);
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  axios
    .post("http://localhost:8081/register", {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      // email: values.email,
    })
    .then((response) => {
      if (response.data.Status === "success") {
        console.log(response.data.Message);
      } else {
        console.log(response.data.Message);
      }
    })
    .catch((err) => console.log(err));

  actions.resetForm();
};

const Register = () => {
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
    <>
      <form
        className="rergister--form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="input__form--container">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors?.email && touched.email && <p>{errors.email}</p>}
        </div>

        <div className="input__form--container">
          <label htmlFor="firstName">First Name: </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors?.firstName && touched.firstName && <p>{errors.firstName}</p>}
        </div>

        <div className="input__form--container">
          <label htmlFor="lastName">Last Name: </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors?.lastName && touched.lastName && <p>{errors.lastName}</p>}
        </div>

        <div className="input__form--container">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors?.password && touched.password && <p>{errors.password}</p>}
        </div>

        <div className="input__form--container">
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors?.confirmPassword && touched.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
        >
          Register
        </button>
      </form>
    </>
  );
};

export default Register;
