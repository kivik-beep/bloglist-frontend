import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

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
  } catch (exception) {      
      setErrorMessage('wrong credentials')      
    setTimeout(() => {        
      setErrorMessage(null)      
    }, 5000)    
  }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedappUser')
    setUser(null)
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

      <Notification message={errorMessage} />

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