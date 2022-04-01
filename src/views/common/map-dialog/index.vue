<template>
  <el-dialog :title="$t('common.getMapTitle')" :visible.sync="dialogVisible" :modal="false" id="map_dialog">
    <el-row>
      <div class="amap-page-container" ref="searchBox1">
        <div ref="searchmap" class="map-box"></div>
        <input ref="searchInput" class="search-input">
      </div>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <span style="float:left">{{ lng }},{{ lat }} &nbsp; {{ address }}</span>
      <el-button type="info" @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('common.ok') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isLongitude, isLatitude } from '@/utils/validate'
import {LNG, LAT} from '@/config/mapConfig'
export default {
  data() {
    return {
      address: '',
      lng: 0,
      lat: 0,
      center: [LNG, LAT],
      marker: null,
      searchOption: {
        city: '杭州',
        citylimit: false
      },
      map: null,
      placeSearch: null,
      dialogVisible: false
    }
  },
  methods: {
    open(lng, lat) {
      this.dialogVisible = true
      this.$nextTick(() => {
        if (isLongitude(lng) && isLatitude(lat)) {
          this.center = [lng, lat]
        }
        this.map = new AMap.Map(this.$refs.searchmap, {
          center: this.center,
          zoom: 10
        })
        var auto = new AMap.Autocomplete({
          input: this.$refs.searchInput
        })
        this.placeSearch = new AMap.PlaceSearch({
            map: this.map
        })
        auto.on('select', this.selectHandle)
        if (isLongitude(lng) && isLatitude(lat)) {
          this.lng = lng
          this.lat = lat
          this.addMarker(lng, lat)
          this.getGeocoder(lng, lat)
        }
        this.map.on('click', this.clickMap);
      })
    },
    clickMap(e) {
      let { lng, lat } = e.lnglat
      this.lng = lng
      this.lat = lat
      this.getGeocoder(lng, lat)
      this.addMarker(lng, lat)
    },
    getGeocoder(lng, lat) {
      var _that = this
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
      geocoder.getAddress([lng, lat], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            _that.address = result.regeocode.formattedAddress
            _that.$nextTick()
          }
        }
      })
    },
    selectHandle(e) {
      this.placeSearch.setCity(e.poi.adcode)
      this.placeSearch.search(e.poi.name)
    },
    addMarker(lng, lat) {
      if (this.marker) this.map.remove(this.marker)
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat)
      })
      this.map.add(this.marker)
    },
    submit() {
      this.$emit('change', [this.lng, this.lat], this.address)
      this.dialogVisible = false
    }
  }
}
</script>

<style>
.amap-page-container {
  position: relative;
  width: 100%;
  height: 430px;
  border: 1px solid #f8f6f4;
}

.search-box {
  margin-top: 0px;
  position: absolute;
  top: 65px;
  left: 20px;
}
.map-box {
  width: 100%;
  height: 100%;
}
.search-input {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  display: block;
  width: 94%;
  line-height: 45px;
  height: 45px;
  padding: 0 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  outline: none;
}

#map_dialog .el-dialog__body {
  padding-top: 0;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

#map_dialog .el-dialog__footer {
  box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.05);
  padding-top: 15px;
}
</style>
