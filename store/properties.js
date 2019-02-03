import api from '@/api'
import { websiteId } from '@/config'
import { transformProperty, get3RandomProperties } from '@/services'

const state = {
  properties: [],
  property: {},
  favorites: []
}

const PROPERTIES_LIST = 'PROPERTIES_LIST'
const FETCH_PROPERTY = 'FETCH_PROPERTY'
const FAVORITES_ADD = 'FAVORITES_ADD'
const FAVORITES_REMOVE = 'FAVORITES_REMOVE'

const actions = {
  [PROPERTIES_LIST]: async ({ commit }) => {
    const resp = await api.properties.list({ websiteId })

    commit(PROPERTIES_LIST, await resp.data)
    return resp
  },

  [FETCH_PROPERTY]: async ({ commit }, id) => {
    const resp = await api.properties.get({ websiteId, id })

    commit(FETCH_PROPERTY, await resp.data)
    return resp
  },

  [FAVORITES_ADD]: ({ commit }, id) => {
    commit(FAVORITES_ADD, id)
  },

  [FAVORITES_REMOVE]: ({ commit }, id) => {
    commit(FAVORITES_REMOVE, id)
  }
}

const mutations = {
  [PROPERTIES_LIST]: (state, properties) => {
    state.properties = properties
  },

  [FETCH_PROPERTY]: (state, property) => {
    state.property = transformProperty(property)
  },

  [FAVORITES_ADD]: (state, id) => {
    state.favorites.push(id)
  },

  [FAVORITES_REMOVE]: (state, id) => {
    state.favorites.splice(state.favorites.indexOf(id), 1)
  }
}

const getters = {
  getActiveProperties: state => {
    const { properties } = state

    const arr = []

    // TODO: Remove the following logic when the logic will be implemented on the backend side
    Object.keys(properties).forEach(key => {
      if (properties[key].status === 'Active') { arr.push(properties[key]) }
    })

    return arr
  },
  getProperties: state => state.properties,
  get3RandomProperties: state => get3RandomProperties(state.properties),
  getProperty: state => state.property,
  getFavorites: state => state.favorites
}

export {
  PROPERTIES_LIST,
  FETCH_PROPERTY,
  FAVORITES_ADD,
  FAVORITES_REMOVE
}

export default {
  state,
  getters,
  actions,
  mutations
}
