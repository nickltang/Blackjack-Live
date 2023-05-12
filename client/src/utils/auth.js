import { isExpired, decodeToken } from 'react-jwt'

export const getToken = () => {
    const token = localStorage.getItem('jwt_token');
    const tokenIsExpired = isExpired(token)
    const decodedJWT = decodeToken(token)

    return {
        token: token,
        tokenExpired: tokenIsExpired, 
        decodedJWT: decodedJWT
    }
}