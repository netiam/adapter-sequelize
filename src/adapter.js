import Promise from 'bluebird'
import Sequelize from 'sequelize'

export const ID_SEPARATOR = '--'

export default function({models}) {
  const registry = {}
  _.forEach(models, model => registry[getType(model)] = model)

  function getIdNames(type) {
    return _.keys(model.primaryKeys)
  }

  function getId(resource) {
    return resource.id.split(ID_SEPARATOR)
  }

  function getIdQuery(type, resource) {
    const keys = getIdNames(type)
    const values = getId(resource)
    return _.zipObject(keys, values)
  }

  function getType(model) {
    return _.kebabCase(model.name)
  }

  function getModel(type) {
    return _.get(registry, type, undefined)
  }

  function create({type, data}) {
    const model = getModel(type)

    if (_.isObject(data) && !_.isArray(data)) {
      data = [data]
    }

    const attributes = _.map(data, document => document.attributes)

    return model.sequelize.transaction(() => {
      return model
        .bulkCreate(attributes)
        .then(documents => {
          return Promise
            .all(
              _.map(documents, (document, index) => {
                const post = data[index]
                if (!_.has(post, 'relationships')) {
                  return Promise.resolve()
                }

                return Promise.all(
                  _.map(post.relationships, (relationship, path) => {
                    return adapter.setRelationship({
                      model,
                      document,
                      path,
                      resourceIdentifiers: relationship.data
                    })
                  })
                )
              })
            )
            // TODO do we really need to fetch all created instances again (missing relationships)?
            .then(() => {
              return model.findAll({
                where: {id: {$in: _.map(documents, document => document.id)}},
                include: [{all: true}]
              })
            })
            .then(documents => {
              documents = _.map(documents, document => document.toJSON())

              if (documents.length === 1) {
                documents = documents.shift()
              }

              res.status(201)
              res.body = convert({
                documents,
                model
              })
            })
        })
    })
  }

  function find({type, id, opts}) {
    const model = getModel(type)
    // TODO Build query form id + options
    const query = {}
    return model
      .findAll(query)
      .then(documents => {
        if (documents.length === 0) {
          return []
        }

        if (!id && documents.length !== 1) {
          throw new Error('A sinle resource should be fetched, but there are zero or more than one documents fetched.')
        }

        if (!id) {
          return documents[0].toJSON()
        }

        return _.map(documents, document => document.toJSON())
      })
  }

  function update(type, id, data) {

  }

  function remove(type, id) {

  }

  function setAttributes(type, resource, attributes) {
    const keys = getAttributeKeys(type, resource)
    resource.attributes = _.pick(attributes, keys)
    return resource
  }

  function getAttributes(type, resource) {
    const keys = getAttributeKeys(type, resource)
    return _.pick(resource.attributes, keys)
  }

  function getAttributeKeys(type, resource) {
    const model = getModel(type)
    const keys = _.keys(model.attributes)
    return _.pick(resource, keys)
  }

  function setRelationship(type, resource, relationship, resourceIdentifiers) {
    if (!hasRelationship(type, relationship)) {
      return Promise.reject(
        new Error(`The given type do not have a relationship "${relationship}"`))
    }

    const model = getModel(type)
    const relationshipResourceType = getRelationshipType(type, relationship)
    const relationshipModel = getModel(relationshipResourceType)
    const relationshipIds = _.map(resourceIdentifiers, resourceIdentifier => resourceIdentifier.id)
    const relationshipType = model.associations[relationship].associationType

    return model
      .findOne({where: getIdQuery(type, resource)})
      .then(document => {
        return relationshipModel
        // TODO Support composite primary keys WHERE (a, b, c, …n) IN ( (1, 2, 3, …), (4, 5, 6, …) )
          .findAll({where: {id: {$in: relationshipIds}}})
          .then(relatedDocuments => {
            switch (relationshipType) {
              case 'HasOne':
              case 'BelongsTo':
                return document[`set${_.capitalize(relationship)}`](relatedDocuments.shift())
              case 'HasMany':
              case 'BelongsToMany':
                return document[`set${_.capitalize(relationship)}`](relatedDocuments)
              default:
                throw new Error(`Invalid relationship type: "${relationshipType}"`)
            }
          })
      })
  }

  function setRelationships(type, resource, relationships) {
    return Promise.all(
      _.map(relationships, (resourceIdentifiers, relationship) => {
        return setRelationship(type, resource, relationship, resourceIdentifiers)
      })
    )
  }

  function getRelationship(type, resource, relationship) {
    return hasRelationship(type, relationship)
      ? _.get(resource, `relationships.${relationship}`)
      : undefined
  }

  function getRelationshipKeys(type, resource) {
    const model = getModel(type)
    const keys = _.keys(model.associations)
    return _.pick(resource.relationships, keys)
  }

  function hasRelationship(type, relationship) {
    const model = getModel(type)
    return _.has(model, `associations.${relationship}`)
  }

  function getRelationshipType(type, relationship) {
    const model = getModel(type)
    return getType(model.associations[relationship].target)
  }

  return Object.freeze({
    getId,
    getType,
    getModel,
    find,
    update,
    remove,
    setAttributes,
    getAttributes,
    setRelationship,
    setRelationships,
    getRelationship
  })
}
