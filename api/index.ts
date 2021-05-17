import express from 'express'
import { config } from 'dotenv'
import pg from 'pg'
import {
  connectPathUsers,
  connectPathPushRecordsManagement,
} from '../composables/routing'
import {
  Users,
  RecordsManagement,
  Clients,
  Costs,
  StateInterface,
  Request,
} from '../composables/interface'
import { sql } from './sql'

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

// 初期処理
app.post(connectPathUsers, async (req: Request, res) => {
  // 状態
  const client = await pool.connect()
  const input: StateInterface = {
    // ユーザ情報
    userInfo: {
      id: '',
      office: '',
    },

    // 取引管理
    userRecordsManagement: [
      {
        id: '',
        payflg: 0,
        pay: 0,
        subject: '',
        subjectGroup: '',
        day: '',
        clientOrCostName: '',
        note: '',
        month: '',
      },
    ],

    // 勘定科目
    subjectsInfo: [
      {
        id: '',
        name: '',
        groupname: '',
        requireflg: 0,
        sortid: 0,
      },
    ],
    // 取引先および固定経費
    clientsAndCostsInfo: [
      {
        id: '',
        name: '',
        itemFlg: 0,
      },
    ],
    // 現在の会計期間
    currentSysYear: { num: 0 },

    // タブ情報
    tabsInfo: [{ tab: '', content: '' }],
  }
  try {
    // ユーザ情報取得
    await client
      .query(sql.userInfo.query, [req.body.key])
      .then((result) => {
        input.userInfo = result.rows[0]
        // console.log('userInfo', input.userInfo)
      })
      .catch((e) => {
        throw e
      })

    // 取引管理情報取得
    await client
      .query(sql.userRecordsManagement.query, [
        input.userInfo.id,
        new Date().getFullYear() - 1 + '-01-01',
        new Date().getFullYear() - 1 + '-12-31',
      ])
      .then((result) => {
        input.userRecordsManagement = result.rows
        // console.log('userRecordsManagement', input.userRecordsManagement)
      })
      .catch((e) => {
        throw e
      })

    // 勘定科目一覧取得
    await client
      .query(sql.subjectsInfo.query)
      .then((result) => {
        input.subjectsInfo = result.rows
        // console.log('subjectsInfo', input.subjectsInfo)
      })
      .catch((e) => {
        throw e
      })

    // ユーザ情報取得
    await client
      .query(sql.clientsAndCostsInfo.query, [input.userInfo.id])
      .then((result) => {
        input.clientsAndCostsInfo = result.rows
        // console.log('userInfo', input.userInfo)
      })
      .catch((e) => {
        throw e
      })

    // タブ情報取得
    await client
      .query(sql.tabsInfo.query)
      .then((result) => {
        input.tabsInfo = result.rows
        // console.log('subjectsInfo', input.subjectsInfo)
      })
      .catch((e) => {
        throw e
      })

    // console.log('Total', input)
    res.json(input)
  } catch (e) {
    console.log(e)
    res.json(null)
  } finally {
    if (client) client.release()
  }
})

/// 取引管理テーブル 追加
app.post(connectPathPushRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const uid: string = req.body.key.id
  const input: RecordsManagement = req.body.key.aryData

  console.log(uid)
  console.log(input)

  try {
    await client
      .query(sql.insertRecordsManagement.query, [
        input.id,
        uid,
        input.payflg,
        input.pay,
        input.subject,
        input.day,
        input.clientOrCostName,
        input.note,
      ])
      .then(() => {
        console.log('DB:insert complete')
        res.json(true)
        // console.log('userInfo', input.userInfo)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    console.log(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

module.exports = {
  path: '/api',
  handler: app,
}
