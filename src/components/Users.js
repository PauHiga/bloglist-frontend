import React from 'react'
import { Link } from 'react-router-dom'

const Users = ({users}) => {

  return (
    <div>
      <h2>Users</h2>
      {users.map(item => 
        <div key={item.id}>
          <Link to={`/users/${item.id}`}>
            {item.user} - {item.blogs.length} blogs created
          </Link>
        </div>)}
    </div>
  )
}

export default Users