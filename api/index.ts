import http from 'http'
import express from 'express'
import { config } from 'dotenv'
import pg from 'pg'
import { configure, getLogger } from 'log4js'
import {
  connectDefaultWorks,
  connectPathUsers,
  connectPathInsertWorks,
  connectPathUpdateWorks,
  connectPathDeleteWorks,
  connectPathInsertRecordsManagement,
  connectPathUpdateRecordsManagement,
  connectPathDeleteRecordsManagement,
  connectPathInsertClientCost,
  connectPathUpdateClientCost,
  connectPathDeleteClientCost,
  connectPathChangeYearRecordsManagement,
  connectPathChangeWorksRecordsManagement,
} from '../composables/routing'
import {
  InsertUpdateWorks,
  RecordsManagement,
  ClientsAndCosts,
  StateInterface,
  Request,
  Works,
  WorkChange,
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

configure({
  appenders: { app: { type: 'file', filename: './logs/app.log' } },
  categories: { default: { appenders: ['app'], level: 'error' } },
})
const logger = getLogger()

// app.set('port', process.env.PORT || 8083)
// app.listen(app.get('port'))
app.use(express.json())

app.post(connectDefaultWorks, async (req: Request, res) => {
  const client = await pool.connect()
  const input: string = req.body.key
  const workDefault: Works = {
    id: '',
    name: '',
    last: '',
  }
  try {
    // 事業所取得
    await client
      .query(sql.defaultWorkInfo.query, [input])
      .then((result) => {
        if (result.rows[0] !== undefined) {
          workDefault.id = result.rows[0].id
          workDefault.name = result.rows[0].name
          workDefault.last = result.rows[0].last
        }
        logger.info('aha!')
        res.json(workDefault)
      })
      .catch((e) => {
        logger.error(e)
        throw e
      })
  } catch (e) {
    res.json(false)
  } finally {
    if (client) client.release()
  }
})
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
        last: '',
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
        update: '',
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
        payflg: 0,
      },
    ],
    // 取引先および固定経費
    clientsAndCostsInfo: [
      {
        id: '',
        name: '',
        wid: '',
        iflg: 0,
        color: '',
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

    // ヘルプ
    helpsInfo: [
      {
        title: '',
        body: '',
      },
    ],
  }
  try {
    // ユーザ情報取得
    await client
      .query(sql.workInfo.query, [req.body.key])
      .then((result) => {
        input.workInfo = result.rows
      })
      .catch((e) => {
        throw e
      })
    if (input.workInfo[0] !== undefined) {
      // 取引管理情報取得
      await client
        .query(sql.userRecordsManagement.query, [
          input.workInfo[0].id,
          new Date().getFullYear() - 1 + '-01-01',
          new Date().getFullYear() - 1 + '-12-31',
        ])
        .then((result) => {
          input.workRecordsManagement = result.rows
        })
        .catch((e) => {
          throw e
        })

      // ユーザ情報取得
      await client
        .query(sql.clientsAndCostsInfo.query, [input.workInfo[0].id])
        .then((result) => {
          input.clientsAndCostsInfo = result.rows
        })
        .catch((e) => {
          throw e
        })
    }

    // 勘定科目一覧取得
    await client
      .query(sql.subjectsInfo.query)
      .then((result) => {
        input.subjectsInfo = result.rows
      })
      .catch((e) => {
        throw e
      })

    // タブ情報取得
    await client
      .query(sql.tabsInfo.query)
      .then((result) => {
        input.tabsInfo = result.rows
      })
      .catch((e) => {
        throw e
      })

    // ヘルプ情報取得
    await client
      .query(sql.helpsInfo.query)
      .then((result) => {
        input.helpsInfo = result.rows
      })
      .catch((e) => {
        throw e
      })

    res.json(input)
  } catch (e) {
    logger.error(e)
    res.json(null)
  } finally {
    if (client) client.release()
  }
})

/// 事業所テーブル 追加
app.post(connectPathInsertWorks, async (req, res) => {
  const client = await pool.connect()
  const input: InsertUpdateWorks = req.body.key

  try {
    await client
      .query(sql.insertWork.query, [input.id, input.uid, input.name])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 事業所テーブル 更新
app.post(connectPathUpdateWorks, async (req, res) => {
  const client = await pool.connect()
  const input: InsertUpdateWorks = req.body.key

  try {
    // 事業所テーブル更新
    await client
      .query(sql.updateWork.query, [input.name, input.id])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 事業所テーブル 削除
app.post(connectPathDeleteWorks, async (req, res) => {
  const client = await pool.connect()
  const input: string = req.body.key

  try {
    // 事業所テーブル更新
    await client
      .query(sql.deleteWork.query, [input])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 取引管理テーブル 追加
app.post(connectPathInsertRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const input: RecordsManagement = req.body.key

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
        input.update,
      ])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 取引管理テーブル 更新
app.post(connectPathUpdateRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const input: RecordsManagement = req.body.key

  try {
    // 取引管理テーブル更新
    await client
      .query(sql.updateRecordManagement.query, [
        input.pay,
        input.sid,
        input.day,
        input.cid,
        input.note,
        input.update,
        input.id,
      ])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})
/// 取引管理テーブル 削除
app.post(connectPathDeleteRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const input: string = req.body.key

  try {
    // 取引管理テーブル更新
    await client
      .query(sql.deleteRecordManagement.query, [input])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 取引先固定経費テーブル 追加
app.post(connectPathInsertClientCost, async (req, res) => {
  const client = await pool.connect()
  const input: ClientsAndCosts = req.body.key

  try {
    await client
      .query(sql.insertClientCost.query, [
        input.id,
        input.name,
        input.wid,
        input.iflg,
        input.color,
      ])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 取引先固定経費テーブル 更新
app.post(connectPathUpdateClientCost, async (req, res) => {
  const client = await pool.connect()
  const input: ClientsAndCosts = req.body.key

  try {
    await client
      .query(sql.updateClientCost.query, [input.name, input.color, input.id])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 取引先固定経費テーブル 削除
app.post(connectPathDeleteClientCost, async (req, res) => {
  const client = await pool.connect()
  const input: string = req.body.key

  try {
    // 取引先固定経費テーブル更新
    await client
      .query(sql.deleteClientCost.query, [input])
      .then(() => {
        res.json(true)
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

/// 年度切り替えによる取引管理テーブル 再取得
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
      })
      .catch((e) => {
        throw e
      })
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})
/// 事業所切り替えによる取引管理テーブルおよび取引先、固定経費テーブル 再取得
app.post(connectPathChangeWorksRecordsManagement, async (req, res) => {
  const client = await pool.connect()
  const inputYear: number = req.body.key.y
  const inputWid: string = req.body.key.id
  const inputNow: string = req.body.key.now

  const input: WorkChange = {
    workRecordsManagement: [
      {
        id: '',
        wid: '',
        pay: 0,
        sid: '',
        day: '',
        cid: '',
        note: '',
        update: '',
      },
    ],
    clientsAndCostsInfo: [
      {
        id: '',
        name: '',
        wid: '',
        iflg: 0,
        color: '',
      },
    ],
  }
  try {
    // 取引管理情報取得
    await client
      .query(sql.userRecordsManagement.query, [
        inputWid,
        inputYear + '-01-01',
        inputYear + '-12-31',
      ])
      .then((result) => {
        input.workRecordsManagement = result.rows
      })
      .catch((e) => {
        throw e
      })

    // 取引先および固定経費情報取得
    await client
      .query(sql.clientsAndCostsInfo.query, [inputWid])
      .then((result) => {
        input.clientsAndCostsInfo = result.rows
      })
      .catch((e) => {
        throw e
      })

    // 事業所テーブルにおいて、選択した事業所の最終選択時刻を更新
    await client.query(sql.updateWorkLastTime.query, [inputNow, inputWid])

    res.json(input)
  } catch (e) {
    logger.error(e)
    res.json(false)
  } finally {
    if (client) client.release()
  }
})

module.exports = {
  path: '/api',
  handler: app,
}
