<template>
	<view class="login-container">
		<view class="top-decoration">
			<view class="deco-bar"></view>
		</view>

		<view class="login-header">
			<text class="login-title">🐰 兔发骑想</text>
			<text class="login-subtitle">专属你的骑行规划师</text>
		</view>

		<view class="form-container">
			<!-- Tab切换 -->
			<view class="tab-buttons">
				<view 
					class="tab-button" 
					:class="{ active: isLogin }"
					@tap="switchToLogin">
					登录
				</view>
				<view 
					class="tab-button" 
					:class="{ active: !isLogin }"
					@tap="switchToRegister">
					注册
				</view>
				<view class="tab-indicator" :class="{ 'register-mode': !isLogin }"></view>
			</view>

			<!-- 登录表单 -->
			<view v-if="isLogin" class="form-content">
				<view class="form-group">
					<input 
						class="form-input"
						type="text"
						placeholder="请输入手机号"
						v-model="loginForm.phone"
						@input="onPhoneInput" />
				</view>
				<view class="form-group">
					<input 
						class="form-input"
						type="password"
						placeholder="请输入密码"
						v-model="loginForm.password" />
				</view>
				<view class="form-group forget-password">
					<text @tap="toForgetPassword">忘记密码？</text>
				</view>
				<button class="login-button" @tap="handleLogin">登录</button>
			</view>

			<!-- 注册表单 -->
			<view v-else class="form-content">
				<view class="form-group">
					<input 
						class="form-input"
						type="text"
						placeholder="请输入手机号"
						v-model="registerForm.phone" />
				</view>
				<view class="form-group">
					<view class="verify-group">
						<input 
							class="form-input verify-input"
							type="text"
							placeholder="请输入验证码"
							v-model="registerForm.verifyCode" />
						<button 
							class="verify-button"
							:disabled="verifyButtonDisabled"
							@tap="getVerifyCode">
							{{ verifyButtonText }}
						</button>
					</view>
				</view>
				<view class="form-group">
					<input 
						class="form-input"
						type="password"
						placeholder="请设置密码"
						v-model="registerForm.password" />
				</view>
				<view class="form-group">
					<input 
						class="form-input"
						type="password"
						placeholder="确认密码"
						v-model="registerForm.confirmPassword" />
				</view>
				<view class="form-group agreement">
					<view class="checkbox-wrapper">
						<view 
							class="checkbox"
							:class="{ checked: registerForm.agreeTerms }"
							@tap="toggleAgreed">
						</view>
						<text class="agreement-text">
							我同意
							<text class="link" @tap="toServiceTerms">服务条款</text>
							和
							<text class="link" @tap="toPrivacyPolicy">隐私政策</text>
						</text>
					</view>
				</view>
				<button 
					class="login-button"
					:disabled="!registerForm.agreeTerms"
					@tap="handleRegister">
					注册
				</button>
			</view>
		</view>

		<!-- 第三方登录 -->
		<view class="third-party-login">
			<view class="divider">
				<view class="divider-line"></view>
				<text class="divider-text">或使用以下方式登录</text>
				<view class="divider-line"></view>
			</view>
			<view class="social-login">
				<button class="social-button wechat" @tap="wechatLogin">
					<image class="social-icon" src="/static/icons/wechat.svg" mode="aspectFit" />
					<text class="social-text">微信</text>
				</button>
				<button class="social-button qq" @tap="qqLogin">
					<image class="social-icon" src="/static/icons/qq.svg" mode="aspectFit" />
					<text class="social-text">QQ</text>
				</button>
				<button class="social-button alipay" @tap="alipayLogin">
					<image class="social-icon" src="/static/icons/alipay.svg" mode="aspectFit" />
					<text class="social-text">支付宝</text>
				</button>
			</view>
		</view>
		<custom-tabbar></custom-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isLogin: true,
			loginForm: {
				phone: '',
				password: ''
			},
			registerForm: {
				phone: '',
				verifyCode: '',
				password: '',
				confirmPassword: '',
				agreeTerms: false
			},
			verifyButtonDisabled: false,
			verifyCountdown: 0,
			verifyTimer: null
		}
	},
	computed: {
		verifyButtonText() {
			if (this.verifyCountdown > 0) {
				return `重新获取(${this.verifyCountdown}s)`;
			}
			return '获取验证码';
		}
	},
	methods: {
		switchToLogin() {
			this.isLogin = true;
		},
		switchToRegister() {
			this.isLogin = false;
		},
		onPhoneInput(e) {
			// 格式化手机号
			let phone = e.detail.value.replace(/\D/g, '');
			if (phone.length > 11) {
				phone = phone.substring(0, 11);
			}
			this.loginForm.phone = phone;
		},
		handleLogin() {
			if (!this.loginForm.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' });
				return;
			}
			if (!this.loginForm.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' });
				return;
			}
			if (this.loginForm.phone.length !== 11) {
				uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
				return;
			}
			
			// 模拟登录
			uni.showLoading({ title: '登录中...' });
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({ title: '登录成功', icon: 'success' });
				// 跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				});
			}, 1500);
		},
		getVerifyCode() {
			if (!this.registerForm.phone) {
				uni.showToast({ title: '请先输入手机号', icon: 'none' });
				return;
			}
			if (this.registerForm.phone.length !== 11) {
				uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
				return;
			}
			if (this.verifyButtonDisabled) {
				return;
			}

			this.verifyButtonDisabled = true;
			// Mock code: generate 6-digit number and fill it directly.
			const code = Math.floor(100000 + Math.random() * 900000);
			this.registerForm.verifyCode = String(code);
			uni.showToast({ title: '验证码已发送', icon: 'success' });

			this.verifyCountdown = 60;
			if (this.verifyTimer) {
				clearInterval(this.verifyTimer);
			}
			this.verifyTimer = setInterval(() => {
				this.verifyCountdown--;
				if (this.verifyCountdown === 0) {
					clearInterval(this.verifyTimer);
					this.verifyTimer = null;
					this.verifyButtonDisabled = false;
				}
			}, 1000);
		},
		handleRegister() {
			if (!this.registerForm.phone || !this.registerForm.verifyCode || !this.registerForm.password || !this.registerForm.confirmPassword) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' });
				return;
			}
			if (this.registerForm.password !== this.registerForm.confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' });
				return;
			}
			if (!this.registerForm.agreeTerms) {
				uni.showToast({ title: '请同意服务条款和隐私政策', icon: 'none' });
				return;
			}
			
			uni.showLoading({ title: '注册中...' });
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({ title: '注册成功', icon: 'success' });
				this.isLogin = true;
				this.loginForm.phone = this.registerForm.phone;
				this.registerForm = {
					phone: '',
					verifyCode: '',
					password: '',
					confirmPassword: '',
					agreeTerms: false
				};
			}, 1500);
		},
		toggleAgreed() {
			this.registerForm.agreeTerms = !this.registerForm.agreeTerms;
		},
		toForgetPassword() {
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		toServiceTerms() {
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		toPrivacyPolicy() {
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		wechatLogin() {
			uni.showToast({ title: '微信登录开发中', icon: 'none' });
		},
		qqLogin() {
			uni.showToast({ title: 'QQ登录开发中', icon: 'none' });
		},
		alipayLogin() {
			uni.showToast({ title: '支付宝登录开发中', icon: 'none' });
		}
	}
}
</script>

<style scoped>
.login-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF5E6 0%, #FFFAEF 100%);
	padding: 0;
}

.top-decoration {
	height: 80rpx;
	background: linear-gradient(90deg, #FFC854 0%, #FF9D4D 100%);
	border-radius: 0 0 30rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.deco-bar {
	width: 60rpx;
	height: 8rpx;
	background: rgba(255, 255, 255, 0.4);
	border-radius: 4rpx;
}

.login-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40rpx 0 20rpx 0;
}

.login-title {
	font-size: 56rpx;
	font-weight: bold;
	color: #8B6F47;
	margin-bottom: 10rpx;
}

.login-subtitle {
	font-size: 26rpx;
	color: #FFD4CC;
}

.form-container {
	flex: 1;
	background: #FFFFFF;
	margin: 30rpx 25rpx;
	border-radius: 25rpx;
	padding: 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(255, 200, 84, 0.1);
}

.tab-buttons {
	display: flex;
	margin-bottom: 28rpx;
	position: relative;
	height: 80rpx;
}

.tab-button {
	flex: 1;
	text-align: center;
	padding: 25rpx 0;
	font-size: 32rpx;
	color: #CCCCCC;
	transition: all 0.3s ease;
	z-index: 2;
	font-weight: 600;
    height: 80rpx;
}

.tab-button.active {
	color: #FFFFFF;
}

.tab-indicator {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 50%;
	height: 60rpx;
	background: linear-gradient(90deg, #FFC854 0%, #FF9D4D 100%);
	border-radius: 15rpx;
	transition: left 0.3s ease;
	z-index: 1;
}

.tab-indicator.register-mode {
	left: 50%;
}

.form-content {
	display: flex;
	flex-direction: column;
}

.form-group {
	margin-bottom: 20rpx;
}

.form-input {
	width: 100%;
	height: 72rpx;
	line-height: 72rpx;
	padding: 0 18rpx;
	border: 2rpx solid #F0E6D2;
	border-radius: 15rpx;
	font-size: 28rpx;
	background: #FFFAEF;
	color: #8B6F47;
	caret-color: #FF9D4D;
	box-sizing: border-box;
	transition: all 0.3s ease;
}

.form-input:focus {
	border-color: #FFC854;
	background: #FFFFFF;
	box-shadow: 0 0 10rpx rgba(255, 200, 84, 0.2);
}

.verify-group {
	display: flex;
	gap: 12rpx;
}

.verify-input {
	flex: 1;
}

.verify-button {
	flex: 0 0 140rpx;
	padding: 0;
	height: 70rpx;
	background: linear-gradient(90deg, #FFC854 0%, #FF9D4D 100%);
	color: #FFFFFF;
	border: none;
	border-radius: 15rpx;
	font-size: 22rpx;
	font-weight: bold;
    line-height: 70rpx;
}

.verify-button:disabled {
	background: #CCCCCC;
	color: #FFFFFF;
}

.forget-password {
	text-align: right;
	margin-bottom: 20rpx;
}

.forget-password text {
	color: #FFC854;
	font-size: 24rpx;
}

.login-button {
	width: 100%;
	padding: 18rpx;
	background: linear-gradient(90deg, #FFC854 0%, #FF9D4D 100%);
	color: #FFFFFF;
	border: none;
	border-radius: 15rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-top: 10rpx;
}

.third-party-login {
	padding: 30rpx 25rpx;
}

.divider {
	display: flex;
	align-items: center;
	gap: 15rpx;
	margin-bottom: 30rpx;
}

.divider-line {
	flex: 1;
	height: 1rpx;
	background: #E8D7C3;
}

.divider-text {
	font-size: 24rpx;
	color: #CCBBAA;
	white-space: nowrap;
}

.social-login {
	display: flex;
	gap: 15rpx;
}

.social-button {
	flex: 1;
	padding: 20rpx;
	border: 2rpx solid #F0E6D2;
	border-radius: 15rpx;
	text-align: center;
	background: #FFFAEF;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.social-button:active {
	background: #FFF5E6;
	transform: scale(0.96);
}

.social-icon {
	width: 44rpx;
	height: 44rpx;
}

.social-text {
	font-size: 24rpx;
	color: #8B6F47;
	font-weight: 500;
}

.agreement {
	margin-top: 6rpx;
}

.checkbox-wrapper {
	display: flex;
	align-items: flex-start;
	gap: 10rpx;
}

.checkbox {
	width: 30rpx;
	height: 30rpx;
	border: 2rpx solid #E8D7C3;
	border-radius: 6rpx;
	background: #FFFFFF;
	flex-shrink: 0;
	transition: all 0.3s ease;
	margin-top: 4rpx;
}

.checkbox.checked {
	background: #FFC854;
	border-color: #FFC854;
}

.agreement-text {
	font-size: 24rpx;
	color: #8B6F47;
	line-height: 1.5;
}

.link {
	color: #FF9D4D;
}

.login-button:disabled {
	background: #E8D7C3;
	color: #FFFFFF;
}
</style>

