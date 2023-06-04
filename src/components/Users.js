import React from 'react'
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom'

const Users = ({users}) => {

  return (
    <div>
      <h3>Users</h3>
      <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>User</th>
          <th>Blogs Created</th>
        </tr>
      </thead>
      <tbody>
      {users.map(item => 
        <tr key={item.id}>
          <td><Link to={`/users/${item.id}`}>{item.user}</Link></td>
          <td>{item.blogs.length}</td>
        </tr>)}
      </tbody>
      </Table>
    </div>
  )
}

export default Users