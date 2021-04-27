import express from 'express'

import { config } from 'dotenv'
import pg from 'pg'

import { getMail } from '../composables/useChart'

config()
const env = process.env
const app = express()

export const pool = new pg.Pool({
  database: env.DB_DATABASE,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
})

app.listen(8083, () => console.log('API Mock Server is running'))

app.post('/testcopy', async (req, res) => {
  console.log(`DB_HOST:${env.DB_HOST}`)

  const resData = await getMail()
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
