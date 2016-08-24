import { ReactiveVar } from 'meteor/reactive-var'

import './index.html'
import './index.css'
import '../form/form.js'
import '../edit/edit.js'

Template.body.onCreated(() => {
  Template.instance()._template = new ReactiveVar('customUserFields')
});

Template.body.helpers({
  template: () => Template.instance()._template.get(),
  $eq: (a1, a2) => a1 == a2,
});

Template.body.events({
  'click ul.nav li': (e, _i) => {
    _i._template.set($(e.currentTarget).data('template'))
  },
});
