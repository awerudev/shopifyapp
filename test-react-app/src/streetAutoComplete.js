import { useEffect, useRef } from 'react'
import useAutoComplete from './use-autocomplete';

export default function StreetAutoComplete({runAutoComplete, setDataSuggestions, onDataChange, onDataInput, autoUpdate, updateStatus, focusUpdate, updateFocusStatus}) {
    const { bindInput, bindOptions,  bindOption, isBusy, suggestions, selectedIndex, updateInput, closeList} = useAutoComplete({
        onInput: value => onDataInput(value),
        onChange: value => onDataChange(value),
        source: async (search) => {
          try {
               const res = await runAutoComplete(search);
               const data = await res.predictions
               setDataSuggestions({
                street: data
               })
               return data.map((d, index) => ({ value: index, label: d.street }))
          } catch (e) {
              console.log(e)
                return []
          }
     }
    })

    const inputRef = useRef();

    useEffect(() => {
        if (autoUpdate['street'].length > 0) {
            updateInput(autoUpdate['street']);
            updateStatus({
                ...autoUpdate,
                street: ""
            })
        }

        if (focusUpdate['street'] > 0) {
            inputRef.current.focus();
            updateFocusStatus({
                ...focusUpdate,
                street: 0
            })
        }
    })

    return (<div>
            <label className="form-label" htmlFor="street">{"Street*"}</label>
                        <input
                            ref={inputRef}
                            placeholder='Enter street...'
                            className="form-control"
                            {...bindInput}
                        />
                        {isBusy && <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin"></div>}
                        <ul {...bindOptions} className="w-[300px] scroll-smooth absolute max-h-[260px] overflow-x-hidden overflow-y-auto" >
                            {
                                suggestions.map((suggestion, index) => (
                                    <li
                                        className={`flex items-center h-[40px] p-1` + (selectedIndex === index && "bg-slate-300")}
                                        key={index}
                                        {...bindOption}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <a href="#">
                                                <span className="highlight">
                                                    {suggestion.label.substring(0, bindInput.value.length)}
                                                </span>
                                                <span className="normal">
                                                    {suggestion.label.substring(bindInput.value.length, suggestion.label.length)}
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