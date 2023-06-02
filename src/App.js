import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import FormLogin from './components/FormLogin'
import FormCreate from './components/FormCreate'
import Togglable from './components/Togglable'
import { getBlogs, createNewBlog } from './request'
import './App.css'

import { useContext } from 'react'
import NotificationContext from './context/notificationContext'

const App = ()  =>  {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  
  const [refresh, setRefresh] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  const queryClient = useQueryClient()

  const result = useQuery('blogs', getBlogs)
  const createNewBlogMutation = useMutation(createNewBlog, {onSuccess: () => {
    notificationDispatch({type: 'MESSAGE', payload: 'Blog added to the list!'})
    setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    queryClient.invalidateQueries('blogs')}, 
    onError: () => {
      notificationDispatch({type: 'ERRORMESSAGE', payload: 'There was an error and the new blog was not added to the list'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    }
  })


  useEffect(() => {
    const localUser = window.localStorage.getItem('loggedBloglistAppUser')
    if(localUser){
      const parseUser = JSON.parse(localUser)
      setUser(parseUser)
    }
  }, [])

  const handleLogin = async (event)  => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user.data)
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
    setUser(null)
  }

  const handleCreate = async (title, author, url)  =>  {
      createNewBlogMutation.mutate({title, author, url, user})
  }

  // const handleCreate = async (title, author, url)  =>  {
  //   try{
  //     console.log(title);
  //     const response = await blogService.createBlogEntry(title, author, url, user)
  //     notificationDispatch({type: 'MESSAGE', payload: 'The blog "' + response.data.title + '" was successfully added to the list'})
  //     setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
  //     setRefresh(refresh+1)
  //   } catch (exception){
  //     notificationDispatch({type: 'ERRORMESSAGE', payload: 'error creating entry'})
  //     setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
  //   }
  // }

  const handleLike = async (updatedBlog, blogId)  => {
    try{
      await blogService.updateLikes(updatedBlog, blogId, user)
      notificationDispatch({type: 'MESSAGE', payload: 'The blog "' + updatedBlog.title + '" was liked'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
      setRefresh(refresh+1)
    } catch(exception){
      notificationDispatch({type: 'ERRORMESSAGE', payload: 'Error adding new likes'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    }
  }

  const handleDelete = async (blogId)  => {
    try{
      await blogService.deleteBlog(blogId, user)
      notificationDispatch({type: 'MESSAGE', payload: 'Blog deleted'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
      setRefresh(refresh+1)
    }catch (exception){
      notificationDispatch({type: 'ERRORMESSAGE', payload: 'Error deleting blog'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    }
  }

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  return (
    <div>
      <h2>blogs</h2>
      {notification.notification
        ? <div className={notification.message_type}>{notification.notification}</div>
        : ''
      }
      {/* {messageOfBox
        ? <div className={messageType}>{messageOfBox}</div>
        : ''
      } */}

      {user === null && <FormLogin username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin}/>
      }

      {user !== null &&
          <div>
            {user.user} is logged in
            <br />
            <button onClick={handleLogout}>Logout</button>
            <br />
            <br />
            <Togglable buttonText={'Add New Blog'}>
              <FormCreate create={handleCreate}/>
            </Togglable>
            <br />
            {blogs.sort((a, b) => {let keyA = a.likes; let keyB = b.likes; if(keyA>keyB){return -1} else if(keyA<keyB){return 1} else{return 0} }).map(blog  =>
              <Blog key={blog.id} blog={blog} handleLike={handleLike} user={user} handleDelete={handleDelete}/>)}
          </div>
      }

    </div>
  )
}

export default App