import { useEffect, useRef } from 'react'
import { memo } from 'react'

import { theme, resetButton } from '../styles'



const SearchBar= ({ onSearch, searchType,setSearchType,setRecent,inputVal,setInputVal}) =>{

  const timeoutIdRef = useRef(null)
  const querytext = useRef(inputVal);
  const inputRef = useRef(null);

  useEffect(()=>{inputRef.current.value = inputVal;querytext.current = inputVal;triggerSearch(querytext.current)},[inputVal])

  useEffect(()=>{onSearch(querytext?.current);},[searchType])


  const styles = {

    wrapper: {

      display: 'flex',

      gap: '8px',

      width: '100%',

      maxWidth: 600,

      margin: '0 auto',

      alignItems: 'stretch',

      flexWrap: 'wrap',

    },

    input: {

      flex: '1 1 200px',

      fontFamily: 'inherit',

      fontSize: theme.fontSizes.base,

      color: theme.colors.text,

      border: `1px solid ${theme.colors.border}`,

      borderRadius: theme.radii.md,

      padding: '10px 14px',

      outline: 'none',

      transition: 'border-color 0.15s, box-shadow 0.15s',

      background: theme.colors.bg,

    },

    buttonGroup: {

      display: 'flex',

      gap: '8px',

      flex: '0 1 auto',

      justifyContent: 'flex-end',

    },

    toggleBtn: {

      ...resetButton,

      fontSize: theme.fontSizes.sm,

      fontWeight: 500,

      padding: '6px 14px',

      borderRadius: theme.radii.sm,

      color: theme.colors.textSecondary,

      background: theme.colors.bgSecondary,

      border: `1px solid ${theme.colors.border}`,

      transition: 'all 0.15s',

      whiteSpace: 'nowrap',

    },

    toggleBtnActive: {

      background: theme.colors.primaryLight,

      color: theme.colors.primary,

      borderColor: theme.colors.primary,

    },

  }


  const onClickHandler = (type) => {
        setSearchType((prev)=>{
        return type
      });
   
    }

  async function triggerSearch(querytext) {
    if(!querytext?.trim()) return
    if(timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    await onSearch(querytext);
  }



  async function handleChange(e) {
  
    querytext.current = e.target.value
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
   

    if (querytext.current.trim() !== '') {

        timeoutIdRef.current = setTimeout(async()=>{

        //await triggerSearch(querytext.current);
        setInputVal(querytext.current);
        setRecent((prev)=>{
        if(prev.length===10){return [querytext.current,...prev.slice(0,10)]}
        else{return[querytext.current,...prev]}

      })}, 2000)

    }
  }



  const handleSubmit = (e) => {
    e.preventDefault();
  };


  return (

    <form style={styles.wrapper}onSubmit={handleSubmit}>

      <input

        type="text"
 
        ref = {inputRef}

        placeholder={searchType === 'user' ? 'Enter GitHub username...' : 'Search repositories...'}

        onChange={handleChange}

        style={styles.input}

        aria-label={searchType === 'user' ? 'GitHub username' : 'Repository search'}

      />

     

      <div style={styles.buttonGroup}>

        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(searchType === 'user' ? styles.toggleBtnActive : {}) }}
          onClick={() =>{onClickHandler("user")}}
        >
          User
        </button>



        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(searchType === 'repo' ? styles.toggleBtnActive : {}) }}
          onClick={()=>{onClickHandler("repo")}}
        >
          Repo
        </button>

      </div>

    </form>

  )

}
export default memo(SearchBar)