<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-26 21:38:23
 * @Description: 锁定元素
-->

<template>
  <el-tooltip :show-after="500" :content="$t('quick.lock')" v-if="mSelectMode === 'one'">
    <el-link v-if="isLock" :underline="false" @click="doLock(false)">
      <el-icon size="16"><Lock /></el-icon>
    </el-link>
    <el-link v-else :underline="false" @click="doLock(true)">
      <el-icon size="16"><Unlock /></el-icon>
    </el-link>
  </el-tooltip>
</template>

<script>
import select from '@/mixins/select';
import { Lock, Unlock } from '@element-plus/icons-vue';
const lockAttrs = [
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
];
export default {
  name: 'ToolBar',
  mixins: [select],
  components: {
    Lock,
    Unlock,
  },
  data() {
    return {
      isLock: false,
    };
  },
  created() {
    this.event.on('selectOne', (items) => {
      this.isLock = !items[0].hasControls;
      // eslint-disable-next-line prefer-destructuring
      this.mSelectActive = items[0];
    });
  },
  methods: {
    doLock(isLock) {
      isLock ? this.lock() : this.unLock();
    },
    lock() {
      // 修改自定义属性
      this.mSelectActive.hasControls = false;
      // 修改默认属性
      lockAttrs.forEach((key) => {
        this.mSelectActive[key] = true;
      });

      this.mSelectActive.selectable = false;

      this.isLock = true;
      this.canvas.c.renderAll();
    },
    unLock() {
      // 修改自定义属性
      this.mSelectActive.hasControls = true;
      // 修改默认属性
      lockAttrs.forEach((key) => {
        this.mSelectActive[key] = false;
      });
      this.mSelectActive.selectable = true;

      this.isLock = false;
      this.canvas.c.renderAll();
    },
  },
};
</script>

<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
