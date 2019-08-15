const db = wx.cloud.database();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    contentH:'',
    sectionName: '',
    pre:'',
    next:'',
    url:'',
    name:'',
    imgUrl:'',
    catalog:'',//目录
  },
  getContent: function (url) {
    wx.showLoading({
      title: '正在加载'
    })
    wx.cloud.callFunction({
      name: 'getContent',
      data: {
        url: url
      }
    }).then(res => {
      console.log(res.result);
      wx.hideLoading();
      let result = res.result || '';
      this.setData({ 
        content: result.content.replace(/\s*/g, "").replace('记住手机版网址：m.biqiuge.com', '').replace('记住手机版网址：wap.biqiuge.com', ''),
        contentH: result.contentH.replace('记住手机版网址：m.biqiuge.com', '').replace('记住手机版网址：wap.biqiuge.com', ''),
        sectionName: result.sectionName,
        pre: result.pre,
        next: result.next,
        catalog: result.catalog
        })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
       
    })
      .catch(err => {
        wx.hideLoading();
        console.log(err)
      })
  },
  prePage:function(e){
    console.log(e)
    let url = e.currentTarget.dataset.url || '';
    console.log(url);
    if (url){
      if (url.endsWith('.html')) {
        this.joinBook(url)
        this.getContent(url);
      }
    }else{
      return;
    }
   
  },
  catalog: function (e) {
    console.log(e.currentTarget.dataset.url);
    let url = e.currentTarget.dataset.url || '';
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
  nextPage: function (e) {
    let url = e.currentTarget.dataset.url || '';
    console.log(url);
    if (url) {
      if (url.endsWith('.html')) {
        this.joinBook(url)
        this.getContent(url);
      }
    } else {
      return;
    }
  },
  joinBook: function (url) {
    db.collection('book').where({
      _openid: app.globalData.openid,
      // bookUrl: url,
      bookName: this.data.name
    }).get().then(res => {
      console.log(res);
      const data = res.data || [];
      if (data.length > 0) {//代表本书已在书架中，就要记录它的阅读
        console.log('进入修改判断');
        if (data[0].bookUrl != url) {
          const id = data[0]._id || '';
          console.log(id);
          db.collection('book').doc(id).update({
            data: {
              bookUrl: url,
            }
          }).then(res => {
            console.log(res);
          }).catch(err => {
            wx.showToast({
              icon: 'none',
              title: '网络异常，稍后重试'
            }, 3000)
          })
        }

      }
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '网络异常，稍后重试'
      }, 3000)
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let url = options.url || '';
    let name = options.name || '';
    let imgUrl = options.imgUrl || '';
    this.setData({ url: url, name: name, imgUrl: imgUrl})
    this.getContent(url);
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