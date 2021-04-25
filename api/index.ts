import express from 'express'
const app = express()

app.listen(8083, () => console.log('API Mock Server is running'))

app.post('/testcopy', (req, res) => {
  console.log(`接続できたcopy！${req.body}`)
  res.json({ message: 'hello, api' })
})
module.exports = {
  path: '/api',
  handler: app,
}
