import axios from 'axios'

const baseUrl = '/api/users'

const getAllUsers = async () => {
  const userLogged = await axios.get(baseUrl)
  return userLogged
}

export default { getAllUsers }