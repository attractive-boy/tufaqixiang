<template>
	<view class="index-container">
		<!-- 头部轮播 -->
		<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :duration="500">
			<swiper-item class="banner-item" v-for="(item, index) in banners" :key="index">
				<image :src="item" mode="aspectFill" class="banner-image"></image>
			</swiper-item>
		</swiper>

		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input" @tap="toSearch">
				<text class="search-icon">🔍</text>
				<text class="search-placeholder">搜索骑行路线</text>
			</view>
			<view class="filter-button" @tap="toMap">
				<text class="filter-icon">📍</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="function-menu">
			<view class="menu-item" @tap="toCreateRoute">
				<view class="menu-icon">🗺️</view>
				<text class="menu-text">规划路线</text>
			</view>
			<view class="menu-item" @tap="toAIRoute">
				<view class="menu-icon">🤖</view>
				<text class="menu-text">AI规划</text>
			</view>
			<view class="menu-item" @tap="toNearby">
				<view class="menu-icon">📍</view>
				<text class="menu-text">附近路线</text>
			</view>
			<view class="menu-item" @tap="toEvents">
				<view class="menu-icon">🎉</view>
				<text class="menu-text">骑行活动</text>
			</view>
		</view>

		<!-- 推荐路线 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">🌟 精选路线</text>
				<text class="section-more" @tap="toMoreRoutes">更多</text>
			</view>
			<view class="routes-list">
				<view class="route-card" v-for="(route, index) in recommendRoutes" :key="index" @tap="toRouteDetail(route)">
					<image :src="route.image" mode="aspectFill" class="route-image"></image>
					<view class="route-info">
						<text class="route-name">{{ route.name }}</text>
						<view class="route-tags">
							<text class="route-tag">{{ route.distance }}km</text>
							<text class="route-tag">{{ route.difficulty }}</text>
						</view>
						<view class="route-stats">
							<text class="route-stat">👥 {{ route.participants }}</text>
							<text class="route-stat">⭐ {{ route.rating }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 热门话题 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">🔥 热门话题</text>
				<text class="section-more" @tap="toForum">更多</text>
			</view>
			<view class="topics-list">
				<view class="topic-card" v-for="(topic, index) in hotTopics" :key="index" @tap="toTopic(topic)">
					<text class="topic-title">{{ topic.title }}</text>
					<text class="topic-desc">{{ topic.description }}</text>
					<view class="topic-footer">
						<text class="topic-count">💬 {{ topic.commentCount }}</text>
						<text class="topic-likes">👍 {{ topic.likes }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 我的进度 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">📊 我的骑行进度</text>
			</view>
			<view class="progress-card">
				<view class="progress-item">
					<text class="progress-label">本月骑行</text>
					<text class="progress-value">{{ myStats.monthDistance }} km</text>
				</view>
				<view class="progress-item">
					<text class="progress-label">总骑行</text>
					<text class="progress-value">{{ myStats.totalDistance }} km</text>
				</view>
				<view class="progress-item">
					<text class="progress-label">完成路线</text>
					<text class="progress-value">{{ myStats.completedRoutes }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			banners: [
				'/static/banner1.jpg',
				'/static/banner2.jpg',
				'/static/banner3.jpg'
			],
			recommendRoutes: [
				{
					id: 1,
					name: '颐和园环湖骑行',
					distance: 15,
					difficulty: '简单',
					participants: 2580,
					rating: 4.8,
					image: '/static/route1.jpg',
					description: '环绕颐和园，享受湖光山色'
				},
				{
					id: 2,
					name: '北京奥森公园',
					distance: 22,
					difficulty: '中等',
					participants: 3200,
					rating: 4.6,
					image: '/static/route2.jpg',
					description: '城市中心的绿色骑行路线'
				},
				{
					id: 3,
					name: '长城脚下骑行',
					distance: 35,
					difficulty: '困难',
					participants: 1580,
					rating: 4.9,
					image: '/static/route3.jpg',
					description: '体验长城脚下的壮观风景'
				}
			],
			hotTopics: [
				{
					id: 1,
					title: '春季骑行安全指南',
					description: '分享春季骑行的注意事项和装备推荐...',
					commentCount: 234,
					likes: 1280
				},
				{
					id: 2,
					title: '我的长城之旅',
					description: '记录了我骑行长城脚下的精彩时刻...',
					commentCount: 156,
					likes: 892
				},
				{
					id: 3,
					title: '新手骑行装备选购',
					description: '给新手的装备推荐和购买建议...',
					commentCount: 312,
					likes: 1560
				}
			],
			myStats: {
				monthDistance: 128,
				totalDistance: 1280,
				completedRoutes: 24
			}
		}
	},
	onLoad() {
		// 初始化页面数据
		console.log('首页加载');
	},
	methods: {
		toSearch() {
			uni.showToast({ title: '搜索功能开发中', icon: 'none' });
		},
		toMap() {
			uni.showToast({ title: '地图功能开发中', icon: 'none' });
		},
		toCreateRoute() {
			uni.showToast({ title: '路线编辑功能开发中', icon: 'none' });
		},
		toAIRoute() {
			uni.showToast({ title: 'AI规划功能开发中', icon: 'none' });
		},
		toNearby() {
			uni.showToast({ title: '附近路线功能开发中', icon: 'none' });
		},
		toEvents() {
			uni.showToast({ title: '骑行活动功能开发中', icon: 'none' });
		},
		toMoreRoutes() {
			uni.showToast({ title: '更多路线功能开发中', icon: 'none' });
		},
		toRouteDetail(route) {
			uni.showToast({ title: `查看路线: ${route.name}`, icon: 'none' });
		},
		toForum() {
			uni.switchTab({ url: '/pages/forum/forum' });
		},
		toTopic(topic) {
			uni.showToast({ title: `查看话题: ${topic.title}`, icon: 'none' });
		}
	}
}
</script>

<style scoped>
.index-container {
	display: flex;
	flex-direction: column;
	background: #F5F5F5;
	min-height: 100vh;
	padding-bottom: 20rpx;
}

.banner-swiper {
	width: 100%;
	height: 300rpx;
	margin-bottom: 0;
}

.banner-item {
	width: 100%;
	height: 100%;
}

.banner-image {
	width: 100%;
	height: 100%;
}

.search-bar {
	display: flex;
	gap: 10rpx;
	padding: 20rpx;
	background: #FFFFFF;
	align-items: center;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.search-input {
	flex: 1;
	display: flex;
	align-items: center;
	background: #F5F5F5;
	border-radius: 20rpx;
	padding: 15rpx 20rpx;
	gap: 10rpx;
}

.search-icon {
	font-size: 28rpx;
}

.search-placeholder {
	color: #999999;
	font-size: 28rpx;
	flex: 1;
}

.filter-button {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FA541C;
	border-radius: 50%;
	font-size: 32rpx;
}

.filter-icon {
	font-size: 32rpx;
}

.function-menu {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 15rpx;
	padding: 20rpx;
	background: #FFFFFF;
	margin: 0 0 20rpx 0;
}

.menu-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	padding: 15rpx;
	border-radius: 10rpx;
	background: #F5F5F5;
	transition: all 0.3s ease;
}

.menu-item:active {
	background: #E8E8E8;
	transform: scale(0.95);
}

.menu-icon {
	font-size: 48rpx;
}

.menu-text {
	font-size: 22rpx;
	color: #333333;
	text-align: center;
}

.section {
	margin: 0 20rpx 20rpx 20rpx;
	background: #FFFFFF;
	border-radius: 10rpx;
	padding: 20rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.section-more {
	font-size: 24rpx;
	color: #FA541C;
}

.routes-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.route-card {
	border: 1rpx solid #EEEEEE;
	border-radius: 10rpx;
	overflow: hidden;
	display: flex;
	height: 200rpx;
	background: #FFFFFF;
	transition: all 0.3s ease;
}

.route-card:active {
	box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	transform: translateY(-2rpx);
}

.route-image {
	width: 200rpx;
	height: 200rpx;
	flex-shrink: 0;
}

.route-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 15rpx;
}

.route-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 10rpx;
}

.route-tags {
	display: flex;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.route-tag {
	background: #F0F0F0;
	color: #666666;
	font-size: 22rpx;
	padding: 5rpx 10rpx;
	border-radius: 5rpx;
}

.route-stats {
	display: flex;
	gap: 20rpx;
	font-size: 22rpx;
	color: #999999;
}

.route-stat {
	display: flex;
	align-items: center;
}

.topics-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.topic-card {
	padding: 15rpx;
	background: #F9F9F9;
	border-radius: 10rpx;
	border-left: 4rpx solid #FA541C;
	transition: all 0.3s ease;
}

.topic-card:active {
	background: #F0F0F0;
	transform: translateX(2rpx);
}

.topic-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8rpx;
	display: block;
}

.topic-desc {
	font-size: 24rpx;
	color: #666666;
	margin-bottom: 10rpx;
	display: block;
	line-height: 1.4;
}

.topic-footer {
	display: flex;
	gap: 20rpx;
	font-size: 22rpx;
	color: #999999;
}

.topic-count {
	display: flex;
	align-items: center;
}

.topic-likes {
	display: flex;
	align-items: center;
}

.progress-card {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 15rpx;
	background: linear-gradient(135deg, #FA541C 0%, #FF8C42 100%);
	padding: 20rpx;
	border-radius: 10rpx;
	color: #FFFFFF;
	text-align: center;
}

.progress-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
}

.progress-label {
	font-size: 24rpx;
	opacity: 0.9;
}

.progress-value {
	font-size: 36rpx;
	font-weight: bold;
}
</style>
