const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();
require("./db/conn");

const tasks= require("./controllers/tasks");
const userss = require("./controllers/user");
const initializeWeb3Connection = require("./utils/initializeWeb3Connection");

let provider, contract;
initializeWeb3Connection().then(async ({ contract: ct, web3 }) => {
  contract = ct;
  provider = web3;
  // // const res = await contract.methods.createTask("Hello world").send({
  // //   from: "0x068Cea44Af30066b1f8dE4AbAc12a749d9ddaE26"
  // // });
  // const res = await contract.methods.getAllTasks().call();
  // // console.log(res);
});

app.post('/addUser',userss.adduser);
app.post('/loginuser',userss.loginuser);
app.post('/addtask',tasks.addtask);
app.get('/gettask',tasks.gettask);
app.delete('/deletetask',tasks.deletetask);
app.put('/complete',tasks.complete);
app.put('/modifytask',tasks.modifytask);
app.get('/getcoins',tasks.coins);

app.listen(port, () => {
  console.log("server is running on port " + port);
});
