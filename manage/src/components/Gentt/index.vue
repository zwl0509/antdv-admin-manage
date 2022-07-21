<template>
  <div>
    <div ref="gantt"></div>
  </div>
</template>
 
<script>
import { gantt } from 'dhtmlx-gantt'
export default {
  name: 'Gantt',
  data( ){
    return {
      columns:[
        {
          name: 'text',
          label: '阶段名字',
          tree: true,
          width: 200,
          template: (obj)=> {
            // 1 已完成 2 进行中 3 已延期 4 未开始
            const template =  `<img src="${require(`../../assets/gantt/${obj.type || 1}.png`)}" class="imgs"></img>` + obj.text
            const defaultTemplate = `<span style="margin: 0 10px;font-size: 14px;font-weight: 500;">${ obj.text }</span>`
            return obj.open ? defaultTemplate : template
          }
        },
        {
          name: 'duration',
          label: '工期',
          align: 'center',
          template: (obj)=> { return obj.duration + '天' }
        },
        { 
          name:'start_date', 
          label:'开始时间', 
          align: 'center',
        },
      ],
    }
  },
  destroyed() {
    this.clearAll()
  },
  methods: {
    // 新增弹出框
    addTask(task_id) {
      console.log(task_id)
    },
    // 配置基础参数
    config(tasks) {
      tasks.data?.map((item)=> {
        if(item.type == 1) {
          item.color = '#36CFC9'
        } else if(item.type == 2) {
          item.color = '#0FCFFF'
        }else if(item.type == 3) {
          item.color = '#4FA0FF'
        }else if(item.type == 4) {
          item.color = '#F6941C'
        }
      })
      // 设置中文
      gantt.i18n.setLocale('cn')
      // 时间格式
      gantt.config.xml_date = '%Y-%m-%d'
      // 初始化
      gantt.init(this.$refs.gantt)
      // 获取数据
      gantt.parse(tasks)
      //自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
      gantt.config.autosize = true
      // 用户可以通过拖拽调整行高
      gantt.config.resize_rows = false
      // 设置甘特图表头高度
      gantt.config.scale_height = 50
      // 设置行高
      gantt.config.row_height = 40
      // 当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
      gantt.config.fit_tasks = true
      // 禁止保存提示
      gantt.config.show_errors = false
      // 最右侧表格小宽度
      gantt.config.min_column_width = 50
      // 只读模式
      gantt.config.readonly = true
      // 是否显示依赖连线(取消)
      gantt.config.show_links = true
      // 在时间线上增加一行显示星期
      gantt.config.scales = [
        { 
          unit: 'month', 
          step: 1, 
          format: '%Y' + '年' +'%M',
          css: ()=> { return 'month-class' }
        },
        { unit: 'day', 
          step: 1, 
          format: '%d',
          css: ()=> { return 'day-class' }
        }
      ] 
      // 自定义表头
      gantt.config.columns = this.columns   
      // gantt.config.tooltip_offset_x = 10
      // gantt.config.tooltip_offset_y = 30
      // 进度百分比
      gantt.templates.progress_text = (start, end, task) => {
        return '<span>' + Math.round(task.progress * 100) + '% </span>'
      }

      gantt.plugins({
        marker: true
      })
      
      gantt.addMarker({
        start_date: new Date(),
        text: '今日'
      })
      // 动态设置grid样式
      gantt.templates.grid_row_class = (start, end, task)=> {
        let style = ''
        if (task.type == 'project') {
          style = 'row_project'
        } else if (task.type == 'task') {
          style = 'row_task'
        } else if (task.type == 'milestone') {
          style = 'row_milestone'
        }else {
          style = 'row_milestone'
        }
        return style
      }

      // // 任务条显示内容(方向=> task_text leftside_text rightside_text 
      gantt.templates.task_text = (start, end, task)=> {
        return task.text + '(' + task.duration + '天)'
      }
      gantt.templates.rightside_text = (start, end, task)=>{
        return task.text + '(' + task.duration + '天)'
      }
      // 任务条 样式
      gantt.templates.task_class = (start, end, task)=>{
        return 'task-css'
      }
      
      //时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
      gantt.config.show_task_cells = true
      
      // 弹灯箱事件 有bug不能更新
      gantt.attachEvent('onBeforeLightbox',(task_id)=> {
        console.log(task_id)
        // 刷新灯箱数据
        gantt.resetLightbox()
        // 打开灯箱
        return true
        //这里调用了自己的页面，没有打开默认灯箱
        this.addTask(task_id)
      })
    },
    clearAll() {
      gantt.clearAll()
    }
  }
}
</script>
 
<style lang="scss">
  @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
  .gantt_scale_line {
    border-top: none;
  }
  .month-class {
    background: #E4EAEC;
  }
  .day-class {
    background: #F1F7F9;
  }
  .gantt_task .gantt_task_scale .gantt_scale_cell {
    color: #333;
    border-right: 1px solid #C6C6C6;
  }
  // 左边表头样式
  .gantt_grid_scale .gantt_grid_head_cell {
    color: #000;
    font-size: 14px;
  }
  // 是否显示右边的边框
  .gantt_task_cell {
    border-right: 0;
  }
  .gantt_task_progress {
    display: none;
  }
  // 开启 icon
  .gantt_tree_icon.gantt_open {
    background-image: url('../../assets/gantt/gantt-open.png');
    width: 14px;
    height: 100%;
    cursor: pointer;
  }
  // 关闭 icon
  .gantt_tree_icon.gantt_close {
    background-image: url('../../assets/gantt/gantt-close.png');
    width: 16px;
    height: 100%;
    cursor: pointer;
  }
  // 选中
  .gantt_task_row.gantt_selected {
    background:rgba(241, 247, 249, 1);
  }
  .gantt_grid_data .gantt_row.gantt_selected {
    background:rgba(241, 247, 249, 1);
  }
  .gantt_grid_data .gantt_row.odd.gantt_selected {
    background:rgba(241, 247, 249, 1);
  }
  // 鼠标经过
  .gantt_grid_data .gantt_row.odd:hover, 
  .gantt_grid_data .gantt_row:hover {
    background:rgba(241, 247, 249, 1);
  }

  // 任务条背景颜色
  .gantt_task_line {
    border-radius: 6px;
    background-color: #7F7F7F;
    border: none !important;
    .gantt_task_content {
      font-size: 13px;
      color: #FFF;
    }
  }
  .gantt_line_wrapper div {
    background-color: #E33B3A;
  }
  .gantt_link_arrow_right {
    border-left-color: #E33B3A;
  }
  .gantt_link_arrow_left {
    border-right-color: #E33B3A;
  }
  // 任务栏样式
  .task-css { 
    height: 30px !important;
    line-height: 30px !important;
    margin-top: 2px;
    border-radius: 20px;
  }

  // 文字超出.....
  .gantt_tree_content {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // 任务图标
  .gantt_tree_icon.gantt_folder_open {
    display: none;
  }
  .gantt_tree_icon.gantt_file {
    display: none;
  }
  .gantt_tree_icon.gantt_folder_closed {
    display: none;
  }

  // 自定义图标
  .gantt_tree_content {
    text-align: center;
    .imgs {
      vertical-align: middle;
      margin: 0 4px;
      width: 16px;
    }
  }

</style>