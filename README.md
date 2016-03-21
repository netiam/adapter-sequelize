# netiam-adapter-sequelize

[![Build Status](https://travis-ci.org/netiam/adapter-sequelize.svg)](https://travis-ci.org/netiam/adapter-sequelize)
[![Dependencies](https://david-dm.org/netiam/adapter-sequelize.svg)](https://david-dm.org/netiam/adapter-sequelize)
[![npm version](https://badge.fury.io/js/netiam-adapter-sequelize.svg)](http://badge.fury.io/js/netiam-adapter-sequelize)

> A *sequelize* persistence adapter

## Get it

```
npm i -S netiam netiam-adapter-sequelize
```

## Anatomy of a persistence adapter

Every adapter has to export a public interface with the following requirements.

```js
/**
 * Get ID names for type
 * @param {string} type - The type of resource
 * @returns {string|string[]} An ID field or list of ID fields
 */
getIdNames(type) {
}

/**
 * Get ID for type
 * @param {string} type - The type of resource
 * @returns {string|number|string[]|number[]} ID value or a list of ID value(s)
 */
getId(type) {
}

/**
 * Get type by model
 * @param {*} model - The model you want a type of
 * @returns {string} The model as string representation aka type
 */
getType(model) {
}

/**
 * Find one or more resources
 * @param {string} type - The type of resource you are looking for
 * @param {string|number|string[]|number[]} [id] - A single or list of resource IDs to find
 * @param {object} [opts] - Optional configuration of the query
 * @param {number} [opts.page] - Pagination
 * @param {number} [opts.page.size] - Size of resultset
 * @param {number} [opts.page.limit] - Limt size of resultset
 * @param {number} [opts.page.offset] - Offset resultset
 * @param {number} [opts.page.before] - Curser based pagination
 * @param {number} [opts.page.after] - Curser based pagination
 * @param {string} [opts.filter] - Filter
 * @param {string} [opts.sort] - Sort
 * @param {string} [opts.fields] - Sparse fieldsets
 * @param {string} [opts.include] - Compound documents
 * @returns {Promise} The result or a resultset
 */
find(type, id, opts) {
}

/**
 * Update a resource
 * @param {string} type - The type of resource you want to update
 * @param {string|number} id - The ID of a resource you wanna update
 * @param {object} [opts] - Optional configuration of the query
 * @returns {Promise} The modified resource
 */
update(type, id, opts) {
}

/**
 * Delete a resource
 * @param {string} type - The type of resource you want to delete
 * @param {string|number} id - The ID of a resource you wanna delete
 * @returns {Promise}
 */
delete(type, id) {
}

/**
 * Set attributes for a resource
 * @param {string} type - The type of resource you want to set attributes for
 * @param {obuect} resource - The resource you want to set attributes for
 * @param {object} attributes - A object literal with attribute names as keys
 * @returns {Promise} The modified resource
 */
setAttributes(type, resource, attributes) {
}

/**
 * Get only the attributes for a specific resource
 * @param {string} type - The type of resource you want to get attributes from
 * @param {object} resource - The resource you want to get attributes from
 * @returns {object} The attributes for the given resource
 */
getAttributes(type, resource) {
}

/**
 * Get all attribute keys as list of path names
 * @param {string} type - The type of resource you want to get attributes from
 * @param {object} resource - The resource you want to get attributes from
 * @returns {string[]} A list of attribute names
 */
getAttributeKeys(type, resource) {
}

/**
 * Set a relationship for a resource
 * @param {string} type - The type of resource you want to set a relationship for
 * @param {object} resource - The resource you want to set a relationship for
 * @param {string} relationship - The relationship/association name
 * @param {object|object[]} resourceIdentifiers - A single resource identifier or a list of identifiers
 * @see {@link http://jsonapi.org/format/#document-resource-identifier-objects|JSON API}
 * @returns {Promise} The relationship
 */
setRelationship(type, resource, relationship, resourceIdentifiers) {
}

/**
 * Set relationships for a resource
 * @param {string} type - The type of resource you want to set a relationship for
 * @param {object} resource - The resource you want to set a relationship for
 * @param {object.<string, object>|object.<string, object[]>} relationships - The relationships to set
 * @returns {Promise} The relationship
 */
setRelationships(type, resource, relationships) {
}

/**
 * Get a relationship from resource
 * @param {string} type - The type of resource you want to get a relationship from
 * @param {object} resource - The resource you want to get a relationship from
 * @param {string} relationship - The relationship/association name
 * @returns {Promise} The relationship
 */
getRelationship(type, resource, relationship) {
}

/**
 * Get all relationships as list of path names
 * @param {string} type - The type of resource you want to get relationships from
 * @param {object} resource - The resource you want to get relationships from
 * @returns {string[]} A list of relaionship names
 */
getRelationshipKeys(type, resource) {
}

/**
 * Check if a specific type has a relationship defined
 * @param {string} type - The type of resource
 * @param {string} relationship - The name of the relationship you want to check
 * @returns {boolean} True if relationship is defined, otherwise false
 */
hasRelationship(type, relationship) {
}

/**
 * Get the type of a relationship
 * @param {string} type - The type of resource
 * @param {string} relationship - The name of the relationship you want to get a type for
 * @returns {string} The resource type for the relationship
 */
getRelationshipType(type, relationship) {
}
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
