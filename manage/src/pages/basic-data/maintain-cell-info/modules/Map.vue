<template>
  <a-modal 
    title="查看位置"
    :width="900"
    :visible="visible"
    :centered="true"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <div class="amap-page-container flex-around">
      <div class="box">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"/>
        <el-amap 
          class="amap-box" 
          ref="map" 
          :vid="'amap-vue'" 
          :events="amap.events" 
          :center="amap.center"
          :zoom="amap.zoom"
          :plugin="amap.plugin">
          <el-amap-marker :position="amap.position" :events="amap.events" />
          <el-amap-text :text="amap.orgAddr" :position="amap.position" :offset="[0, 20]"/>
        </el-amap>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    const vm = this
    return {
      visible: false,
      // form对象
      dataForm: {
        lat: '',
        lon: '',
        orgAddr: '',
        province: '',
        city: '',
        district: '',
      },
      // 地图搜索对象
      searchOption: {
        city: '',
        citylimit: true,
      },
      lat: 0,
      lng: 0,
      amap: {
        zoom: 16,
        center: [120.591337, 31.292691],
        position: [120.591337, 31.292691],
        orgAddr:'',
        events: {
          // 点击获取地址的数据
          click(e) {
            const { lng, lat } = e.lnglat
            vm.dataForm.lon = lng
            vm.dataForm.lat = lat
            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 100,
              extensions: 'all',
            })
            geocoder.getAddress([lng, lat], function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  console.log('点击获取地址的数据', result)
                  vm.dataForm.orgAddr = result.regeocode.formattedAddress
                  vm.dataForm.province = result.regeocode.addressComponent.province
                  vm.dataForm.city = result.regeocode.addressComponent.city
                  vm.dataForm.district = result.regeocode.addressComponent.district
                  vm.dataForm.lat = lat ? lat.toString() : ''
                  vm.dataForm.lon = lng ? lng.toString() : ''
                  vm.amap.markers = []
                  const obj = {
                    position: [lng, lat],
                    text: result.regeocode.formattedAddress,
                    offset: [0, 30],
                  }
                  vm.amap.markers.push(obj)
                  vm.sure()
                }
              }
            })
            vm.$nextTick()
          },
        },
      },
      plugin: [
        {
          // 定位
          pName: 'Geolocation',
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log('定位：', result)
                if (result && result.position) {
                  // 设置经度
                  vm.lng = result.position.lng
                  // 设置维度
                  vm.lat = result.position.lat
                  // 设置坐标
                  vm.amap.center = [vm.lng, vm.lat]
                  const op = {
                    position: [vm.lng, vm.lat],
                    text: result.formattedAddress,
                    offset: [0, 30],
                  }
                  vm.amap.markers.push(op)
                  // 页面渲染好后
                  vm.$nextTick()
                }
              })
            },
          },
        },
        {
          // 
          pName:'Autocomplete',
          events: {
            init(o) {
              console.log(o,111111)
            }
          }
        }
      ],
      markers: [], // 多标注地址
    }
  },
  methods: {
    show(locationInfo, city, orgAddr) {
      const vm = this
      vm.amap.position = vm.amap.center =  locationInfo && locationInfo.length && locationInfo[0] ? locationInfo : [120.591337, 31.292691]
      vm.searchOption.city = city
      vm.amap.orgAddr = orgAddr
      vm.visible = true
    },
    onSearchResult(pois) {
      const vm = this
      vm.amap.markers = []
      let latSum = 0
      let lngSum = 0
      console.log('地图回调', pois)
      if (pois.length > 0) {
        pois.forEach((poi, index) => {
          const { lng, lat } = poi
          if (index === 0) {
            lngSum = lng
            latSum = lat
            const obj = {
              position: [poi.lng, poi.lat],
              text: poi.name,
              offset: [0, 30],
            }
            vm.amap.markers.push(obj)
            console.log('地图搜索回调', poi)
            vm.dataForm.orgAddr = poi.name
            vm.dataForm.lat = poi.lat ? poi.lat.toString() : ''
            vm.dataForm.lon = poi.lng ? poi.lng.toString() : ''
          }
        })
        vm.amap.center = vm.amap.position = [lngSum, latSum]
      }
    },
    // 提交方法
    sure() {
      const vm = this
      vm.amap.position = [vm.dataForm.lon ,vm.dataForm.lat]
      vm.amap.orgAddr = vm.dataForm.orgAddr
    },
    handleSubmit() {
      const vm = this
      console.log(vm.dataForm)
      this.$emit('updateLocation', vm.dataForm)
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
      this.searchOption.city = ''
    },
  }
}
</script>

<style scoped lang="scss">
.amap-page-container {
  width: 100%;
  min-width: 800px;
  height: 600px;
  .box {
    height: 550px;
  }
  .amap-box {
    margin-top: 10px;
  }

  .search-box {
    ::v-deep .search-btn {
      width: 60px;
      background: linear-gradient(28deg, #E33B3A 0%, #E6403F 27%, #ED5554 61%, #F16261 100%);
      border-radius: 5px;
      color: #EFEFEF;
      height: 36px;
    }
  }
}

.el-vue-search-box-container {
  width: 100%;
  height: 40px;
  border: 1px solid #EFEFEF;
  border-radius: 5px;
}
::v-deep .amap-overlay-text-container {
  opacity: 0.7;
  color: #eee;
  background-color: #000;
  border-radius: 5px;
}
</style>
