var app =getApp()
var util = require('../../../util/util.js')
var dataUrl = ""
Page({
  data: {
	  reviews:[]
  },
  onLoad: function (options) {
    var id = options.id;
    dataUrl = app.globalData.doubanBase + 
	"/v2/movie/subject/"+id+"/reviews";
	this.data.requestUrl  = dataUrl;
	console.log(dataUrl);
	util.http(dataUrl,this.processDoubanData)
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
		  time: review.updated_at,
		  useful_count:review.useful_count,
		  avatar: review.author.avatar,
		  useless_count:review.useless_count
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
  },

  // target 和currentTarget
  // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
  // target这里指的是image，而currentTarget指的是swiper
  onSwiperTap: function (event) {
    var postId = event.target.dataset.postId;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }
})