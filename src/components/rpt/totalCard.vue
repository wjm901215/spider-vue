<style lang="less">
  @import './styles/total-card.less';
</style>

<template>
  <el-card :padding="0" :body-style="{ padding: '5px',height: 'auto' }" shadow="hover">
    <div class="total-card-con">
      <el-row>
        <el-col :span="5">
          <div class="circle" :style="{backgroundColor: color, color: 'white'}">
            <div style="padding: 10px">
              <icon-svg :name="iconType" :style="{'font-size':iconSize}"></icon-svg>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <span><span class="info-intro-text">{{introText}}</span></span>
        </el-col>
        <el-col :span="7" style="text-align:right;line-height:40px;">
          <span><span class="info-increase-text">增长比</span></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="5">
          <count-up
            class="info-card-count"
            :id-name="idName"
            :end-val="endVal"
            :color="color"
            :align="align"
            :countSize="countSize"
            :countWeight="countWeight"
            :unit="unit">
          </count-up>
        </el-col>
        <el-col :span="7" style="text-align:right;line-height:48px;font-size:18px;">
          <i class="el-icon-caret-top" style="color: red"></i>
          <span class="info-rate-text">{{weekRate}}%</span>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
  import countUp from './countUp.vue';

  export default {
    name: 'totalCard',
    components: {
      countUp
    },
    props: {
      idName: String,
      endVal: Number,
      color: String,
      iconType: String,
      introText: String,
      avgVal: String,
      weekRate: Number,
      dayRate: Number,
      avgIntroText: String,
      countSize: {
        type: String,
        default: '30px'
      },
      countWeight: {
        type: Number,
        default: 700
      },
      align: {
        type: String,
        default: 'left'
      },
      iconSize: {
        type: Number,
        default: 40
      },
      unit: {
        type: String
      },
    }
  };
</script>

