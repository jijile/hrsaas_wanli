<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{ disabled: fileComplete }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percent" style="width: 180px" />
    <el-dialog :visible.sync="showDialog" :title="imgName">
      <img :src="imaUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import OSS from 'ali-oss'
export default {
  data() {
    return {
      showDialog: false,
      imaUrl: '',
      imgName: '',
      fileList: [
      ], // 存储图片的数组
      currentFileUID: '',
      percent: 0,
      showProgress: false
    }
  },
  computed: {
    fileComplete() {
      // 如果length===1表示上传完成
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.showDialog = true
      console.log(file)
      this.imaUrl = file.url
      this.imgName = file.name
    },
    handleRemove(file, fileList) {
    //   this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 过滤相同的file
      this.fileList = fileList
    },
    changeFile(file, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file) {
    //  检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片格式不正确')
        return false
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传文件大小不能超过5M')
        return false
      }
      this.currentFileUID = file.uid
      this.showProgress = true
      //   最后一定要return true
      return true
    },
    /* 上传 */
    async upload(parmas) {
      if (parmas.file) {
        const fileName = 'picture.png'
        const client = new OSS({
          region: 'oss-cn-hangzhou',
          accessKeyId: '',
          accessKeySecret: '',
          bucket: 'zwl1'
        })
        console.log('开始上传', parmas.file)
        // const res = await client.multipartUpload(fileName, parmas.file)
        // console.log(res)
        try {
          // const result = await client.multipartUpload(fileName, parmas.file, {
          //   progress: function(p) { // 获取进度条的值
          //     console.log('进度', p)
          //     this.progress = p * 100 // 更新进度条
          //   }
          // })
          const result = await client.put(fileName, parmas.file, {
            progress: function(p) { // 获取进度条的值
              console.log('进度', p)
              this.progress = p * 100 // 更新进度条
            }
          })
          const { url } = result
          debugger
          if (url) {
            console.log(url)
            debugger
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUID) {
                return { ...item, url, upload: true }
              }
              return item
            })
            console.log('新的文件列表', this.fileList)
          }
          this.showProgress = false
          this.percent = 0
          this.$message.success('上传成功')
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    }
  }
}
</script>

<style lang="scss" scope>
.disabled .el-upload--picture-card {
    display: none;
}
</style>
