const express = require('express');
const app = express();
const {
  socketPort
} = require('./../../config/vars');
const server = app.listen(socketPort);
const socketIo = require('socket.io');
const io = socketIo.listen(server,{'forceNew':true,'reconnection':true,'reconnectionDelay': 500,'reconnectionAttempts': 2423});
const Hairdresser = require('./../models/hairdresser.model');
const Client = require('./../models/client.model');
//const Room = require('./../models/room.model')
const connection = require('../../config/mysql');

var users={hairdresser:null, client:null}




io.on('connection', (socket) => {
  console.log('connected')

  //hairdresser entered the room

  socket.on('clickStartButton', async (dresserId, clientId) => {
  

    await connection.query('UPDATE hairdresser SET socketId=? WHERE id = ?', [socket.id, dresserId]);
    let createlogs = `create table if not exists logs(
      id int primary key auto_increment,
      sender varchar(255)not null,
      receiver varchar(255)not null,
      content varchar(255)not null,
      created_at timestamp default current_timestamp
  )`;
  await connection.query(createlogs);

    connection.query('SELECT * FROM hairdresser WHERE id =?', [dresserId], (async (err, rows) => {
      users.hairdresser=rows[0];
      const dresserSocketId = rows[0].socketId;
      const email=rows[0].email;

      await connection.query("INSERT INTO logs (sender, content) VALUES (?, 'connected')",[email])
      console.log('Dresser click the ready button--dresser-socket-id:' + dresserSocketId)
    }))
  });

  socket.on('confirmConnectClient', async (dresserId, clientId) => {



    connection.query('SELECT * FROM hairdresser WHERE id =?', [dresserId], (async (err, rows) => {
      console.log('rows')
      console.log(rows)

      
      if(!rows||rows[0].socketId=='' || rows[0].socketId==null){
        socket.emit('backToClient','fail');
        return;
      }
      const dresserSocketId = rows[0].socketId;

      await connection.query('UPDATE client SET socketId=? WHERE id = ?', [socket.id, clientId]);
      let createlogs = `create table if not exists logs(
        id int primary key auto_increment,
        sender varchar(255)not null,
        receiver varchar(255)not null,
        content varchar(255)not null,
        created_at timestamp default current_timestamp
    )`;
    await connection.query(createlogs);


      connection.query('SELECT * FROM client WHERE id =?', [clientId], (async(err, rows2) => {
        users.client=rows2[0];
        const clientSocketId = rows2[0].socketId;
        const email=rows2[0].email;
        await connection.query("INSERT INTO logs (sender, content) VALUES (?, 'connected')",[email]);

        console.log('client clict the confirm button--clien-socket-id:' + clientSocketId);
        socket.to(dresserSocketId).emit('confirmConnectClient', clientSocketId);
        console.log('client:' + clientSocketId + '-->' + 'hairdresser:' + dresserSocketId);
        socket.emit('startChatting', dresserSocketId);
        console.log('client--->client-->' + dresserSocketId);

      }))
    }))
  });
  // socket.on('dresserEnterRoom', async (clientId) => {
  //   connection.query('SELECT * FROM client WHERE id =?', [clientId], ((err, rows) => {

  //     const clientSocketId = rows[0].socketId;
  //     socket.to(clientSocketId).emit('dresserEnterRoom', 'dresserEnter');
  //     console.log('Dresser enter room: clientSocketId' + clientSocketId)
  //   }))
  // });

  socket.on('sendTextFromDresser', async (clientSocketId, data) => {
    console.log('clientSocketId')
    console.log(clientSocketId)
    
    socket.to(clientSocketId).emit('receiveMessageFromDresser',data)
    socket.emit('backMessageToDresser',data);
        await connection.query("INSERT INTO logs (sender,receiver, content) VALUES (?,?,?)",
        [users.hairdresser.email,users.client.email, data.message]);

  });

  socket.on('sendTextFromClient', async (dresserSocketId, data) => {

    socket.to(dresserSocketId).emit('receiveMessageFromClient',data)
    socket.emit('backMessageToClient',data);

    await connection.query("INSERT INTO logs (sender,receiver, content) VALUES (?,?,?)",
    [users.client.email,users.hairdresser.email, data.message]);

  });

  socket.on('typing', async (other) => {

    socket.to(other).emit('typing','')


  });

  socket.on('untyping', async (other) => {

    socket.to(other).emit('untyping','')


  });




  socket.on('disconnect', async () => {
    console.log('disconnected:' + socket.id)
    if(users.hairdresser==null)
    return;
    if(socket.id==users.hairdresser.socketId){
      console.log('dddss')
      await connection.query('UPDATE hairdresser SET socketId=? WHERE socketId = ?', ['', socket.id]);
      socket.to(users.client.socketId).emit('DresserExit','');
      await connection.query("INSERT INTO logs (sender,content) VALUES (?,'disconnected')",[users.hairdresser.email]);
    }else{
      await connection.query('UPDATE client SET socketId=? WHERE socketId = ?', ['', socket.id]);
      socket.to(users.hairdresser.socketId).emit('ClientExit','');
      await connection.query("INSERT INTO logs (sender,content) VALUES (?,'disconnected')",[users.client.email]);
    }
  });

});


