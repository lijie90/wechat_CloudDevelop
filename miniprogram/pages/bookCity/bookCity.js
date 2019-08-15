// pages/bookCity/bookCity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotdata:[],
    classtyf:[]
  },
  getList:function(){
    wx.showLoading({
      title: '正在加载'
      // icon: 'loading'
    })
    wx.cloud.callFunction({
      name:'getList',
      data:{}
    }).then(res=>{
      wx.hideLoading ();
      console.log(res.result);
      const result = res.result || {};
      this.setData({
        hotdata: result.hotData,
        classtyf: result.classifyData
      })
    }).catch(err=>{
      wx.hideLoading ();
      console.log(err)})
  },
  skip:function(e){
    console.log(e.currentTarget.dataset.url);
    let url = e.currentTarget.dataset.url || '';
    if (url){
      wx.navigateTo({
        url: `../bookSection/bookSection?url=${url}`
      })
    }else{
      wx.showToast({
        title: '链接为空'
      },3000)
    }
   
  },
  toSearch:function(){
    wx.navigateTo({
      url: `../search/search`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getList();
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