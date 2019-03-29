<template>
  <article class="property-tile is-child is-bg-cream property-tile-style-one">
    <div class="favorite-icon-container">
      <button @click="toggleFavorites">
        <svg :class="`icon__favorite-${isFavorite ? '' : 'un'}selected`" >
            <use v-bind="{'xlink:href':'#icon__favorite-' + (isFavorite ? '' : 'un') + 'selected'}"></use>
        </svg>
      </button>
    </div>
    <router-link :to="{ path: `/property/${title}`}">
      <figure class="image">
        <img :class="`object-fit ${$style.featuredImage}`" :src="image" @load="event => imageLoaded(event)" />
      </figure>
      <div class="prop-description">
        <p class="prop-timestamp" v-if="status !== 'sold'">{{ marketDays }}</p>
        <div class="bottom-description">
            <p class="prop-title">
              <svg :class="`icon-map-point__${status}`" >
                <use v-bind="{'xlink:href':'#icon-map-point__' + status}"></use>
              </svg>
              {{ type }}
              {{ propertyStatusMessage(status) }}
            </p>
            <p class="prop-stats">
                <span>{{ bds }} bds</span><span
                    class="middle-dot"
                    aria-hidden="true">&nbsp;</span>
                <span>{{ ba }} ba</span><span
                    class="middle-dot"
                    aria-hidden="true">&nbsp;</span>
                <span>{{ sqft }} sqft</span>
            </p>
            <p class="prop-price">{{ price | currency }}{{ propertyStatusPostfix(status) }}</p>
            <p class="prop-address">{{ address }}, {{ city }}, {{ state }} {{ postalCode }}</p>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script>
import {
  propertyStatusPostfix,
  propertyStatusMessage
} from '@/utils'

export default {
  name: 'PropertyTile',
  props: {
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    bds: {
      type: Number,
      default: 0
    },
    ba: {
      type: Number,
      default: 0
    },
    sqft: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    postalCode: {
      type: String,
      default: ''
    },
    marketDays: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    propertyStatusPostfix,
    propertyStatusMessage,

    imageLoaded (event) {
      event.currentTarget.classList.add(this.$style.imageLoaded)
    },

    toggleFavorites () {
      if (this.isFavorite) {
        this.$emit('removeFromFavorites', this.id)
      } else {
        this.$emit('addToFavorites', this.id)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .property-tile
    height: 100%

  .image
    height: 100%
    filter: brightness(85%)
    background-color: #e0e0e0

    img
      height: 100%
</style>

<style lang="sass" module>
.featuredImage
  opacity: 0

.imageLoaded
  transition: opacity .5s
  opacity: 1

article.property-tile img
  height: 185px
</style>
