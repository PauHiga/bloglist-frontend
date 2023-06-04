import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type){
    case 'MESSAGE':
      return {message_type: 'success', notification: action.payload} 
    case 'ERRORMESSAGE':
      return {message_type: 'danger', notification: action.payload}
    case 'BLANKMESSAGE':
      return {message_type: 'success', notification: ''}    
    default:
      return state
  }
}

const NotificationContext = createContext() 

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  
  return(
  <NotificationContext.Provider value={[notification, notificationDispatch]}>
    {props.children}   
  </NotificationContext.Provider>
  )
}

export default NotificationContext