'use strict'

import expect from 'expect'
import superagent from 'superagent'
import cleanDB from '../../lib/clean-db'
import User from '../../../src/models/user'
import { start, stop } from '../../../src/lib/server'
import { mockClub, mockUser } from '../../lib/mock-data';

let TEST_API_URL = `http://localhost:${process.env.PORT}`

describe('User Test Module', function(){
  beforeAll(start)
  afterAll(stop)
  afterAll(cleanDB)

  let token = ''
  
  describe('valid requests', function(){
    describe('PUT password updates', () => {
      beforeAll(() => {
        return superagent.post(`${TEST_API_URL}/api/signup`)
          .send(mockUser)
          .then(res => {
            this.res = res
            token = this.res.body
          })
          .catch(err => console.error(err))
      })

      test('should update a user', () => {
        return superagent.put(`${TEST_API_URL}/api/updatePassword`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .send({
            "email": `${mockUser.email}`, 
            "password": "uwotmate"
          })
          .then(res => expect(this.res.status).toBe(200))
      })
      
      test('should reset the password of a user', () => {
        return superagent.put(`${TEST_API_URL}/api/forgotPassword`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            "email": `${mockUser.email}`
          })
          .then(res => expect(this.res.status).toBe(200))
      })
    })
  })

  // describe('invalid requests', function(){
  //   describe('PUT updatePassword bad requests', () => {

  //     test('missing request data', () => {
  //       superagent.put(`${TEST_API_URL}/api/updatePassword`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .send({ 
  //           "email": `${mockUser.email}`
  //         })
  //         .then(() => expect(err.status).toBe(400))
  //     })
  //   })
  // })

})