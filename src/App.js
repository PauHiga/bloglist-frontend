import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import FormLogin from './components/FormLogin'
import FormCreate from './components/FormCreate'
import Togglable from './components/Togglable'
import './App.css'

const App = ()  =>  {
  const [blogs, setBlogs] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [messageOfBox, setMessageOfBox] = useState('')
  const [messageType, setMessageType] = useState('message')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(()  =>  {
    blogService
      .getAll()
      .then(blogs  => {
        setBlogs( blogs )
      })
  }, [refresh])

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
      setUser(user)
      console.log('user', user)
      window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      setMessageType('message')
      setMessageOfBox('Successful login!')
      setTimeout(() => {setMessageOfBox('')}, 3000)
    } catch(exception) {
      setMessageType('error-message')
      setMessageOfBox('Wrong username or password')
      setTimeout(() => {setMessageOfBox('')}, 3000)
    }
  }

  const handleLogout = ()  =>  {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
  }

  const handleCreate = async (title, author, url)  =>  {
    try{
      const response = await blogService.createBlogEntry(title, author, url, user)

      setMessageType('message')
      setMessageOfBox('The blog "' + response.data.title + '" was successfully added to the list')
      setTimeout(() => {setMessageOfBox('')}, 5000)
      setRefresh(refresh+1)
    } catch (exception){
      setMessageType('error-message')
      setMessageOfBox('User not authorized')
      setTimeout(() => {setMessageOfBox('')}, 3000)
    }
  }

  const handleLike = async (updatedBlog, blogId)  => {
    try{
      await blogService.updateLikes(updatedBlog, blogId, user)
      setRefresh(refresh+1)
    } catch(exception){
      setMessageType('error-message')
      setMessageOfBox('Error adding new likes')
      setTimeout(() => {setMessageOfBox('')}, 3000)
    }
  }

  const handleDelete = async (blogId)  => {
    try{
      await blogService.deleteBlog(blogId, user)
      setRefresh(refresh+1)
    }catch (exception){
      setMessageType('error-message')
      setMessageOfBox('Error deleting blog')
      setTimeout(() => {setMessageOfBox('')}, 3000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      {messageOfBox
        ? <div className={messageType}>{messageOfBox}</div>
        : ''
      }

      {user === null && <FormLogin username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin}/>
      }

      {user !== null &&
          <div>
            {user.data.user} is logged in
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