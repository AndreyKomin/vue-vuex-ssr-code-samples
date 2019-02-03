<template>
  <div
    class="columns"
    :class="classList"
  >
    <div
      v-for="property in items"
      :key="property.id"
      class="column"
      :class="getColumnsClass()"
    >
      <property-tile
        :id="property.id"
        :marketDays="calculateDaysOnMarket(property.original_entry_timestamp)"
        :isFavorite="isFavorite(property.id)"
        :image="makeImageUrl(property.resources[0].uuid, property.resources[0].type)"
        :status="determinePropertyStatus(property.property_type)"
        :bds="property.beds_total"
        :ba="property.baths_total"
        :sqft="property.sq_ft_liv_area"
        :price="property.current_price"
        :title="property.title"
        :address="property.address_internet_display"
        :city="property.city"
        :postalCode="property.postal_code"

        @addToFavorites="addToFavorites"
        @removeFromFavorites="removeFromFavorites"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PropertyTile from '@/components/properties/PropertyTileStyleOne.vue'
import { PROPERTIES_LIST, FAVORITES_ADD, FAVORITES_REMOVE } from '@/store/properties'

import { calculateDaysOnMarket, determinePropertyStatus } from '@/utils'

const apiUrl = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'Properties',
  components: {
    PropertyTile
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Number,
      default: 3
    },
    classList: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      'getFavorites'
    ])
  },
  created () {
    this.$store.dispatch(PROPERTIES_LIST)
  },
  methods: {
    calculateDaysOnMarket,
    determinePropertyStatus,

    makeImageUrl (uuid, type) {
      return `${apiUrl}/static/resources/${uuid}.${type}`
    },

    addToFavorites (id) {
      this.$store.dispatch(FAVORITES_ADD, id)
    },

    removeFromFavorites (id) {
      this.$store.dispatch(FAVORITES_REMOVE, id)
    },

    isFavorite (id) {
      return this.getFavorites.indexOf(id) >= 0
    },

    getColumnsClass () {
      if (this.columns === 2) {
        return ' is-6'
      }
      return ' is-4'
    }
  }
}
</script>
