const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  if (!request.body.title || !request.body.url) {
    response.status(400).send({ error: 'title or url missing' })
  } else {
    let blog = new Blog({ ...request.body, user })

    if (!blog.likes) blog.likes = 0

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog.toJSON())
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user._id.toString() === user._id.toString()) {
    const updatedBlogsArray = user.blogs.filter(
      (b) => b._id.toString() !== blog._id.toString()
    )
    user.blogs = updatedBlogsArray
    await user.save()
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response
      .status(401)
      .json({ error: 'blog can only be removed by user who created it' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
