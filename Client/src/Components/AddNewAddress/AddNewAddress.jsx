import React from "react";
import "./AddNewAddress.scss";
import { useFormik } from "formik";
import { addressFormSchema } from "../../Validation/Validation";

const onSubmit = () => {
  console.log("submit");
};

function AddNewAddress({ setForms }) {
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: {
      fullName: "",
      completeAddress: "",
      zipCode: "",
      phoneNumber: ""
    },

    validationSchema: addressFormSchema,
    onSubmit,
  });

  console.log(errors);

  return (
    <>
      <form
        className="addNewAddress"
        onSubmit={handleSubmit}
      >
        <h2>Add New Address</h2>
        <div>
          <div className="input-field">
            <input
              type="text"
              name="fullName"
              placeholder=""
              onChange={handleChange}
              value={values.fullName}
            />
            <span>Full Name</span>
          </div>

          {errors?.fullName && touched.fullName && <p>{errors.fullName}</p>}
        </div>
        <div>
          <div className="input-field">
            <input
              type="text"
              name="phoneNumber"
              placeholder=""
              onChange={handleChange}
              value={values.phoneNumber}
            />
            <span>Phone Number</span>
          </div>

          {errors?.phoneNumber && touched.phoneNumber && <p>{errors.phoneNumber}</p>}
        </div>
        <div>
          <div className="input-field">
            <textarea
              type="text"
              name="completeAddress"
              placeholder=""
              onChange={handleChange}
              value={values.completeAddress}
            />
            <span>Complete Address</span>
          </div>

          {errors?.completeAddress && touched.completeAddress && <p>{errors.completeAddress}</p>}
        </div>
        <div>
          <div className="input-field">
            <input
              type="text"
              placeholder=""
              name="zipCode"
              onChange={handleChange}
              value={values.zipCode}
            />
            <span>Zip Code</span>
          </div>

          {errors?.zipCode && touched.zipCode && <p>{errors.zipCode}</p>}
        </div>
        <div>
          <button
            type="button"
            onClick={() => setForms("chooseAddress")}
          >
            Cancel
          </button>
          <button type="subtmit">Submit</button>
        </div>
      </form>
    </>
  );
}

export default AddNewAddress;
