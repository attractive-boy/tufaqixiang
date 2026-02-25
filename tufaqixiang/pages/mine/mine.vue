<template>
	<view class="mine-container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<image class="user-avatar" src="/image.png" mode="aspectFill"></image>
			<view class="user-info">
				<text class="user-name">骑行爱好者</text>
				<text class="user-level">Lv. 8 骑行达人</text>
			</view>
			<view class="user-edit" @tap="toEditProfile">
				<text>编辑资料 →</text>
			</view>
		</view>

		<!-- 数据统计 -->
		<view class="stats-section">
			<view class="stat-item">
				<text class="stat-value">1280</text>
				<text class="stat-label">总里程</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">24</text>
				<text class="stat-label">完成路线</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">45</text>
				<text class="stat-label">获赞</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">128</text>
				<text class="stat-label">粉丝</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<!-- 我的骑行 -->
			<view class="menu-group">
				<view class="menu-title">我的骑行</view>
				<view class="menu-item" @tap="toMyRoutes">
					<view class="item-content">
						<text class="item-icon">🗺️</text>
						<text class="item-name">我的路线</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toRecords">
					<view class="item-content">
						<text class="item-icon">📊</text>
						<text class="item-name">骑行记录</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toAchievements">
					<view class="item-content">
						<text class="item-icon">🏆</text>
						<text class="item-name">成就勋章</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
			</view>

			<!-- 社交互动 -->
			<view class="menu-group">
				<view class="menu-title">社交互动</view>
				<view class="menu-item" @tap="toMyPosts">
					<view class="item-content">
						<text class="item-icon">✍️</text>
						<text class="item-name">我的发布</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toMyComments">
					<view class="item-content">
						<text class="item-icon">💬</text>
						<text class="item-name">我的评论</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toFollowing">
					<view class="item-content">
						<text class="item-icon">👥</text>
						<text class="item-name">我的关注</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
			</view>

			<!-- 我的收藏 -->
			<view class="menu-group">
				<view class="menu-title">我的收藏</view>
				<view class="menu-item" @tap="toFavorites">
					<view class="item-content">
						<text class="item-icon">❤️</text>
						<text class="item-name">收藏的路线</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toCollections">
					<view class="item-content">
						<text class="item-icon">📁</text>
						<text class="item-name">我的收藏夹</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
			</view>

			<!-- 设置 -->
			<view class="menu-group">
				<view class="menu-title">设置</view>
				<view class="menu-item" @tap="toSettings">
					<view class="item-content">
						<text class="item-icon">⚙️</text>
						<text class="item-name">账号设置</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toPrivacy">
					<view class="item-content">
						<text class="item-icon">🔒</text>
						<text class="item-name">隐私设置</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toAbout">
					<view class="item-content">
						<text class="item-icon">ℹ️</text>
						<text class="item-name">关于我们</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
				<view class="menu-item" @tap="toHelp">
					<view class="item-content">
						<text class="item-icon">❓</text>
						<text class="item-name">帮助中心</text>
					</view>
					<text class="item-arrow">&gt;</text>
				</view>
			</view>

			<!-- 登出 -->
			<view class="logout-button" @tap="handleLogout">
				<text>退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				name: '骑行爱好者',
				level: 'Lv. 8 骑行达人',
				avatar: '/image.png',
				stats: {
					distance: 1280,
					routes: 24,
					likes: 45,
					followers: 128
				}
			}
		}
	},
	onLoad() {
		console.log('我的页面加载');
	},
	methods: {
		toEditProfile() {
			uni.showToast({ title: '编辑资料功能开发中', icon: 'none' });
		},
		toMyRoutes() {
			uni.showToast({ title: '我的路线功能开发中', icon: 'none' });
		},
		toRecords() {
			uni.showToast({ title: '骑行记录功能开发中', icon: 'none' });
		},
		toAchievements() {
			uni.showToast({ title: '成就勋章功能开发中', icon: 'none' });
		},
		toMyPosts() {
			uni.showToast({ title: '我的发布功能开发中', icon: 'none' });
		},
		toMyComments() {
			uni.showToast({ title: '我的评论功能开发中', icon: 'none' });
		},
		toFollowing() {
			uni.showToast({ title: '我的关注功能开发中', icon: 'none' });
		},
		toFavorites() {
			uni.showToast({ title: '收藏的路线功能开发中', icon: 'none' });
		},
		toCollections() {
			uni.showToast({ title: '我的收藏夹功能开发中', icon: 'none' });
		},
		toSettings() {
			uni.showToast({ title: '账号设置功能开发中', icon: 'none' });
		},
		toPrivacy() {
			uni.showToast({ title: '隐私设置功能开发中', icon: 'none' });
		},
		toAbout() {
			uni.showToast({ title: '关于我们功能开发中', icon: 'none' });
		},
		toHelp() {
			uni.showToast({ title: '帮助中心功能开发中', icon: 'none' });
		},
		handleLogout() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: '已退出登录', icon: 'success' });
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/login/login'
							});
						}, 1500);
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.mine-container {
	display: flex;
	flex-direction: column;
	background: #F5F5F5;
	min-height: 100vh;
	padding-bottom: 20rpx;
}

.user-card {
	background: linear-gradient(135deg, #FA541C 0%, #FF8C42 100%);
	color: #FFFFFF;
	padding: 40rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 4rpx 15rpx rgba(250, 84, 28, 0.2);
}

.user-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.5);
	flex-shrink: 0;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.user-name {
	font-size: 32rpx;
	font-weight: bold;
}

.user-level {
	font-size: 24rpx;
	opacity: 0.9;
}

.user-edit {
	background: rgba(255, 255, 255, 0.3);
	padding: 10rpx 15rpx;
	border-radius: 6rpx;
	font-size: 22rpx;
	white-space: nowrap;
}

.stats-section {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 0;
	background: #FFFFFF;
	margin: 20rpx;
	border-radius: 10rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
	padding: 25rpx;
	text-align: center;
	border-right: 1rpx solid #F0F0F0;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.stat-item:last-child {
	border-right: none;
}

.stat-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #FA541C;
}

.stat-label {
	font-size: 22rpx;
	color: #999999;
}

.menu-section {
	display: flex;
	flex-direction: column;
	gap: 0;
	margin: 0 20rpx;
}

.menu-group {
	background: #FFFFFF;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.menu-title {
	padding: 15rpx 20rpx;
	font-size: 24rpx;
	color: #999999;
	font-weight: bold;
	background: #F9F9F9;
	border-bottom: 1rpx solid #F0F0F0;
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #F0F0F0;
	transition: all 0.3s ease;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item:active {
	background: #F5F5F5;
	transform: translateX(4rpx);
}

.item-content {
	display: flex;
	align-items: center;
	gap: 15rpx;
	flex: 1;
}

.item-icon {
	font-size: 32rpx;
}

.item-name {
	font-size: 28rpx;
	color: #333333;
}

.item-arrow {
	font-size: 28rpx;
	color: #CCCCCC;
}

.logout-button {
	background: #FFFFFF;
	border: 2rpx solid #FA541C;
	color: #FA541C;
	padding: 20rpx;
	border-radius: 10rpx;
	text-align: center;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	margin-top: 20rpx;
	transition: all 0.3s ease;
}

.logout-button:active {
	background: #FFF5F0;
	transform: scale(0.98);
}
</style>
