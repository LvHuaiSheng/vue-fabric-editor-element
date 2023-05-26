<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-25 21:53:19
 * @Description: 插入SVG元素
-->

<template>
  <div>
    <el-dropdown @command="insertTypeHand">
      <span class="el-dropdown-link" style="line-height: 50px">
        {{ $t('insertFile.insert') }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 图片 -->
          <el-dropdown-item command="insertImg">
            {{ $t('insertFile.insert_picture') }}
          </el-dropdown-item>
          <!-- SVG -->
          <el-dropdown-item command="insertSvg">{{ $t('insertFile.insert_SVG') }}</el-dropdown-item>
          <!-- SVG 字符串 -->
          <el-dropdown-item command="insertSvgStrModal">
            {{ $t('insertFile.insert_SVGStr') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 插入字符串svg元素 -->
    <el-dialog
      v-model="showModal"
      :title="$t('insertFile.modal_tittle')"
      width="30%"
      :before-close="
        () => {
          showModal = false;
        }
      "
    >
      <el-input
        v-model="svgStr"
        :rows="4"
        type="textarea"
        :placeholder="$t('insertFile.insert_SVGStr_placeholder')"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { checkFileExt, downFontByJSON, getImgStr, selectFiles } from '@/utils/utils';
import select from '@/mixins/select';
import { v4 as uuid } from 'uuid';
import { processPSD2Sky } from '@/utils/psd';
import { ArrowDown } from '@element-plus/icons-vue';

export default {
  name: 'ToolBar',
  mixins: [select],
  components: {
    ArrowDown,
  },
  data() {
    return {
      showModal: false,
      svgStr: '',
    };
  },
  methods: {
    insertTypeHand(type) {
      this[type]();
    },
    handleConfirm() {
      this.showModal = false;
    },
    // 插入图片
    async insertImg() {
      selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
        Array.from(fileList).forEach(async (item) => {
          console.log('item=', item);
          if (checkFileExt(item, ['psd'])) {
            // PSD文件
            const psdJson = await processPSD2Sky(item);
            console.log('psdJson=', psdJson);
            this.insertPsdFile(psdJson);
          } else {
            // 非PSD文件
            getImgStr(item).then((file) => {
              this.insertImgFile(file);
            });
          }
        });
      });
    },
    // 插入Svg
    insertSvg() {
      selectFiles({ accept: '.svg', multiple: true }).then((fileList) => {
        Array.from(fileList).forEach((item) => {
          getImgStr(item).then((file) => {
            this.insertSvgFile(file);
          });
        });
      });
    },
    // 插入SVG元素
    insertSvgStrModal() {
      this.svgStr = '';
      this.showModal = true;
    },
    // 插入图片文件
    insertImgFile(file) {
      const imgEl = document.createElement('img');
      imgEl.src = file || this.imgFile;
      // 插入页面
      document.body.appendChild(imgEl);
      imgEl.onload = () => {
        // 创建图片对象
        const imgInstance = new this.fabric.Image(imgEl, {
          id: uuid(),
          name: '图片1',
          left: 100,
          top: 100,
        });
        // 设置缩放
        this.canvas.c.add(imgInstance);
        this.canvas.c.setActiveObject(imgInstance);
        this.canvas.c.renderAll();
        // 删除页面中的图片元素
        imgEl.remove();
      };
    },
    // 插入文件元素
    insertSvgFile(svgFile) {
      const This = this;
      this.fabric.loadSVGFromURL(svgFile || this.svgFile, (objects, options) => {
        const item = This.fabric.util.groupSVGElements(objects, {
          ...options,
          name: 'defaultSVG',
          id: uuid(),
        });
        This.canvas.c.add(item).centerObject(item).renderAll();
      });
    },
    // 插入字符串元素
    insertSvgStr() {
      const This = this;
      this.fabric.loadSVGFromString(this.svgStr, (objects, options) => {
        const item = This.fabric.util.groupSVGElements(objects, {
          ...options,
          name: 'defaultSVG',
          id: uuid(),
        });
        This.canvas.c.add(item).centerObject(item).renderAll();
      });
    },
    // 插入PSD文件元素
    insertPsdFile(psdJson) {
      const This = this;
      psdJson.objects.forEach((item) => {
        console.log('objects.item=', item);
        if (item.type === 'text') {
          const text = new this.fabric.Textbox(item.text, {
            ...item,
            id: uuid(),
          });
          this.canvas.c.add(text);
          this.canvas.c.setActiveObject(text);
          // this.fabric.loadSVGFromString(item.text, (objects, options) => {
          //   const item = This.fabric.util.groupSVGElements(objects, {
          //     ...options,
          //     id: uuid(),
          //   });
          //   This.canvas.c.add(item).centerObject(item).renderAll();
          // });
        } else {
          const imgEl = document.createElement('img');
          imgEl.src = item.src;
          // 插入页面
          document.body.appendChild(imgEl);
          imgEl.onload = () => {
            // 创建图片对象
            const imgInstance = new this.fabric.Image(imgEl, {
              id: uuid(),
              ...item,
            });
            // 设置缩放
            this.canvas.c.add(imgInstance);
            this.canvas.c.setActiveObject(imgInstance);
            this.canvas.c.renderAll();
            // 删除页面中的图片元素
            imgEl.remove();
          };
        }
      });
    },
    insertJsonFile(jsonFile) {
      // 加载字体后导入
      downFontByJSON(jsonFile).then(() => {
        this.canvas.c.loadFromJSON(jsonFile, () => {
          this.canvas.c.renderAll.bind(this.canvas.c);
          setTimeout(() => {
            const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
            workspace.set('selectable', false);
            workspace.set('hasControls', false);
            this.canvas.c.requestRenderAll();
            this.canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
            this.canvas.c.renderAll();
            this.canvas.c.requestRenderAll();
          }, 100);
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
:deep(.el-dropdown) {
  z-index: 999;
}
</style>
