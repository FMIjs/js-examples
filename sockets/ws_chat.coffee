WebSocketServer = require('ws').Server
wss = new WebSocketServer port: 8080

sockets = []

send_to_sockets = (message, from) ->
  sockets.forEach (socket) ->
    return if socket == from
    socket.send message

wss.on 'connection', (socket) ->
  sockets.push socket
  socket.__user_info = {}
  socket.send 'Use "/nick <nick>" to set your nick'
  console.log 'Connected new client'

  socket.on 'message', (message) ->
    match_nick = message.match /\/nick ([\w\d]+)/

    if match_nick
      new_nick = match_nick[1]
      message_to_send = if socket.__user_info.name then "#{socket.__user_info.name} is now known as #{new_nick}" else "#{new_nick} is no longer lurking"
      send_to_sockets message_to_send, socket
      socket.__user_info.name = match_nick[1]
      return

    unless socket.__user_info.name
      socket.send '!!!!Please set a nick'
      return

    send_to_sockets "#{socket.__user_info.name}: #{message}", socket

  socket.on 'close', ->
    console.log 'Closed'

    sockets.splice sockets.indexOf socket
    send_to_sockets "#{socket.__user_info.name} has quit", socket
    return
