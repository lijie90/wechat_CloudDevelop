// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    key:'',
    listData:[],
    listShow:false
  },
  onSearch:function(data){
    console.log(data.detail);
    let key = data.detail || '';
    if(key){
      this.setData({ key: key, listShow:true})
      this.getSearch(key);
    }
    
  },
  getSearch:function(key){
    wx.showLoading({
      title: '正在加载'
    })
    wx.cloud.callFunction({
      name:'getSearchResult',
      data:{
        key:key
      }
    })
    .then(res=>{
      wx.hideLoading();
      console.log(res)
      let listData = res.result.listData || [];
      this.setData({
        listData: listData
      })
      })
    .catch(err=>{
      wx.hideLoading();
      console.log(err)
      })
  },
  skip: function (e) {
    console.log(e.currentTarget.dataset.url);
    let url = e.currentTarget.dataset.url || '';
    let name = e.currentTarget.dataset.name || '';
    if (url) {
      wx.navigateTo({
        url: `../bookSection/bookSection?url=${url}`
      })
    } else {
      wx.showToast({
        title: '链接为空'
      }, 3000)
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getSearch()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})