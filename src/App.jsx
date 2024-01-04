import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
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

  const handleBlogSubmit = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    }

    try {
      const createdBlog = await blogService.create(newBlog)

      setBlogs([...blogs, createdBlog])

      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setMessage(`New blog "${newBlogTitle}" by "${newBlogAuthor}"`)

      setTimeout(() => {        
        setMessage(null)      
      }, 5000)   
    } catch (exception) {
      setMessage('Error creating a new blog')
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

  const blogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleBlogSubmit}>
        <div>
          Title:
          <input
            type="text"
            value={newBlogTitle}
            onChange={(e) => setNewBlogTitle(e.target.value)}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newBlogAuthor}
            onChange={(e) => setNewBlogAuthor(e.target.value)}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={newBlogUrl}
            onChange={(e) => setNewBlogUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      <ul>
        {blogs.map((blog, i) => 
          <Blog
            key={i}
            blog={blog} 
          />
        )}
      </ul>
      <div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div> 
    </div>
  )

  

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={message} />

      {!user && loginForm()}      
      {user && <div>
       <p>{user.name} logged in</p>
         {blogForm()}
      </div>
    }
 
    </div>
  )
}

export default App