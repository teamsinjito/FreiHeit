import axios from 'axios'
import {
  connectPathUsers,
  connectPathRecordsManagement,
  connectPathClients,
  connectPathCosts,
  connectPathSubjects,
  connectPathSubjectsGroup,
} from '../composables/routing'
import {
  Users,
  RecordsManagement,
  Clients,
  Costs,
  Subjects,
  SubjectsGroup,
} from '../composables/interface'

export const getAllData = async (): Promise<Users | undefined> => {
  let response
  await axios
    .post<Users>(`/api${connectPathUsers}`, {
      key: 'uR',
    })
    .then((data) => {
      alert('getAllData関数終わり')
      response = data.data
      console.log(response)
    })
    .catch(() => {
      alert('getAllData関数失敗')
      response = undefined
    })
  return response
}
