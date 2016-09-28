var express = require('express')
var open = require('open')
var path = require('path')

var port = 1337
var app = express()

app.use(express.static('./dist'))

app.use('*', function(req, res) {
  res.sendFile(path.join( __dirname, 'dist/index.html'))
})

app.listen(port, function(err) {
  if (err) {
    console.log(err)
  } else {
    open(`http://localhost:${port}`)
  }
})
