import React, { useState } from 'react'
import PT from 'prop-types'
import axios from 'axios'

const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm({ login }) {
  const [values, setValues] = useState(initialFormValues)

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = async (evt) => {
    evt.preventDefault()
    try {
      const { data } = await axios.post(
        "http://localhost:9000/api/login",
        values
      )
      login(data)
    } catch (err) {
      const status = err.response?.status
      let message = 'Error occurred'
      
      switch (status) {
        case 401:
          message = 'Invalid credentials'
          break
        case 403:
          message = 'Forbidden'
          break
        case 500:
          message = 'Server error'
          break
        case 400:
          message = 'Bad request'
          break
        case 404:
          message = 'Not found'
          break
        case 409:
          message = 'Conflict'
          break
        case 422:
          message = 'Unprocessable entity'
          break
        case 429:
          message = 'Too many requests'
          break
        case 503:
          message = 'Service unavailable'
          break
        case 504:
          message = 'Gateway timeout'
          break
        case 511:
          message = 'Network authentication required'
          break
        default:
          message = 'Error occurred'
      }
      login({ error: message })
    }
  }

  const isDisabled = () => {
    const { username, password } = values
    return !username.trim() || !password.trim() || 
           username.trim().length < 3 || 
           password.trim().length < 8
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
