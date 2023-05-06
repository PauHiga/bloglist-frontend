import { useState } from 'react'

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
      <h3>Add new blog</h3>
      <form type='submit'>
        <ul>
          <li>
            title: <input type='text' id='input-title' value={title} name='Title' placeholder="write the blog's title here" onChange={({ target }) => {setTitle(target.value)}}/>
          </li>
          <li>
            author: <input type='text' id='input-author' value={author} name='author' placeholder="write the blog's author here" onChange={({ target }) => {setAuthor(target.value)}}/>
          </li>
          <li>
            url: <input type="text" id='input-url' value={url} name="url" placeholder="write the blog's url here"onChange={({ target }) => {setUrl(target.value)}}/>
          </li>
        </ul>
        <div><button onClick={handleCreate2}>Create</button></div>
      </form>
    </div>
  )
}

export default FormCreate