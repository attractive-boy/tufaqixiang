<template>
	<view class="chat-page">
		<view class="chat-hero">
			<view class="chat-title">
				<image class="title-avatar" :src="peerAvatar" mode="aspectFill"></image>
				<text class="title-text">{{ peerName }}</text>
			</view>
			<text class="chat-sub">你已添加了“{{ peerName }}”，现在可以聊天了。</text>
		</view>

		<scroll-view class="chat-body" scroll-y="true">
			<view class="message-row" v-for="(msg, index) in messages" :key="index" :class="msg.side">
				<image class="bubble-avatar" :src="msg.avatar" mode="aspectFill"></image>
				<view class="bubble" :class="msg.side">
					<text>{{ msg.text }}</text>
				</view>
			</view>

			<view class="invite-card">
				<view class="invite-left">
					<text class="invite-title">“小汤爱骑行”群</text>
					<text class="invite-sub">邀请你加入群聊</text>
				</view>
				<view class="invite-right">
					<view class="invite-grid">
						<view class="invite-cell" v-for="n in 6" :key="n"></view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="chat-input">
			<view class="icon-btn">🎙️</view>
			<view class="input-box">点击输入</view>
			<view class="icon-btn">😊</view>
			<view class="icon-btn">＋</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			peerName: '小汤爱骑行',
			peerAvatar: '/static/avatar.png',
			messages: []
		};
	},
	onLoad(options) {
		const name = options.name ? decodeURIComponent(options.name) : '';
		const avatar = options.avatar ? decodeURIComponent(options.avatar) : '';
		this.peerName = name || '小汤爱骑行';
		this.peerAvatar = avatar || '/static/avatar.png';
		this.messages = this.buildMessages();
	},
	methods: {
		buildMessages() {
			return [
				{
					side: 'left',
					text: '嘿嘿，这是我与伙伴们一起合拍的！',
					avatar: this.peerAvatar
				},
				{
					side: 'right',
					text: '你好呀，你拍的照片好漂亮呀',
					avatar: '/static/avatar.png'
				},
				{
					side: 'left',
					text: '你最喜欢去公园骑行吗',
					avatar: this.peerAvatar
				},
				{
					side: 'right',
					text: '是呀是呀，我超级喜欢呢。',
					avatar: '/static/avatar.png'
				},
				{
					side: 'left',
					text: '你愿意加入我们吗，我们可以一起结伴出行呢。',
					avatar: this.peerAvatar
				},
				{
					side: 'right',
					text: '当然呀，听起来好棒，我想要加入',
					avatar: '/static/avatar.png'
				},
				{
					side: 'right',
					text: '天呐，太谢谢了！！！',
					avatar: '/static/avatar.png'
				}
			];
		}
	}
};
</script>

<style scoped>
.chat-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #F4A84E 0%, #F8C57B 55%, #FBE2B2 100%);
	font-family: "STKaiti", "KaiTi", "Songti SC", "Georgia", serif;
	color: #4B3A2F;
	display: flex;
	flex-direction: column;
}

.chat-hero {
	padding: 24rpx 24rpx 8rpx;
	text-align: center;
}

.chat-title {
	display: inline-flex;
	align-items: center;
	gap: 12rpx;
	background: rgba(255, 255, 255, 0.45);
	padding: 10rpx 20rpx;
	border-radius: 999rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.6);
}

.title-avatar {
	width: 44rpx;
	height: 44rpx;
	border-radius: 12rpx;
}

.title-text {
	font-size: 28rpx;
	font-weight: 600;
	color: #6B3F1F;
}

.chat-sub {
	margin-top: 12rpx;
	font-size: 22rpx;
	color: rgba(107, 63, 31, 0.65);
}

.chat-body {
	flex: 1;
	padding: 0 24rpx 12rpx;
}

.message-row {
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
	margin: 12rpx 0;
}

.message-row.right {
	flex-direction: row-reverse;
}

.bubble-avatar {
	width: 46rpx;
	height: 46rpx;
	border-radius: 14rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.6);
}

.bubble {
	max-width: 62%;
	padding: 12rpx 16rpx;
	border-radius: 14rpx;
	font-size: 24rpx;
	line-height: 1.5;
	border: 2rpx solid rgba(255, 255, 255, 0.7);
	box-shadow: 0 8rpx 16rpx rgba(117, 66, 23, 0.08);
}

.bubble.left {
	background: rgba(255, 255, 255, 0.8);
	color: #5B3C27;
}

.bubble.right {
	background: #7CCC66;
	color: #FFFFFF;
	border-color: rgba(124, 204, 102, 0.7);
}

.invite-card {
	margin: 18rpx 0 24rpx;
	padding: 16rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 16rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.8);
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.invite-left {
	flex: 1;
}

.invite-title {
	font-size: 24rpx;
	font-weight: 600;
	color: #3F2A1B;
}

.invite-sub {
	margin-top: 6rpx;
	font-size: 22rpx;
	color: #8A6B52;
}

.invite-right {
	width: 120rpx;
	height: 80rpx;
	border-radius: 12rpx;
	background: #F7E4C8;
	padding: 8rpx;
}

.invite-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 6rpx;
}

.invite-cell {
	width: 22rpx;
	height: 22rpx;
	border-radius: 6rpx;
	background: rgba(255, 255, 255, 0.8);
}

.chat-input {
	display: flex;
	align-items: center;
	gap: 14rpx;
	padding: 16rpx 20rpx 24rpx;
	background: rgba(255, 255, 255, 0.9);
	border-top: 2rpx solid rgba(255, 255, 255, 0.7);
}

.icon-btn {
	width: 54rpx;
	height: 54rpx;
	border-radius: 14rpx;
	background: #F3E0C2;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
}

.input-box {
	flex: 1;
	height: 54rpx;
	border-radius: 16rpx;
	background: #FFFFFF;
	display: flex;
	align-items: center;
	padding: 0 16rpx;
	color: #B08A63;
	font-size: 24rpx;
}
</style>
