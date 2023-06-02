import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createNewBlog } from '../requestBlogs'
import Togglable from '../components/Togglable'
import FormCreate from '../components/FormCreate'
import NotificationContext from '../context/notificationContext'

const BlogsDisplay = ({blogs, userData}) => {
  const notificationDispatch = useContext(NotificationContext)
  const queryClient = useQueryClient()

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

  const handleCreate = async (title, author, url)  =>  {
    createNewBlogMutation.mutate({title, author, url, userData})
  }

  return (
    <div>
        <Togglable buttonText={'Add New Blog'}>
          <FormCreate create={handleCreate}/>
        </Togglable>
        <br />
        {blogs.sort((a, b) => {let keyA = a.likes; let keyB = b.likes; if(keyA>keyB){return -1} else if(keyA<keyB){return 1} else{return 0} }).map(blog => <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
           {blog.title} 
           </Link>   
           </div>)}
    </div>
  )
}

export default BlogsDisplay