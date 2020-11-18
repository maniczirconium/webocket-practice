// Make connection
const socket   = io.connect('http://localhost:4000')
const messages = []

// Query DOM
const message    = document.getElementById('message'),
      handle     = document.getElementById('handle'),
      btn        = document.getElementById('send'),
      output     = document.getElementById('output'),
      feedback   = document.getElementById('feedback'),
      chatWindow = document.getElementById('chat-window')

// Emit Events
btn.addEventListener('click', function(event) {
  sendChat({
    message : message.value,
    handle  : handle.value
  })

  message.value = ""
})

message.addEventListener('keypress', function(event) {
  socket.emit('typing', handle.value)
  if(event.keyCode == 13) { // Enter key
    sendChat({
      message : message.value,
      handle  : handle.value
    })

    message.value = ""
  }
})

// Listen for events
socket.on('chat', function(data) {
  feedback.innerHTML = ''
  receiveChat(data)
  renderChatbox()

  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight
})

socket.on('typing', function(data) {
  feedback.innerHTML = `<p><em>${data}</em> is typing&hellip;</p>`
  chatWindow.scrollTop = chatWindow.scrollHeight
})

function sendChat({ message, handle }) {
  if(message === '') return

  socket.emit('chat', { message, handle })
}

function receiveChat(data) {
  messages.push(data)
}

function renderChatbox() {
  const renderedMessages = []
  let currentHandle    = ''

  for(m of messages) {
    let msgGroup = ''

    if(m.handle !== currentHandle) {
      msgGroup += `<dt${m.handle === handle.value ? ' class="from-me"' : ''}>${m.handle}</dt>`
    }
    
    msgGroup += `<dd${m.handle === handle.value ? ' class="from-me"' : ''}>${m.message}</dd>`
    currentHandle = m.handle
    renderedMessages.push(msgGroup)
  }

  output.innerHTML = renderedMessages.join("\n")
}