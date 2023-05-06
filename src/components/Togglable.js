import { useState } from 'react'

const Togglable = (props) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return(
    <div>
      <button style={hideWhenVisible}onClick={toggleVisible}>{props.buttonText}</button>

      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisible}>Cancel</button>
      </div>
    </div>
  )
}

export default Togglable