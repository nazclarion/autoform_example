import { Mongo } from 'meteor/mongo'

export const Settings = new Mongo.Collection('settings');

Settings.deny({
  insert: function (userId, doc) {
    return true
  },
  update: function (userId, doc, fields, modifier) {
    return true
  },
  remove: function (userId, doc) {
    return true
  },
});
