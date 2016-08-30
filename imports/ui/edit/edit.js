import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import './edit.html'

Template.editCustomUserFields.onCreated(() => {
  const instance = Template.instance()
  instance.currentEditMode = new ReactiveVar(false)
  instance.autorun(() => {
    instance.subscribe('settings')
  });

  instance.saveField = (event) => {
    const rowId = $(event.currentTarget).closest('tr.settings-row').data('id');
    const labelValue = instance.$(`input[data-id="${rowId}"][name="label"]`).val();

    Meteor.call('saveSettings', rowId, {
      _id: rowId,
      type: 'cuf',
      value: {
        label: labelValue,
      }
    });
    instance.currentEditMode.set(false);
  }
  _
});

Template.editCustomUserFields.helpers({
  settings: () => Settings.find(),
  editMode: (_id) => Template.instance().currentEditMode.get() == _id
});

Template.editCustomUserFields.events({
  'click tr.settings-row': (event, instance) => {
    instance.currentEditMode.set($(event.currentTarget).data('id'))
  },
  'keypress input[name="label"]': (event, instance) => {
    switch (event.keyCode) {
      case 13:
        instance.saveField(event);
        break;
      case 27:
        instance.currentEditMode.set(false);
        break;
    }
  },
});
