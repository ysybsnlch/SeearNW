var app =getApp()
var util = require("../../../util/util.js")
Page({
  data: {
	  reviews:[]
  },
  onLoad: function (options) {
    var id = options.id;
    dataUrl = app.globalData.coubanBase + 
	"v2/movie/subject/"+id+"/reviews";
	this.data.requestUrl  = dataUrl;
	util.http(dataUrl,this.processDoubanData)
  },

  processDoubanData: function (reviewsDouban){
	  var reviews = [];
	  for (var idx in reviewsDouban.reviews) {
		  var review = reviewsDouban.reviews[idx];
	  var temp = {
		  stars: uril.convertToStarsArrayB(review.rating.value),
		  author: review.author.name,
		  title: review.title,
		  summary: review.summary,
		  id: review.id
	   }
	  reviews.push(temp)
	 }
	 this.setData(reviews);
	 
  },
  
  onTapToDetail(event) {
    var reviewId = event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: "https://movie.douban.com/celebrity/1274388/+reviewId"+reviewId+"/"
    })
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