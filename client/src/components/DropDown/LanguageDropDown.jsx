import Select from 'react-select'   
import { useState } from 'react'
import { Languages } from '../../constants/Languages'
import { Styles } from '../../constants/Style'



const LanguageDropDown = () =>{
    const [selectedLanguage, setSelectedLanguage]=useState(Languages[0])

    return(
        <>
        <Select
        styles={Styles}
        value={selectedLanguage}
        options={Languages}
        />
        </>
    )
}

export default LanguageDropDown