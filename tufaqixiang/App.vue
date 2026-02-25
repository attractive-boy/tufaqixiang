<script>
	export default {
		onLaunch: function() {
			console.log('App Launch - 兔发骑想')
			// 检查登录状态
			this.checkLoginStatus()
			uni.hideTabBar()
		},
		onShow: function() {
			console.log('App Show')
			uni.hideTabBar()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			checkLoginStatus() {
				// 从本地存储检查用户是否已登录
				const userInfo = uni.getStorageSync('userInfo')
				if (!userInfo) {
					// 用户未登录，记录已显示启动页
					uni.setStorageSync('showSplash', true)
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	
	body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		background: #F5F5F5;
	}
	
	page {
		background: #F5F5F5;
	}
	
	view, text, input, button, image {
		box-sizing: border-box;
	}
	
	button {
		background: #FA541C;
		color: #FFFFFF;
		border: none;
		border-radius: 8rpx;
		font-size: 28rpx;
		padding: 16rpx 32rpx;
		outline: none;
	}
	
	button:active {
		opacity: 0.9;
	}
	
	input {
		margin: 0;
		padding: 0;
		border: none;
		outline: none;
		background: transparent;
	}
	
	/* 隐藏原生导航栏 */
	uni-page-head {
		display: none !important;
	}
</style>

