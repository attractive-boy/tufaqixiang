<template>
	<view class="map-page">
		<map
			id="amap"
			class="map-view"
			:longitude="location.longitude"
			:latitude="location.latitude"
			:markers="markers"
			:scale="14"
			show-location
		></map>

		<view class="map-panel">
			<view class="panel-header">
				<text class="panel-title">当前定位</text>
				<text class="panel-action" @tap="refreshLocation">刷新</text>
			</view>
			<view class="panel-content">
				<text class="panel-name">{{ location.name || '定位中...' }}</text>
				<text class="panel-address">{{ location.address || '获取地址信息中' }}</text>
			</view>
		</view>

		<view class="poi-section">
			<view class="panel-header">
				<text class="panel-title">附近骑行点</text>
			</view>
			<view class="poi-list">
				<view class="poi-item" v-for="(poi, index) in pois" :key="index">
					<text class="poi-name">{{ poi.name }}</text>
					<text class="poi-address">{{ poi.address }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import AMapWX from '@/utils/amap-wx.130.js'

export default {
	data() {
		return {
			amap: null,
			location: {
				latitude: 39.916527,
				longitude: 116.397128,
				name: '北京',
				address: ''
			},
			markers: [],
			pois: []
		}
	},
	onLoad() {
		this.amap = new AMapWX({ key: 'b288db5e2841b2514d833020ff718fa8' })
		this.refreshLocation()
	},
	methods: {
		refreshLocation() {
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					const latitude = res.latitude
					const longitude = res.longitude
					this.location.latitude = latitude
					this.location.longitude = longitude
					this.updateMarkers()
					this.fetchRegeo()
					this.fetchPoiAround()
				},
				fail: () => {
					uni.showToast({ title: '定位失败，请检查权限', icon: 'none' })
				}
			})
		},
		updateMarkers() {
			this.markers = [
				{
					id: 1,
					latitude: this.location.latitude,
					longitude: this.location.longitude,
					iconPath: '/static/logo.png',
					width: 32,
					height: 32,
					title: '当前位置'
				}
			]
		},
		fetchRegeo() {
			if (!this.amap) {
				return
			}
			this.amap.getRegeo({
				location: `${this.location.longitude},${this.location.latitude}`,
				success: (data) => {
					const item = data && data[0] ? data[0] : null
					if (item) {
						this.location.name = item.name || '当前位置'
						this.location.address = item.desc || ''
					}
				}
			})
		},
		fetchPoiAround() {
			if (!this.amap) {
				return
			}
			this.amap.getPoiAround({
				location: `${this.location.longitude},${this.location.latitude}`,
				success: (data) => {
					const pois = data && data[0] && data[0].poisData ? data[0].poisData : []
					this.pois = pois.slice(0, 6).map((poi) => ({
						name: poi.name,
						address: poi.address
					}))
				}
			})
		}
	}
}
</script>

<style scoped>
.map-page {
	min-height: 100vh;
	background: #F6F1E9;
	display: flex;
	flex-direction: column;
}

.map-view {
	width: 100%;
	height: 500rpx;
}

.map-panel {
	margin: -50rpx 20rpx 20rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx;
	box-shadow: 0 16rpx 30rpx rgba(0, 0, 0, 0.08);
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.panel-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #4B3A2F;
}

.panel-action {
	font-size: 22rpx;
	color: #E1873E;
}

.panel-content {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.panel-name {
	font-size: 26rpx;
	font-weight: 600;
	color: #4B3A2F;
}

.panel-address {
	font-size: 22rpx;
	color: #78685C;
}

.poi-section {
	margin: 0 20rpx 20rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx;
	box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.05);
}

.poi-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.poi-item {
	padding-bottom: 12rpx;
	border-bottom: 1rpx solid #F0E6DA;
}

.poi-item:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.poi-name {
	font-size: 24rpx;
	color: #4B3A2F;
	font-weight: 600;
}

.poi-address {
	font-size: 22rpx;
	color: #8B7B6F;
}
</style>
