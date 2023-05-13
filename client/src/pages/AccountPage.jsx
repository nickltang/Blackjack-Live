import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import axios from 'axios'
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';


/*
    TO DO:
        - Account page title
        - Show current username as label
        - Show current screen name as label
        - Change Screen Name button
            - Should open a modal to change username
        - Change Password button
            - Should open a modal to change password
                - Prompts user to enter old password, then enter new password
                - Checks if new password is valid
                - Save button calls localhost:8000/api/update-user-info
*/

const getUserInfoURL = 'http://localhost:8000/api/users/get-user-info'
const updateUserInfoURL = 'http://localhost:8000/api/users/update-user-info'


const AccountPage = () => {
  const navigate = useNavigate()
  const tokenState = getToken()

  const [name, setName] = useState('')
  const [id, setId] = useState('')

  // Component did mount
  useEffect(() => {
    // If token expired/not present, send user to home page
    if(tokenState.tokenExpired){
      navigate('/')
    }
    
    // Get user info
    axios.get(getUserInfoURL, {
      headers: {
        'Authorization': `Bearer ${tokenState.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setName(res.data.name)
      setId(res.data.setId)

    }).catch((error) => {
      console.log(error)
    }) 
  }, [])


  return (
    <>
      <Navigation />
      <div className='mt-5 my-auto text-center'>
        <h1>Account</h1>
      </div>
    </>
  )
}

export default AccountPage