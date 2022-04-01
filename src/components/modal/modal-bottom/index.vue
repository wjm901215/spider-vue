<template>
  <div>
    <div class="map_cover_layer" v-if="value" @click="modalHandle"></div>
    <transition name="map-modal">
      <div v-show="value" class="map_modal_warp" :class="modalTransform" ref="modalTransform">
        <div style="height:100%;overflow:auto">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true
      },
      height: {
        type: String,
        required: false
      }
    },
    created() {
      if (this.height) {
        document.body.style.setProperty("--modal_height", this.height);
      }
    },
    data() {
      return {
        modalTransform: {
          transform: ""
        }
      };
    },
    watch: {
      height(val) {
        document.body.style.setProperty("--modal_height", val);
      },
    },
    methods: {
      modalHandle() {
        this.$emit("input", false);
        this.$emit("submitMethod");
        this.cover_layer_show = false;
      },
      coslpan(height_var) {
        this.height = height_var;
      }
    }
  };

</script>
<style>
  :root {
    --modal_height: 300px;
  }

  .map_cover_layer {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.2);
    z-index: 100;
  }

  .map_modal_warp {
    width: 100%;
    height: var(--modal_height);
    z-index: 160;
    background: #fff;
    position: absolute;
    bottom: 0px;
    right: 0px;
    box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.1);
    transition: .5s;
  }

  .map-modal-enter-active {
    animation-name: map-modal-in;
    animation-duration: 0.5s;
  }

  @keyframes map-modal-in {
    0% {
      transform: translateY(var(--modal_height));
    }

    100% {
      transform: translateY(0);
    }
  }

  .map-modal-leave-active {
    animation-name: map-modal-leave;
    animation-duration: 0.5s;
  }

  @keyframes map-modal-leave {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(var(--modal_height));
    }
  }

</style>
