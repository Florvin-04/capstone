import React from "react";
import "./AddUpdateAddress.scss";
import axios from "axios";
import { useFormik } from "formik";
import { addressFormSchema } from "../../Validation/Validation";
import { useGlobalContext } from "../../AppContext/AppContext";

async function add_address(values, route, userID, forms, addressID) {
  const { completeAddress, fullName, zipCode, phoneNumber } = values;

  try {
    const response = await axios.post(`${route}/add-update-address`, {
      userID: userID,
      address: completeAddress,
      zipCode,
      phoneNumber,
      contactPerson: fullName,
      formState: { status: forms, id: addressID },
    });

    if (response.status === "success") {
      console.log(response);
      return;
    } else {
      console.log(response.data.Message);
      return;
    }
  } catch (error) {
    console.log("catch error: ", error);
  }
}

function AddUpdateAddress({ setForms, forms, editAddress }) {
  const { loggedInID, route, getAddress } = useGlobalContext();

  console.log(forms);

  let initial_values = {
    fullName: forms === "newAddress" ? "" : editAddress.fullName,
    completeAddress: forms === "newAddress" ? "" : editAddress.completeAddress,
    zipCode: forms === "newAddress" ? "" : editAddress.zipCode,
    phoneNumber: forms === "newAddress" ? "" : editAddress.phoneNumber,
  };

  const onSubmit = async (values) => {
    try {
      await add_address(values, route, loggedInID, forms, editAddress.id);
      await getAddress();
      setForms("chooseAddress");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: {
      ...initial_values,
    },

    validationSchema: addressFormSchema,
    onSubmit,
  });

  console.log(errors);

  return (
    <>
      <form
        autoComplete="off"
        className="addNewAddress"
        onSubmit={handleSubmit}
      >
        <h2>Add New Address</h2>
        <div>
          <div className="input-field">
            <input
              className={errors?.fullName && "input-field-errorMessage"}
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
              className={errors?.phoneNumber && "input-field-errorMessage"}
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
              className={errors?.completeAddress && "input-field-errorMessage"}
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
              className={errors?.zipCode && "input-field-errorMessage"}

              placeholder=""
              name="zipCode"
              onChange={handleChange}
              value={values.zipCode}
            />
            <span>Zip Code</span>
          </div>

          {errors?.zipCode && touched.zipCode && <p>{errors.zipCode}</p>}
        </div>
        <div className="add-edit__btn">
          <button
          className="addUpdate__btn--cancel"
            type="button"
            onClick={() => setForms("chooseAddress")}
          >
            Cancel
          </button>
          <button className="addUpdate__btn--submit" type="subtmit">Submit</button>
        </div>
      </form>
    </>
  );
}

export default AddUpdateAddress;
