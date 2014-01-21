WebSocketServer = require('ws').Server
wss = new WebSocketServer port: 8080

wss.on 'connection', (ws) ->
  ws.on 'message', (message) ->
    console.log "Recieved message '#{message}'"

    ws.send "Thank you for contacting us with the message #{message}"
