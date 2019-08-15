// pages/bookSection/bookSection.js
const db = wx.cloud.database();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetailData: {},
    lastData: [],
    next: '',
    pre: '',
    page: 1,//当前页
    pageArray: [],
    pageData: [],
    index: 0,
    url: ''
  },
  getSection: function (url) {
    wx.showLoading({
      title: '正在加载'
    })
    wx.cloud.callFunction({
      name: 'bookSection',
      data: {
        url: url
      }
    })
      .then(res => {
        wx.hideLoading();
        const result = res.result || {};
        console.log(result);
        this.setData({
          bookDetailData: result.bookDetailData,
          lastData: result.lastData,
          next: result.next,
          page: parseInt(result.next.split('/')[2]) - 1,
          pre: result.pre,
          pageArray: result.pageArray,
          pageData: result.pageData
        })
      })
      .catch(err => {
        wx.hideLoading();
        console.log(err);
      })
  },
  bindPickerChange: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (parseInt(e.detail.value) != this.page) {//选择页数不是当前页时，进行请求
      this.setData({
        page: parseInt(e.detail.value) + 1
      });
      let pageno = that.data.page - 1;//数组对应页数的地址下标
      this.getSection(that.data.pageArray[pageno].name);
    }

  },
  prePage: function (e) {
    let url = e.currentTarget.dataset.url || '';
    this.getSection(url)
  },
  nextPage: function (e) {
    let url = e.currentTarget.dataset.url || '';
    this.getSection(url)
  },
  navtoUrl: function (e) {
    let url = e.currentTarget.dataset.url || '';
    if (url) {
      // this.joinBook(url);
      db.collection('book').where({
        _openid: app.globalData.openid,
        // bookUrl: url,
        bookName: this.data.bookDetailData.name
      }).get().then(res=>{
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
      }).catch(err=>{
        wx.showToast({
          icon: 'none',
          title: '网络异常，稍后重试'
        }, 3000)
      })

      wx.navigateTo({
        url: `../bookContent/bookContent?url=${url}&name=${this.data.bookDetailData.name}&imgUrl=${this.data.bookDetailData.imgurl}`
      })
    } else {
      wx.showToast({
        title: '链接为空'
      }, 3000)
    }
  },
  joinBook: function (e) {
    let url = e.currentTarget.dataset.url || '';
    db.collection('book').where({
      _openid: app.globalData.openid,
      // bookUrl: url,
      bookName: this.data.bookDetailData.name
    }).get().then(res => {
      console.log(res);
      const data = res.data[0] || [];
      if (data.length == 0) {//没有此地址记录时，代表可加入书架
        db.collection('book').add({
          data: {
            userId: app.globalData.openid,
            bookName: this.data.bookDetailData.name,
            bookUrl: url,
            imgurl: this.data.bookDetailData.imgurl
          }
        }).then(res => {
          console.log(res)
          wx.showToast({
            icon:'success',
            title: '加入成功'
          }, 3000)
        }).catch(err => {
          console.log(err)
        })
      } else {//否则已经加入提示
        wx.showToast({
          icon: 'none',
          title: '本书已在书架中，请到书架阅读'
        }, 3000)
        
      }
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '网络异常，稍后重试'
      }, 3000)
    })


  },
  warn: function () {
    wx.showToast({
      title: '无上一页或者下一页'
    }, 3000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const url = options.url || '';
    this.setData({
      url: url
    })
    this.getSection(url);
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