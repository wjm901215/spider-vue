import AMapLoader from '@amap/amap-jsapi-loader'

const install = (Vue) => {
  AMapLoader.load({
    key: 'b106f8bfcaa862d8341ef91399775dc5',
    // key: '81d89d3d0e36232091e681bd68b58b56',
    version: '1.4.15', // 由于 Loca 限制，最高只能使用 1.4.15 版本
    plugins: ['AMap.MarkerCluster', 'AMap.DistrictSearch', 'AMap.Geocoder', 'AMap.OverView', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.Autocomplete'],
    AMapUI: {
      version: '1.1',
      plugins: ['overlay/SimpleMarker']
    },
    Loca: {
      version: '1.3.2'
    }
  })
    .then((amap) => {
      Vue.prototype.$Amap = amap
      window.Amap = amap
    })
    .catch((err) => {
      throw new Error('加载高德地图失败：' + err)
    })
}

export default {
  install
}
