import { useContext } from 'react'
import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type){
    case 'MESSAGE':
      return {message_type: 'message', notification: action.payload} 
    case 'ERRORMESSAGE':
      return {message_type: 'error-message', notification: action.payload}
    case 'BLANKMESSAGE':
      return {message_type: 'message', notification: ''}    
    default:
      return state
  }
}

const NotificationContext = createContext() 

export const useNotificationDispatch = () => {
  const NotifiCationAndDispatch = useContext(NotificationContext)
  return NotifiCationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  
  return(
  <NotificationContext.Provider value={[notification, notificationDispatch]}>
    {props.children}   
  </NotificationContext.Provider>
  )
}

export default NotificationContext