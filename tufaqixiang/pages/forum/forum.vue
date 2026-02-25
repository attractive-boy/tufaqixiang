<template>
	<view class="forum-container">
		<!-- 论坛头部 -->
		<view class="forum-header">
			<view class="header-top">
				<text class="header-title">大广场</text>
				<view class="mini-pill">
					<text>点击 ··· 添加我的小程序</text>
					<text class="pill-close">×</text>
				</view>
			</view>
		</view>

		<!-- 论坛内容 -->
		<scroll-view class="forum-content" scroll-y="true" @scrolltolower="loadMore">
			<!-- 置顶帖子 -->
			<view class="sticky-section" v-if="stickyPosts.length > 0">
				<view class="topic-item sticky" v-for="post in stickyPosts" :key="post.id" @tap="toPostDetail(post)">
					<view class="topic-header">
						<image :src="post.avatar" class="user-avatar"></image>
						<view class="user-info">
							<text class="user-name">{{ post.author }}</text>
							<text class="post-time">{{ formatTime(post.time) }}</text>
						</view>
					</view>
					<text class="topic-content">{{ post.title }}</text>
					<view class="topic-preview">{{ post.content }}</view>
					<view class="topic-images" v-if="post.images && post.images.length > 0">
						<image 
							v-for="(img, index) in post.images.slice(0, 3)"
							:key="index"
							:src="img"
							class="preview-image">
						</image>
						<view class="more-images" v-if="post.images.length > 3">
							+{{ post.images.length - 3 }}
						</view>
					</view>
					<view class="topic-footer">
						<view class="topic-stat">
							<text class="stat-icon">❤️</text>
							<text class="stat-count">{{ post.likes }}</text>
						</view>
						<view class="topic-stat">
							<text class="stat-icon">💬</text>
							<text class="stat-count">{{ post.comments }}</text>
						</view>
						<view class="topic-stat">
							<text class="stat-icon">🔁</text>
							<text class="stat-count">{{ post.shares }}</text>
						</view>
						<view class="topic-stat">
							<text class="stat-icon">⭐</text>
							<text class="stat-count">{{ post.favorites }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 普通帖子 -->
			<view class="posts-section">
				<view class="topic-item" v-for="post in posts" :key="post.id" @tap="toPostDetail(post)">
					<view class="topic-header">
						<image :src="post.avatar" class="user-avatar"></image>
						<view class="user-info">
							<text class="user-name">{{ post.author }}</text>
							<text class="post-time">{{ formatTime(post.time) }}</text>
						</view>
					</view>
					<text class="topic-content">{{ post.title }}</text>
					<view class="topic-preview">{{ post.content }}</view>
					<view class="topic-images" v-if="post.images && post.images.length > 0">
						<image 
							v-for="(img, index) in post.images.slice(0, 3)"
							:key="index"
							:src="img"
							class="preview-image">
						</image>
						<view class="more-images" v-if="post.images.length > 3">
							+{{ post.images.length - 3 }}
						</view>
					</view>
					<view class="topic-footer">
						<view class="topic-stat">
							<text class="stat-icon">❤️</text>
							<text class="stat-count">{{ post.likes }}</text>
						</view>
						<view class="topic-stat">
							<text class="stat-icon">💬</text>
							<text class="stat-count">{{ post.comments }}</text>
						</view>
						<view class="topic-stat">
							<text class="stat-icon">🔁</text>
							<text class="stat-count">{{ post.shares }}</text>
						</view>
						<view class="topic-stat">
							<text class="stat-icon">⭐</text>
							<text class="stat-count">{{ post.favorites }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载提示 -->
			<view class="loading-tip" v-if="isLoading">
				<text>加载中...</text>
			</view>
			<view class="no-more-tip" v-if="noMore">
				<text>没有更多了</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
			activeCategory: 1,
			categories: [
				{ id: 1, name: '全部' },
				{ id: 2, name: '骑行攻略' },
				{ id: 3, name: '装备讨论' },
				{ id: 4, name: '路线评测' },
				{ id: 5, name: '活动组织' },
				{ id: 6, name: '经验分享' }
			],
			stickyPosts: [
				{
					id: 0,
					author: '官方运营',
					avatar: '/static/avatar1.jpg',
					title: '兔发骑想社区规则',
					content: '友善、互助、分享是我们社区的核心价值。遵守以下规则可以让我们的社区更加和谐...',
					images: ['/static/forum1.jpg'],
					likes: 5300,
					comments: 2005,
					shares: 201,
					favorites: 105,
					views: 12580,
					time: Date.now() - 7 * 24 * 60 * 60 * 1000
				}
			],
			posts: [
				{
					id: 1,
					author: '骑行天使',
					avatar: '/static/avatar2.jpg',
					title: '2024春季骑行必备：装备清单完全版',
					content: '春天到了，又是骑行的好季节。整理了一份完整的骑行装备清单，包括必须装备和推荐装备...',
					images: ['/static/forum2.jpg', '/static/forum3.jpg'],
					likes: 4523,
					comments: 1753,
					shares: 453,
					favorites: 123,
					views: 5680,
					time: Date.now() - 2 * 60 * 60 * 1000
				},
				{
					id: 2,
					author: '北京自行车爱好者',
					avatar: '/static/avatar3.jpg',
					title: '长城骑行线路测评：北京最经典的骑行之旅',
					content: '周末完成了长城骑行挑战，全程35km，用时2.5小时，风景绝了！路线难度适中...',
					images: ['/static/forum4.jpg'],
					likes: 4523,
					comments: 1753,
					shares: 453,
					favorites: 123,
					views: 4290,
					time: Date.now() - 5 * 60 * 60 * 1000
				},
				{
					id: 3,
					author: '新手骑手',
					avatar: '/static/avatar4.jpg',
					title: '新人提问：如何选择合适的公路车？',
					content: '想入坑骑行，但不知道怎么选择自行车。预算在3000-5000元，想听听各位的建议...',
					images: [],
					likes: 4523,
					comments: 1753,
					shares: 453,
					favorites: 123,
					views: 2120,
					time: Date.now() - 8 * 60 * 60 * 1000
				},
				{
					id: 4,
					author: '骑友小王',
					avatar: '/static/avatar5.jpg',
					title: '我的骑行大数据：一年骑行5000km的总结',
					content: '坚持骑行一整年，总结了很多经验。从装备、训练、营养、安全等多个方面分享...',
					images: ['/static/forum5.jpg', '/static/forum6.jpg', '/static/forum7.jpg'],
					likes: 4523,
					comments: 1753,
					shares: 453,
					favorites: 123,
					views: 8920,
					time: Date.now() - 12 * 60 * 60 * 1000
				}
			],
			isLoading: false,
			noMore: false,
			page: 1
		}
	},
	onLoad() {
		console.log('论坛页面加载');
	},
	methods: {
		onSearch() {
			// 搜索功能
			console.log('搜索：', this.searchKeyword);
		},
		selectCategory(category) {
			this.activeCategory = category.id;
			// 重新加载当前分类数据
			console.log('选择分类：', category.name);
		},
		formatTime(timestamp) {
			const now = Date.now();
			const diff = now - timestamp;
			const minutes = Math.floor(diff / 60000);
			const hours = Math.floor(diff / 3600000);
			const days = Math.floor(diff / 86400000);
			
			if (minutes < 1) return '刚才';
			if (minutes < 60) return `${minutes}分钟前`;
			if (hours < 24) return `${hours}小时前`;
			if (days < 7) return `${days}天前`;
			
			const date = new Date(timestamp);
			return `${date.getMonth() + 1}月${date.getDate()}日`;
		},
		loadMore() {
			if (!this.isLoading && !this.noMore) {
				this.isLoading = true;
				this.page++;
				
				// 模拟加载更多数据
				setTimeout(() => {
					this.isLoading = false;
					if (this.page > 3) {
						this.noMore = true;
					}
				}, 1000);
			}
		},
		toPublish() {
			uni.showToast({ title: '发布功能开发中', icon: 'none' });
		},
		toPostDetail(post) {
			uni.showToast({ title: `查看帖子: ${post.title}`, icon: 'none' });
		}
	}
}
</script>

<style scoped>
.forum-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: linear-gradient(180deg, #F6B36B 0%, #F7C588 45%, #F8D9A8 100%);
	font-family: "STKaiti", "KaiTi", "Songti SC", "Georgia", serif;
}

.forum-header {
	background: transparent;
	padding: 26rpx 24rpx 10rpx;
}

.header-top {
	display: flex;
	flex-direction: column;
	gap: 14rpx;
}

.header-title {
	font-size: 40rpx;
	font-weight: 600;
	color: #B06B3B;
	letter-spacing: 4rpx;
}

.mini-pill {
	align-self: flex-end;
	background: rgba(124, 65, 34, 0.8);
	color: #FFF2E8;
	padding: 10rpx 18rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.pill-close {
	font-size: 24rpx;
	line-height: 1;
	opacity: 0.8;
}

.forum-content {
	flex: 1;
	overflow-y: auto;
	padding-bottom: 20rpx;
}

.sticky-section {
	padding: 0 0 10rpx;
}

.posts-section {
	padding: 0;
}

.topic-item {
	background: transparent;
	margin: 16rpx 24rpx;
	padding: 8rpx 0 18rpx;
	border-radius: 0;
	border-left: none;
	transition: all 0.3s ease;
}

.topic-item.sticky {
	background: transparent;
}

.topic-item:active {
	transform: translateY(2rpx);
	opacity: 0.9;
}

.topic-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 15rpx;
}

.user-avatar {
	width: 56rpx;
	height: 56rpx;
	border-radius: 50%;
	flex-shrink: 0;
	background: rgba(255, 255, 255, 0.6);
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.user-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #7B4B2D;
}

.post-time {
	font-size: 22rpx;
	color: rgba(123, 75, 45, 0.7);
}

.topic-content {
	font-size: 28rpx;
	font-weight: 600;
	color: #7B4B2D;
	display: block;
	margin-bottom: 8rpx;
	line-height: 1.4;
}

.topic-preview {
	font-size: 24rpx;
	color: rgba(123, 75, 45, 0.85);
	line-height: 1.6;
	margin-bottom: 10rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
}

.topic-images {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.preview-image {
	width: 100%;
	height: 130rpx;
	border-radius: 8rpx;
	background: rgba(255, 255, 255, 0.6);
}

.more-images {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 6rpx;
}

.topic-footer {
	display: flex;
	gap: 22rpx;
	font-size: 22rpx;
	color: rgba(123, 75, 45, 0.8);
	padding-top: 6rpx;
}

.topic-stat {
	display: flex;
	align-items: center;
	gap: 6rpx;
}

.stat-icon {
	font-size: 26rpx;
}

.stat-count {
	font-size: 22rpx;
}

.loading-tip {
	text-align: center;
	padding: 40rpx 20rpx;
	color: rgba(123, 75, 45, 0.7);
	font-size: 26rpx;
}

.no-more-tip {
	text-align: center;
	padding: 40rpx 20rpx;
	color: rgba(123, 75, 45, 0.4);
	font-size: 24rpx;
}
</style>
