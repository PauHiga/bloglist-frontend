import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


test('<Blog/> renders', () => {

  const mockFunction =  jest.fn

  const user = { data:{ username:'userUsername' } }

  const mockBlog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 5,
    creator: { id:10, username:'creatorUsername' }
  }

  render(<Blog blog={ mockBlog } handleLike={ mockFunction } user={user} handleDelete={ mockFunction } />)

  screen.getByText('blog title', { exact: false })
  screen.getByText('blog author', { exact: false })
  const url = screen.queryByText('blog url')
  expect(url).toBeNull()
  const likes = screen.queryByText(5)
  expect(likes).toBeNull()
})


test('<Blog/> displays url and number of like when the "show details" button is pressed', async () => {

  const user = userEvent.setup()
  const mockFunction =  jest.fn

  const mockUser = { data:{ username:'userUsername' } }

  const mockBlog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 5,
    creator: { id:10, username:'creatorUsername' }
  }

  render(<Blog blog={ mockBlog } handleLike={ mockFunction } user={mockUser} handleDelete={ mockFunction } />)

  const url = screen.queryByText('blog url')
  const likes = screen.queryByText(5)
  const button = screen.getByText('Show details')

  expect(url).toBeNull()
  expect(likes).toBeNull()

  await user.click(button)

  screen.getByText('blog url', { exact: false })
  screen.getByText('Likes: 5', { exact: false })
})

test('if the "like" button is called twice, the event handler is called twice', async () => {
  const user =userEvent.setup()
  const mockFunction = jest.fn()

  const mockBlog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 5,
    creator: { id:10, username:'creatorUsername' }
  }

  const mockUser = { data:{ username:'userUsername' } }

  render(<Blog blog={mockBlog} handleLike={mockFunction} user={mockUser} handleDelete={mockFunction} />)

  const button = screen.getByText('like')

  await user.dblClick(button, { delay:100 })
  expect(mockFunction.mock.calls).toHaveLength(2)

})
