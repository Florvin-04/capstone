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

const zipCodeRegex = /^\d{4}$/;
const phoneNumberCodeRegex = /^\d{11}$/;

export const addressFormSchema = yup.object().shape({
  fullName: yup.string().min(5, "Mimimum of 5 characters").required("Required"),
  completeAddress: yup.string().min(10, "Mimimum of 10 characters").required("Required"),
  zipCode: yup.string().matches(zipCodeRegex, "Invalid Zip Code").required("Required"),
  phoneNumber: yup.string().matches(phoneNumberCodeRegex, "Invalid Phone Number").required("Required"),
});
