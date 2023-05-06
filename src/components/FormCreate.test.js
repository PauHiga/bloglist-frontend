import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import FormCreate from './FormCreate'
import userEvent from '@testing-library/user-event'

test('<FormCreate/> calls its event handler prop sending the right data to create a new blog entry', async () => {

  const eventHandler = jest.fn()
  const user = userEvent.setup()

  render(<FormCreate create={eventHandler}/>)

  const inputTitle = screen.getByPlaceholderText('write the blog\'s title here')
  const inputAuthor = screen.getByPlaceholderText('write the blog\'s author here')
  const inputUrl = screen.getByPlaceholderText('write the blog\'s url here')
  const button = screen.getByText('Create')

  await user.type(inputTitle, 'blog title')
  await user.type(inputAuthor, 'blog author')
  await user.type(inputUrl, 'blog url')
  await user.click(button)

  expect(eventHandler.mock.calls[0][0]).toBe('blog title')
  expect(eventHandler.mock.calls[0][1]).toBe('blog author')
  expect(eventHandler.mock.calls[0][2]).toBe('blog url')



})