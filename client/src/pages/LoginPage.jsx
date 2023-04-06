import React from 'react'
import Navigation from '../components/Navigation'

/*
    TO DO:
        - Login Form
            - Text field for username
            - Text field for password
            - Button to log in
                - Should validate login info with api
*/
const LoginPage = () => {
  return (
    <>
      <Navigation/>
      <div className='mt-5 my-auto text-center'>
        <h1>Login Page</h1>
      </div>
    </>
  )
}

export default LoginPage