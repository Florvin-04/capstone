import { useEffect, useState } from "react";
import "./Address.scss";

function Address({ address, idx, handleChangeAddress, chosenAddress, setForms, setEditAddress }) {
  return (
    <>
      <input
        className="address__radio--btn"
        hidden
        type="radio"
        name="address"
        id={`address${idx}`}
        value={`${address.address}, ${address.phone_number}, ${address.zip_code}, ${address.contact_person}`}
        checked={
          chosenAddress ==
          `${address.address}, ${address.phone_number}, ${address.zip_code}, ${address.contact_person}`
        }
        onChange={handleChangeAddress}
      />
      <div className="modal__address--container">
        <div className="circle__address--checked">
          
        </div>
        <label
          className=""
          htmlFor={`address${idx}`}
        >
          <p className="contactPerson">
            {address.contact_person} | {address.phone_number}
          </p>
          <p className="deliveryAddress">
            {address.address}, {address.zip_code} 
          </p>
        </label>
        <button
          type="button"
          onClick={() => {
            setForms("editAddress");
            setEditAddress({
              id: address.id,
              completeAddress: address.address,
              phoneNumber: address.phone_number,
              zipCode: address.zip_code,
              fullName: address.contact_person,
            });
            console.log("edit");
          }}
        >
          edit
        </button>
      </div>
    </>
  );
}

export default Address;
