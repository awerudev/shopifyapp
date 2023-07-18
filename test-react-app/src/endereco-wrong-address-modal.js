import { useState, useEffect } from "react";
import EnderecoRadioButton from './endereco-radio'

export default function EnderecoWrongAddressModal({OpenStatus, UpdateOpenStatus, Data, Handler}) {
  const [checkStatus, setCheckStatus] = useState("0");
  const onCheck = (value) => {
    setCheckStatus(value)
  }

  const onApply = (event) => {
    Handler(checkStatus);
    UpdateOpenStatus(false);
  }

  if (!Data || Object.keys(Data).length == 0 || !Data.prediction)
    return (<></>)
  return (
    <div className={`endereco-popup-container endereco-popup-container--direction-ltr ${!OpenStatus ? "hidden" : ""}`}>
      <div className="endereco-modal">
        <div className="endereco-modal__header">
          <p className="endereco-modal__header-main">
            Check billing address
          </p>
          <p className="endereco-modal__header-sub">
            The address you entered appears to be incorrect or incomplete. Please select the correct address.
          </p>
          <span className="endereco-modal__close" onClick={(e) => UpdateOpenStatus(false)}></span>
        </div>
        <div className="endereco-modal__body">
          <div className="endereco-modal__divider">
            <span className="endereco-modal__divider-innertext">
              Our suggestions:
            </span>
          </div>
          <ul className="endereco-address-predictions endereco-address-predictions--suggestions">
              <EnderecoRadioButton 
                name="0"
                value="0"
                data={Data}
                onCheck={onCheck}
                checkStatus={checkStatus}
              />
          </ul>
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
            <ul className="endereco-address-predictions endereco-address-predictions--original">
              <EnderecoRadioButton 
                name="original"
                value="-1"
                data={Data}
                onCheck={onCheck}
                checkStatus={checkStatus}
              />
            </ul>
          <div className="endereco-modal__warning" endereco-show-if-origin="">
            Wrong addresses can lead to delivery problems and cause additional costs.
          </div>
        </div>
        <div className="endereco-modal__footer">
          <button className="btn btn-primary btn-lg" endereco-use-selection="" endereco-disabled-until-confirmed="" onClick={onApply}>
            apply selection
          </button>
        </div>
      </div>
    </div>
    )
}