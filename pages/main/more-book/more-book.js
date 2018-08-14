var app = getApp()
var bookstart = 21;
var util = require('../../../util/util.js')
Page({
  data: {
    books: []
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "最热书籍":
        dataUrl = app.globalData.doubanBase +
          "/v2/book/search" + "?tag=热门&start=0&count=21";
        break;
      case "新书速递":
        dataUrl = app.globalData.doubanBase +
          "/v2/book/search" + "?tag=最新&start=0&count=21";
        break;
      case "畅销书籍":
        dataUrl = app.globalData.doubanBase + 
          "/v2/book/search" + "?tag=畅销&start=0&count=21";
        break;
    }
    this.data.requestUrl = dataUrl;
    console.log(dataUrl);
    util.http(dataUrl, this.processDoubanData)
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
    wx.showNavigationBarLoading()
  },

  processDoubanData: function (booksDouban) {
    var books = [];
    for (var idx in booksDouban.books) {
      var subject = booksDouban.books[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.average*5),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        bookId: subject.id
      }
      books.push(temp)
    }
    var totalbooks = []
    totalbooks = this.data.books.concat(books);
    this.setData({
      books: totalbooks
    });
    wx.stopPullDownRefresh();
    //隐藏loading状态
    wx.hideNavigationBarLoading();
  },

  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl.split("?")[0] +
      "?start=0&count=21";

    //刷新页面后将页面所有初始化参数恢复到初始值
    this.data.books = [];
    util.http(refreshUrl, this.processDoubanData);
    //显示loading状态
    wx.showNavigationBarLoading();
  },

  onReachBottom: function (event) {
        //拼接下一组数据的URL
    var nextUrl = this.data.requestUrl.split("&")[0] +
      "&start=" + bookstart + "&count=9";
      console.log(nextUrl);
    util.http(nextUrl, this.processDoubanData)
    //显示loading状态
    wx.showNavigationBarLoading();
    bookstart += 9;
    console.log(bookstart);
  },

  onbookTap: function (event) {
    var bookId = event.currentTarget.dataset.bookId;
    wx.navigateTo({
      url: '../book-detail/book-detail?id=' + bookId
    })
  },
});