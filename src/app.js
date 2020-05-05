//packages
const express = require('express');

//files
const userRouter = require('./routers/user');
require('./db/db');

const PORT = process.env.PORT;
const app = express();

//middleware
app.use(express.json());
app.use(userRouter);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));