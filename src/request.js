import axios from 'axios'

const baseUrl = '/api/blogs'

export const getBlogs = () => {
  return axios.get(baseUrl).then(res => res.data)
}

export const createNewBlog = ({title, author, url, user}) => {
  console.log(author)
  const body = {
    title:title,
    author:author,
    url:url
  }
  const authorization = 'Bearer ' + user.token
  const config = { headers:{ 'Authorization':authorization } }
  return axios.post(baseUrl, body, config)
}

export const updateLikes = ({updatedBlog, blogId, user}) => {

  const body = {
    title:updatedBlog.title,
    author:updatedBlog.author,
    url:updatedBlog.url,
    likes:updatedBlog.likes,
    creator:updatedBlog.creator
  }

  const authorization = 'Bearer ' + user.token
  const config = { headers:{ 'Authorization':authorization } }
  return axios.put(baseUrl + '/' + blogId, body, config)
}

export const deleteBlog = ({blogId, user}) => {
  const authorization = 'Bearer ' + user.token
  const config = { headers:{ 'Authorization':authorization } }
  return axios.delete(baseUrl + '/' + blogId, config)
}