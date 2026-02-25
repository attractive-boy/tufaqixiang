<template>
	<view class="ai-page">
		<view class="hero">
			<view class="hero-top">
				<view class="brand-pill">
					<text>点击 ··· 添加我的小程序</text>
				</view>
			</view>

			<view class="search-panel">
				<view class="search-btn" @tap="onSearch">搜索</view>
				<view class="search-input-wrap">
					<input
						class="search-input"
						type="text"
						v-model="keyword"
						placeholder="输入搜索内容"
						confirm-type="search"
						@confirm="onSearch"
					/>
					<view class="clear-btn" v-if="keyword" @tap="clearKeyword">清空</view>
				</view>
			</view>

			<view class="chip-row">
				<view
					v-for="(item, index) in categories"
					:key="item.id"
					class="chip"
					:class="{ active: activeIndex === index }"
					@tap="setCategory(index)"
				>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>

		<view class="card-grid">
			<view class="spot-card" v-for="spot in filteredSpots" :key="spot.id" @tap="toSpotDetail(spot)">
				<image class="spot-image" :src="spot.image" mode="aspectFill"></image>
				<view class="spot-name">
					<text class="spot-dot">•</text>
					<text>{{ spot.name }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAttractionsList } from '@/utils/ctrip-api.js';

export default {
	data() {
		return {
			keyword: '',
			activeIndex: 0,
			categories: [
				{ id: 1, name: '博物馆', keywords: ['博物馆', '博物'] },
				{ id: 2, name: '公园', keywords: ['公园', '园'] },
				{ id: 3, name: '商业体', keywords: ['商场', '商业', '中心', '广场'] },
				{ id: 4, name: '古建筑', keywords: ['古', '宫', '寺', '坛', '庙', '楼', '塔', '府'] },
				{ id: 5, name: '胡同', keywords: ['胡同', '巷'] }
			],
			spots: [],
			baseSpots: [],
			loading: false
		}
	},
	onLoad() {
		this.loadSpots();
	},
	computed: {
		filteredSpots() {
			const active = this.categories[this.activeIndex];
			const keyword = this.keyword.trim();
			return this.spots.filter((spot) => {
				const categoryMatch = active ? this.matchesCategory(spot, active) : true;
				const keywordMatch = keyword ? this.matchesKeyword(spot, keyword) : true;
				return categoryMatch && keywordMatch;
			});
		}
	},
	methods: {
		async loadSpots() {
			if (this.loading) return;
			this.loading = true;
			uni.showLoading({ title: '加载中...' });
			try {
				let list = [];
				for (let i = 1; i <= 10; i++) {
					const res = await getAttractionsList({ index: i, count: 40, sortType: 1 });
					list = list.concat(res);
				}
				const formatted = list.map((item, index) => this.formatSpot(item, index));
				this.baseSpots = formatted;
				this.spots = formatted;
			} catch (error) {
				console.error('加载景点失败:', error);
				uni.showToast({ title: '加载景点失败', icon: 'none' });
				this.baseSpots = [
					{ id: 'fallback-1', name: '北海公园', image: '/static/banner1.jpg', tags: ['公园'] },
					{ id: 'fallback-2', name: '玉渊潭公园', image: '/static/route2.png', tags: ['公园'] },
					{ id: 'fallback-3', name: '故宫博物院', image: '/static/route3.png', tags: ['博物馆'] },
					{ id: 'fallback-4', name: '南锣鼓巷', image: '/static/route1.png', tags: ['胡同'] }
				];
				this.spots = this.baseSpots;
			} finally {
				this.loading = false;
				uni.hideLoading();
			}
		},
		formatSpot(item, index) {
			return {
				id: item.id || item.poiId || `poi-${index}`,
				name: item.name || '未知景点',
				image: item.image || '/static/banner1.jpg',
				tags: item.tags || [],
				rating: item.rating || 0,
				commentCount: item.commentCount || 0,
				latitude: item.latitude || 0,
				longitude: item.longitude || 0
			};
		},
		matchesCategory(spot, category) {
			if (!category || !category.keywords || category.keywords.length === 0) return true;
			const haystack = `${spot.name} ${(spot.tags || []).join(' ')}`;
			return category.keywords.some((key) => haystack.includes(key));
		},
		matchesKeyword(spot, keyword) {
			const haystack = `${spot.name} ${(spot.tags || []).join(' ')}`;
			return haystack.includes(keyword);
		},
		setCategory(index) {
			this.activeIndex = index;
		},
		onSearch() {
			this.keyword = this.keyword.trim();
			const candidates = this.filteredSpots.length ? this.filteredSpots : this.baseSpots;
			if (candidates.length === 0) {
				uni.showToast({ title: '暂无可用景点', icon: 'none' });
				return;
			}
			uni.setStorageSync('aiRouteAllSpots', this.baseSpots);
			uni.setStorageSync('aiRouteCandidates', candidates);
			const categoryName = this.categories[this.activeIndex]?.name || '';
			const keyword = encodeURIComponent(this.keyword || '');
			const category = encodeURIComponent(categoryName);
			uni.navigateTo({ url: `/pages/ai/route?keyword=${keyword}&category=${category}` });
		},
		clearKeyword() {
			this.keyword = '';
		},
		toSpotDetail(spot) {
			uni.showToast({ title: `查看: ${spot.name}`, icon: 'none' });
		}
	}
}
</script>

<style scoped>
.ai-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #F4A94D 0%, #F7C676 45%, #FBE2B2 100%);
	padding-bottom: 40rpx;
	font-family: "STKaiti", "KaiTi", "Songti SC", "Georgia", serif;
	color: #4B3A2F;
}

.hero {
	padding: 24rpx 24rpx 12rpx;
}

.hero-top {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 20rpx;
}

.brand-pill {
	background: rgba(120, 60, 20, 0.78);
	color: #FFFFFF;
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
}

.search-panel {
	display: flex;
	align-items: center;
	background: #FFF4E2;
	border-radius: 14rpx;
	padding: 10rpx;
	box-shadow: 0 10rpx 20rpx rgba(126, 77, 34, 0.18);
}

.search-btn {
	width: 120rpx;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	background: #F0A346;
	color: #FFFFFF;
	border-radius: 10rpx;
	font-size: 26rpx;
	font-weight: 600;
}

.search-input-wrap {
	flex: 1;
	display: flex;
	align-items: center;
	margin-left: 12rpx;
	background: #FFFFFF;
	border-radius: 10rpx;
	border: 2rpx solid #E6B16B;
	padding: 0 10rpx;
	min-height: 70rpx;
}

.search-input {
	flex: 1;
	padding: 0 10rpx;
	font-size: 26rpx;
	color: #6B5647;
}

.clear-btn {
	padding: 0 8rpx;
	font-size: 22rpx;
	color: #B8773E;
}

.chip-row {
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
	margin-top: 16rpx;
}

.chip {
	padding: 8rpx 18rpx;
	border-radius: 10rpx;
	background: rgba(255, 255, 255, 0.88);
	color: #8B6A4E;
	font-size: 22rpx;
	border: 2rpx solid #F0D0A2;
	box-shadow: 0 8rpx 16rpx rgba(120, 70, 28, 0.08);
}

.chip.active {
	background: #D99A5C;
	color: #FFFFFF;
	border-color: #D99A5C;
}

.card-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16rpx;
	padding: 20rpx 24rpx 0;
}

.spot-card {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 14rpx;
	padding: 12rpx 12rpx 14rpx;
	border: 2rpx solid #F1D2A8;
	box-shadow: 0 10rpx 18rpx rgba(117, 66, 23, 0.12);
}

.spot-image {
	width: 100%;
	height: 180rpx;
	border-radius: 12rpx;
}

.spot-name {
	display: flex;
	align-items: center;
	gap: 6rpx;
	margin-top: 10rpx;
	font-size: 24rpx;
	color: #4B3A2F;
	font-weight: 600;
}

.spot-dot {
	color: #9C6B3C;
}
</style>
