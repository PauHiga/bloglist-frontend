import { useState } from 'react'
import Form from 'react-bootstrap/Form';

const FormCreate = ({  create  }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate2 = async (event)  =>  {
    event.preventDefault()
    create(title, author, url)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2 className="py-1 display-6">Add new blog</h2>
      <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Title: </Form.Label>
        <Form.Control value={title} name='Title' placeholder="write the blog's title here" onChange={({ target }) => {setTitle(target.value)}}/>
        <Form.Text className="text-muted">
        write the blog&apos;s title here
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Author: </Form.Label>
        <Form.Control value={author} name='author' placeholder="write the blog's author here" onChange={({ target }) => {setAuthor(target.value)}}/>
        <Form.Text className="text-muted">
        write the blog&apos;s author here
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Url: </Form.Label>
        <Form.Control value={url} name="url" placeholder="write the blog's url here"onChange={({ target }) => {setUrl(target.value)}}/>
        <Form.Text className="text-muted">
        write the blog&apos;s url here
        </Form.Text>
      </Form.Group>
        <div><button onClick={handleCreate2}>Create</button></div>
    </Form>

    </div>
  )
}

export default FormCreate