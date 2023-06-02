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