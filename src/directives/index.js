// 所有自定义指令
export const imageerror = {
  // 当前dom 插入到节点之后调用
  inserted(dom, options) {
    //   options是指令中变量的解释
    // dom表示当前作用的dom对象
    // dom是图片
    // 当图片有地址没有加载成功时候报错，会触发 => onerror事件
    dom.src = dom.src || options.value
    dom.onerror = function() {
      dom.src = options.value // 把传进来的默认图片设置为图片默认
    }
  },
  componentUpdated(dom, options) {
    // insert 作用在组件上只会执行一次。，组件刷新不会进去insertedg函数
    dom.src = dom.src || options.value
  }
}
