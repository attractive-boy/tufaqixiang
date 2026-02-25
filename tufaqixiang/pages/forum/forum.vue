<template>
	<view class="forum-container">
		<!-- 论坛头部 -->
		<view class="forum-header">
			<view class="header-top">
				<input 
					class="search-input"
					type="text"
					placeholder="搜索话题..."
					v-model="searchKeyword"
					@input="onSearch">
				<button class="publish-button" @tap="toPublish">发布+</button>
			</view>
			
			<!-- 分类标签 -->
			<scroll-view class="category-scroll" scroll-x="true">
				<view class="category-list">
					<view 
						class="category-item"
						:class="{ active: activeCategory === item.id }"
						v-for="item in categories"
						:key="item.id"
						@tap="selectCategory(item)">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 论坛内容 -->
		<scroll-view class="forum-content" scroll-y="true" @scrolltolower="loadMore">
			<!-- 置顶帖子 -->
			<view class="sticky-section" v-if="stickyPosts.length > 0">
				<view class="section-label">📌 置顶话题</view>
				<view class="topic-item sticky" v-for="post in stickyPosts" :key="post.id" @tap="toPostDetail(post)">
					<view class="topic-header">
						<image :src="post.avatar" class="user-avatar"></image>
						<view class="user-info">
							<text class="user-name">{{ post.author }}</text>
							<text class="post-time">{{ formatTime(post.time) }}</text>
						</view>
						<view class="topic-badge">置顶</view>
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
						<text class="topic-stat">❤️ {{ post.likes }}</text>
						<text class="topic-stat">💬 {{ post.comments }}</text>
						<text class="topic-stat">👁️ {{ post.views }}</text>
					</view>
				</view>
			</view>

			<!-- 普通帖子 -->
			<view class="posts-section">
				<view class="section-label" v-if="stickyPosts.length > 0">热门话题</view>
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
						<text class="topic-stat">❤️ {{ post.likes }}</text>
						<text class="topic-stat">💬 {{ post.comments }}</text>
						<text class="topic-stat">👁️ {{ post.views }}</text>
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
					likes: 528,
					comments: 89,
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
					likes: 1250,
					comments: 234,
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
					likes: 892,
					comments: 156,
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
					likes: 456,
					comments: 89,
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
					likes: 2340,
					comments: 456,
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
	background: #F5F5F5;
}

.forum-header {
	background: #FFFFFF;
	padding: 15rpx;
	border-bottom: 1rpx solid #EEEEEE;
}

.header-top {
	display: flex;
	gap: 10rpx;
	margin-bottom: 15rpx;
}

.search-input {
	flex: 1;
	padding: 12rpx 15rpx;
	background: #F5F5F5;
	border: 1rpx solid #EEEEEE;
	border-radius: 20rpx;
	font-size: 28rpx;
}

.publish-button {
	width: 100rpx;
	padding: 12rpx 0;
	background: #FA541C;
	color: #FFFFFF;
	border: none;
	border-radius: 20rpx;
	font-size: 26rpx;
	font-weight: bold;
}

.category-scroll {
	white-space: nowrap;
	width: 100%;
}

.category-list {
	display: flex;
	gap: 15rpx;
	padding: 0 15rpx;
}

.category-item {
	display: inline-block;
	padding: 10rpx 20rpx;
	background: #F0F0F0;
	color: #666666;
	border-radius: 20rpx;
	font-size: 26rpx;
	white-space: nowrap;
	transition: all 0.3s ease;
}

.category-item.active {
	background: #FA541C;
	color: #FFFFFF;
}

.forum-content {
	flex: 1;
	overflow-y: auto;
}

.sticky-section {
	padding: 15rpx 0;
}

.section-label {
	padding: 15rpx 20rpx;
	font-size: 24rpx;
	color: #999999;
	font-weight: bold;
	background: #F5F5F5;
}

.posts-section {
	padding: 0;
}

.topic-item {
	background: #FFFFFF;
	margin: 10rpx 15rpx;
	padding: 20rpx;
	border-radius: 10rpx;
	border-left: 4rpx solid #FA541C;
	transition: all 0.3s ease;
}

.topic-item.sticky {
	border-left-color: #FF6B35;
	background: linear-gradient(135deg, #FFF5F0 0%, #FFFFFF 100%);
}

.topic-item:active {
	box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	transform: translateY(-2rpx);
}

.topic-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 15rpx;
}

.user-avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	flex-shrink: 0;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.user-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
}

.post-time {
	font-size: 22rpx;
	color: #999999;
}

.topic-badge {
	background: #FF6B35;
	color: #FFFFFF;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 4rpx;
}

.topic-content {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 12rpx;
	line-height: 1.4;
}

.topic-preview {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.6;
	margin-bottom: 12rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.topic-images {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8rpx;
	margin-bottom: 12rpx;
}

.preview-image {
	width: 100%;
	height: 120rpx;
	border-radius: 6rpx;
	background: #E0E0E0;
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
	gap: 20rpx;
	font-size: 22rpx;
	color: #999999;
	border-top: 1rpx solid #F0F0F0;
	padding-top: 12rpx;
}

.topic-stat {
	display: flex;
	align-items: center;
}

.loading-tip {
	text-align: center;
	padding: 40rpx 20rpx;
	color: #999999;
	font-size: 26rpx;
}

.no-more-tip {
	text-align: center;
	padding: 40rpx 20rpx;
	color: #CCCCCC;
	font-size: 24rpx;
}
</style>
