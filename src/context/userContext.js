import { createContext, useReducer } from 'react'

const userReducer = (state, action) => {
  switch(action.type){
    case 'SETUSER':
      return action.payload
    case 'REMOVEUSER':
      return ''
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [userData, userDispatch] = useReducer(userReducer, '')

  return(
    <UserContext.Provider value={[userData, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext