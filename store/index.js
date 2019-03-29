import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import properties from './properties'
import { websiteId } from '@/config'

Vue.use(Vuex)

const plugins = []

// SSR condition
if (process.browser) {
  const persistedState = createPersistedState({
    key: 'mls-app',
    paths: ['favorites']
  })
  plugins.push(persistedState)
}

export function createStore () {
  return new Vuex.Store({
    state: {
      website_id: websiteId
    },
    modules: {
      properties
    },
    plugins
  })
}
