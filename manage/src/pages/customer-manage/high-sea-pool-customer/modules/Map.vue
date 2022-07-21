<template>
  <a-modal 
    title="查看位置"
    :width="900"
    :visible="visible"
    :centered="true"
    :mask-closable="false"
    @cancel="handleCancel">
    <div class="amap-page-container flex-around">
      <div class="box">
        <el-amap 
          class="amap-box" 
          ref="map" 
          :vid="'amap-vue'" 
          :events="events" 
          :zoom="zoom"
          :plugin="plugin">
          <el-amap-marker :events="markersEvents"></el-amap-marker>
        </el-amap>
      </div>
    </div>
    <template slot="footer">
      <div>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      zoom: 20,
      center: [120.632511, 31.266049],
      position: [120.632511, 31.266049],
      events: {
        init(o) {
        },
        zoomchange: (e) => {
          // console.log(e)
        },
        zoomend: (e) => {
          // console.log(e)
        },
        click: e => {
          console.log(e.lnglat.lat,e.lnglat.lng)
        }
      },
      markersEvents: {
        click: () => {
          // window.open('https://ditu.amap.com/place/B0FFGWMUUB')
        }
      },
      plugin: [
        {
          pName: 'Scale',
          events: {
            init(instance) {
              // console.log(instance,1)
            }
          }
        },
        {
          pName: 'ToolBar',
          events: {
            init(instance) {
              // console.log(instance,2)
            }
          }
        }]
    }
  },
  methods: {
    show(mapPosition) {
      this.center = mapPosition || [120.632511, 31.266049]
      this.position = mapPosition || [120.632511, 31.266049]
      this.visible = true
    },
    handleCancel() {
      this.visible = false
      this.zoom = 20
    }

  }
}
</script>

<style scoped lang="scss">
.amap-page-container {
  width: 100%;
  min-width: 800px;
  height: 600px;
  .box {
    width: 800px;
    height: 550px;
  }
}
</style>
