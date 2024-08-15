import Select from 'react-select'   
import { useState } from 'react'
import { Languages } from '../../constants/Languages'
import { Styles } from '../../constants/Style'



const LanguageDropDown = ({handleChangeLang}) =>{
    const [selectedLanguage, setSelectedLanguage]=useState(Languages[0])
    
    const themeChanged = (selectLanguage) =>{
        setSelectedLanguage(selectLanguage)
        handleChangeLang(selectLanguage)
    }

    return(
        <>
        <Select
        styles={Styles}
        onChange={themeChanged}
        value={selectedLanguage}
        options={Languages}
        />
        </>
    )
}

export default LanguageDropDown