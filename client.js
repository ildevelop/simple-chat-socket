var user = '';
var namespace = io('/room1');

window.onload = function () {
  var btns = document.getElementsByTagName('button');
  var roomData = document.getElementsByTagName('h2')[0];
  var btn = document.getElementById('btn');
  var message_input = document.getElementById('inp');
  var users_container = document.getElementById('userList');
  var curentNameSpace = null;
  console.log(roomData);

  namespace.emit('load users')
  namespace.on('users loaded', function (data) {
    var display_users = data.users.map((username) => `<li>${username} </li>  `);
    users_container.innerHTML = display_users.join( ' ');
  })
  namespace.on('new user', function (data) {
    user = data.user
    console.log('add', user);
  })

  btns[0].onclick = function () {
    console.log('click');
    namespace.on('connect', function () {
      if(curentNameSpace){
        curentNameSpace.disconnect()
      }else{
        curentNameSpace = namespace;
      }
      console.log('connected to room:', curentNameSpace);
      namespace.emit('btn_click', {btn:1})
    });
    namespace.on('room_join', function (data) {
      console.log('join to room N1');
      roomData.innerHTML = 'room ' + data.roomname+ ' joined <br>';
      curentNameSpace = namespace;
    })
    namespace.on('chat message', function (message) {
      console.log('msg', message);
      var display_msg = `<div>${message.user}: ${message.text}</div> `;
      roomData.innerHTML += display_msg
    })
  }
  btns[1].onclick = function () {
    var namespace = io('/room1');

    namespace.on('connect', function () {
      if(curentNameSpace){
        curentNameSpace.disconnect()
      }else{
        curentNameSpace = namespace;
      }
      console.log('connected to room:', curentNameSpace);
      namespace.emit('btn_click', {btn:2})
    });
    namespace.on('room_join', function (data) {
      console.log('join to room N2',roomData);
      roomData.innerHTML = 'room ' + data.roomname+ ' joined <br>';
      curentNameSpace = namespace;
    })
    namespace.on('chat message', function (message) {
      console.log('msg', message);
      var display_msg = `<div>${message.user}: ${message.text}</div> `;
      roomData.innerHTML += display_msg
    })
  }

  btn.onclick = function () {
    console.log('curentNameSpace',curentNameSpace);
    curentNameSpace.emit('send message', {user:user, text: message_input.value})
  }

}