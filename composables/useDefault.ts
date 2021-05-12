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

export const getAllData = async (id: string): Promise<Users | undefined> => {
  let response
  const table = 'uR' as string
  await axios
    .post<Users>(`/api${connectPathUsers}`, {
      key: { table, id },
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
