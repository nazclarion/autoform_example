import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const userIdSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      omit: true
    }
  }
});
