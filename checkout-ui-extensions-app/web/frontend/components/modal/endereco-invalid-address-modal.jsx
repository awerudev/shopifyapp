import { useState, useEffect } from "react";

export default function EnderecoModal({OpenStatus, UpdateOpenStatus, Data, Handler}) {
  const [checkStatus, setCheckStatus] = useState("");
  const onCheck = (value) => {
    setCheckStatus(value)
  }

  const onApply = (event) => {
    UpdateOpenStatus(false);
  }

  if (!Data || Object.keys(Data).length == 0 || !Data.status)
    return (<></>)

  const buildingNumberNotFound = Data.status.filter(s => s === 'building_number_major_correction')
  const addressNotFound = Data.status.filter(s => s=== 'address_not_found');
  const streetNotFound = Data.status.filter(s => s=== 'street_name_major_correction');
  
  return (
    <div className={`endereco-popup-container endereco-popup-container--direction-ltr ${!OpenStatus ? "hidden" : ""}`}>
      <div className={`endereco-modal endereco-modal--no-prediction ${Data.status.join(" ")}`}>
        <div className="endereco-modal__header">
          <p className="endereco-modal__header-main">
            Check billing address
          </p>
          <p className="endereco-modal__header-sub">
            Your address could not be verified. Please check your input and change or confirm it.
          </p>
          <span className="endereco-modal__close" onClick={(e) => UpdateOpenStatus(false)}></span>
        </div>
        <div className="endereco-modal__body">
          <div className="endereco-modal__divider">
            <span className="endereco-modal__divider-innertext">
              Your input: 
              <small>
                <a href="#" endereco-edit-address="" onClick={(e) => UpdateOpenStatus(false)}>
                  (edit)
                </a>
              </small>
            </span>
          </div>
          <div className="endereco-modal__errors">
            <ul>
              {buildingNumberNotFound.length > 0 ? <li>
                This house number could not be found.
              </li> : <></> }
              {streetNotFound.length > 0 ? <li>
                This Street could not be found.
              </li> : <></> }
              {addressNotFound.length > 0 ? <li>
                This address is incorrect.
              </li> : <></> }
            </ul>
          </div>
          <div className="endereco-modal__address-container">
            <span className="endereco-street-name">
              {Data.street}
            </span>
            <span className="endereco-building-number">
              {Data.houseNumber}
            </span> <br />
            <span className="endereco-postal-code">
              {Data.postCode}
            </span>
            <span>&nbsp;</span>
            <span className="endereco-locality">
              {Data.cityName}
            </span> <br />
            <span className="endereco-country-code">
              {Data.countryName}
            </span>
          </div>
          <div className="endereco-modal__warning" endereco-show-if-origin="">
            Incorrect addresses can lead to problems in delivery and cause further costs.
          </div>
        </div>
        <div className="endereco-modal__footer">
          <button className="btn btn-secondary btn-lg" onClick={(e) => UpdateOpenStatus(false)}>
            Confirm address
          </button>
          <button className="btn btn-primary btn-lg" endereco-use-selection="" endereco-disabled-until-confirmed="" onClick={onApply}>
            Edit address
          </button>
        </div>
      </div>
    </div>
    )
}