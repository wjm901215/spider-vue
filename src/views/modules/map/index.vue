<template>
  <el-container>
    <el-main>
      <div ref="mapContainer" class="map-box"></div>
    </el-main>
  </el-container>
</template>


<script>

import {MAP_KEY, LNG, LAT} from '@/config/mapConfig'
import 'leaflet.chinatmsproviders'

export default {
  data() {
    return {
      mapKey: MAP_KEY, //你的key
      mapType: 'GaoDe.Normal.Map', // 高德地图展示形式
      map: null
    }
  },
  mounted() {
    this.getMap();
  },
  methods: {
    getMap() {
      let map = L.map(this.$refs.mapContainer, {
        center: [LAT, LNG],
        zoom: 12
      })
      //add GaoDe Normal Map Layer to map.详细请看https://github.com/htoooth/Leaflet.ChineseTmsProviders
      L.tileLayer.chinaProvider(
          this.mapType,
          {
            key:MAP_KEY,
            maxZoom:18,
            minZoom:5,
          }
      ).addTo(map);
      this.map = map;
    }
  }
}
</script>


<style scoped>
.map-box {
  height: 100vh !important;
  width: 100%;
}
</style>
