import api from '@/api'
import debounceAsync from 'debounce-async'
import { transformProperty, get3RandomProperties, mergeBackendFilters, bindBackendFiltersValues, applyFrontendFilters } from '@/services'
import { makeFilter } from '@/utils'
import {
  frontendFilters,
  backendFilters,
  FILTER_ACTIVE,
  FILTER_NEWEST,
  FILTER_RENT,
  FILTER_SALE,
  FILTER_SOLD
} from '@/config'

const state = {
  properties: [],
  activeProperties: [],
  property: {},
  favorites: [],
  backendFilters: [
    // Default filter
    makeFilter(FILTER_ACTIVE)
  ],
  frontendFilters: [
    // Default filter
    makeFilter(FILTER_NEWEST)
  ],
  propertyMouseOver: 0,
  propertiesView: 'grid'
}

const ACTIVE_PROPERTIES_LIST = 'ACTIVE_PROPERTIES_LIST'
const PROPERTIES_LIST = 'PROPERTIES_LIST'
const FETCH_PROPERTY = 'FETCH_PROPERTY'
const FAVORITES_ADD = 'FAVORITES_ADD'
const FAVORITES_REMOVE = 'FAVORITES_REMOVE'
const MOUSE_OVER_SET = 'MOUSE_OVER_SET'
const ACTIVATE_BACKEND_FILTER = 'ACTIVATE_BACKEND_FILTER'
const ACTIVATE_FRONTEND_FILTER = 'ACTIVATE_FRONTEND_FILTER'
const UPDATE_BACKEND_FILTER = 'UPDATE_BACKEND_FILTER'
const DEACTIVATE_BACKEND_FILTER = 'DEACTIVATE_BACKEND_FILTER'
const DEACTIVATE_FRONTEND_FILTER = 'DEACTIVATE_FRONTEND_FILTER'
const CHANGE_PROPERTIES_VIEW = 'CHANGE_PROPERTIES_VIEW'
const FLUSH_PROPERTY = 'FLUSH_PROPERTY'

async function propertiesList ({ commit, state }) {
  const resp = await api.properties.list({
    filters: mergeBackendFilters(bindBackendFiltersValues([...state.backendFilters]))
  })

  commit(PROPERTIES_LIST, await resp.data)

  return resp
}

const debouncedProperties = debounceAsync(propertiesList, 200)

const actions = {
  [ACTIVE_PROPERTIES_LIST]: async ({ commit, state }) => {
    const resp = await api.properties.list({
      filters: mergeBackendFilters(bindBackendFiltersValues([
        makeFilter(FILTER_ACTIVE)
      ]))
    })

    commit(ACTIVE_PROPERTIES_LIST, await resp.data)
    return resp
  },

  [PROPERTIES_LIST]: debouncedProperties,

  [FETCH_PROPERTY]: async ({ commit }, title) => {
    const resp = await api.properties.getByTitle(title)

    commit(FETCH_PROPERTY, await resp.data)
    return resp
  },

  [FLUSH_PROPERTY]: async ({ commit }) => commit(FLUSH_PROPERTY),

  [FAVORITES_ADD]: ({ commit }, id) => {
    commit(FAVORITES_ADD, id)
  },

  [FAVORITES_REMOVE]: ({ commit }, id) => {
    commit(FAVORITES_REMOVE, id)
  },

  [ACTIVATE_BACKEND_FILTER]: ({ commit, dispatch }, filter) => {
    commit(ACTIVATE_BACKEND_FILTER, filter)
    dispatch(PROPERTIES_LIST)
  },

  [ACTIVATE_FRONTEND_FILTER]: ({ commit }, filter) => {
    commit(ACTIVATE_FRONTEND_FILTER, filter)
  },

  [UPDATE_BACKEND_FILTER]: ({ commit, dispatch }, filter) => {
    commit(UPDATE_BACKEND_FILTER, filter)
    dispatch(PROPERTIES_LIST)
  },

  [DEACTIVATE_BACKEND_FILTER]: ({ commit, dispatch }, filter) => {
    commit(DEACTIVATE_BACKEND_FILTER, filter)
    dispatch(PROPERTIES_LIST)
  },

  [DEACTIVATE_FRONTEND_FILTER]: ({ commit, dispatch }, filter) => {
    commit(DEACTIVATE_FRONTEND_FILTER, filter)
    dispatch(PROPERTIES_LIST)
  },

  [MOUSE_OVER_SET]: ({ commit }, id) => {
    commit(MOUSE_OVER_SET, id)
  },

  [CHANGE_PROPERTIES_VIEW]: ({ commit }, view) => {
    commit(CHANGE_PROPERTIES_VIEW, view)
  }
}

const mutations = {
  [ACTIVE_PROPERTIES_LIST]: (state, properties) => {
    state.activeProperties = properties
  },

  [PROPERTIES_LIST]: (state, properties) => {
    state.properties = properties
  },

  [FETCH_PROPERTY]: (state, property) => {
    if (property.length > 0) {
      state.property = transformProperty(property[0])
    } else {
      state.property = transformProperty({})
    }
  },

  [FLUSH_PROPERTY]: (state) => {
    state.property = {}
  },

  [FAVORITES_ADD]: (state, id) => {
    state.favorites.push(id)
  },

  [FAVORITES_REMOVE]: (state, id) => {
    state.favorites.splice(state.favorites.indexOf(id), 1)
  },

  [ACTIVATE_BACKEND_FILTER]: (state, filter) => {
    if (backendFilters.indexOf(filter.name) !== -1) {
      state.backendFilters.push(filter)
    }
  },

  [ACTIVATE_FRONTEND_FILTER]: (state, filter) => {
    if (frontendFilters.indexOf(filter.name) !== -1) {
      state.frontendFilters.push(filter)
    }
  },

  [UPDATE_BACKEND_FILTER]: (state, filter) => {
    if (backendFilters.indexOf(filter.name) !== -1) {
      const index = state.backendFilters.findIndex(f => f.name === filter.name)

      if (index === -1) {
        state.backendFilters.push(filter)
      } else {
        state.backendFilters[index].value = filter.value
      }
    }
  },

  [DEACTIVATE_BACKEND_FILTER]: (state, filter) => {
    if (backendFilters.indexOf(filter.name) !== -1) {
      const index = state.backendFilters
        .findIndex(f => f.name === filter.name)
      if (index !== -1) state.backendFilters.splice(index, 1)
    }
  },

  [DEACTIVATE_FRONTEND_FILTER]: (state, filter) => {
    if (frontendFilters.indexOf(filter.name) !== -1) {
      const index = state.frontendFilters
        .findIndex(f => f.name === filter.name)
      if (index !== -1) state.frontendFilters.splice(index, 1)
    }
  },

  [MOUSE_OVER_SET]: (state, id) => {
    if (state.propertyMouseOver !== id) {
      state.propertyMouseOver = id
    }
  },

  [CHANGE_PROPERTIES_VIEW]: (state, view) => { state.propertiesView = view }
}

const getters = {
  getActiveProperties: state => state.activeProperties,
  getProperties: state => applyFrontendFilters({
    properties: [...state.properties],
    filters: state.frontendFilters,
    favorites: state.favorites
  }),
  get3RandomProperties: state => get3RandomProperties(state.activeProperties),
  getProperty: state => state.property,
  getFavorites: state => state.favorites,
  getPropertyMouseOver: state => state.propertyMouseOver,
  getBackendFilters: state => state.backendFilters,
  getFrontendFilters: state => state.frontendFilters,
  getPropertiesView: state => state.propertiesView,

  ifActiveFilter: state => {
    return state.backendFilters.findIndex(f => f.name === FILTER_ACTIVE) !== -1
  },
  ifSaleFilter: state => {
    return state.backendFilters.findIndex(f => f.name === FILTER_SALE) !== -1 &&
      state.backendFilters.findIndex(f => f.name === FILTER_RENT) === -1
  },
  ifRentFilter: state => {
    return state.backendFilters.findIndex(f => f.name === FILTER_RENT) !== -1 &&
      state.backendFilters.findIndex(f => f.name === FILTER_SALE) === -1
  },
  ifSoldFilter: state => {
    return state.backendFilters.findIndex(f => f.name === FILTER_SOLD) !== -1
  },
  ifSaleRentFilter: state => {
    return state.backendFilters.findIndex(f => f.name === FILTER_RENT) !== -1 &&
      state.backendFilters.findIndex(f => f.name === FILTER_SALE) !== -1
  }
}

export {
  ACTIVE_PROPERTIES_LIST,
  PROPERTIES_LIST,
  FETCH_PROPERTY,
  FAVORITES_ADD,
  FAVORITES_REMOVE,
  ACTIVATE_BACKEND_FILTER,
  ACTIVATE_FRONTEND_FILTER,
  UPDATE_BACKEND_FILTER,
  DEACTIVATE_BACKEND_FILTER,
  DEACTIVATE_FRONTEND_FILTER,
  FLUSH_PROPERTY,
  MOUSE_OVER_SET
}

export default {
  state,
  getters,
  actions,
  mutations
}
