Page({
    onTapJump: function (event) {
        wx.switchTab({
            url: "../main/main",
            success: function () {
                console.log("jump success")
            },
            fail: function () {
                console.log("jump failed")
            },
            complete: function () {
                console.log("jump complete")
            }
        });
    },
    onUnload: function (event) {
        console.log("page is unload")
    },
    onHide: function (event) {
        console.log("page is hide")
    },
    onGotUserInfo: function (e) {
      console.log(e.detail.errMsg)
      console.log(e.detail.userInfo)
      console.log(e.detail.rawData)
    },
})