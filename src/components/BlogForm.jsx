import {useState} from 'react'

const blogForm = ({createBlog}) => {
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogAuthor, setNewBlogAuthor] = useState('')
    const [newBlogUrl, setNewBlogUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newBlogTitle,
            author: newBlogAuthor,
            url: newBlogUrl
        })

        setNewBlogAuthor('')
        setNewBlogTitle('')
        setNewBlogUrl('')
    }


    return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
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
    </div>)
}

export default blogForm