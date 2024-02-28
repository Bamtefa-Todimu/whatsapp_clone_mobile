import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import Pusher from 'pusher-js/react-native'


export const echo = new Echo({
  broadcaster: 'pusher',
  Pusher,
  cluster:'mt1',
  key:"Laravel",
  forceTLS: false,
  wsHost: '192.168.100.42',
    wsPort: 6001,
    encrypted: false,
    enabledTransports: ['ws','wss']
});

