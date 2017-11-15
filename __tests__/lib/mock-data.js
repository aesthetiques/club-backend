'use strict'

import Club from '../../src/models/club'
import User from '../../src/models/user'
import Image from '../../src/models/image'
import Directory from '../../src/models/directory'

export const mockUser = {
  username: 'watman',
  password: 'watpass',
  email: 'watman@watmon.com',
}

export const mockImage = {
  url: 'http://imagemang.com',
  city: 'Seattle',
  caption: 'Dis is de image',
  location: 'Around the corner and..',
}

export const mockDirectory = {}

export const mockClub = {
  city: 'Seattle',
  caption: 'Catch phrase!',
  location: 'Dis is a place',
  clubPicture: 'http://imagedewd.net',
}

export const cleanDB = () => {
  () => Promise.all([User.remove()]),
  () => Promise.all([Image.remove()]),
  () => Promise.all([Directory.remove()])
}