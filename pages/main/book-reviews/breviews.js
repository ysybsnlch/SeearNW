import { DBbreviews } from '../../db/DBbreviews.js';

Page({
  data: {
  },
  onLoad: function () {
    var dbbreviews = new DBbreviews();
    this.setData({
      breviewsList: dbbreviews.getAllbreviewsData()
    });
  },

  onTapToDetail(event) {
    var breviewsId = event.currentTarget.dataset.breviewsId;
    console.log(breviewsId);
    wx.navigateTo({
      url: 'breviews-detail/breviews-detail?id=' + breviewsId,
    })
  },

  // target 和currentTarget
  // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
  // target这里指的是image，而currentTarget指的是swiper
  onSwiperTap: function (event) {
    var breviewsId = event.target.dataset.breviewsId;
    wx.navigateTo({
      url: "breviews-detail/breviews-detail?id=" + breviewsId
    })
  }
})