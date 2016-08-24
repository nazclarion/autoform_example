import { ReactiveVar } from 'meteor/reactive-var'

import './index.html'
import '../form/form.js'

Template.body.onCreated(() => {
  Template.instance()._template = new ReactiveVar('customUserFields')
});

Template.body.helpers({
  template: () => Template.instance()._template.get(),
});

Template.body.events({
  'click ul.nav li a': (e, _i) => _i._template.set($(e.currentTarget).data('template')),
});
