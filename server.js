import express, { Router } from 'express'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import zoomRouter from './controller/bot.js'
const PORT = process.env.PORT || 3000
dotenv.config()


const app = express()
app.use(express.json())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/', zoomRouter)

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'views/join.html')
})

app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
)
