import { CustomUserFields } from './collection.js'

Meteor.publish('custom-user-fields', function() {
  if (!this.userId) return
  return CustomUserFields.find({ userId: this.userId });
});
