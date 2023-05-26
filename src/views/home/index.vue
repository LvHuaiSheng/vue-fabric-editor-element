<template>
  <div class="home">
    <el-container>
      <el-header v-if="show" style="height: 45px; padding: 0 10px; line-height: 45px">
        <!-- logo -->
        <span class="logo">
          <el-link
            type="primary"
            :underline="false"
            href="https://github.com/LvHuaiSheng/vue-fabric-editor-element"
            target="_blank"
          >
            <el-icon size="30"><ChromeFilled /></el-icon>
            GitHub
          </el-link>
        </span>
        <el-space :size="5" :spacer="spacer">
          <!-- 导入 -->
          <import-JSON></import-JSON>
          <import-file></import-file>
          <!-- 标尺开关 -->
          <el-tooltip :content="$t('grid')">
            <el-switch v-model="ruler" size="small" class="switch"></el-switch>
          </el-tooltip>
          <history></history>
        </el-space>
        <div style="float: right">
          <el-space wrap :size="30">
            <!-- 预览 -->
            <previewCurrent />
            <save></save>
            <lang></lang>
          </el-space>
        </div>
      </el-header>
      <el-container style="display: flex; height: calc(100vh - 64px)">
        <div v-if="show" style="width: 380px; height: 100%; background: #fff; display: flex">
          <el-tabs
            tab-position="left"
            v-model="menuActive"
            class="emt-menu-vertical"
            @on-select="(activeIndex) => (menuActive = activeIndex)"
          >
            <el-tab-pane :name="1">
              <template #label>
                <div class="menu-item">
                  <el-icon size="20"><Reading /></el-icon>
                  <div>{{ $t('templates') }}</div>
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane :name="2">
              <template #label>
                <div class="menu-item">
                  <el-icon size="20"><PictureIcon /></el-icon>
                  <div>{{ $t('elements') }}</div>
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane :name="3">
              <template #label>
                <div class="menu-item">
                  <el-icon size="20"><Operation /></el-icon>
                  <div>{{ $t('layers') }}</div>
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
          <div class="content">
            <!-- 生成模板 -->
            <div v-show="menuActive === 1" class="left-panel">
              <import-tmpl></import-tmpl>
            </div>
            <!-- 常用元素 -->
            <div v-show="menuActive === 2" class="left-panel">
              <tools></tools>
              <fontTmpl></fontTmpl>
              <svgEl></svgEl>
            </div>
            <!-- 背景设置 -->
            <div v-show="menuActive === 3" class="left-panel">
              <layer></layer>
            </div>
          </div>
        </div>
        <!-- 画布区域 -->
        <div id="workspace" style="width: 100%; position: relative; background: #f1f1f1">
          <div class="canvas-box">
            <div class="inside-shadow"></div>
            <canvas id="canvas" :class="ruler ? 'design-stage-grid' : ''"></canvas>
            <dragMode></dragMode>
            <zoom></zoom>
            <mouseMenu></mouseMenu>
          </div>
        </div>
        <!-- 属性区域 380-->
        <div style="width: 530px; height: 100%; padding: 10px; overflow-y: auto; background: #fff">
          <div v-if="show" style="padding-top: 10px">
            <!-- 新增字体样式使用 -->
            <!-- <el-button @click="getFontJson" size="small">获取字体数据</el-button> -->
            <set-size></set-size>
            <bg-bar></bg-bar>
            <group></group>
            <replaceImg></replaceImg>
            <filters></filters>
            <div class="attr-item">
              <lock></lock>
              <dele></dele>
              <clone></clone>
            </div>
            <!-- 组对齐方式 -->
            <align></align>
            <!-- 居中对齐 -->
            <center-align></center-align>
            <!-- 翻转 -->
            <flip></flip>
          </div>
          <attribute v-if="show"></attribute>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 导入元素
import importJSON from '@/components/importJSON.vue';
import importFile from '@/components/importFile.vue';
import fontTmpl from '@/components/fontTmpl.vue';

// 顶部组件
import align from '@/components/align.vue';
import centerAlign from '@/components/centerAlign.vue';
import flip from '@/components/flip.vue';
import previewCurrent from '@/components/previewCurrent';
import save from '@/components/save.vue';
import lang from '@/components/lang.vue';
import clone from '@/components/clone.vue';
import group from '@/components/group.vue';
import zoom from '@/components/zoom.vue';
import dragMode from '@/components/dragMode.vue';
import lock from '@/components/lock.vue';
import dele from '@/components/del.vue';

// 左侧组件
import importTmpl from '@/components/importTmpl.vue';
import tools from '@/components/tools.vue';
import svgEl from '@/components/svgEl.vue';
import bgBar from '@/components/bgBar.vue';
import setSize from '@/components/setSize.vue';
import replaceImg from '@/components/replaceImg.vue';
import filters from '@/components/filters.vue';

// 右侧组件
import history from '@/components/history.vue';
import layer from '@/components/layer.vue';
import attribute from '@/components/attribute.vue';

// 右键菜单
import mouseMenu from '@/components/contextMenu/index.vue';

import { ElDivider } from 'element-plus';
const spacer = h(ElDivider, { direction: 'vertical' });

// 功能组件
import CanvasEventEmitter from '@/utils/event/notifier';
import { downFile } from '@/utils/utils';
import { fabric } from 'fabric';
import Editor from '@/core';
import { ElLoading } from 'element-plus';
const event = new CanvasEventEmitter();
const canvas = {};
import { Reading, Picture as PictureIcon, Operation, ChromeFilled } from '@element-plus/icons-vue';
export default {
  name: 'HomeView',
  provide: {
    canvas,
    fabric,
    event,
  },
  data() {
    return {
      menuActive: 1,
      show: false,
      select: null,
      ruler: false,
      spacer: spacer,
    };
  },
  components: {
    setSize,
    tools,
    bgBar,
    lock,
    layer,
    align,
    attribute,
    dele,
    importFile,
    dragMode,
    previewCurrent,
    save,
    lang,
    importJSON,
    clone,
    flip,
    importTmpl,
    centerAlign,
    group,
    zoom,
    svgEl,
    history,
    mouseMenu,
    fontTmpl,
    replaceImg,
    filters,
    Reading,
    ChromeFilled,
    PictureIcon,
    Operation,
  },
  watch: {
    ruler: {
      handler(value) {
        if (!this.canvas.ruler) return;
        if (value) {
          this.canvas.ruler.enable();
        } else {
          this.canvas.ruler.disable();
        }
      },
    },
  },
  mounted() {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    this.canvas = new fabric.Canvas('canvas', {
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    });

    canvas.c = this.canvas;
    event.init(canvas.c);
    canvas.editor = new Editor(canvas.c);

    canvas.c.renderAll();

    this.show = true;
    loading.close();
    // this.$Spin.hide();
  },
  methods: {
    // 获取字体数据 新增字体样式使用
    getFontJson() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        const json = activeObject.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
        console.log(json);
        const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(json, null, '\t')
        )}`;
        downFile(fileStr, 'font.json');
        const dataUrl = activeObject.toDataURL();
        downFile(dataUrl, 'font.png');
      }
    },
  },
};
</script>
<style>
.emt-menu-vertical .el-tabs__item {
  height: 60px !important;
}
</style>
<style lang="less" scoped>
.logo {
  //width: 30px;
  //height: 30px;
  display: inline-block;
  margin-right: 10px;
  text-align: center;
  vertical-align: middle;
  .ivu-icon {
    vertical-align: super;
  }
}

// 属性面板样式
:deep(.attr-item) {
  position: relative;
  margin-bottom: 12px;
  height: 40px;
  padding: 0 10px;
  background: #f6f7f9;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
  .el-button--text,
  .el-link {
    margin: 0 auto;
  }
}

.emt-menu-vertical {
  :deep(.el-tabs__item) {
    text-align: center !important;
  }
}
.emt-menu-vertical .menu-item {
  margin: 0 auto;
  text-align: center;
  padding: 10px 2px;
  box-sizing: border-box;
  font-size: 12px;

  & > i {
    margin: 0;
  }
}

:deep(.el-header) {
  --height: 45px;
  padding: 0 10px;
  border-bottom: 1px solid #eef2f8;
  background: #fff;
  height: var(--height);
  line-height: var(--height);
}

.home,
.el-container {
  height: 100vh;
}

.icon {
  display: block;
}

.canvas-box {
  position: relative;
}
// 画布内阴影
.inside-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 9px 2px #0000001f;
  z-index: 2;
  pointer-events: none;
}

#canvas {
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

#workspace {
  overflow: hidden;
}

.content {
  flex: 1;
  width: 220px;
  padding: 10px;
  padding-top: 0;
  height: 100%;
  overflow-y: auto;
}

//.emt-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
//  background: none;
//}
// 标尺
.switch {
  margin-right: 10px;
}
// 网格背景
.design-stage-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    ),
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
