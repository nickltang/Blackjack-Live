import axios from 'axios'

export const getTest = async () => {
    try{
        const res = await axios.get('http://localhost:8080/test').then(() => console.log(res))

        return res
    } catch (err) {
        console.log('getTest Error: ', err)
    }
}