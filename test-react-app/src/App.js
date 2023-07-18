import { useEffect, useCallback, useState } from "react"

import logo from './logo.svg';
import './App.css';

import {
  UseAddressCheck,
  UsePostCodeAutocomplete,
  UseCityNameAutocomplete,
  UseStreetAutocomplete,
  UseEmailCheck,
  UseNameCheck,
  UsePhoneCheck,
  UseIbanCheck,
  UseVatIdCheck,
  loadCountryStates
} from "./hooks";

import PostCodeAutoComplete from './postAutoComplete';
import CityNameAutoComplete from './cityAutoComplete';
import StreetAutoComplete from './streetAutoComplete';

import EnderecoWrongAddressModal from './endereco-wrong-address-modal';
import EnderecoInvalidAddressModal from './endereco-invalid-address-modal';

function App() {
  const [information, setInformation] = useState({
    firstName: '',
    lastName: '',
    street: '',
    postCode: '',
    email: '',
    password: '',
    houseNumber: '',
    cityName: '',
    country: "84702aaa0e434716a805a4e35bdf0bb6",
    salutation: 'x'
  });

  const [updateStatus, setUpdateStatus] = useState({
    firstName: false,
    lastName: false,
    street: false,
    postCode: false,
    email: false,
    password: false,
    houseNumber: false,
    cityName: false,
    country: false,
    salutation: false
  });

  const [infoStatus, setInfoStatus] = useState({
    salutation: -1,
    firstName: -1,
    lastName: -1,
    email: -1,
    password: -1,
    country: -1,
    state: -1,
    postCode: -1,
    cityName: -1,
    street: -1,
    houseNumber: -1
  });
  const [suggestions, setSuggetions] = useState({
    postCode: [],
    cityName: [],
    street: []
  });
  const [countryStates, setCountryStates] = useState([]);
  const [autoCompleteUpdate, setAutoCompleteUpdate] = useState({
    postCode: "",
    cityName: "",
    street: "",
  })
  const [focusUpdate, setFocusUpdate] = useState({
    street: 0,
  })
  const [dialogStatus, setDialogStatus] = useState(false);
  const [dialogType, setDialogType] = useState("wrong");
  const [dialogData, setDialogData] = useState({});

  const countryData = [
      {
        countryId: "84702aaa0e434716a805a4e35bdf0bb6",
        countryCode: "DE",
        language: "de",
        countryName: "Germany"
      }
    ]

  useEffect(() => {
    const countryId = countryData[0].countryId;
    loadCountryStates(countryId).then((result) => {
      setCountryStates(result);
    })
  }, [loadCountryStates])

  const blur = useCallback((event) => {
    switch(event.target.id) {
    case "email":
      emailCheck(event.target.id, event.target.value);
      break;
    case "password":
      passwordCheck(event.target.id, event.target.value);
      break;
    case 'firstName':
      firstNameCheck(event.target.id, event.target.value);
      break;
    case 'lastName':
      lastNameCheck(event.target.id, event.target.value);
      break;
    default:
      break;
    }
  })

  const change = useCallback((event) => {
    setInformation({
      ...information,
      [event.target.id]: event.target.value
    })

    switch(event.target.id) {
        case 'salutation':
          salutationCheck(event.target.id, event.target.value);
          break;
        default:
          break;
    }
  })

  const submit = async (event) => {
  }

  const salutationCheck = (key, value) => {
    if (information['firstName'].length === 0) {
      setInfoStatus({
        ...infoStatus,
        firstName: 0
      })
      return;
    }
    if (information['lastName'].length === 0) {
      setInfoStatus({
        ...infoStatus,
        lastName: 0
      })
      return;
    }

    let params = {
      salutation: value,
      firstName: information['firstName'],
      lastName: information['lastName']
    }

    nameCheck(params);
  }

  const firstNameCheck = (key, value) => {
    if (information['salutation'].length === 0) {
      setInfoStatus({
        ...infoStatus,
        salutation: 0
      });
      return;
    }

    if (value.length === 0) {
      setInfoStatus({
        ...infoStatus,
        firstName: 0
      })
      return;
    }

    if (information['lastName'].length === 0) {
      setInfoStatus({
        ...infoStatus,
        lastName: 0
      })
      return;
    }

    let params = {
      salutation: information['salutation'],
      firstName: value,
      lastName: information['lastName']
    }

    nameCheck(params);
  }

  const lastNameCheck = (key, value) => {
    if (information['salutation'].length === 0) {
      setInfoStatus({
        ...infoStatus,
        salutation: 0
      });
      return;
    }
    if (information['firstName'].length === 0) {
      setInfoStatus({
        ...infoStatus,
        firstName: 0
      })
      return;
    }

    if (value.length === 0) {
      setInfoStatus({
        ...infoStatus,
        lastName: 0
      })
      return;
    }

    let params = {
      salutation: information['salutation'],
      firstName: information['firstName'],
      lastName: value
    }

    nameCheck(params);
  }

  const nameCheck = (params) => {
    if (information['country']) {
      const selectedCountry = countryData.find(country => country['countryId'] === information['country']);
      if (selectedCountry) {
        params['countryCode'] = selectedCountry['countryCode'];
        params['language'] = selectedCountry['language'];
      } 
    }

    UseNameCheck(params).then((result) => {
      if (result.status) {
        const nameNotfound = result.status.filter((status) => status === 'name_not_found');
        const nameFake = result.status.filter((status) => status === 'name_is_fake');
        if (nameFake.length > 0) {
          setInfoStatus({
            salutation: 2
          })
        } else if (nameNotfound.length > 0) {
          setInfoStatus({
            ...infoStatus,
            lastName: 1,
            firstName: 1,
            salutation: 1
          })
        } else {
          const needsCorrection = result.status.filter((status) => status.includes("needs_correction"));
          let salutation = information['salutation'];
          let salutationInfoStatus = -1;
          let salutationUpdateStatus = true;
          let firstName = information['firstName'];
          let firstNameInfoStatus = -1;
          let firstNameUpdateStatus = true;
          let lastName = information['lastName'];
          let lastNameInfoStatus = -1;
          let lastNameUpdateStatus = true;
          if (needsCorrection.length > 0) {
            const salutationNeedsCorrection = needsCorrection.filter((status) => status.includes('salutation'));
            if (salutationNeedsCorrection) {
              if (updateStatus['salutation']) {
                salutationInfoStatus = 1;
              } else {
                salutation = result.predictions[0].salutation;
                salutationInfoStatus = 2;
                salutationUpdateStatus = true;
              }
            }

            const lastNameNeedsCorrection = needsCorrection.filter((status) => status.includes('last_name'));
            if (lastNameNeedsCorrection) {
              if (!updateStatus['lastName']) {
                lastName = result.predictions[0].lastName;
                lastNameInfoStatus = 2;
                lastNameUpdateStatus = true;
              }
            }

            const firstNameNeedsCorrection = needsCorrection.filter((status) => status.includes('first_name'));
            if (firstNameNeedsCorrection) {
              if (!updateStatus['firstName']) {
                firstName = result.predictions[0].firstName;
                firstNameInfoStatus = 2;
                firstNameUpdateStatus = true;
              }
            }

            setUpdateStatus({
              ...updateStatus,
              firstName: firstNameUpdateStatus,
              lastName: lastNameUpdateStatus,
              salutation: salutationUpdateStatus
            })

            setInformation({
              ...information,
              firstName,
              lastName,
              salutation
            });

            setInfoStatus({
              ...infoStatus,
              firstName: firstNameInfoStatus,
              lastName: lastNameInfoStatus,
              salutation: salutationInfoStatus,
            })

          }
        }
      }
    });
  }

  const emailCheck = (key, value) => {
    if (value.length === 0) {
      setInfoStatus({
              ...infoStatus,
              email: 0
            })
      return;
    }

    let params = {
      email: value
    }

    UseEmailCheck(params).then((result) => {
      if (result.status && result.status) {
        console.log(result)
        const emailCorrect = result.status.filter((status) => status === 'A1000');
        const emailIncorrect = result.status.filter((status) => status === 'email_not_correct')
        const emailWrong = result.status.filter((status) => status === 'A4000');
        if (emailCorrect.length > 0) {
          setInfoStatus({
            ...infoStatus,
            email: 2
          })
        } else if (emailIncorrect.length > 0) {
          setInfoStatus({
            ...infoStatus,
            email: 0
          })
        } else if (emailWrong.length > 0) {
          setInfoStatus({
            ...infoStatus,
            email: 1
          })
        }
      }
    });
  }

  const passwordCheck = (key, value) => {
    if (value.length < 8) {
      setInfoStatus({
        ...infoStatus,
        password: 0
      })
    } else {
      setInfoStatus({
        ...infoStatus,
        password: 2
      })
    }
  }

  const addressCheck = (newValues) => {

    let isCheckable = true;
    let newStatuses = {};
    const selectedCountry = countryData.find(country => country['countryId'] === information['country']);

    const country = selectedCountry.countryCode;
    const postCode = newValues && newValues['postCode'] ? newValues['postCode'] : information['postCode'];
    if (!postCode || postCode.length === 0) {
      isCheckable = false;
      newStatuses['postCode'] = 0;
    }
    const cityName = newValues && newValues['cityName'] ? newValues['cityName'] : information['cityName'];
    if (!cityName || cityName.length === 0) {
      isCheckable = false;
      newStatuses['cityName'] = 0;
    }
    const houseNumber = newValues && newValues['houseNumber'] ? newValues['houseNumber'] : information['houseNumber'];
    if (!houseNumber || houseNumber.length === 0) {
      isCheckable = false;
      newStatuses['houseNumber'] = 0;
    }
    const street = newValues && newValues['street'] ? newValues['street'] : information['street'];
    if (!street || street.length === 0) {
      isCheckable = false;
      newStatuses['street'] = 0;
    }

    if (!isCheckable) {
      setInfoStatus({
        ...infoStatus,
        ...newStatuses
      })
      return;
    }
    
    let params = {
      country: country,
      cityName: cityName,
      postCode: postCode,
      houseNumber: houseNumber,
      street: street,
      language: selectedCountry.language
    }

    setInfoStatus({
      ...infoStatus,
      postCode: 2,
      country: 2,
      state: 2,
      cityName: 2,
      street: 2,
      houseNumber: 2
    })

    UseAddressCheck(params).then((result) => {
      if (result.status && result.status.length > 0) {
        const correctAddress = result.status.filter((status) => status === 'address_correct');
        if (correctAddress.length === 0) {
          const originalCityName = newValues && newValues['cityName'] ? newValues['cityName'] : information['cityName'];
          const originalPostCode = newValues && newValues['postCode'] ? newValues['postCode'] : information['postCode'];
          const originalStreet = newValues && newValues['street'] ? newValues['street'] : information['street'];
          const originalHouseNumber = newValues && newValues['houseNumber'] ? newValues['houseNumber'] : information['houseNumber'];
          if (result.predictions.length === 0) {
            setDialogData({
              countryName: selectedCountry.countryName,
              postCode,
              cityName,
              street,
              houseNumber,
              status: result.status.filter((s) => s !== 'A1000' && s !== 'A1100' && s !== 'A3000' && s.split('_')[s.split('_').length - 1] !== 'correct')
            })
            setDialogType("incorrect");
          } else {
            setDialogData({
              original: {
                postCode,
                cityName,
                street,
                houseNumber
              },
              prediction: result.predictions[0]
            })
            setDialogType("wrong");
          }
          setDialogStatus(true);
        }
      }
    })
  }

  const validate = (e) => {
    addressCheck({})
  }

  const getClassName = (originalClass, key, label) =>{
    let className = originalClass;
    switch(infoStatus[key]) {
      case 0:
        className += " was-validated";
        break;
      case 1:
        className += " endereco-s--" + label + "_needs_correction";
        break;
      case 2:
        className += " endereco-s--" + label + "_correct";
        break;
    }
    return className;
  }

  const runPostCodeAutoComplete = async (value) => {
    const selectedCountry = countryData.find(country => country['countryId'] === information['country']);
    let params = {
      postCode: value,
      country: selectedCountry['countryCode'],
      language: selectedCountry['language']
    };

    if (information['street'].length > 0) {
      params['street'] = information['street'];
    }

    if (information['houseNumber'].length > 0) {
      params['houseNumber'] = information['houseNumber'];
    }

    const result = await UsePostCodeAutocomplete(params);
    return result;
  }

  const setDataSuggestions = (data) => {
    setSuggetions({
      ...suggestions,
      ...data
    })
  }

  const runCityNameAutoComplete = async (value) => {
    const selectedCountry = countryData.find(country => country['countryId'] === information['country']);
    let params = {
      cityName: value,
      country: selectedCountry['countryCode'],
      language: selectedCountry['language']
    };

    const result = await UseCityNameAutocomplete(params); 
    return result;
  }

  const runStreetAutoComplete = async (value) => {
    const selectedCountry = countryData.find(country => country['countryId'] === information['country']);
    let params = {
      street: value,
      cityName: information['cityName'],
      country: selectedCountry['countryCode'],
      language: selectedCountry['language'],
      postCode: information['postCode'],
      houseNumber: information['houseNumber']
    };

    const result = await UseStreetAutocomplete(params); 
    return result;
  }

  const onDataInput = (key, value) => {
    setInformation({
      ...information,
      [key]: value
    })
  }

  const onPostCodeChange = (value) => {
    const selectedState = countryStates.find(state => state.shortCode === value.subdivisionCode);
    setInformation({
      ...information,
      cityName: value.cityName,
      postCode: value.postCode,
      state: selectedState.id
    })

    setAutoCompleteUpdate({
      ...autoCompleteUpdate,
      cityName: value.cityName
    })

    if (information['street'].length === 0) {
      setFocusUpdate({
        ...focusUpdate,
        street: 1
      })
    }
  };

  const onCityNameChange = (value) => {
    const selectedState = countryStates.find(state => state.shortCode === value.subdivisionCode)
    setInformation({
      ...information,
      cityName: value.cityName,
      postCode: value.postCode,
      state: selectedState.id
    })

    setAutoCompleteUpdate({
      ...autoCompleteUpdate,
      postCode: value.postCode
    })

    if (information['street'].length === 0) {
      setFocusUpdate({
        ...focusUpdate,
        street: 1
      })
    }
  };

  const onStreetNameChange = (selectedValue) => {
    setInformation({
      ...information,
      street: selectedValue.label
    })
    
  };

  const ModalHandler = (value) => {
    if(value === "0") {
      setInformation({
        ...information,
        postCode: dialogData['prediction'].postCode,
        cityName: dialogData['prediction'].cityName,
        houseNumber: dialogData['prediction'].houseNumber,
        street: dialogData['prediction'].street
      })

      setAutoCompleteUpdate({
        ...autoCompleteUpdate,
        postCode: dialogData['prediction'].postCode,
        cityName: dialogData['prediction'].cityName,
        street: dialogData['prediction'].cityName
      })
    }

    setInfoStatus({
      ...infoStatus,
      postCode: 2,
      country: 2,
      state: 2,
      cityName: 2,
      street: 2,
      houseNumber: 2
    })
  }

  return (
    <div className="App">
      <div className="card register-card">
            <div className="card-body">
              <div className="card-title"> Ich bin Neukunde! </div>
              <form className="register-form">
                <div className="register-personal">
                  <div className="row g-2">
                    <div className={getClassName("form-group col-md-3 col-sm-6", "salutation", "salutation")}>
                      <label className="form-label" htmlFor="personalSalutation">
                        Salutation*
                      </label>
                      <select id="salutation" className="form-select" name="salutation" required="required" value={information['salutation']} onChange={change}>
                        <option value="x">
                          Keine Angabe
                        </option>
                        <option value="f">
                          Frau
                        </option>
                        <option value="m">
                          Herr
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className={getClassName("form-group col-sm-6", 'firstName', 'first_name')}>
                      <label className="form-label" htmlFor="personalFirstName">
                        First name*
                      </label>
                      <input type="text" className="form-control" id="firstName" placeholder="Enter first name..." name="firstName" data-form-validation-required-message="Vorname darf nicht leer sein." required="required" onChange={change} onBlur={blur} value={information['firstName']}/>
                    </div>
                    <div className={getClassName("form-group col-sm-6", 'lastName', 'last_name')}>
                      <label className="form-label" htmlFor="personalLastName">
                        Last name*
                      </label>
                      <input type="text" className="form-control" id="lastName" placeholder="Enter last name..." name="lastName" data-form-validation-required-message="Nachname darf nicht leer sein." required="required" onChange={change} onBlur={blur} value={information['lastName']}/>
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className={getClassName("form-group col-sm-6", 'email', 'email')}>
                      <label className="form-label" htmlFor="personalMail">
                            New E-mail adress*
                      </label>
                      <input type="email" className="form-control" id="email" placeholder="Enter new email address..." name="email" required="required" onChange={change} onBlur={blur}/>
                      {infoStatus['email'] === 0 ? <div className="endereco-status-wrapper">
                        <ul className="endereco-status-wrapper-list">
                          <li className="endereco-status-wrapper-list__item endereco-status-wrapper-list__item--email_not_correct">
                            The email address does not appear to be correct
                          </li>
                          <li className="endereco-status-wrapper-list__item endereco-status-wrapper-list__item--email_syntax_error">
                            Check the spelling
                          </li>
                        </ul>
                      </div> : <></>}
                      {infoStatus['email'] === 1 ? <div data-id="64832fe2-f0d0-46ce-ab2d-2a0fecef6b74" className="endereco-status-wrapper">
                        <ul className="endereco-status-wrapper-list">
                          <li className="endereco-status-wrapper-list__item endereco-status-wrapper-list__item--email_not_correct">The email address does not appear to be correct</li>
                        </ul>
                      </div> : <></>}
                    </div>
                    <div className={getClassName("form-group col-sm-6", 'password', 'password')}>
                      <span className="js-form-field-toggle-guest-mode">
                        <label className="form-label" htmlFor="personalPassword">
                          Password*
                        </label>
                        <input type="password" className="form-control" id="password" placeholder="Enter password ..." name="password" minLength="8" data-form-validation-length-message=" Das Passwort muss mindestens 8 Zeichen lang sein." required="required" onChange={change} onBlur={blur}/>
                        <small className={`form-text js-validation-message ${infoStatus['password'] === 0 ? 'invalid-feedback' : ""}`} data-form-validation-length-text="true">
                          The password must be at least 8 characters long.
                        </small>
                      </span>
                    </div>
                    <div className="form-group col-sm-6">
                    </div>
                    <div className="form-group col-sm-6">
                    </div>
                  </div>
                </div>
                <div className="register-address">
                  <div className="register-billing">
                    <div className="card-title">
                      Ihre Adresse
                    </div>
                    <div className="row g-2 country-and-state-form-elements" data-country-state-select="true">
                      <div className={getClassName("form-group col-md-6", "country", "country_code")}>
                        <label className="form-label" htmlFor="country">
                          Country*
                        </label>
                        <select className="country-select form-select" name="country" id="country" required="required" onChange={change} defaultValue={information['country']} >
                          {
                            countryData.map((country)=> {
                              return(<option value={country['countryId']} key={country['countryId']}>
                                                      {country['countryName']}
                                                    </option>)
                            })
                          }
                        </select>
                      </div>
                      <div className={getClassName("form-group col-md-6", "state", "subdivision_code")}>
                        <label className="form-label" htmlFor="state">
                          Federal State    
                        </label>

                        <select className="country-state-select form-select" id="state" name="state" onChange={change} value={information['state']}>
                            <option value="" data-placeholder-option="true" >
                                Bundesland auswählen ...
                            </option>
                            {
                              countryStates.map(state => {
                                return (<option value={state.id} key={state.id}>{state.name}</option>)
                              })
                            }
                        </select>
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className={getClassName("form-group col-md-2 col-4", "postCode", "postal_code")}>
                        <PostCodeAutoComplete
                          runAutoComplete={runPostCodeAutoComplete}
                          setDataSuggestions={setDataSuggestions}
                          onDataChange={onPostCodeChange}
                          countryStates={countryStates}
                          autoUpdate={autoCompleteUpdate}
                          updateStatus={setAutoCompleteUpdate}
                          onDataInput={(value) => onDataInput('postCode', value)}
                        />
                      </div>
                      <div className={getClassName("form-group col-md-4 col-8", "cityName", "locality")}>
                        <CityNameAutoComplete
                          runAutoComplete={runCityNameAutoComplete}
                          setDataSuggestions={setDataSuggestions}
                          onDataChange={onCityNameChange}
                          countryStates={countryStates}
                          autoUpdate={autoCompleteUpdate}
                          updateStatus={setAutoCompleteUpdate}
                          onDataInput={(value) => onDataInput('cityName', value)}
                        />
                      </div>
                      <div className={getClassName("form-group col-8 col-md-4", "street", "street_name")}>
                        <StreetAutoComplete
                          runAutoComplete={runStreetAutoComplete}
                          setDataSuggestions={setDataSuggestions}
                          onDataChange={onStreetNameChange}
                          countryStates={countryStates}
                          autoUpdate={autoCompleteUpdate}
                          updateStatus={setAutoCompleteUpdate}
                          focusUpdate={focusUpdate}
                          updateFocusStatus={setFocusUpdate}
                          onDataInput={(value) => onDataInput('street', value)}
                        />
                      </div>
                      <div className={getClassName("form-group col-4 col-md-2", "houseNumber", "additional_info")}>
                        <label className="form-label" htmlFor="houseNumber">
                          House number*
                        </label>
                        <input type="text" className="form-control" id="houseNumber" placeholder="Enter house number..." required="required" value={information['houseNumber']} onChange={change}>
                        </input>
                      </div>
                    </div>
                    <div className="row g-2">
                    </div>
                  </div>
                </div>
                {
                  dialogType === 'wrong' ? <EnderecoWrongAddressModal  
                                                  OpenStatus={dialogStatus}
                                                  UpdateOpenStatus={setDialogStatus}
                                                  Data={dialogData}
                                                  Handler={ModalHandler}
                                                /> : <EnderecoInvalidAddressModal
                                                    OpenStatus={dialogStatus}
                                                    UpdateOpenStatus={setDialogStatus}
                                                    Data={dialogData}
                                                    Handler={ModalHandler}
                                                  />
                }
                <div className="register-submit d-grid col-md-6 offset-md-6">
                  <div className="btn btn-primary btn-lg" onClick={validate}>
                    Continue to shipping
                  </div>
                </div>
              </form>
            </div>
          </div>
    </div>
  );
}

export default App;
