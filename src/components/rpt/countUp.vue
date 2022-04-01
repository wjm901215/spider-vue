<template>
  <div>
    <p :class="className" :style="{textAlign: align, color: color, fontSize: countSize, fontWeight: countWeight}">
      <span v-cloak :id="idName">{{ startVal }}</span><span>{{ unit }}</span></p>
    <slot name="intro"></slot>
  </div>
</template>

<script>
  import CountUp from 'countup';

  export default {
    data() {
      return {
        demo: {}
      };
    },
    name: 'countUp',
    props: {
      idName: String,
      className: String,
      startVal: {
        type: Number,
        default: 0
      },
      endVal: {
        type: Number,
        required: true
      },
      decimals: {
        type: Number,
        default: 0
      },
      duration: {
        type: Number,
        default: 2
      },
      delay: {
        type: Number,
        default: 500
      },
      options: {
        type: Object,
        default: () => {
          return {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.'
          };
        }
      },
      color: String,
      countSize: {
        type: String,
        default: '30px'
      },
      align: {
        type: String,
        default: 'center'
      },
      countWeight: {
        type: Number,
        default: 700
      },
      unit: {
        type: String,
        default: '元'

      },
      introText: [String, Number]
    },
    methods: {
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          let endVal =this.endVal;
          this.unit =this.unit;
          let demo = {};
          this.demo = demo = new CountUp(this.idName, this.startVal, endVal, this.decimals, this.duration, this.options);
          if (!demo.error) {
            demo.start();
          }
        }, this.delay);
      });
    },
    watch: {
      endVal(val) {
        let endVal = val;
        this.unit = this.unit;
        this.demo.update(endVal);
      }
    }
  };
</script>
