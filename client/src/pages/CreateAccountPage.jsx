import React from 'react'
import Navigation from '../components/Navigation'

/*
    TO DO:
        - Create Account page title
        - Form for account creation
            - Text field for username
            - Text field for screen name (what user's name is in game)
            - Text field for password
            - Button to create account using form input
                - Checks if all fields filled out
                - Checks if username is available by calling api
                - Checks if password is valid based on criteria
*/
const CreateAccountPage = () => {
  return (
    <>
      <Navigation />
      <div className='mt-5 my-auto text-center'>
        <h1>Create Account</h1>
      </div>
    </>
  )
}

export default CreateAccountPage