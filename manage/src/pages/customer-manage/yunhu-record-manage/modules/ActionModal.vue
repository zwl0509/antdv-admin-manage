<template>
  <a-modal
    title="云呼记录详情"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-descriptions bordered :column="3">
        <a-descriptions-item label="被叫号码">
          {{ info.calledNbr }}
        </a-descriptions-item>
        <a-descriptions-item label="主叫号码">
          {{ info.callerNbr }}
        </a-descriptions-item>
        <a-descriptions-item label="客户名称">
          {{ info.customerName }}
        </a-descriptions-item>
        <a-descriptions-item label="拨打时间">
          {{ info.dialTime }}
        </a-descriptions-item>
        <a-descriptions-item label="显示号码">
          {{ info.displayNbr }}
        </a-descriptions-item>
        <a-descriptions-item label="通话响应状态">
          {{ info.disposition }}
        </a-descriptions-item>
        <a-descriptions-item label="通话时长(秒)">
          {{ info.duration }}
        </a-descriptions-item>
        <a-descriptions-item label="员工姓名">
          {{ info.employeeName }}
        </a-descriptions-item>
        <a-descriptions-item label="分机号">
          {{ info.extensionNum }}
        </a-descriptions-item>
        <a-descriptions-item label="混合录音文件md5值">
          {{ info.md5Value }}
        </a-descriptions-item>
        <a-descriptions-item label="主叫一方录音文件md5值">
          {{ info.md5ValueIn }}
        </a-descriptions-item>
        <a-descriptions-item label="被叫一方录音文件md5值">
          {{ info.md5ValueOut }}
        </a-descriptions-item>
        <a-descriptions-item label="通话时长(分)">
          {{ info.minDuration }}
        </a-descriptions-item>
        <a-descriptions-item label="振铃时间">
          {{ info.ringTime }}
        </a-descriptions-item>
        <a-descriptions-item label="业务号码">
          {{ info.serviceNbr }}
        </a-descriptions-item>
        <a-descriptions-item label="业务号码B">
          {{ info.serviceNbrB }}
        </a-descriptions-item>


        <a-descriptions-item label="话单类型">
          {{ info.serviceType }}
        </a-descriptions-item>
        <a-descriptions-item label="用户自定义数据">
          {{ info.userData }}
        </a-descriptions-item>

        <a-descriptions-item label="混合语音文件">
          <a-button type="primary" @click="openVoiceFile(info.voiceAddress)">打开语音文件</a-button>
        </a-descriptions-item>
        <a-descriptions-item label="主叫一方语音文件">
          <!-- {{ info.voiceAddressIn }} -->
          <a-button type="primary" @click="openVoiceFile(info.voiceAddressIn)">打开语音文件</a-button>
        </a-descriptions-item>
        <a-descriptions-item label="被叫一方语音文件">
          <!-- {{ info.voiceAddressOut }} -->
          <!-- <audio
            :src="info.voiceAddressOut"
            autoplay="autoplay"
            controls="controls"
            ref="audio"
          >Your browser does not support the audio element.</audio> -->
          <a-button type="primary" @click="openVoiceFile(info.voiceAddressOut)">打开语音文件</a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
import moment from 'moment'
import labels from '@/utils/labels'
import { defaultErrorMessage, } from '@/utils/common'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      id: '',
      info: {}
    }
  },
  methods: {
    show(record) {
      this.visible = true
      this.confirmLoading = true
      this.$get({
        url: this.$api.customInfo.CloudCallRecord.getDetail,
        params: { id: record.id },
      }).then((res) => {
          const data = { ...res }
          this.info = data
        })
        .catch((err) => defaultErrorMessage(err, labels.GET_DATA_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })
    },
    openVoiceFile(url) {
      if(url){
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          '语音文件'
        )
        document.body.appendChild(link)
        link.click()
      }else {
        this.$notification.error({
          message: labels.HINT,
          description: '暂无语音文件！'
        })
      }
    },
    handleCancel() {
      // 重置数据
      this.id = ''
      this.confirmLoading = false
      this.visible = false
      this.info = {}
    },
  },
}
</script>
