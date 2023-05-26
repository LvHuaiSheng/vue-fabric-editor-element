<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-05-07 09:34:18
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18

 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <el-space>
      <el-link :underline="false" @click="beforeClear">
        {{ $t('empty') }}
      </el-link>
      <el-dropdown style="margin-left: 10px" @command="saveWith">
        <el-button type="primary">
          {{ $t('keep') }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clipboard">{{ $t('copy_to_clipboard') }}</el-dropdown-item>
            <el-dropdown-item command="saveImg">{{ $t('save_as_picture') }}</el-dropdown-item>
            <el-dropdown-item command="saveSvg">{{ $t('save_as_svg') }}</el-dropdown-item>
            <el-dropdown-item command="saveJson" divided>{{ $t('save_as_json') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-space>
  </div>
</template>

<script setup name="save-bar">
import { ElMessageBox } from 'element-plus';
import { clipboardText } from '@/utils/utils.ts';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { ArrowDown } from '@element-plus/icons-vue';
const { t } = useI18n();

const { canvas } = useSelect();
const cbMap = {
  clipboard() {
    const jsonStr = canvas.editor.getJson();
    clipboardText(JSON.stringify(jsonStr, null, '\t'));
  },

  saveJson() {
    const dataUrl = canvas.editor.getJson();
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downFile(fileStr, 'json');
  },

  saveSvg() {
    const workspace = canvas.c.getObjects().find((item) => item.id === 'workspace');
    const { left, top, width, height } = workspace;
    const dataUrl = canvas.c.toSVG({
      width,
      height,
      viewBox: {
        x: left,
        y: top,
        width,
        height,
      },
    });
    const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`;
    downFile(fileStr, 'svg');
  },

  saveImg() {
    const workspace = canvas.c.getObjects().find((item) => item.id === 'workspace');
    canvas.editor.ruler.hideGuideline();
    const { left, top, width, height } = workspace;
    const option = {
      name: 'New Image',
      format: 'png',
      quality: 1,
      left,
      top,
      width,
      height,
    };
    canvas.c.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.c.toDataURL(option);
    downFile(dataUrl, 'png');
    canvas.editor.ruler.showGuideline();
  },
};

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
}, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvas.c.getObjects().forEach((obj) => {
    if (obj.id !== 'workspace') {
      canvas.c.remove(obj);
    }
  });
  canvas.c.discardActiveObject();
  canvas.c.renderAll();
};

const beforeClear = () => {
  ElMessageBox({
    title: t('tip'),
    type: 'warning',
    dangerouslyUseHTMLString: true,
    message: `<p>${t('clearTip')}</p>`,
    showCancelButton: true,
    confirmButtonText: t('ok'),
    cancelButtonText: t('cancel'),
  }).then(() => {
    clear();
  });
};

function downFile(fileStr, fileType) {
  const anchorEl = document.createElement('a');
  anchorEl.href = fileStr;
  anchorEl.download = `${uuid()}.${fileType}`;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}
</script>

<style scoped lang="less">
.save-box {
  //display: inline-block;
  //padding-right: 10px;
}
</style>
