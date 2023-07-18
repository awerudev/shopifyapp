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
              {
                Data.status.map((s, id) => {
                  return (<li key={id}>
                    {s.split('_').map(st => st.charAt(0).toUpperCase() + st.slice(1)).join(' ')}
                  </li>)
                })
              }
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
            Wrong addresses can lead to delivery problems and cause additional costs.
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