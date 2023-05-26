<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-20 09:18:28
 * @LastEditors: June
 * @LastEditTime: 2023-05-20 22:53:50
-->
<template>
  <el-dropdown @command="setLang">
    <el-link :underline="false">
      {{ lang }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-link>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="lang in langList" :key="lang.langType" :command="lang.langType">
          {{ lang.langName }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup name="saveBar">
import { setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';
import { ArrowDown } from '@element-plus/icons-vue';

const $i18n = getCurrentInstance().appContext.config.globalProperties.$i18n;
const LANGMAP = {
  zh: '中文',
  en: 'En',
};

let langList = reactive(
  Object.keys(LANGMAP).map((key) => ({ langType: key, langName: LANGMAP[key] }))
);

const lang = computed(() => {
  return LANGMAP[$i18n.locale];
});

// 设置语言
const setLang = (type) => {
  $i18n.locale = type;
  setLocal(LANG, type);
  window.location.reload();
};
</script>

<style scoped lang="less"></style>
