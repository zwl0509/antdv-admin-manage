<template>
  <a-modal 
    class="construction-task-detail"
    title="施工计划查看"
    :width="900"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
      <a-collapse-panel key="1" header="开工信息">
        <div v-if="info.codeA && info.codeA[0]">
          <a-card hoverable>
            <div class="remark">{{ info.codeA[0].remark }}</div>
            <div>
              <img v-for="(item, index) in info.codeA[0].attachInfos" :key="index" class="pic" :src="item.path">
            </div>
          </a-card>
        </div>
        <div v-else class="remark">当前项目还没有开工</div>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="完工信息">
        <div v-if="info.codeB && info.codeB[0]">
          <a-card hoverable>
            <div class="remark">{{ info.codeB[0].remark }}</div>
            <div>
              <img v-for="(item, index) in info.codeB[0].attachInfos" :key="index" class="pic" :src="item.path">
            </div>
          </a-card>
        </div>
        <div v-else class="remark">当前项目还没有完工</div>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="延期申请">
        <div v-if="info.codeC && info.codeC.length">
          <a-card hoverable v-for="(item, index) in info.codeC" :key="index" style="margin-bottom: 10px;">
            <div class="remark">{{ item.remark }}</div>
            <div>
              <img v-for="(s_item, s_index) in item.attachInfos" :key="s_index" class="pic" :src="s_item.path">
            </div>
          </a-card>
        </div>
        <div v-else class="remark">当前项目还没有完工</div>
      </a-collapse-panel>
    </a-collapse>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'ConstructionTaskDetail',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        activeKey: ['1'],
        info: {
          codeA: {},
          codeB: {},
          codeC: {}
        }
      }
    },
    methods: {
      show (recoed) {
        this.visible = true
        this.getTaskDetail(recoed.id) 
      },
      getTaskDetail(id) {
        this.$get({
          url: this.$api.construction.customerConstructionTaskInfo.getTaskDetail,
          params: {customerConstructionTaskId: id }
        }).then((res)=> {
          this.info = {
            codeA: res['1080-10'],
            codeB: res['1080-20'],
            codeC: res['1080-30']
          }
          console.log(this.info)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
        this.info = {
          codeA: {},
          codeB: {},
          codeC: {}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.construction-task-detail {
  .pic {
    width: 100px;
    height: 100px;
    margin: 10px 10px 0  0;
  }
  .remark {
    color: #999;
    font-size: 18px;
    // text-indent: 36px;
  }
}
</style>