var app = getApp()
var util = require('../../../util/util.js')
var dataUrl = ""
Page({
  data: {
    reviews: []
  },
  onLoad: function (options) {
    var id = options.id;
    dataUrl = app.globalData.doubanBase +
      "/v2/book/" + id + "/reviews";
    this.data.requestUrl = dataUrl;
    console.log(dataUrl);
    util.http(dataUrl, this.processDoubanData)
  },
  processDoubanData: function (reviewsDouban){
	  var reviews = [];
	  for (var idx in reviewsDouban.reviews) {
		  var review = reviewsDouban.reviews[idx];
	  var temp = {
		  stars: util.convertToStarsArrayB(review.rating.value),
		  author: review.author.name,
		  title: review.title,
		  summary: review.summary,
		  id: review.id,
		  time: review.updated,
		  useful_count:review.votes,
		  avatar: review.author.avatar,
		  useless_count:review.useless
	   }
	  reviews.push(temp)
	 }
	 var totalReviews = []
	 totalReviews = this.data.reviews.concat(reviews);
	 console.log(totalReviews);
	 this.setData({
      reviews: totalReviews
    });
	 
  },
  onTapToDetail(event) {
	  console.log(event);
	  var Url = app.globalData.doubanBase +
      "/v2/book/" + event.currentTarget.id + "/reviews";
	  util.http(Url, this.showModal)
	
  },
  
  showModal: function(data){
	  console.log(data);
	  wx.showModal({
      content: data,
      confirmColor: '#1F4BA5',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          callback && callback();
        }
      }
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