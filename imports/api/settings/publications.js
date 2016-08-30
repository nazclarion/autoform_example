import { Meteor } from 'meteor/meteor'
import { Settings } from './collection.js'

Meteor.publish('settings', () => Settings.find());
