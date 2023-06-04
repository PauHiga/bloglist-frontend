import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createNewBlog } from '../requestBlogs'
import FormCreate from '../components/FormCreate'
import NotificationContext from '../context/notificationContext'


const BlogsDisplay = ({blogs, userData}) => {
  const contextNotif = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const createNewBlogMutation = useMutation(createNewBlog, {onSuccess: (newBlog) => {
    
    contextNotif[1]({type: 'MESSAGE', payload: 'Blog added to the list!'})
    setTimeout(() => {contextNotif[1]({type: 'BLANKMESSAGE'})}, 3000)
    const blogs = queryClient.getQueryData('blogs')
    queryClient.setQueryData('blogs', blogs.concat({...newBlog.data, creator: {id: newBlog.data.creator, user: userData.user, username: userData.username}}))
  }, 
    onError: () => {
      contextNotif[1]({type: 'ERRORMESSAGE', payload: 'There was an error and the new blog was not added to the list'})
      setTimeout(() => {contextNotif[1]({type: 'BLANKMESSAGE'})}, 3000)
    }
  })

  const handleCreate = async (title, author, url)  =>  {
    createNewBlogMutation.mutate({title, author, url, userData})
  }



  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <button
        type="button"
        style={{ backgroundColor: 'white' }}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }



  return (
    <div>
      <Accordion>
        <Card>
          <Card.Header>
            <CustomToggle eventKey="0">Add New Blog</CustomToggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body><FormCreate create={handleCreate}/></Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

        <br />
        <ListGroup>
        {blogs.sort((a, b) => {let keyA = a.likes; let keyB = b.likes; if(keyA>keyB){return -1} else if(keyA<keyB){return 1} else{return 0} }).map(blog => <ListGroup.Item key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
           {blog.title} 
           </Link>   
           </ListGroup.Item>)}
        </ListGroup>
    </div>
  )
}

export default BlogsDisplay