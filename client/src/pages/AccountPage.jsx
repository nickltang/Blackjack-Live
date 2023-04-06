import React from 'react'
import Navigation from '../components/Navigation'

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
const AccountPage = () => {
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