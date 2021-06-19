// import axios from 'axios'
// import {
//   Users,
//   RecordsManagement,
//   Clients,
//   Costs,
//   Subjects,
//   SubjectsGroup,
// } from './interface'
// import {
//   connectPathUsers,
//   connectPathRecordsManagement,
//   connectPathClients,
//   connectPathCosts,
//   connectPathSubjects,
//   connectPathSubjectsGroup,
// } from './routing'

// export const getAllDataUsers = async (): Promise<Users | undefined> => {
//   let response: Users | undefined
//   await axios
//     .post<Users>(connectPathUsers, {
//       query2: 'SELECT * FROM users',
//       table: 'users',
//     })
//     .then((data) => {
//       response = data.data
//     })
//     .catch(() => {
//       response = undefined
//     })
//   return response
// }

// export const getAllDataRecordsManagement = async (): Promise<
//   RecordsManagement | undefined
// > => {
//   let response
//   await axios
//     .post<RecordsManagement>(connectPathRecordsManagement)
//     .then((data) => {
//       response = data.data
//     })
//     .catch(() => {
//       response = undefined
//     })
//   return response
// }

// export const getAllDataClients = async (): Promise<Clients | undefined> => {
//   let response
//   await axios
//     .post<Users>(connectPathClients)
//     .then((data) => {
//       response = data.data
//     })
//     .catch(() => {
//       response = undefined
//     })
//   return response
// }

// export const getAllDataCosts = async (): Promise<Costs | undefined> => {
//   let response
//   await axios
//     .post<Costs>(connectPathCosts)
//     .then((data) => {
//       response = data.data
//     })
//     .catch(() => {
//       response = undefined
//     })
//   return response
// }

// export const getAllDataSubjects = async (): Promise<Subjects | undefined> => {
//   let response
//   await axios
//     .post<Subjects>(connectPathSubjects)
//     .then((data) => {
//       response = data.data
//     })
//     .catch(() => {
//       response = undefined
//     })
//   return response
// }

// export const getAllDataSubjectsGroup = async (): Promise<
//   SubjectsGroup | undefined
// > => {
//   let response: SubjectsGroup | undefined
//   await axios
//     .post<SubjectsGroup>(connectPathSubjectsGroup)
//     .then((data) => {
//       response = data.data
//     })
//     .catch(() => {
//       response = undefined
//     })
//   return response
// }
