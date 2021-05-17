import { pool } from '../api/index'

// インターフェース
export interface Users {
  authId: string
}

export const getMail = async () => {
  let client
  try {
    client = await pool.connect()

    const val = (await client.query('SELECT mail FROM users')).rows as Users[]
    if (val && val.length > 0) {
      return val
    }
  } catch (e) {
    console.log(e)
  } finally {
    if (client) client.release()
  }

  // console.log('getMailの最初')
  // let test = [
  //   {
  //     mail: 'test1111@email.com',
  //   },
  //   {
  //     mail: 'test22222@email.com',
  //   },
  // ]
  // pool.connect(async (err, client) => {
  //   if (err) {
  //     console.log('接続できない')
  //   } else {
  //     console.log('接続できた')

  //     const val = (await client.query('SELECT mail FROM users')).rows

  //     console.log(val)
  //     return val

  // client.query('SELECT mail FROM users', (err, result) => {
  //   if (!err) {
  //     test = result.rows
  //     console.log('========ここはUseChart=======')
  //     console.log(test)
  //     console.log('============================')
  //     return test
  //     // res.json({ datas: result.rows })
  //   }
  // })
  // }
  // return test
  // })
}
