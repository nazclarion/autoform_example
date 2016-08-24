import { SimpleSchema } from 'meteor/aldeed:simple-schema'

import { CustomUserFields } from '../api/'

SimpleSchema.messages({
  residentOrOwnerRequired: "Either Owner or Resident should be selected"
});

const strataProfileSchema = new SimpleSchema({
  'strataProfile': {
    type: Object,
  },
  'strataProfile.phMobile': {
    type: String,
    label: 'Mobile phone',
    regEx: /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/
  },
  'strataProfile.aptNumber': {
    type: String,
    label: 'Apartment number',
    regEx: /^[a-z0-9]+$/i,
  },
  'strataProfile.isOwner': {
    type: Boolean,
    label: 'Are you an owner?',
    optional: true,
    defaultValue: false,
    custom: function() {
      const dependsOn = this.field('strataProfile.isResident');
      const isRequired = !dependsOn.isSet || (dependsOn.value === false);
      if (isRequired) {
        // inserts
        if (!this.operator) {
          if (!this.isSet || this.value === null || this.value == false) return 'residentOrOwnerRequired';
        }
        // updates
        else if (this.isSet) {
          if (this.operator === '$set' && this.value === null || this.value == false) return "residentOrOwnerRequired";
          if (this.operator === '$unset') return 'residentOrOwnerRequired';
          if (this.operator === '$rename') return 'residentOrOwnerRequired';
        }
      }
    },
  },
  'strataProfile.isResident': {
    type: Boolean,
    label: 'Are you a resident?',
    optional: true,
    defaultValue: true,
    custom: function() {
      const dependsOn = this.field('strataProfile.isOwner');
      const isRequired = !dependsOn.isSet || (dependsOn.value === false);
      if (isRequired) {
        // inserts
        if (!this.operator) {
          if (!this.isSet || this.value === null || this.value == false) return 'residentOrOwnerRequired';
        }
        // updates
        else if (this.isSet) {
          if (this.operator === '$set' && this.value === null || this.value == false) return "residentOrOwnerRequired";
          if (this.operator === '$unset') return 'residentOrOwnerRequired';
          if (this.operator === '$rename') return 'residentOrOwnerRequired';
        }
      }
    },
  },
  'strataProfile.agentEmail': {
    type: String,
    label: 'Managing agent email',
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  'language': {
    type: String,
    optional: true,
    label: 'Language',
  },
})

CustomUserFields.addSchema(strataProfileSchema);
