import React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { updateLikes } from '../requestBlogs'
import NotificationContext from '../context/notificationContext'

const BlogInfo = ({blogs, userData}) => {
  const id = useParams().id
  const selectedBlog = blogs.find(item => item.id === id)
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

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
  
  const handleLike = async (updatedBlog, blogId)  => {
      updateLikesMutation.mutate({updatedBlog, blogId, userData})
  }

  return (
    <div>
      <h3>{selectedBlog.title}</h3>
      <div>url: <a href={selectedBlog.url}>{selectedBlog.url}</a> </div>
      <div>{selectedBlog.likes} likes <button onClick={() => handleLike({...selectedBlog, likes: selectedBlog.likes+1, creator: selectedBlog.creator.id}, selectedBlog.id)}>like</button></div>
    </div>
  )
}

export default BlogInfo