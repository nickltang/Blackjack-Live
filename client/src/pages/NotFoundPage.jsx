import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'

/*
    TO DO:
        - Shows Page Not Found title
*/
const NotFoundPage = () => {
  return (
    <>
      <Navigation/>
      <div className='mt-5 my-auto text-center'>
        <h1>Sorry, the page you're looking for was not found.</h1>
        <p>Click  <Link to>here</Link> to go back home</p>  
      </div>
    </>
  )
}

export default NotFoundPage