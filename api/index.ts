import express from 'express'
import { config } from 'dotenv'
import pg from 'pg'
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
  getAllDataPostVal,
} from '../composables/interface'
import { sqlText } from './sql'

const env = process.env
const app = express()
export const pool = new pg.Pool({
  database: env.DB_DATABASE,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
})
config()

app.listen(8083, () => console.log('API Mock Server is running'))
app.use(express.json())

app.post(connectPathUsers, async (req, res) => {
  const client = await pool.connect()
  try {
    const sqll = `select * from users
    where auth_id = '${req.body.key as string}'`
    client.query(sqll, (err, result) => {
      if (!err) {
        console.log(result.rows[0])
        res.json(result.rows[0])
      }
    })
  } catch (e) {
    console.log(e)
    return {}
  } finally {
    if (client) client.release()
  }

  // const reqVal = sqlText.filter((sqlText) =>
  //   sqlText.name.match(req.body.key.table as string)
  // )
  // res.json(await sql(reqVal[0], [req.body.key.id as string]))
})

const sql = async (reqVal: getAllDataPostVal, prm: string[]) => {
  const client = await pool.connect()
  try {
    const val = (await client.query(reqVal.query, prm)).rows
    if (val && val.length > 0) {
      if (reqVal.table === 'Users') {
        console.log(val)
        return val as Users[]
      } else if (reqVal.table === 'RecordsManagement') {
        return val as RecordsManagement[]
      } else if (reqVal.table === 'Clients') {
        return val as Clients[]
      } else if (reqVal.table === 'Costs') {
        return val as Costs[]
      } else if (reqVal.table === 'Subjects') {
        return val as Subjects[]
      } else {
        return val as SubjectsGroup[]
      }
    } else {
      return {}
    }
  } catch (e) {
    console.log(e)
    return {}
  } finally {
    if (client) client.release()
  }
}

app.post('/testcopy', async (req, res) => {
  console.log(`DB_HOST:${env.DB_HOST}`)

  const resData = {}
  console.log('========ここはIndex=======')
  console.log(resData)
  console.log('============================')
  res.json(resData)
  // res.json({ message: 'hello, api' })
  // これはModelで！
  // pool.connect((err, client) => {
  //   if (err) {
  //     console.log('接続できない')
  //   } else {
  //     console.log('接続できた')
  //     client.query('SELECT mail FROM users', (err, result) => {
  //       if (!err) {
  //         res.json({ datas: result.rows })
  //       }
  //     })
  //   }
  // })
})

module.exports = {
  path: '/api',
  handler: app,
}
