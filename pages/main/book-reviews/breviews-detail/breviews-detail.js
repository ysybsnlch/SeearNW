import { DBbreviews } from '../../../db/DBbreviews.js';
var app = getApp();
console.log(app)

Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (options) {
    var breviewsId = options.id;
    
    this.breviewsId = breviewsId;

    this.dbbreviews = new DBbreviews(breviewsId);
    this.breviewsData = this.dbbreviews.getbreviewsItemById().data;
    this.setData({
      breviews: this.breviewsData
    })
    this.addReadingTimes();
    this.setMusicMonitor();
    this.initMusicStatus();
    this.setAniation();
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.breviewsData.title
    })
  },

  setAniation: function () {
    //定义动画
    var animationUp = wx.createAnimation({
      timingFunction: 'ease-in-out'
    })

    this.animationUp = animationUp
  },

  initMusicStatus() {
    var currentbreviewsId = this.breviewsData.breviewsId;
    if (app.globalData.g_isPlayingMusic &&
      app.globalData.g_currentMusicbreviewsId === currentbreviewsId) {

      // 如果全局播放的音乐是当前文章的的音乐，才将图标状态设置为正在播放
      this.setData({
        isPlayingMusic: true
      })
    }
    else {
      this.setData({
        isPlayingMusic: false
      })
    }
  },

  onCollectionTap: function (event) {
    var newData = this.dbbreviews.collect();

    // 重新绑定数据。注意，不要将整个newData全部作为setData的参数，
    // 应当有选择的更新部分数据

    this.setData({
      'breviews.collectionStatus': newData.collectionStatus,
      'breviews.collectionNum': newData.collectionNum
    })

    // 交互反馈
    wx.showToast({
      title: newData.collectionStatus ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success",
      mask: true
    })
  },

  onUpTap: function (event) {
    var newData = this.dbbreviews.up();

    this.setData({
      'breviews.upStatus': newData.upStatus,
      'breviews.upNum': newData.upNum
    }),

    this.animationUp.scale(2).step();
    this.setData({
      animationUp: this.animationUp.export()
    })
    setTimeout(function () {
      this.animationUp.scale(1).step();
      this.setData({
        animationUp: this.animationUp.export()
      })
    }.bind(this), 300);
  },

  onCommentTap: function (event) {
    var id = event.currentTarget.dataset.breviewsId;
    wx.navigateTo({
      url: '../breviews-comment/breviews-comment?id=' + id
    })
  },

  //阅读量+1
  addReadingTimes: function () {
    this.dbbreviews.addReadingTimes();
  },

  onMusicTap: function (event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: this.breviewsData.music.url,
        title: this.breviewsData.music.title,
        coverImgUrl: this.breviewsData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicbreviewsId = this.breviewsData.breviewsId;
    }
  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    });

    wx.onBackgroundAudioPlay(function (event) {
      // 只处理当前页面的音乐播放。
      if (app.globalData.g_currentMusicbreviewsId === that.breviewsData.breviewsId) {
        that.setData({
          isPlayingMusic: true
        })
      }
      app.globalData.g_isPlayingMusic = true;
    });

    wx.onBackgroundAudioPause(function () {
      // 只处理当前页面的音乐暂停。
      if (app.globalData.g_currentMusicbreviewsId == that.breviewsData.breviewsId) {
        that.setData({
          isPlayingMusic: false
        })
      }
      app.globalData.g_isPlayingMusic = false;
    });
  },

  onShareAppMessage: function () {
    return {
      title: this.breviewsData.title,
      desc: this.breviewsData.content,
      path: "/pages/breviews/breviews-detail/breviews-detail?id="+this.breviewsId
    }
  }

})