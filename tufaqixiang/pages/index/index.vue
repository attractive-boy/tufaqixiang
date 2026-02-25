<template>
	<view class="home">
		<view class="hero">
			<swiper class="hero-swiper" :autoplay="true" :interval="3500" :duration="600" :circular="true">
				<swiper-item class="hero-slide" v-for="(item, index) in heroImages" :key="index">
					<image class="hero-image" :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="hero-overlay">
				<view class="hero-top">
					<text class="brand">兔发骑想</text>
					<view class="mini-pill">
						<text>点击 ··· 添加我的小程序</text>
					</view>
				</view>
				<view class="hero-text">
					<text class="hero-title">春日去北海</text>
					<text class="hero-sub">让我们骑着车去旅行</text>
				</view>
			</view>
		</view>

		<view class="card-board">
			<view class="board-header">
				<view class="bike-mark">
					<text class="bike-icon">🚲</text>
				</view>
				<text class="board-tip">自由骑行 · 给“兔”新版本</text>
				<!-- <view class="map-entry" @tap="toMapPage">
					<text>地图服务</text>
				</view> -->
			</view>
			<view class="action-grid">
				<view class="action-card action-drama" @tap="toCreateRoute">
					<text class="action-title">剧情探索</text>
					<text class="action-sub">路线故事随心走</text>
				</view>
				<view class="action-card action-ai" @tap="toAIRoute">
					<text class="action-title">AI
						<text class="action-title-break">线路定制</text>
					</text>
					<text class="action-sub">一键生成专属路线</text>
					<view class="flower">
						<text>✿</text>
						<text>✿</text>
					</view>
				</view>
			</view>
		</view>

		<view class="section">
			<view class="section-header">
				<text class="section-title">北京地标评分 &gt;</text>
				<text class="section-more" @tap="toMoreRoutes">更多</text>
			</view>
			<view class="landmark-grid">
				<view class="landmark-card" v-for="(item, index) in landmarks" :key="index" @tap="toRouteDetail(item)">
					<image class="landmark-image" :src="item.image" mode="aspectFill"></image>
					<view class="landmark-info">
						<view class="landmark-main">
							<text class="landmark-name">{{ item.name }}</text>
							<text class="landmark-score">⭐ {{ item.rating }}</text>
						</view>
						<view class="landmark-meta" v-if="item.commentCount">
							<text class="landmark-comments">{{ item.commentCount }}条评论</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="section section-plain">
			<view class="section-header">
				<text class="section-title">精选路线</text>
				<text class="section-more" @tap="toMoreRoutes">更多</text>
			</view>
			<scroll-view class="route-scroll" scroll-x="true" show-scrollbar="false">
				<view class="route-strip">
					<view class="route-chip" v-for="(route, index) in recommendRoutes" :key="index" @tap="toRouteDetail(route)">
						<image class="route-chip-image" :src="route.image" mode="aspectFill"></image>
						<text class="route-chip-name">{{ route.name }}</text>
						<text class="route-chip-meta">{{ route.distance }} km · {{ route.difficulty }}</text>
					</view>
				</view>
			</scroll-view>
		</view> -->
	</view>
</template>

<script>
import { getBeijingLandmarksByNames } from '@/utils/ctrip-api.js';

export default {
	data() {
		return {
			heroImages: [],
			landmarks: [],
			landmarksLoading: false,
			recommendRoutes: [
				{
					id: 1,
					name: '颐和园环湖骑行',
					distance: 15,
					difficulty: '简单',
					image: '/static/route1.png'
				},
				{
					id: 2,
					name: '北京奥森公园',
					distance: 22,
					difficulty: '中等',
					image: '/static/route2.png'
				},
				{
					id: 3,
					name: '长城脚下骑行',
					distance: 35,
					difficulty: '困难',
					image: '/static/route3.png'
				}
			]
		}
	},
	onLoad() {
		console.log('首页加载');
		this.refreshHeroImages();
		this.loadBeijingLandmarks();
	},
	methods: {
		refreshHeroImages() {
			this.heroImages = ['/static/WechatIMG24.jpg'];
		},
		// 加载北京地标数据
		async loadBeijingLandmarks() {
			if (this.landmarksLoading) return;
			
			this.landmarksLoading = true;
			uni.showLoading({ title: '加载地标数据...' });
			
			try {
				const targetNames = ['北海', '地坛', '颐和园', '什刹海', '景山', '天坛'];
				const landmarks = await getBeijingLandmarksByNames(targetNames);
				console.log('原始地标数据:', landmarks);
				this.landmarks = landmarks.map((item, index) => ({
					id: item.id,
					name: item.name,
					rating: item.rating.toFixed(1), // 格式化评分为一位小数
					image: item.image || '/static/banner1.jpg', // 使用真实图片或默认图片
					commentCount: item.commentCount,
					tags: item.tags.slice(0, 3).join(' · '),
					latitude: item.latitude,
					longitude: item.longitude
				}));
				console.log('地标数据加载成功:', this.landmarks);
			} catch (error) {
				console.error('获取地标数据失败:', error);
				uni.showToast({ 
					title: '加载地标数据失败', 
					icon: 'none' 
				});
				// 如果API失败，使用默认数据
				this.landmarks = [
					{ id: 1, name: '北海', rating: '4.9', image: '/static/banner1.jpg' },
					{ id: 2, name: '地坛', rating: '4.8', image: '/static/route2.png' },
					{ id: 3, name: '颐和园', rating: '4.8', image: '/static/route3.png' },
					{ id: 4, name: '什刹海', rating: '4.7', image: '/static/route1.png' },
					{ id: 5, name: '景山', rating: '4.7', image: '/static/route2.png' },
					{ id: 6, name: '天坛', rating: '4.6', image: '/static/route3.png' }
				];
			} finally {
				this.landmarksLoading = false;
				uni.hideLoading();
			}
		},
		toMapPage() {
			uni.navigateTo({ url: '/pages/map/map' })
		},
		toCreateRoute() {
			uni.showToast({ title: '剧情探索功能开发中', icon: 'none' });
		},
		toAIRoute() {
			uni.showToast({ title: 'AI线路定制功能开发中', icon: 'none' });
		},
		toMoreRoutes() {
			uni.showToast({ title: '更多路线功能开发中', icon: 'none' });
		},
		toRouteDetail(route) {
			uni.showToast({ title: `查看: ${route.name}`, icon: 'none' });
		}
	}
}
</script>

<style scoped>
.home {
	--brand-cream: #FFF3E6;
	--brand-orange: #F39A43;
	--brand-amber: #FFC97D;
	--brand-rose: #F7B7A3;
	--brand-ink: #4B3A2F;
	--brand-ink-soft: #78685C;
	min-height: 100vh;
	background: linear-gradient(180deg, #FCE4D7 0%, #FFF4E8 40%, #FFF9F2 100%);
	font-family: "STKaiti", "KaiTi", "Songti SC", "Georgia", serif;
	color: var(--brand-ink);
	padding-bottom: 30rpx;
}

.hero {
	position: relative;
	width: 100%;
	height: 360rpx;
	overflow: hidden;
	border-bottom-left-radius: 26rpx;
	border-bottom-right-radius: 26rpx;
}

.hero-swiper {
	width: 100%;
	height: 100%;
}

.hero-slide {
	width: 100%;
	height: 100%;
}

.hero-image {
	width: 100%;
	height: 100%;
	transform: scale(1.02);
	animation: heroZoom 18s ease-in-out infinite;
}

.hero-overlay {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	padding: 24rpx 24rpx 30rpx;
	background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.05) 35%, rgba(255, 255, 255, 0.6) 100%);
	color: #FFFFFF;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 2;
}

.hero-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.brand {
	font-size: 34rpx;
	font-weight: 600;
	letter-spacing: 2rpx;
}

.mini-pill {
	background: rgba(138, 75, 40, 0.75);
	padding: 10rpx 18rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
}

.hero-text {
	color: #FFFFFF;
	text-shadow: 0 4rpx 14rpx rgba(0, 0, 0, 0.25);
}

.hero-title {
	font-size: 42rpx;
	font-weight: 600;
	letter-spacing: 2rpx;
}

.hero-sub {
	font-size: 26rpx;
	margin-top: 8rpx;
	color: rgba(255, 255, 255, 0.95);
}

.card-board {
	margin: -60rpx 22rpx 24rpx;
	padding: 24rpx;
	background: var(--brand-cream);
	border-radius: 24rpx;
	box-shadow: 0 18rpx 40rpx rgba(120, 72, 36, 0.15);
	border: 2rpx solid rgba(243, 154, 67, 0.2);
	animation: floatIn 0.8s ease;
}

.board-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18rpx;
}

.bike-mark {
	width: 84rpx;
	height: 84rpx;
	border-radius: 50%;
	background: #FFF;
	border: 2rpx solid rgba(243, 154, 67, 0.35);
	display: flex;
	align-items: center;
	justify-content: center;
}

.bike-icon {
	font-size: 40rpx;
}

.board-tip {
	font-size: 22rpx;
	color: var(--brand-ink-soft);
	flex: 1;
	margin-left: 12rpx;
}

.map-entry {
	background: #FFFFFF;
	border: 1rpx solid rgba(243, 154, 67, 0.35);
	border-radius: 999rpx;
	padding: 8rpx 16rpx;
	font-size: 20rpx;
	color: #A56433;
}

.action-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16rpx;
}

.action-card {
	min-height: 220rpx;
	border-radius: 12rpx;
	padding: 20rpx 22rpx;
	color: #FFFFFF;
	position: relative;
	overflow: hidden;
	border: 2rpx solid rgba(255, 255, 255, 0.7);
	box-shadow: none;
	transition: transform 0.25s ease;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.action-card:active {
	transform: translateY(4rpx);
}

.action-drama {
	background: linear-gradient(180deg, #F7A13F 0%, #F28A2D 100%);
}

.action-ai {
	background: linear-gradient(180deg, #F8C9A3 0%, #F3B894 100%);
	color: #FFFFFF;
}

.action-title {
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1.15;
}

.action-title-break {
	display: block;
}

.action-sub {
	margin-top: 6rpx;
	font-size: 20rpx;
	opacity: 0.9;
}

.flower {
	position: absolute;
	right: 12rpx;
	bottom: 12rpx;
	font-size: 26rpx;
	opacity: 0.6;
}

.section {
	margin: 0 22rpx 24rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 22rpx;
	box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.04);
}

.section-plain {
	background: transparent;
	box-shadow: none;
	padding: 0 8rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
}

.section-more {
	font-size: 22rpx;
	color: #E1873E;
}

.landmark-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16rpx;
}

.landmark-card {
	background: #FFF8F1;
	border-radius: 16rpx;
	overflow: hidden;
	border: 1rpx solid rgba(243, 154, 67, 0.18);
	transition: transform 0.25s ease;
}

.landmark-card:active {
	transform: translateY(4rpx);
}

.landmark-image {
	width: 100%;
	height: 160rpx;
}

.landmark-info {
	padding: 14rpx;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.landmark-main {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.landmark-name {
	font-size: 24rpx;
	color: var(--brand-ink);
	font-weight: 600;
	max-width: 140rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.landmark-score {
	font-size: 22rpx;
	color: #D67E3A;
	font-weight: 600;
}

.landmark-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.landmark-comments {
	font-size: 20rpx;
	color: var(--brand-ink-soft);
}

.route-scroll {
	white-space: nowrap;
	width: 100%;
	padding-bottom: 10rpx;
}

.route-strip {
	display: flex;
	gap: 16rpx;
	padding-left: 14rpx;
}

.route-chip {
	width: 240rpx;
	background: #FFFFFF;
	border-radius: 16rpx;
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
	overflow: hidden;
	border: 1rpx solid rgba(243, 154, 67, 0.15);
}

.route-chip-image {
	width: 100%;
	height: 150rpx;
}

.route-chip-name {
	font-size: 24rpx;
	font-weight: 600;
	padding: 10rpx 12rpx 4rpx;
}

.route-chip-meta {
	font-size: 20rpx;
	color: var(--brand-ink-soft);
	padding: 0 12rpx 12rpx;
}

@keyframes heroZoom {
	0%, 100% {
		transform: scale(1.02);
	}
	50% {
		transform: scale(1.08);
	}
}

@keyframes floatIn {
	from {
		opacity: 0;
		transform: translateY(18rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
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
