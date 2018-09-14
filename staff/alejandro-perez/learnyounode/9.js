const express = require('express')
const app = express()
const morgan = require('morgan') // NOT NECESSARY "MIDDLEWARE" FOR INFO IN CONSOLE

const PORT = process.argv[2] || 3000

app.use(morgan('dev')) // NOT NECESSARY "MIDDLEWARE" FOR INFO IN CONSOLE

app.get('/api/parsetime', (req, res) => {
  const {iso} = req.query
  const _date = new Date(iso)
  res.json({
    "hour":_date.getHours(),
    "minute":_date.getMinutes(),
    "second":_date.getSeconds()
  })
});


app.get('/api/unixtime', (req, res) => {
  const {iso} = req.query
  const _date = new Date(iso)
  res.json({
    "unixtime": _date.getTime()
  })
});

app.listen(PORT)