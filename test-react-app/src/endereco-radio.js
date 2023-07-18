const EnderecoRadioButton = ({name, value, data, onCheck, checkStatus}) => {
	const onChange = (e) => {
    	onCheck(name)
  	}

  	const displayStreet = () => {
  		const originalData = data.original;
  		const predirectionData = data.prediction;
  		if (originalData.street.toLowerCase() === predirectionData.street.toLowerCase()) {
  			return (
  					<span className="endereco-span--neutral">
				        { originalData.street }
			      	</span>
  				)
  		} else {
  			return (
  				<>
					<span className="endereco-span--remove">
				        { originalData.street }
			      	</span>
			      	<span className="endereco-span--add">
				        { predirectionData.street }
			      	</span>
		      	</>
			)
  		}
  	}

  	const displayHouseNumber = () => {
  		const originalData = data.original;
  		const predirectionData = data.prediction;
  		if (originalData.houseNumber === predirectionData.houseNumber) {
  			return (
  					<span className="endereco-span--neutral">
				        { originalData.houseNumber }
			      	</span>
  				)
  		} else {
  			return (
  				<>
					<span className="endereco-span--remove">
				        { originalData.houseNumber }
			      	</span>
			      	<span className="endereco-span--add">
				        { predirectionData.houseNumber }
			      	</span>
		      	</>
			)
  		}
  	}

  	const displayPostCode = () => {
  		const originalData = data.original;
  		const predirectionData = data.prediction;
  		if (originalData.postCode === predirectionData.postCode) {
  			return (
  					<span className="endereco-span--neutral">
				        { originalData.postCode }
			      	</span>
  				)
  		} else {
  			return (
  				<>
					<span className="endereco-span--remove">
				        { originalData.postCode }
			      	</span>
			      	<span className="endereco-span--add">
				        { predirectionData.postCode }
			      	</span>
		      	</>
			)
  		}
  	}

  	const displayCityName = () => {
  		const originalData = data.original;
  		const predirectionData = data.prediction;
  		if (originalData.cityName === predirectionData.cityName) {
  			return (
  					<span className="endereco-span--neutral">
				        { originalData.cityName }
			      	</span>
  				)
  		} else {
  			return (
  				<>
					<span className="endereco-span--remove">
				        { originalData.cityName }
			      	</span>
			      	<span className="endereco-span--add">
				        { predirectionData.cityName }
			      	</span>
		      	</>
			)
  		}
  	}

	return (
	    <li className="endereco-address-predictions__item">
		    <input className="endereco-address-predictions__radio" type="radio" name="endereco-address-predictions" value={value} id={`endereco-address-predictions__item_` + name} onChange={onChange} checked={checkStatus === name} />
		    <label className="endereco-address-predictions__label" htmlFor={`endereco-address-predictions__item_` + name}>
		      {displayStreet()}
		      {displayHouseNumber()}
		      <br />
		      {displayPostCode()}
		      {displayCityName()}
		      <br />
		    </label>
		 </li>
	  )
	};
export default EnderecoRadioButton;