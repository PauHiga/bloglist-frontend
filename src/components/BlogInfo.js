import React from 'react'
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import { useContext, useState } from 'react'
import { useParams, useNavigate  } from 'react-router-dom'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { updateLikes, getComments, createComment, deleteBlog} from '../requestBlogs'
import NotificationContext from '../context/notificationContext'

const BlogInfo = ({blogs, userData}) => {
  const navigate = useNavigate();

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

  const deleteBlogMutation = useMutation(deleteBlog, {onSuccess: () => 
    {
    contextNotif[1]({type: 'MESSAGE', payload: 'Blog removed!'})
    setTimeout(() => {contextNotif[1]({type: 'BLANKMESSAGE'})}, 3000)
    queryClient.invalidateQueries('blogs')
    navigate('/');
    
    
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

  const handleDelete = async (blogId)  => {
    deleteBlogMutation.mutate({blogId, userData})
  }

  const confirmDelete = () => {
    if (window.confirm(`Remove blog '${selectedBlog.title}'?`)) {
      handleDelete(selectedBlog.id)
    }
  }

  if ( comments.isLoading ) {
    return <div>loading data...</div>
  }

  return (
    <Stack direction="vertical" gap={3}>

      <Card style={{ width: '100%' }}>
        <Card.Body>
          <Card.Title><h3>{selectedBlog.title}</h3></Card.Title>
          <Card.Subtitle className="mb-2 text-muted"><a href={selectedBlog.url}>{selectedBlog.url}</a></Card.Subtitle>
          <Card.Text>
          {selectedBlog.likes} likes <button onClick={() => handleLike({...selectedBlog, likes: selectedBlog.likes+1, creator: selectedBlog.creator.id}, selectedBlog.id)}>like</button>
          </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Added by: {selectedBlog.creator.user} {userData.username === selectedBlog.creator.username ? <button onClick={confirmDelete} style={{ fontSize:12 }}>Delete blog</button> : ''}</ListGroup.Item>
        </ListGroup>
      </Card>

      <Card style={{ width: '100%' }}>
        <Card.Body>
          <Card.Title>Comments</Card.Title>
          <form type='submit'>
            <input type="text" value={commentInput} onChange={ ({target}) => {setCommentInput(target.value)}}/>
            <div><button className='my-2' onClick={handleComment}>Create</button></div>
          </form>
        </Card.Body>
        {comments.data.length !== 0 ? 
          <ListGroup className="list-group-flush">{comments.data.map(item => <ListGroup.Item key={item.id}>{item.content}</ListGroup.Item>)}</ListGroup>
          : <div className='mb-3 d-flex justify-content-center'>No comments yet</div>}
      </Card>

    </Stack>
  )
}

export default BlogInfo