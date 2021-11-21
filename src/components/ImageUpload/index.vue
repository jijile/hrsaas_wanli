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
      fileList: [{ url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F0829%2Fb871e1addf5f8e96f3b390ece2b2da0d.jpg&refer=http%3A%2F%2Ffile02.16sucai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1639967891&t=197e7df4e70e95649f9afae8220ef948', name: '风景' }]
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
      //   最后一定要return true
      return true
    },
    /* 上传 */
    async upload(parmas) {
      if (parmas.file) {
        const fileName = 'picture.png'
        const client = new OSS({
          region: 'oss-cn-hangzhou',
          accessKeyId: ' LTAI5tNrs91hAjHxWRyJ2hEm',
          accessKeySecret: 'ZMhPrw4R5xhMJIfSApXvA5JkoF4LPr',
          bucket: 'zwl1'
        })
        console.log('开始上传', parmas.file)
        debugger
        try {
          // const res = await client.multipartUpload(fileName, parmas.file)
          // console.log(res)
          const result = await client.put(fileName, parmas.file)
          console.log(result)
          this.$message.success('上传成功')
        } catch (error) {
          console.log(error)
          this.$message.error('上传失败')
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
