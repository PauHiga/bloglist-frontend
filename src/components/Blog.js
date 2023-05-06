import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, handleLike, user, handleDelete }) => {
  const [visible, setVisible] = useState({ display:'none' })

  const updatedBlog = {
    title:blog.title,
    author:blog.author,
    url:blog.url,
    likes:blog.likes + 1,
    creator:blog.creator.id
  }

  const confirmDelete = () => {
    if (window.confirm(`Remove blog '${blog.title}'?`)) {
      console.log('delete confirmed')
      handleDelete(blog.id)
    }
  }

  return(
    <div className='blog-box'>
      <div className='blog-title'>
        {blog.title} - {blog.author} <button onClick={() => setVisible({ display:'' })}>Show details</button>
      </div>
      <div style={visible} className='blog-details'>
        <button onClick={() => setVisible({ display:'none' })}>Hide Details</button>
        <ul>
          <li>Url: {blog.url}</li>
          <li>Creator: {blog.creator.user}</li>
          <li>Likes: {blog.likes} <button onClick={() =>  handleLike(updatedBlog, blog.id)}>like</button></li>
        </ul>
        {user.data.username === blog.creator.username ? <button onClick={confirmDelete} style={{ fontSize:12 }}>Delete blog</button> : ''}
      </div>

    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike:PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  handleDelete:PropTypes.func.isRequired
}

export default Blog