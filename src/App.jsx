import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {    
    const loggedUserJSON = 
    window.localStorage.getItem('loggedappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    }  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {      
      const user = await loginService.login({        
      username, password,      
    })      

    window.localStorage.setItem(        
      'loggedappUser', JSON.stringify(user)      
    ) 
    blogService.setToken(user.token)
    setUser(user)      
    setUsername('')      
    setPassword('')
    setMessage('Login successfull')
    setTimeout(() => {        
      setMessage(null)      
    }, 5000)     
  } catch (exception) {      
      setMessage('wrong credentials')      
    setTimeout(() => {        
      setMessage(null)      
    }, 5000)    
  }
  }


  const handleLogout = () => {
    window.localStorage.removeItem('loggedappUser')
    setUser(null)
    setMessage('Logout successfull')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  const blogForm = () => (
    <Togglable buttonLabel="uusi blogi" ref={blogFormRef} >
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={message} />

      {!user && loginForm()}      
      {user && <div>
       <p>{user.name} logged in</p>
       <h2>Blogit</h2>
       {blogForm()}
         <div>
         <ul>
        {blogs.map((blog, i) => 
          <Blog
            key={i}
            blog={blog} 
          />
        )}
      </ul>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div> 
      </div>
    }
 
    </div>
  )
}

export default App

