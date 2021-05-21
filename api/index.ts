import express from 'express'
import { config } from 'dotenv'
import pg from 'pg'
import {
  connectPathUsers,
  connectPathInsertRecordsManagement,
  connectPathUpdateRecordsManagement,
  connectPathDeleteRecordsManagement,
  connectPathInsertClientCost,
  connectPathUpdateClientCost,
  connectPathDeleteClientCost,
  connectPathChangeYearRecordsManagement,
} from '../composables/routing'
import {
  RecordsManagement,
  ClientsAndCosts,
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
    workInfo: [
      {
        id: '',
        name: '',
      },
    ],

    // 取引管理
    workRecordsManagement: [
      {
        id: '',
        wid: '',
        pay: 0,
        sid: '',
        day: '',
        cid: '',
        note: '',
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
        wid: '',
        iflg: 0,
      },
    ],
    // 現在の会計期間
    currentSysYear: { num: 0 },

    // タブ情報
    tabsInfo: [{ tab: '', content: '' }],

    // スナックバー
    snackInfo: {
      text: '',
      color: '',
      view: false,
    },
  }
  try {
    // ユーザ情報取得
    await client
      .query(sql.workInfo.query, [req.body.key])
      .then((result) => {
        input.workInfo = result.rows
        // console.log('userInfo', input.userInfo)
      })
      .catch((e) => {
        throw e
      })

    // 取引管理情報取得
    await client
      .query(sql.userRecordsManagement.query, [
        input.workInfo[0].id,
        new Date().getFullYear() - 1 + '-01-01',
        new Date().getFullYear() - 1 + '-12-31',
      ])
      .then((result) => {
        input.workRecordsManagement = result.rows
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
      .query(sql.clientsAndCostsInfo.query, [input.workInfo[0].id])
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
app.post(connectPathInsertRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const input: RecordsManagement = req.body.key

  console.log(input)

  try {
    await client
      .query(sql.insertRecordsManagement.query, [
        input.id,
        input.wid,
        input.pay,
        input.sid,
        input.day,
        input.cid,
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

/// 取引管理テーブル 更新
app.post(connectPathUpdateRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const input: RecordsManagement = req.body.key

  console.log(input)

  try {
    // 取引管理テーブル更新
    await client
      .query(sql.updateRecordManagement.query, [
        input.pay,
        input.sid,
        input.day,
        input.cid,
        input.note,
        input.id,
      ])
      .then(() => {
        console.log('DB:update complete')
        res.json(true)
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
/// 取引管理テーブル 削除
app.post(connectPathDeleteRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const input: string = req.body.key

  console.log(input)

  try {
    // 取引管理テーブル更新
    await client
      .query(sql.deleteRecordManagement.query, [input])
      .then(() => {
        console.log('DB:delete complete')
        res.json(true)
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

/// 取引先固定経費テーブル 追加
app.post(connectPathInsertClientCost, async (req, res) => {
  const client = await pool.connect()
  const input: ClientsAndCosts = req.body.key

  console.log(input)

  try {
    await client
      .query(sql.insertClientCost.query, [
        input.id,
        input.name,
        input.wid,
        input.iflg,
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

/// 取引管理テーブル 再取得
app.post(connectPathChangeYearRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const inputYear: number = req.body.key.y
  const inputWid: string = req.body.key.id
  try {
    // 取引管理情報取得
    await client
      .query(sql.userRecordsManagement.query, [
        inputWid,
        inputYear + '-01-01',
        inputYear + '-12-31',
      ])
      .then((result) => {
        res.json(result.rows)
        // console.log('userRecordsManagement', input.userRecordsManagement)
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
