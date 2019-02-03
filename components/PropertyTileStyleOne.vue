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
      <figure class="image is-bg-primary-invert">
        <img class="object-fit" :src="image" />
      </figure>
      <div class="prop-description">
        <p class="prop-timestamp">{{ marketDays }}</p>
        <div class="bottom-description">
            <p class="prop-title"><svg class="icon-map-point__sale" ><use xlink:href="#icon-map-point__sale"/></svg>house {{ status }}</p>
            <p class="prop-stats">
                <span>{{ bds }} bds</span><span
                    class="middle-dot"
                    aria-hidden="true">&nbsp;</span>
                <span>{{ ba }} ba</span><span
                    class="middle-dot"
                    aria-hidden="true">&nbsp;</span>
                <span>{{ sqft }} sqft</span>
            </p>
            <p class="prop-price">{{ price | currency }}</p>
            <p class="prop-address">{{ address }}, {{ city }}, FL {{ postalCode }}</p>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script>
// import objectFitImages from 'object-fit-images'
export default {
  name: 'PropertyTile',
  props: {
    id: {
      type: Number,
      default: 0
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

  img
    height: 100%
</style>
