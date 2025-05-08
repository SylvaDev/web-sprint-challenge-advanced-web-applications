import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  // Check for token on mount and redirect accordingly
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      redirectToArticles()
    } else {
      redirectToLogin()
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
  }

  const login = async (data) => {
    setMessage('')
    setSpinnerOn(true)
    
    if (data.error) {
      setMessage(data.error)
      setSpinnerOn(false)
      return
    }

    if (data.token) {
      localStorage.setItem('token', data.token)
      setMessage(data.message)
      redirectToArticles()
    } else {
      setMessage('Login failed - no token received')
      redirectToLogin()
    }
    setSpinnerOn(false)
  }

  const getArticles = async () => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.get(articlesUrl, {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setArticles(data.articles)
      setMessage(data.message)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        redirectToLogin()
      }
      setMessage(err.response?.data?.message || 'Error occurred')
    } finally {
      setSpinnerOn(false)
    }
  }

  const postArticle = async article => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.post(articlesUrl, article, {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setArticles([...articles, data.article])
      setMessage(data.message)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        redirectToLogin()
      }
      setMessage(err.response?.data?.message || 'Error occurred')
    } finally {
      setSpinnerOn(false)
    }
  }

  const updateArticle = async ({ article_id, article }) => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setArticles(articles.map(art => art.article_id === article_id ? data.article : art))
      setMessage(data.message)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        redirectToLogin()
      }
      setMessage(err.response?.data?.message || 'Error occurred')
    } finally {
      setSpinnerOn(false)
    }
  }

  const deleteArticle = async article_id => {
    setMessage('')
    setSpinnerOn(true)
    try {
      const { data } = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setArticles(articles.filter(art => art.article_id !== article_id))
      setMessage(data.message)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        redirectToLogin()
      }
      setMessage(err.response?.data?.message || 'Error occurred')
    } finally {
      setSpinnerOn(false)
    }
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <ProtectedRoute>
              <>
                <ArticleForm 
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                  articles={articles}
                />
                <Articles 
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            </ProtectedRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
