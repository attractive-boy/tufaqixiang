<template>
	<view class="route-page">
		<view class="hero">
			<view class="hero-top">
				<view class="brand-pill">
					<text>点击 ··· 添加我的小程序</text>
					<text class="pill-close">×</text>
				</view>
			</view>

			<view class="tags-panel">
				<view class="category-chip" v-if="categoryName">{{ categoryName }}</view>
				<view class="name-wrap">
					<view class="name-chip" v-for="spot in spots" :key="spot.id">{{ spot.name }}</view>
				</view>
			</view>

			<text class="hint-text">点击展开</text>
		</view>

		<view class="map-card">
			<map
				id="aiRouteMap"
				class="map-view"
				:longitude="mapCenter.longitude"
				:latitude="mapCenter.latitude"
				:markers="markers"
				:polyline="polylines"
				:include-points="includePoints"
				:scale="13"
				show-location
			></map>
		</view>

		<view class="action-panel">
			<view class="action-btn primary" @tap="startRide">开始骑行</view>
			<view class="action-btn" @tap="regenerateRoute">重新生成</view>
			<!-- <image class="mascot" src="/static/logo.png" mode="aspectFit"></image> -->
		</view>
	</view>
</template>

<script>
const ROUTE_POINT_COUNT = 3;
const AMAP_WEB_API_KEY = 'f41daeee288fc6613e04e66d07df37a8';

export default {
	data() {
		return {
			keyword: '',
			categoryName: '',
			candidates: [],
			allSpots: [],
			spots: [],
			mapCenter: {
				latitude: 39.908722,
				longitude: 116.397499
			},
			markers: [],
			polylines: [],
			includePoints: [],
			loading: false
		}
	},
	onLoad(options) {
		this.keyword = decodeURIComponent(options.keyword || '');
		this.categoryName = decodeURIComponent(options.category || '');
		const stored = uni.getStorageSync('aiRouteCandidates');
		this.candidates = Array.isArray(stored) ? stored : [];
		this.allSpots = Array.isArray(uni.getStorageSync('aiRouteAllSpots'))
			? uni.getStorageSync('aiRouteAllSpots')
			: [];
		this.generateRoute();
	},
	methods: {
		async generateRoute() {
			if (this.loading) return;
			this.loading = true;
			uni.showLoading({ title: '生成路线中...' });
			try {
				await this.ensureCandidates();
				const planned = this.pickRouteSpots();
				console.log('[route] planned spots:', planned.map((spot) => spot.name));
				this.spots = planned;
				await this.buildRoute();
			} finally {
				this.loading = false;
				uni.hideLoading();
			}
		},
		async ensureCandidates() {
			if (this.candidates.length > 0) return;
			try {
				const location = await this.getCurrentLocation();
				this.mapCenter = location;
				const nearby = await this.fetchNearbyLandmarks(location);
				this.candidates = nearby;
				if (this.allSpots.length === 0) {
					this.allSpots = nearby;
				}
			} catch (error) {
				console.error('获取附近地标失败:', error);
				uni.showToast({ title: '获取附近地标失败', icon: 'none' });
			}
		},
		getCurrentLocation() {
			return new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						resolve({ latitude: res.latitude, longitude: res.longitude });
					},
					fail: (err) => reject(err)
				});
			});
		},
		fetchNearbyLandmarks(location) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: 'https://restapi.amap.com/v3/place/around',
					method: 'GET',
					data: {
						key: AMAP_WEB_API_KEY,
						location: `${location.longitude},${location.latitude}`,
						radius: 4000,
						keywords: '地标|景点|公园|博物馆|古建筑',
						offset: 20,
						page: 1,
						extensions: 'base'
					},
					success: (res) => {
						const pois = res.data?.pois || [];
						const formatted = pois
							.map((poi) => this.formatPoi(poi))
							.filter((poi) => poi.latitude && poi.longitude);
						resolve(formatted);
					},
					fail: (err) => reject(err)
				});
			});
		},
		formatPoi(poi) {
			const location = (poi.location || '').split(',');
			return {
				id: poi.id || poi.uid || poi.name,
				name: poi.name || '未知地标',
				image: '/static/banner1.jpg',
				tags: [poi.type].filter(Boolean),
				latitude: Number(location[1]) || 0,
				longitude: Number(location[0]) || 0
			};
		},
		pickRouteSpots() {
			const keyword = (this.keyword || '').trim();
			const rawPool = this.allSpots.length > 0 ? this.allSpots : this.candidates;
			if (!rawPool || rawPool.length === 0) {
				return this.pickRandomSpots(this.candidates, ROUTE_POINT_COUNT);
			}
			const pool = rawPool.filter((spot) => spot.latitude && spot.longitude);
			if (pool.length === 0) {
				return this.pickRandomSpots(rawPool, ROUTE_POINT_COUNT);
			}
			let selected = [];
			const baseSpot = keyword
				? pool.find((spot) => spot.name && spot.name.includes(keyword))
				: null;
			if (baseSpot) {
				this.mapCenter = { latitude: baseSpot.latitude, longitude: baseSpot.longitude };
				const filtered = pool.filter((spot) => spot.id !== baseSpot.id);
				const near = this.pickNearbySpots(filtered, this.mapCenter, ROUTE_POINT_COUNT - 1);
				selected = [baseSpot, ...near];
			} else {
				selected = this.pickNearbySpots(pool, this.mapCenter, ROUTE_POINT_COUNT);
			}
			return this.fillRandomSpots(selected, pool, ROUTE_POINT_COUNT);
		},
		pickNearbySpots(list, center, count = ROUTE_POINT_COUNT) {
			const candidates = (list || [])
				.filter((spot) => spot.latitude && spot.longitude);
			if (candidates.length === 0) {
				return this.pickRandomSpots(list, count);
			}
			const base = center || this.mapCenter;
			const withDistance = candidates.map((spot) => ({
				spot,
				distance: this.calcDistance(base, spot)
			}));
			withDistance.sort((a, b) => a.distance - b.distance);
			const poolSize = Math.min(
				withDistance.length,
				Math.max(count * 3, count + 4)
			);
			const pool = withDistance.slice(0, poolSize).map((item) => item.spot);
			const shuffled = this.shuffleSpots(pool);
			return shuffled.slice(0, Math.min(count, shuffled.length));
		},
		calcDistance(a, b) {
			if (!a || !b) return Number.MAX_VALUE;
			const toRad = (value) => (value * Math.PI) / 180;
			const lat1 = toRad(Number(a.latitude));
			const lat2 = toRad(Number(b.latitude));
			const dLat = lat2 - lat1;
			const dLon = toRad(Number(b.longitude) - Number(a.longitude));
			const sinLat = Math.sin(dLat / 2);
			const sinLon = Math.sin(dLon / 2);
			const calc = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
			const radius = 6371;
			return 2 * radius * Math.asin(Math.min(1, Math.sqrt(calc)));
		},
		shuffleSpots(list) {
			const pool = list.slice();
			for (let i = pool.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[pool[i], pool[j]] = [pool[j], pool[i]];
			}
			return pool;
		},
		pickRandomSpots(list, count) {
			const pool = (list || []).slice();
			for (let i = pool.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[pool[i], pool[j]] = [pool[j], pool[i]];
			}
			return pool.slice(0, count);
		},
		fillRandomSpots(selected, all, count) {
			const picked = selected.slice();
			const usedIds = new Set(picked.map((spot) => spot.id));
			const pool = (all || []).filter((spot) => !usedIds.has(spot.id));
			const shuffled = this.shuffleSpots(pool);
			return picked.concat(shuffled.slice(0, Math.max(0, count - picked.length)));
		},
		async buildRoute() {
			const points = this.extractRoutePoints();
			console.log('[route] points count:', points.length, points);
			this.mapCenter = points[0] || this.mapCenter;
			this.includePoints = points;
			this.markers = points.map((point, index) => ({
				id: index + 1,
				latitude: point.latitude,
				longitude: point.longitude,
				iconPath: '/static/icons/map-pin.svg',
				width: 36,
				height: 36,
				callout: {
					content: this.spots[index]?.name || `站点${index + 1}`,
					color: '#4B3A2F',
					fontSize: 12,
					borderRadius: 6,
					padding: 4,
					display: 'ALWAYS'
				}
			}));
			if (points.length >= 2) {
				await this.planRidingRoute(points);
				return;
			}
			this.polylines = [
				{
					points,
					color: '#3B7AD9',
					width: 6,
					dottedLine: false
				}
			];
		},
		async planRidingRoute(points) {
			const segments = [];
			for (let i = 0; i < points.length - 1; i++) {
				const segment = await this.fetchRidingSegment(points[i], points[i + 1]);
				console.log('[route] segment', i, 'points:', segment.length);
				if (segment.length > 0) {
					segments.push(...segment);
				}
			}
			console.log('[route] total polyline points:', segments.length);
			if (segments.length === 0) {
				this.polylines = [
					{
						points,
						color: '#3B7AD9',
						width: 6,
						dottedLine: false
					}
				];
				return;
			}
			this.polylines = [
				{
					points: segments,
					color: '#3B7AD9',
					width: 6,
					dottedLine: false
				}
			];
		},
		fetchRidingSegment(originPoint, destPoint) {
			return new Promise((resolve) => {
				if (!originPoint || !destPoint) {
					resolve([]);
					return;
				}
				uni.request({
					url: 'https://restapi.amap.com/v4/direction/bicycling',
					method: 'GET',
					data: {
						origin: `${originPoint.longitude},${originPoint.latitude}`,
						destination: `${destPoint.longitude},${destPoint.latitude}`,
						key: AMAP_WEB_API_KEY
					},
					success: (res) => {
						console.log('[route] riding api status:', res.statusCode, res.data?.errmsg || res.data?.errcode || 'ok');
						const steps = res.data?.data?.paths?.[0]?.steps || [];
						resolve(this.buildPolylineFromSteps(steps));
					},
					fail: (err) => {
						console.error('[route] riding api failed:', err);
						resolve([]);
					}
				});
			});
		},
		buildPolylineFromSteps(steps) {
			if (!steps || steps.length === 0) return [];
			const points = [];
			steps.forEach((step) => {
				const lines = step.polyline ? step.polyline.split(';') : [];
				lines.forEach((line) => {
					const [lng, lat] = line.split(',');
					if (lng && lat) {
						points.push({ longitude: Number(lng), latitude: Number(lat) });
					}
				});
			});
			return points;
		},
		extractRoutePoints() {
			const points = this.spots
				.filter((spot) => spot.latitude && spot.longitude)
				.map((spot) => ({ latitude: spot.latitude, longitude: spot.longitude }));
			if (points.length >= 2) {
				return points;
			}
			const base = {
				latitude: 39.908722,
				longitude: 116.397499
			};
			return [
				base,
				{ latitude: base.latitude + 0.018, longitude: base.longitude + 0.02 },
				{ latitude: base.latitude - 0.012, longitude: base.longitude - 0.016 }
			];
		},
		regenerateRoute() {
			this.generateRoute();
			uni.showToast({ title: '已重新生成', icon: 'none' });
		},
		startRide() {
			uni.showToast({ title: '开始骑行', icon: 'none' });
		}
	}
}
</script>

<style scoped>
.route-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #F4A94D 0%, #F7C676 45%, #FBE2B2 100%);
	font-family: "STKaiti", "KaiTi", "Songti SC", "Georgia", serif;
	color: #4B3A2F;
}

.hero {
	padding: 24rpx;
}

.hero-top {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 16rpx;
}

.brand-pill {
	display: flex;
	align-items: center;
	gap: 10rpx;
	background: rgba(120, 60, 20, 0.78);
	color: #FFFFFF;
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
}

.pill-close {
	font-size: 24rpx;
}

.tags-panel {
	background: rgba(255, 248, 236, 0.9);
	border-radius: 12rpx;
	padding: 12rpx;
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
	border: 2rpx solid #F0CF9E;
	box-shadow: 0 8rpx 16rpx rgba(117, 66, 23, 0.08);
}

.category-chip {
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	background: #E8B777;
	color: #6B3F1F;
	font-size: 22rpx;
	border: 2rpx solid #D9A86F;
	font-weight: 600;
}

.name-wrap {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.name-chip {
	padding: 8rpx 18rpx;
	border-radius: 8rpx;
	background: #F8E7D0;
	color: #7A5234;
	font-size: 22rpx;
	border: 2rpx solid #E6C59A;
	box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.6);
}

.hint-text {
	display: block;
	text-align: center;
	margin-top: 12rpx;
	color: #D2A162;
	font-size: 22rpx;
}

.map-card {
	margin: 0 24rpx;
	border-radius: 16rpx;
	overflow: hidden;
	border: 2rpx solid #F1D2A8;
	box-shadow: 0 14rpx 24rpx rgba(117, 66, 23, 0.12);
	background: #FFFFFF;
}

.map-view {
	width: 100%;
	height: 520rpx;
}

.action-panel {
	position: relative;
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 26rpx 24rpx 40rpx;
}

.action-btn {
	flex: 1;
	height: 76rpx;
	line-height: 76rpx;
	text-align: center;
	background: #F8E2C5;
	color: #A3622D;
	border-radius: 14rpx;
	font-size: 28rpx;
	font-weight: 600;
	border: 2rpx solid #F0CFA6;
}

.action-btn.primary {
	background: #F3C98A;
	color: #8C4B24;
}

.mascot {
	position: absolute;
	right: 10rpx;
	bottom: 10rpx;
	width: 120rpx;
	height: 120rpx;
	opacity: 0.8;
}
</style>
