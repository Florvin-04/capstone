import * as yup from "yup";

export const registerSchema = yup.object().shape({
  email: yup.string().email("Please Enter a Valid Email.").required("Email is Required."),
  firstName: yup.string().required("First Name is Required."),
  lastName: yup.string().required("Last Name is Required."),
  password: yup.string().min(5).required("Password is Required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password Do Not Match")
    .required("Confirm Password is Required."),
});
