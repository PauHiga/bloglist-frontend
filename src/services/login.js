import axios from 'axios'

const baseUrl = '/api/login'

const login = async (credentials) => {
  const userLogged = await axios.post(baseUrl, credentials)
  return userLogged
}

export default { login }