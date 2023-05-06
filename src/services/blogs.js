import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const createBlogEntry = async (title, author, url, user) => {
  const body = {
    title:title,
    author:author,
    url:url
  }

  const authorization = 'Bearer ' + user.data.token
  const config = { headers:{ 'Authorization':authorization } }
  const response = await axios.post(baseUrl, body, config)
  return response
}

const updateLikes = async (updatedBlog, blogId, user) => {

  const body = {
    title:updatedBlog.title,
    author:updatedBlog.author,
    url:updatedBlog.url,
    likes:updatedBlog.likes,
    creator:updatedBlog.creator
  }

  const authorization = 'Bearer ' + user.data.token
  const config = { headers:{ 'Authorization':authorization } }
  const response = await axios.put(baseUrl + '/' + blogId, body, config)
  return response
}

const deleteBlog = async (blogId, user) => {
  const authorization = 'Bearer ' + user.data.token
  const config = { headers:{ 'Authorization':authorization } }
  const response = await axios.delete(baseUrl + '/' + blogId, config)
  return response
}

export default { getAll, createBlogEntry, updateLikes, deleteBlog }