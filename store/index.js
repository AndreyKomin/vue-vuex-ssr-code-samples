import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import properties from './properties'

Vue.use(Vuex)

const plugins = []

// SSR condition
if (process.browser) {
  const persistedState = createPersistedState()
  plugins.push(persistedState)
}

export default function () {
  return new Vuex.Store({
    modules: {
      properties
    },
    plugins
  })
}
