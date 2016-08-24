import { _ } from 'meteor/underscore'
import { Mongo } from 'meteor/mongo'

import { userIdSchema } from './schema.js'

class CollectionSchema extends Mongo.Collection {
  addSchema(schema, options = {}) {
    if (!schema || typeof schema !== 'object') return

    const _options = _.extend({
      // Default options
    }, options);

    // Convert SimpleSchema instance to schema definition object
    if (schema.schema && typeof schema.schema === 'function') schema = schema.schema();

    // String support for type field
    const _schema = Object.keys(schema).reduce((p, c) => {
      if (typeof p[c].type === 'string') p[c].type = eval(p[c].type);
      return p;
    }, schema);

    // Attach schema to collection
    this.attachSchema(_schema, _options);
  }

  removeSchema(schemaKeys, options = {}) {
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
