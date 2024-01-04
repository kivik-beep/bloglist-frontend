const Blog = ({ blog }) => {
  
  return (
    <li className='blog'>
      {blog.title} {blog.author}
    </li>
  )
}

export default Blog