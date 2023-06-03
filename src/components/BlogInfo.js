import React from 'react'
import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { updateLikes, getComments, createComment} from '../requestBlogs'
import NotificationContext from '../context/notificationContext'

const BlogInfo = ({blogs, userData}) => {
  const [commentInput, setCommentInput] = useState('')

  const id = useParams().id
  const selectedBlog = blogs.find(item => item.id === id)

  const contextNotif = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const comments = useQuery('comments', () => getComments(id), {refetchOnWindowFocus: false})

  const updateLikesMutation = useMutation(updateLikes, {onSuccess: (updatedBlog) => 
    {
    contextNotif[1]({type: 'MESSAGE', payload: 'Liked!'})
    setTimeout(() => {contextNotif[1]({type: 'BLANKMESSAGE'})}, 3000)
    const blogs = queryClient.getQueryData('blogs')
    queryClient.setQueryData('blogs', blogs.map(item => item.id === updatedBlog.data.id ? {...updatedBlog.data, creator: {id: updatedBlog.data.creator, user: userData.user, username: userData.username}} : item))
    }, 
    onError: () => {
      contextNotif[1]({type: 'ERRORMESSAGE', payload: 'There was an error adding the new like'})
      setTimeout(() => {contextNotif[1]({type: 'BLANKMESSAGE'})}, 3000)
    }
  })

  const addComment = useMutation(createComment, {onSuccess: (updatedBlog) => 
    {
      console.log(updatedBlog);
    setCommentInput('')
    contextNotif[1]({type: 'MESSAGE', payload: 'New comment'})
    setTimeout(() => {contextNotif[1]({type: 'BLANKMESSAGE'})}, 3000)
    const comments = queryClient.getQueryData('comments')
    queryClient.setQueryData('comments', comments.concat(updatedBlog) )
    }
  })
  
  const handleLike = async (updatedBlog, blogId)  => {
      updateLikesMutation.mutate({updatedBlog, blogId, userData})
  }

  const handleComment = async (event)  => {
    event.preventDefault()
    addComment.mutate({id, commentInput, userData})
  }

  if ( comments.isLoading ) {
    return <div>loading data...</div>
  }

  return (
    <div>
      <h3>{selectedBlog.title}</h3>
      <div>url: <a href={selectedBlog.url}>{selectedBlog.url}</a> </div>
      <div>{selectedBlog.likes} likes <button onClick={() => handleLike({...selectedBlog, likes: selectedBlog.likes+1, creator: selectedBlog.creator.id}, selectedBlog.id)}>like</button></div>
      <div>Added by: {selectedBlog.creator.user}</div>

      <h3>Comments</h3>
      <form type='submit'>
        <input type="text" value={commentInput} onChange={ ({target}) => {setCommentInput(target.value)}}/>
        <div><button onClick={handleComment}>Create</button></div>
      </form>
      
      {comments.data.length !== 0 ? 
      <ul>{comments.data.map(item => <li key={item.id}>{item.content}</li>)}</ul>
      : <p>No comments yet</p>
      }
    </div>
  )
}

export default BlogInfo