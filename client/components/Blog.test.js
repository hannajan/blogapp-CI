/**
 * @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import {act} from 'react-dom/test-utils'

describe('<Blog />', () => {
  let user
  let mockLikeHandler
  let mockRemoveHandler
  let blog

  beforeEach(() => {
    user = {
      username: 'root',
      name: 'Superuser',
      password: 'secret'
    }

    mockLikeHandler = jest.fn()
    mockRemoveHandler = jest.fn()

    blog = {
      title: 'Blog for jest testing',
      author: 'Test Mickey',
      url: 'www.react.fi',
      likes: 3,
      user: user
    }
  })


  test('renders blog initially only showing title and author', () => {
    const { container } = render(<Blog blog={blog} user={user} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler}/>)

    const div = container.querySelector('.blogView')
    expect(div).toHaveTextContent('Test Mickey')
    expect(div).toHaveTextContent('Blog for jest testing')
    expect(div).not.toHaveTextContent('www.react.fi')
    expect(div).not.toHaveTextContent('likes')

    expect(div).not.toHaveStyle('display: none')
  })

  test('shows full view when view button is pressed', async () => {
    const { container } = render(<Blog blog={blog} user={user} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler} />)

    const viewButton = screen.getByText('view')

    await act(() => userEvent.click(viewButton))
    
    const div = container.querySelector('.fullBlogView')

    expect(div).not.toHaveStyle('display: none')

    expect(div).toHaveTextContent('www.react.fi')
    expect(div).toHaveTextContent('likes 3')
  })

  test('when like button is pressed twice handler is called twice', async () => {
    render(<Blog blog={blog} user={user} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler} />)

    const viewButton = screen.getByText('view')
    await act(() => userEvent.click(viewButton))
    const likeButton = screen.getByText('like')

    await act (() => userEvent.click(likeButton))
    await act (() => userEvent.click(likeButton))

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})


