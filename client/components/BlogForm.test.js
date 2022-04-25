/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import {act} from 'react-dom/test-utils'

test('<BlogForm /> sends out correct information when submitted', async () => {
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const button = screen.getByText('create')

  await act(() => userEvent.type(titleInput, 'testing title'))
  await act(() => userEvent.type(authorInput, 'testing author')) 
  await act(() => userEvent.type(urlInput, 'www.test.fi'))  
  await act(() => userEvent.click(button))  
  
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.test.fi')
})