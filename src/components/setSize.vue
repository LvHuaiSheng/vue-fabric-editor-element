<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-05-10 21:52:37
 * @Description: 尺寸设置f
-->

<template>
  <div v-if="!mixinState.mSelectMode">
    <el-divider content-position="left">{{ $t('size') }}</el-divider>
    <el-form :label-width="50">
      <el-form-item :label="$t('width')" prop="name">
        <el-input-number
          :max="2000"
          :min="1"
          controls-position="right"
          v-model="width"
          @change="setSize"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('height')" prop="name">
        <el-input-number
          :max="2000"
          :min="1"
          controls-position="right"
          v-model="height"
          @change="setSize"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <el-divider content-position="left">{{ $t('default_size') }}</el-divider>
    <el-space direction="vertical">
      <el-button
        v-for="(item, i) in presetSize"
        :key="`${i}presetSize`"
        size="small"
        style="text-align: left"
        @click="setSizeBy(item.width, item.height)"
      >
        {{ item.label }}:{{ item.width }}x{{ item.height }}
      </el-button>
    </el-space>
  </div>
</template>

<script setup name="CanvasSize">
import useSelect from '@/hooks/select';
import useI18n from '@/hooks/useI18n';

import EditorWorkspace from '@/core/EditorWorkspace';

const { canvas, mixinState } = useSelect();
const $t = useI18n();

let width = ref(900);
let height = ref(1200);
let presetSize = reactive([
  {
    label: $t('red_book_vertical'),
    width: 900,
    height: 1200,
  },
  {
    label: $t('red_book_horizontal'),
    width: 1200,
    height: 900,
  },
  {
    label: $t('phone_wallpaper'),
    width: 1080,
    height: 1920,
  },
]);

onMounted(() => {
  canvas.editor.editorWorkspace = new EditorWorkspace(canvas.c, {
    width: width.value,
    height: height.value,
  });
});

const setSizeBy = (w, h) => {
  width.value = w;
  height.value = h;
  setSize();
};
const setSize = () => {
  canvas.editor.editorWorkspace.setSize(width.value, height.value);
};
</script>

<style scoped lang="less">
:deep(.ivu-form-item) {
  margin-bottom: 0;
}
:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
  }
}
</style>
