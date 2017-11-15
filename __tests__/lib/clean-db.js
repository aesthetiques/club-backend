'use strict'

import User from '../../src/models/user'
import Club from '../../src/models/club'
import Image from '../../src/models/image'
import Directory from '../../src/models/directory'

let removeModelWithHook = (model) => {
  return model.find({})
    .then(items => {
      return Promise.all(items.map(a => a.remove()))
    })
}

module.exports = () => {
  return Promise.all([
    removeModelWithHook(User), 
    removeModelWithHook(Club),
    removeModelWithHook(Image),
    removeModelWithHook(Directory)
  ])
}