import { useEffect, useState } from "react";

function Address({ address, idx, handleChangeAddress, chosenAddress, setForms, setEditAddress }) {
  return (
    <>
      <div>
        <input
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
        <label htmlFor={`address${idx}`}>
          <p>
            {address.contact_person} | {address.phone_number}
          </p>
          <p>
            {address.address} | {address.zip_code}
          </p>
        </label>
      </div>
    </>
  );
}

export default Address;
