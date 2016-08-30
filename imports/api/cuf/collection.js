import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Mongo } from 'meteor/mongo'

import { userIdSchema } from './schema.js'
import { Settings } from '../../api'

class CollectionSchema extends Mongo.Collection {
  addSchema(schema) {
    if (!schema || typeof schema !== 'object') return

    // Convert SimpleSchema instance to schema definition object
    if (schema.schema && typeof schema.schema === 'function') schema = schema.schema();

    if (Meteor.isServer) {
      const _schema = Object.keys(schema).reduce((p, c) => {
        // Get field settings
        const __settings = Settings.findOne({ _id: c })
        if (__settings) {
          // Merge settings to schema
          if (__settings.value && __settings.value.label) p[c].label = __settings.value.label;
        } else if (c != 'userId') {
          // Update field settings
          Settings.upsert({ _id: c }, {
            _id: c,
            type: 'cuf',
            value: {
              label: p[c].label,
            },
          });
        }
        return p
      }, schema);
      // Attach schema to collection
      this._addSchema(_schema);
    } else if (Meteor.isClient) {
      // Attach schema to collection
      this._addSchema(schema)
    }
  }
  removeSchema(schemaKeys) {
    // Remove schems settings
    const _schemaKeys = [].concat(schemaKeys);
    if (Meteor.isServer) Settings.remove({ _id: { $in: _schemaKeys } });
    // Modify schema
    this._removeSchema(schemaKeys);
  }
  _addSchema(schema, options = {}) {
    if (!schema || typeof schema !== 'object') return

    const _options = _.extend({
      // Default options
    }, options);

    // Convert SimpleSchema instance to schema definition object
    if (schema.schema && typeof schema.schema === 'function') schema = schema.schema();

    const _schema = Object.keys(schema).reduce((p, c) => {
      // String support for type field
      if (typeof p[c].type === 'string') p[c].type = eval(p[c].type);
      return p
    }, schema);

    // Attach schema to collection
    this.attachSchema(_schema, _options);
  }

  _removeSchema(schemaKeys, options = {}) {
    const _schemaKeys = [].concat(schemaKeys);
    const _options = _.extend({
      // Default options
    }, options, {
      // Mandatory options
      replace: true,
    });

    // Single schema
    if (this._c2._simpleSchema) {
      // Remove schema fields
      const _schema = _schemaKeys.reduce((p, c) => _.omit(p, c), this.simpleSchema()._schema);
      // Attach schema to collection
      this.attachSchema(_schema, _options);
    }

    // Multiple schema (NOT TESTED)
    if (this._c2._simpleSchemas && this._c2._simpleSchemas.length && _options.selector) {
      this._c2._simpleSchemas
        // Filter schemas by selector
        .filter(el => _.isEqual(el.selector, _options.selector))
        .map(elSchema => {
          // Remove schema fields
          const _schema = _schemaKeys.reduce((p, c) => _.omit(p, c), elSchema.schema._schema);
          // Attach schema to collection
          this.attachSchema(_schema, _options);
        });
    }
  }

  replaceSchema(oldSchemaName, newSchemaName, newSchemaValue) {
    this._c2._simpleSchema._schema[newSchemaName] = _.extend(this._c2._simpleSchema._schema[oldSchemaName], newSchemaValue);
    delete this._c2._simpleSchema._schema[oldSchemaName];
  }
}

export const CustomUserFields = new CollectionSchema('custom-user-fields');

CustomUserFields.addSchema(userIdSchema)

CustomUserFields.allow({
  insert: (userId, doc) => userId && doc.userId === userId,
  update: (userId, doc, fields, modifier) => doc.userId === userId,
});

Settings.find({ type: 'cuf' }).observe({
  added: function(document) {
    console.log('added: ', document);
    const _schemaDef = CustomUserFields._c2._simpleSchema._schema[document._id]
    if (_schemaDef) {
      const _newSchema = {}
      _newSchema[document._id] = _.extend(document.value, {
        type: _schemaDef.type.name
      });
      CustomUserFields._addSchema(_newSchema);
    }
  },
  changed: function(newDocument, oldDocument) {
    console.log('changed: ', newDocument);
    const _schemaDef = CustomUserFields._c2._simpleSchema._schema[newDocument._id]
    if (_schemaDef) {
      const _newSchema = {}
      _newSchema[newDocument._id] = _.extend(newDocument.value, {
        type: _schemaDef.type.name
      });
      CustomUserFields._addSchema(_newSchema);
    }
  },
  removed: function(oldDocument) {
    console.log('removed: ', oldDocument);
  },
});
