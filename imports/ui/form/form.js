import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Template } from 'meteor/templating'
import { AutoForm } from 'meteor/aldeed:autoform'

import { CustomUserFields } from '../../api'

import './form.html'

Template.customUserFields.onCreated(() => {
  const _i = Template.instance()
  _i.autorun(() => {
    _i.subscribe('custom-user-fields')
  })
  _i.userId = Meteor.userId()

  const _hook = {};
  const _formId = Template.currentData() && Template.currentData().id || 'custom_user_fields_form';
  _hook[_formId] = {
    formToDoc: (doc) => {
      doc.userId = _i.userId;
      return doc;
    },
  }
  AutoForm.hooks(_hook);
});

Template.customUserFields.helpers({
  params: () => {
    // Determine if the document for current user exists
    const _exists = CustomUserFields.findOne({ userId: Meteor.userId() });

    // Configure quickForm template.
    //   By default automatically determine the form type, doc, submit button text.
    //   Those might be overridden by providing template parameters.
    return _.extend({
      id: 'custom_user_fields_form',
      type: _exists ? 'update' : 'insert',
      doc: _exists || '',
      collection: CustomUserFields,
      buttonContent: _exists ? 'Update' : 'Insert',
      preserveForm: false,
    }, Template.currentData() || {});
  },
});

Template.customUserFields.events({
  'change [name="strataProfile.isOwner"]' (event, instance) {
    const dependsOn = instance.$('[name="strataProfile.isResident"]');
    const thisChecked = $(event.target).prop('checked');
    dependsOn.prop('checked', !(thisChecked && dependsOn.prop('checked')));

    const fieldAgentEmail = instance.$('[name="strataProfile.agentEmail"]');
    if (thisChecked) fieldAgentEmail.val('');
    fieldAgentEmail.closest('.form-group').toggleClass('hidden', thisChecked);
  },
  'change [name="strataProfile.isResident"]' (event, instance) {
    const dependsOn = instance.$('[name="strataProfile.isOwner"]');
    const thisChecked = $(event.target).prop('checked');
    dependsOn.prop('checked', !(thisChecked && dependsOn.prop('checked')));

    const fieldAgentEmail = instance.$('[name="strataProfile.agentEmail"]');
    if (!thisChecked) fieldAgentEmail.val('');
    fieldAgentEmail.closest('.form-group').toggleClass('hidden', !thisChecked);
  },
});
