const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, //  建立token的快捷访问
  name: state => state.user.userInfo.username, // 建立username快捷访问n
  userId: state => state.user.userInfo.userId, // 建立userID的快捷访问
  avatar: state => state.user.userInfo.staffPhoto // 建立头像的快捷访问
}
export default getters
