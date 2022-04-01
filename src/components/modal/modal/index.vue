<template>
  <div>
    <div class="cover_layer" v-if="value" @click='modalHandle'>
    </div>
    <transition name="modal">
      <div v-show="value" class="modal_warp">
        <div style="height:90%;overflow:auto">
          <slot></slot>
        </div>
        <div class="modal_footer" style="height:10%">
          <slot name="footer">
            <el-button type="info" @click="modalHandle">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="$emit('submitMethod')">{{ $t('common.complete') }}</el-button>
          </slot>
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
        required: true,
      },
      width: {
        type: String,
        required: false,
      }
    },
    activated(){
      if (this.width) {
        document.body.style.setProperty('--modal_width', this.width)
      }
    },
    data() {
      return {
      }
    },
    methods: {
      modalHandle() {
        this.$emit('input', false)
        this.$emit('submitMethod')
        this.cover_layer_show = false
      },
    },
  }
</script>
<style scoped>
  :root {
    --modal_width: 300px;
  }

  .modal_footer {
   /* | position: absolute;
    bottom: 20px;
    right: 30px; */
  }

  .cover_layer {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.2);
    z-index: 170;
  }

  .modal_warp {
    width: var(--modal_width);
    height: 100%;
    z-index: 1000;
    background: #fff;
    position: absolute;
    top: 0px;
    right: 0px;box-shadow: -5px 5px 5px rgba(0,0,0,.1);
  }

  .modal-enter-active {
    animation-name: modal-in;
    animation-duration: .5s;
  }

  @keyframes modal-in {
    0% {
      transform: translateX(var(--modal_width));
    }
    100% {
      transform: translateX(0);
    }
  }

  .modal-leave-active {
    animation-name: modal-leave;
    animation-duration: .5s;
  }

  @keyframes modal-leave {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(var(--modal_width));
    }
  }
</style>
