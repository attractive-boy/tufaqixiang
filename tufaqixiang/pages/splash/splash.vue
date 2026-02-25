<template>
	<view class="splash-container">
		<view class="decoration-circle large"></view>
		<view class="decoration-circle small"></view>
		<view class="splash-content">
			<view class="bike-icon">🚲</view>
			<view class="app-name">
				<text class="name-text">兔</text>
				<text class="name-text">发</text>
				<text class="name-text">骑</text>
				<text class="name-text">想</text>
			</view>
			<text class="splash-subtitle">AI规划你的骑行路线</text>
		</view>
		<view class="splash-footer">
			<text class="footer-text">点击进入</text>
		</view>
		<custom-tabbar></custom-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0
		}
	},
	onLoad() {
		const systemInfo = uni.getSystemInfoSync();
		this.statusBarHeight = systemInfo.statusBarHeight;
		setTimeout(() => {
			this.goToLogin();
		}, 2000);
	},
	methods: {
		goToLogin() {
			uni.redirectTo({
				url: '/pages/login/login'
			});
		}
	}
}
</script>

<style scoped>
.splash-container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 100vh;
	background: linear-gradient(135deg, #FFF5E6 0%, #FFE6D5 50%, #FFD4CC 100%);
	position: relative;
	overflow: hidden;
}
.decoration-circle {
	position: absolute;
	border-radius: 50%;
	opacity: 0.15;
}
.decoration-circle.large {
	width: 400rpx;
	height: 400rpx;
	background: #FFC854;
	top: -100rpx;
	right: -100rpx;
}
.decoration-circle.small {
	width: 300rpx;
	height: 300rpx;
	background: #FFD4CC;
	bottom: -80rpx;
	left: -80rpx;
}
.splash-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	z-index: 10;
}
.bike-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
	animation: float 3s ease-in-out infinite;
}
@keyframes float {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-20rpx); }
}
.app-name {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 15rpx;
	margin-bottom: 20rpx;
}
.name-text {
	font-size: 88rpx;
	font-weight: bold;
	background: linear-gradient(135deg, #FFC854 0%, #FF9D4D 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	letter-spacing: 2rpx;
}
.splash-subtitle {
	font-size: 32rpx;
	color: #8B6F47;
	text-align: center;
	font-weight: 500;
}
.splash-footer {
	padding-bottom: 100rpx;
	z-index: 10;
}
.footer-text {
	font-size: 28rpx;
	color: #FFD4CC;
	font-weight: 500;
	opacity: 0.8;
}
</style>
