import { getBlogs } from './requestBlogs'
import loginService from './services/login'
import { useState, useEffect } from 'react'
import FormLogin from './components/FormLogin'
import { useContext } from 'react'
import NotificationContext from './context/notificationContext'
import UserContext from './context/userContext'
import { useQuery } from 'react-query'
import { getUsers } from './requestUsers'
import BlogsDisplay from './components/BlogsDisplay'
import BlogInfo from './components/BlogInfo'
import Alert from 'react-bootstrap/Alert';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Users from './components/Users'
import UserInfo from './components/UserInfo'
import './App.css'

const App = ()  =>  {

  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [userData, userDispatch] = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const allUsers = useQuery('users', getUsers, {refetchOnWindowFocus: false})
  const result = useQuery('blogs', getBlogs, {refetchOnWindowFocus: false})

  useEffect(() => {
    const localUser = window.localStorage.getItem('loggedBloglistAppUser')
    if(localUser){
      const parseUser = JSON.parse(localUser)
      userDispatch({type: 'SETUSER', payload: parseUser})
    }
  }, [])

  const handleLogin = async (event)  => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      userDispatch({type: 'SETUSER', payload: user.data})
      window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(user.data))
      setUsername('')
      setPassword('')
      notificationDispatch({type: 'MESSAGE', payload: 'Successful login!'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    } catch(exception) {
      notificationDispatch({type: 'ERRORMESSAGE', payload: 'Wrong username or password'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    }
  }

  const handleLogout = ()  =>  {
    window.localStorage.removeItem('loggedBloglistAppUser')
    userDispatch({type: 'SETUSER', payload: null})
  }

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const blogs = result.data
  if ( allUsers.isLoading ) {
    return <div>loading data...</div>
  }

  const users = allUsers.data

  return (
    <div className="container">
      <Router>

      <div className="d-flex justify-content-between align-items-center">
        <ul className="nav nav-pills">
          <li className="nav-item">
              <Link className='px-1 nav-link' to={"/"}>Blogs</Link>
          </li>
          <li className="nav-item">
              <Link className='px-1 nav-link' to={"/users"}>Users</Link>
          </li>
          <li>
          </li>
        </ul> 
        <div className="d-flex align-items-center">
          {userData !== null &&
              <>
                {userData.user} is logged in 
                <button className='ms-2' onClick={handleLogout}>Logout</button>
                <br />
                <br />
              </>
          }
        </div>
      </div>

      <div>
        <div>
          {notification.notification ? <Alert key={notification.message_type} variant={notification.message_type}> {notification.notification}</Alert> : ''}
        </div>

        {userData === null && <FormLogin username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin}/>
        }

        <h1 className="py-4 display-3">Blogs App</h1>
      </div>

      <Routes>
        <Route path='/users' element={<Users users={users}/>} />
        <Route path='/users/:id' element={<UserInfo users={users}/>} />
        <Route path='/blogs/:id' element={<BlogInfo blogs={blogs} userData={userData}/>} />
        <Route path='/' element={<BlogsDisplay blogs={blogs} userData={userData}/>} />
      </Routes>
    </Router>
  </div>
  )
}

export default App