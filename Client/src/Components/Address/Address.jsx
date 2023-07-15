import { useEffect, useState } from "react";

function Address({ address, idx, handleChangeAddress, chosenAddress }) {
  return (
    <>
      {/* TODO, UPDATE contact person */}
      <div>
        <input
          required
          type="radio"
          name="address"
          id={`address${idx}`}
          value={`${address.address}, ${address.phone_number}, ${address.zip_code}, ${address.contact_person}`}
          checked={chosenAddress == `${address.address}, ${address.phone_number}, ${address.zip_code}, ${address.contact_person}`}
          onChange={handleChangeAddress}
        />
        <label htmlFor={`address${idx}`}>
          <p>{address.contact_person} | {address.phone_number}</p>
          <p>
            {address.address} | {address.zip_code}
          </p>
          <p></p>
        </label>
      </div>
    </>
  );
}

export default Address;
