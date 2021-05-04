import axios from 'axios'
import { Users } from '../api/index'
export const getAllData = async () => {
  let response
  await axios
    .post<Users>('/api/getAllData')
    .then((data) => {
      alert('getAllData関数終わり')
      response = data
      console.log(response)
    })
    .catch(() => {
      alert('getAllData関数失敗')
    })
}
