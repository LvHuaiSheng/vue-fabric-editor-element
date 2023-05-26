<template>
  <el-tooltip v-if="mixinState.mSelectMode === 'one'" :content="$t('quick.copy')">
    <el-link :underline="false" @click="clone">
      <el-icon size="16"><CopyDocument /></el-icon>
    </el-link>
  </el-tooltip>
</template>

<script setup name="Clone">
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';
import { CopyDocument } from '@element-plus/icons-vue';

const { canvas, mixinState } = useSelect();
const clone = debounce(function () {
  canvas.editor.clone();
}, 300);
</script>
