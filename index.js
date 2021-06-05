require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')

const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})


const errorHandler = require('./middlewares/errorHandler')
const authRoute = require('./routers/auth')
const groupRoute = require('./routers/group')
const groupChatRoute = require('./routers/groupChat')

const Port = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

io.on('connect', socket => {
    let groupIds
    console.log('connect')
    socket.on('join', groupId => {
        groupIds = groupId
        socket.join(groupIds)

    })
    socket.on('newMessage', data => {
        console.log(groupIds)
        io.in(groupIds).emit(`newMessage`, data)
    })

    socket.on('disconnect', () => {
        console.log('disconnect')
    })
})

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/group', groupRoute)
app.use('/api/v1/groupChat', groupChatRoute)

app.use(errorHandler)

server.listen(Port, () => {
    console.log(`app listen on ${Port}`)
})
