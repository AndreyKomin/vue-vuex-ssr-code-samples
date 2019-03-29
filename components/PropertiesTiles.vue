<template>
  <div
    class="columns"
    :class="classList"
  >
    <div v-if="showLoading">
      Loading
    </div>
    <!--<div v-if="showNoResult">-->
      <!--No results-->
    <!--</div>-->
    <div
      v-for="property in items"
      :key="property.id"
      class="column"
      :class="getColumnsClass()"
      @mouseover="isNotMobile ? setPropertyMouseOver(property.id) : null"
      @mouseleave="isNotMobile ? setPropertyMouseOver(0) : null"
    >
      <property-tile
        :id="property.id"
        :marketDays="calculateDaysOnMarket(property.original_entry_timestamp)"
        :isFavorite="isFavorite(property.id)"
        :image="makeImageUrl(property)"
        :status="determinePropertyStatus(property.property_type, property.status)"
        :bds="property.beds_total"
        :ba="property.baths_total"
        :sqft="property.sq_ft_liv_area"
        :price="property.current_price"
        :title="property.title"
        :address="property.address_internet_display"
        :city="property.city"
        :state="property.state"
        :postalCode="property.postal_code"
        :type="property.typeof_property"

        @addToFavorites="addToFavorites"
        @removeFromFavorites="removeFromFavorites"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PropertyTile from '@/components/properties/PropertyTileStyleOne.vue'
import { FAVORITES_ADD, FAVORITES_REMOVE, MOUSE_OVER_SET } from '@/store/properties'
import { getPropertyImage } from '@/services'
import { calculateDaysOnMarket, determinePropertyStatus } from '@/utils'

export default {
  name: 'Properties',
  components: {
    PropertyTile
  },
  data () {
    return {
      noResults: false,
      firstLoad: true,
      hasPropertiesLoaded: false
    }
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
    ]),

    showLoading () {
      return this.items.length === 0 && this.firstLoad
    },

    isNotMobile () {
      const touchDevice = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement)

      return process.browser && !touchDevice
    }

    // showNoResult () {
    //   return this.items.length === 0 && !this.firstLoad
    // }
  },
  watch: {
    items (array) {
      if (array.length > 0 && this.firstLoad) {
        this.firstLoad = false
      }
    }
  },
  methods: {
    calculateDaysOnMarket,
    determinePropertyStatus,

    setPropertyMouseOver (id) {
      this.$store.dispatch(MOUSE_OVER_SET, id)
    },

    makeImageUrl (property) {
      return getPropertyImage(property)
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
