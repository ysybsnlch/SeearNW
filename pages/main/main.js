var util = require('../../util/util.js')
var app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {},
  },

  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/book/search" + "?tag=热门&start=0&count=3" ;
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/book/search" + "?tag=最新&start=0&count=3";
    var top250Url = app.globalData.doubanBase +
      "/v2/book/search" + "?tag=畅销&start=0&count=3";

    wx.showNavigationBarLoading();
    console.log('show');

    this.getbookListData(inTheatersUrl, "popular", "最热书籍");
    this.getbookListData(comingSoonUrl, "newbooks", "新书速递");
    this.getbookListData(top250Url, "wellsale", "畅销书籍");
  },

  getbookListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        // fail
        console.log(error)
      }
    })
  },

  processDoubanData: function (booksDouban, settedKey,
    categoryTitle) {
    var books = [];
    console.log(booksDouban)
    for (var idx in booksDouban.books) {
      var subject = booksDouban.books[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]

      var temp = { 
        stars: util.convertToStarsArray(subject.rating.average*5),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        bookId: subject.id
      }
      books.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      books: books
    }
    this.setData(readyData);
    console.log(books);
    wx.hideNavigationBarLoading();
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-book/more-book?category=" + category
    })
  },

  onbookTap: function (event) {
    var id = event.currentTarget.dataset.bookId;
    wx.navigateTo({
      url: "book-detail/book-detail?id=" + id
    })
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ''
    }
    )
  },

  onBindConfirm: function (event) {
    var keyWord = event.detail.value;
    var searchUrl = app.globalData.doubanBase +
      "/v2/book/search?q=" + keyWord;
    this.getbookListData(searchUrl, "searchResult", "");

  }

})