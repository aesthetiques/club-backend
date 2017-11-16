'use strict'

require('dotenv').config()

import cors from 'cors'
import express from 'express'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import errorHandler from '../middleware/error-middleware'

const app = express()
const bodyParser = require('body-parser').json()
const router = express.Router()

//Routes:
import userRoutes from '../routes/user-routes'
import clubRoutes from '../routes/club-routes'
import imageRoutes from '../routes/image-routes'
import directoryRoutes from '../routes/directory-routes'

//.env variables:
const PORT = process.env.PORT || 3000
const VER = process.env.VER || '0.1.0'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/club-dev'

mongoose.Promise = Promise

app.use(
  bodyParser,  
  cors()
)

app.use('/api', userRoutes(router))
app.use('/api', clubRoutes(router))
app.use('/api', imageRoutes(router))
app.use('/api', directoryRoutes(router))

const appState = {
  isOn: false,
  http: null
}

export const start = () => {
  return new Promise((resolve, reject) => {
    if(!appState.http || !appState.isOn){
      appState.isOn = true
      return mongoose.connect(MONGODB_URI, {useMongoClient: true})
        .then(() => {
          appState.http = app.listen(PORT, () => {
            console.log(`Listening on port: ${PORT}; Version: ${VER}, MONGODB_URI: ${MONGODB_URI}`)
            resolve()
          })
        })
      .catch(err => reject(console.error(err.message)))
    }
  })
}

export const stop = () => {
  return new Promise((resolve, reject) => {
    if(appState.http && appState.isOn){
      appState.isOn = false
      return mongoose.disconnect()
        .then(() => {
          appState.http.close(() => {
            console.log(`Closed PORT: ${PORT}; Version: ${VER}, MONGODB_URI: ${MONGODB_URI}`)
            appState.http = null
            resolve()
          })
        })
        .catch(reject(new Error('server is not running')))
    }
    // reject(new Error('server is not running'))
  })
}
