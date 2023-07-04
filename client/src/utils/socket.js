import io from 'socket.io-client';

const serverUrl = 'http://localhost:4000';
const appSocket = io(serverUrl);

export default appSocket;