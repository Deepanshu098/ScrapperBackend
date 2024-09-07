const server = require('./app');

const port = process.env.PORT;
server.listen((port),()=>{
    console.log(`Server started at http://localhost:${port}`);
})