<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color: #fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFullScreen: false
    }
  },
  methods: {
    changeScreen() {
      // 全屏
      if (this.isFullScreen) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
      this.isFullScreen = !this.isFullScreen
    }
  }
}
</script>

<style>

</style>
