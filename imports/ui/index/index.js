import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import '../form/form.js'
import '../edit/edit.js'
import './index.html'

Template.body.onCreated(() => {
  const _i = Template.instance()
  _i._template = new ReactiveVar('editCustomUserFields')
  _i.autorun(() => {
    _i.subscribe('settings')
  });
});

Template.body.helpers({
  template: () => Template.instance()._template.get(),
  $eq: (a1, a2) => a1 == a2,
});

Template.body.events({
  'click ul.nav li': (e, _i) => _i._template.set($(e.currentTarget).data('template')),
  'click ul.nav li a': e => e.preventDefault(),
});
