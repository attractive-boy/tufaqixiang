<template>
	<view class="tabbar-root">
		<view class="tabbar-spacer"></view>
		<view class="tabbar">
			<view
				v-for="item in items"
				:key="item.path"
				class="tab-item"
				:class="{ active: currentPath === item.path }"
				@tap="toTab(item)"
			>
				<image class="tab-icon" :src="currentPath === item.path ? item.activeIcon : item.icon" mode="aspectFit"></image>
				<text class="tab-text">{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			items: [
				{
					path: '/pages/index/index',
					text: '首页',
					icon: '/static/tabbar/home.svg',
					activeIcon: '/static/tabbar/home-active.svg'
				},
				{
					path: '/pages/forum/forum',
					text: '论坛',
					icon: '/static/tabbar/forum.svg',
					activeIcon: '/static/tabbar/forum-active.svg'
				},
				{
					path: '/pages/mine/mine',
					text: '我的',
					icon: '/static/tabbar/mine.svg',
					activeIcon: '/static/tabbar/mine-active.svg'
				}
			]
		};
	},
	computed: {
		currentPath() {
			const pages = getCurrentPages();
			const current = pages[pages.length - 1];
			return current ? `/${current.route}` : '';
		}
	},
	methods: {
		toTab(item) {
			if (this.currentPath === item.path) return;
			uni.switchTab({ url: item.path });
		}
	}
};
</script>

<style scoped>
.tabbar-root {
	width: 100%;
}

.tabbar-spacer {
	height: 110rpx;
}

.tabbar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 10rpx 24rpx 18rpx;
	background: rgba(255, 249, 236, 0.98);
	border-top: 2rpx solid #F0D2A6;
	display: flex;
	justify-content: space-around;
	align-items: center;
	box-shadow: 0 -10rpx 20rpx rgba(120, 70, 28, 0.12);
}

.tab-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6rpx;
	color: #B68C62;
	font-size: 22rpx;
}

.tab-item.active {
	color: #E39B4E;
}

.tab-icon {
	width: 44rpx;
	height: 44rpx;
}

.tab-text {
	font-size: 22rpx;
}
</style>
