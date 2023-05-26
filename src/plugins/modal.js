import { ElLoading } from 'element-plus';
let loadingInstance;

export default {
  // 打开遮罩层
  show(content) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: content ? content : 'loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
  },
  // 关闭遮罩层
  hide() {
    loadingInstance.close();
  },
};
