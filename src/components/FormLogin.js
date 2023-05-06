const FormLogin = ({ username, setUsername, password, setPassword, handleLogin }) => {
  return(
    <form type='submit' id='login-form'>
      <div>
        username <input type="text" className='username-input' value={username} name='Username' onChange={({  target }) =>  setUsername( target.value)} />
      </div>
      <div>
        password <input type="text" className='password-input' value={password} name='Password' onChange={({ target }) => setPassword(target.value) } />
      </div>
      <button onClick={handleLogin}>Login</button>
    </form>
  )
}

export default FormLogin