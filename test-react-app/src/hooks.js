import axios from 'axios'

export const UseAddressCheck = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('addressCheck', requestData)); 

    return response.data.result;
}

export const UsePostCodeAutocomplete = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('postCodeAutocomplete', requestData)); 
    return response.data.result;
}

export const UseCityNameAutocomplete = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('cityNameAutocomplete', requestData)); 

    return response.data.result;
}

export const UseStreetAutocomplete = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('streetAutocomplete', requestData)); 

    return response.data.result;
}

export const UseEmailCheck = async(requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('emailCheck', requestData)); 

    return response.data.result;
}

export const UseNameCheck = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('nameCheck', requestData)); 
    console.log('response',)
    return response.data.result;
}

export const UsePhoneCheck = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('phoneCheck', requestData)); 

    return response.data.result;
}

export const UseIbanCheck = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('ibanCheck', requestData)); 

    return response.data.result;
}

export const UseVatIdCheck = async (requestData) => {
    const response = await axios.post(
      'http://localhost:3001/endereco', 
      generateRequestParameter('vatIdCheck', requestData)); 

    return response.data.result;
}

function generateRequestParameter(method, params) {
  return {
    "jsonrpc": "2.0",
    "id": 1,
    "method": method,
    "params": params
  }
}

export const loadCountryStates = async (countryId) => {
  const response = await axios.post(
      'http://localhost:3001/countryData',
      {countryId}
    )
  return response.data.states;
}