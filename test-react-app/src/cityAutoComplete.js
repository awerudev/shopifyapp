import React, { useRef, useState, useEffect } from 'react'

const KEY_CODES = {
    "DOWN": 40,
    "UP": 38,
    "PAGE_DOWN": 34,
    "ESCAPE": 27,
    "PAGE_UP": 33,
    "ENTER": 13,
}

function useAutoComplete({ delay = 500, source, onChange, onInput }) {
    
    const [myTimeout, setMyTimeOut] = useState(setTimeout(() => { }, 0))
    const listRef = useRef()
    const [suggestions, setSuggestions] = useState([]);
    const [preSuggestions, setPreSuggestions] = useState([]);
    const [isBusy, setBusy] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [textValue, setTextValue] = useState("")

    function delayInvoke(cb) {
        if (myTimeout) {
            clearTimeout(myTimeout)
        }
        setMyTimeOut(setTimeout(cb, delay));
    }

    function selectOption(index) {
        if (index > -1) {
            onChange(suggestions[index])
            setTextValue(suggestions[index].cityName)
        }
        clearSuggestionsWithData([])
    }

    async function getSuggestions(searchTerm) {
        if (searchTerm && source) {
            const options = await source(searchTerm)
            setSuggestions(options)
            setPreSuggestions([...options])
        }
    }

    function clearSuggestionsWithData(data) {
        setSuggestions(data)
        setSelectedIndex(0)
    }

    function onTextChange(searchTerm) {
        onInput(searchTerm);
        setTextValue(searchTerm);
        // if (searchTerm.length === 0) {
        //     clearSuggestionsWithData([]);
        // }
        // const tempSuggestions = preSuggestions.filter(suggestion => suggestion.cityName.toLowerCase().substring(0, searchTerm.length) === searchTerm.toLowerCase());
        // if (tempSuggestions.length > 0) {
        //     const stackList = [...tempSuggestions];
        //     setSuggestions(stackList);
        // } else {
        //     setBusy(true)
        //     clearSuggestionsWithData([]);
        //     setPreSuggestions([]);
            
        //     delayInvoke(() => {
        //         getSuggestions(searchTerm)
        //         setBusy(false)
        //     });
        // }
        clearSuggestionsWithData([]);
        setPreSuggestions([]);
        getSuggestions(searchTerm)
    }

    let optionHeight;
    if (listRef && listRef.current) {
        const children = listRef.current.children[0]
        if (children) {
            optionHeight = children.clientHeight
        }
    }

    function scrollUp() {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
        }
        // listRef.current.scrollTop -= optionHeight
    }

    function scrollDown() {
        if (selectedIndex < suggestions.length - 1) {
            setSelectedIndex(selectedIndex + 1)
        }
        // listRef.current.scrollTop = selectedIndex * optionHeight
    }

    function pageDown() {
        setSelectedIndex(suggestions.length - 1)
        listRef.current.scrollTop = suggestions.length * optionHeight
    }

    function pageUp() {
        setSelectedIndex(0)
        listRef.current.scrollTop = 0
    }

    function onKeyDown(e) {
        const keyOperation = {
            [KEY_CODES.DOWN]: scrollDown,
            [KEY_CODES.UP]: scrollUp,
            [KEY_CODES.ENTER]: () => selectOption(selectedIndex),
            [KEY_CODES.ESCAPE]: () => clearSuggestionsWithData([]),
            [KEY_CODES.PAGE_DOWN]: pageDown,
            [KEY_CODES.PAGE_UP]: pageUp,
        }
        if (keyOperation[e.keyCode]) {
            keyOperation[e.keyCode]()
        } else {
            setSelectedIndex(0)
        }
    }

    return {
        bindOption: {
            onClick: e => {
                let nodes = Array.from(listRef.current.children);
                selectOption(nodes.indexOf(e.target.closest("li")))
            }
        },
        bindInput: {
            value: textValue,
            onChange: e => onTextChange(e.target.value),
            onKeyDown
        },
        bindOptions: {
            ref: listRef
        },
        updateInput: setTextValue,
        closeList: () => clearSuggestionsWithData([]),
        isBusy,
        suggestions,
        selectedIndex,
    }
}

export default function CityNameAutoComplete({runAutoComplete, setDataSuggestions, onDataChange, onDataInput, countryStates, autoUpdate, updateStatus}) {
    const { bindInput, bindOptions,  bindOption, isBusy, suggestions, selectedIndex, updateInput, closeList} = useAutoComplete({
        onInput: value => onDataInput(value),
        onChange: value => onDataChange(value),
        source: async (search) => {
          try {
               const res = await runAutoComplete(search);
               const data = await res.predictions
               console.log(res)
               setDataSuggestions({
                cityName: data
               })
               return data;
          } catch (e) {
              console.log(e)
                return []
          }
     }
    })

    useEffect(() => {
        if (autoUpdate['cityName'].length > 0) {
            updateInput(autoUpdate['cityName']);
            onDataInput(autoUpdate['cityName']);
            updateStatus({
                ...autoUpdate,
                cityName: ""
            })
        }
    })

    return (<div>
            <label className="form-label" htmlFor="cityName">{"City*"}</label>
                        <input
                            placeholder='Enter city...'
                            className="form-control"
                            {...bindInput}
                        />
                        {isBusy && <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin"></div>}
                        <ul {...bindOptions} className="scroll-smooth absolute overflow-x-hidden overflow-y-auto">
                            {
                                suggestions.map((suggestion, index) => (
                                    <li
                                        className={`flex items-center h-[40px] p-1` + (selectedIndex === index && "bg-slate-300")}
                                        key={index}
                                        {...bindOption}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <a href="#">
                                                <span className="normal">
                                                    {suggestion.postCode + ", "}
                                                </span>
                                                <span className="highlight">
                                                    {suggestion.cityName.substring(0, bindInput.value.length)}
                                                </span>
                                                <span className="normal">
                                                    {suggestion.cityName.substring(bindInput.value.length, suggestion.cityName.length)}
                                                </span>
                                                <span>
                                                    , {countryStates.find(state => state.shortCode === suggestion.subdivisionCode).name}
                                                </span>
                                            </a>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
        </div>
        )
}