import React from 'react'
import { useParams } from 'react-router-dom'

const UserInfo = ({users}) => {
  const id = useParams().id
  const selectedUser = users.find(item => item.id === id)
  return (
    <div>
      <h3>{selectedUser.user}</h3>
      <h4>Added blogs:</h4>
      <ul>
        {selectedUser.blogs.map( item => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  )
}

export default UserInfo