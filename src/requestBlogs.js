import axios from 'axios'

const baseUrl = '/api/blogs'

export const getBlogs = () => {
  return axios.get(baseUrl).then(res => res.data)
}

export const createNewBlog = ({title, author, url, userData}) => {
  const body = {
    title:title,
    author:author,
    url:url
  }
  const authorization = 'Bearer ' + userData.token
  const config = { headers:{ 'Authorization':authorization } }
  return axios.post(baseUrl, body, config)
}

export const updateLikes = ({updatedBlog, blogId, userData}) => {

  const body = {
    title:updatedBlog.title,
    author:updatedBlog.author,
    url:updatedBlog.url,
    likes:updatedBlog.likes,
    creator:updatedBlog.creator
  }

  const authorization = 'Bearer ' + userData.token
  const config = { headers:{ 'Authorization':authorization } }
  return axios.put(baseUrl + '/' + blogId, body, config)
}

export const deleteBlog = ({blogId, userData}) => {
  const authorization = 'Bearer ' + userData.token
  const config = { headers:{ 'Authorization':authorization } }
  return axios.delete(baseUrl + '/' + blogId, config)
}