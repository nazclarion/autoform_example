import { Meteor } from 'meteor/meteor'
import { Settings } from '../../api'

Meteor.methods({
  saveSettings: (id, doc) => Settings.upsert({ _id: id }, doc),
  // addSettings: (id, doc) => Settings.upsert({ _id: id }, doc),
});
