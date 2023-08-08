<template>
  <el-dialog title="导入数据" :visible.sync="centerDialogVisible" @close="handleclear" style="width: 60%;left: 20%;position: absolute">
      <el-upload style="width: 55%;margin: auto;"
        class="upload-data"
        ref="uploadRef"
        action="http://localhost:8443/api/importAsyData"
        accept=".xls, .xlsx"
        :on-preview="handlePreview"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :on-error="handleError"
        :limit=1
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmit">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过5MB</div>
      </el-upload>
  </el-dialog>
</template>

<script>

export default {
  name: 'ImportChats',
  data () {
    return {
      // 上传后的文件列表
      fileList: [],
      // 运行上传文件大小，单位 M
      fileSize: 5,
      // 附件数量限制
      fileLimit: 1,
      // 数据导入框默认关闭
      centerDialogVisible: false
    }
  },
  methods: {
    // 上传文件之前
    handlePreview (file) {
      if (file.type !== '' || file.type !== null || file.type !== undefined) {
        // 截取文件的后缀，判断文件类型
        const FileExt = file.name.replace(/.+\./, '').toLowerCase()
        // 计算文件的大小
        const isLt5M = file.size / 1024 / 1024 < this.fileSize
        // 如果大于5M
        if (!isLt5M) {
          this.$message.warning('上传文件大小不能超过 5MB!')
          return false
        }
        // 如果文件类型不在允许上传的范围内
        if (!this.fileType.includes(FileExt)) {
          this.$message.warning('上传文件格式不正确!')
          return false
        }
      }
    },
    // 超出文件个数的回调
    handleExceed () {
      this.$message({
        type: 'warning',
        message: '目前只支持单文件导入！'
      })
    },
    // 上传文件的事件
    onSubmit () {
      this.$refs.uploadRef.submit()
    },
    // 上传成功后的回调
    handleSuccess () {
      this.$message.success('数据导入成功')
    },
    handleError () {
      this.$message.error('数据导入失败')
    },
    handleclear () {
      this.$refs.uploadRef.clearFiles()
      this.$emit('onSubmit')
    }
  }
}
</script>

<style scoped>

</style>
