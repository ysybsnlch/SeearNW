var util = require('../../../util/util.js')
var bookId=""
var app = getApp();
Page({
  data: {
    book: {}
  },
  onLoad: function (options) {
    bookId = options.id;
    var url = app.globalData.doubanBase + 
      "/v2/book/" + bookId;
    
    util.http(url, this.processDoubanData)
  },

   processDoubanData:function(data) {
        if (!data) {
            return;
        }
        var author = data.author[0];
        
        var book = {
            bookImg: data.images ? data.images.large : "",
           // country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            publisher: data.publisher,
            price: data.price,
            year: data.pubdate,
            generes: data.tags[3].name + "、" + data.tags[4].name + "、" + data.tags[5].name,
            stars: util.convertToStarsArray(data.rating.average*5),
            score: data.rating.average,
            author: author,
            publisher:data.publisher,
            summary: data.summary,
            author_intro : data.author_intro,
            catalog: data.catalog,
            binding : data.bingding
        }
        this.setData({
          book:book
        });
        wx.setNavigationBarTitle({
          title: data.title
        });
    },

  //预览电影海报
  viewbookPostImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, 
      urls: [src] 
    })
  },

  onBreviewsTap: function (event) {
	wx.navigateTo({
      url: "../book-reviews/book-reviews?id=" + bookId
    })
  }
})