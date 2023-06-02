import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Blog from './components/Blog'
import loginService from './services/login'
import FormLogin from './components/FormLogin'
import FormCreate from './components/FormCreate'
import Togglable from './components/Togglable'
import { getBlogs, createNewBlog, updateLikes, deleteBlog } from './request'
import './App.css'

import { useContext } from 'react'
import NotificationContext from './context/notificationContext'
import UserContext from './context/userContext'

const App = ()  =>  {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [userData, userDispatch] = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const queryClient = useQueryClient()

  const result = useQuery('blogs', getBlogs, {refetchOnWindowFocus: false})

  const createNewBlogMutation = useMutation(createNewBlog, {onSuccess: (newBlog) => {
    notificationDispatch({type: 'MESSAGE', payload: 'Blog added to the list!'})
    setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    const blogs = queryClient.getQueryData('blogs')
    queryClient.setQueryData('blogs', blogs.concat({...newBlog.data, creator: {id: newBlog.data.creator, user: userData.user, username: userData.username}}))
  }, 
    onError: () => {
      notificationDispatch({type: 'ERRORMESSAGE', payload: 'There was an error and the new blog was not added to the list'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    }
  })

  const updateLikesMutation = useMutation(updateLikes, {onSuccess: (updatedBlog) => 
    {
    notificationDispatch({type: 'MESSAGE', payload: 'Liked!'})
    setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    const blogs = queryClient.getQueryData('blogs')
    queryClient.setQueryData('blogs', blogs.map(item => item.id === updatedBlog.data.id ? {...updatedBlog.data, creator: {id: updatedBlog.data.creator, user: userData.user, username: userData.username}} : item))
    }, 
    onError: () => {
      notificationDispatch({type: 'ERRORMESSAGE', payload: 'There was an error adding the new like'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    }
  })

  const deleteBlogMutation = useMutation(deleteBlog, {onSuccess: () => 
    {
    notificationDispatch({type: 'MESSAGE', payload: 'Blog deleted'})
    setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    queryClient.invalidateQueries('blogs')
    }, 
    onError: () => {
      notificationDispatch({type: 'ERRORMESSAGE', payload: 'There was an error deleting the blog'})
      setTimeout(() => {notificationDispatch({type: 'BLANKMESSAGE'})}, 3000)
    }
  })

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

  const handleCreate = async (title, author, url)  =>  {
    console.log(userData);
      createNewBlogMutation.mutate({title, author, url, userData})
  }

  const handleLike = async (updatedBlog, blogId)  => {
      updateLikesMutation.mutate({updatedBlog, blogId, userData})
  }

  const handleDelete = async (blogId)  => {
    deleteBlogMutation.mutate({blogId, userData})
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

      {userData === null && <FormLogin username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin}/>
      }

      {userData !== null &&
          <div>
            {userData.user} is logged in
            <br />
            <button onClick={handleLogout}>Logout</button>
            <br />
            <br />
            <Togglable buttonText={'Add New Blog'}>
              <FormCreate create={handleCreate}/>
            </Togglable>
            <br />
            {blogs.sort((a, b) => {let keyA = a.likes; let keyB = b.likes; if(keyA>keyB){return -1} else if(keyA<keyB){return 1} else{return 0} }).map(blog  =>
              <Blog key={blog.id} blog={blog} handleLike={handleLike} user={userData} handleDelete={handleDelete}/>)}
          </div>
      }

    </div>
  )
}

export default App