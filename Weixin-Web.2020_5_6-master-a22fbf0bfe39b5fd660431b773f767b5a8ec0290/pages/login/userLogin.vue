<template>
	<view class="page_login">
		<!-- 头部logo -->
		<view class="head">
			<image src="../../static/logo/basicprofile.png" />
			<view class="jy">
				<span>连接万物，普及超智能管家</span>
			</view>
		</view>
		<!-- 登录form -->
		<view class="login_form">
			<view class="input">
				<view class="img">
					<image style="width:27px;height: 27px;" src="../../static/icons/icon_user.png" />
				</view>
				<input type="text" v-model="username" placeholder="请输入手机号">
			</view>
			<view class="line" />
			<view class="input">
				<view class="img">
					<image style="width:20px;height: 25px;" src="../../static/icons/icon_pwd.png" />
				</view>
				<input type="password" :value="userpwd" @input="inputPwd" placeholder="请输入密码">
			</view>
		</view>
		<view class="opts">
			<text @tap="goReg" class="text">主机注册</text>
			<text @tap="goSelfReg" class="text">自行注册</text>
		</view>
		<!-- 登录提交 -->
		<button class="submit" type="primary" @tap="login">登录</button>
<!-- 		<view class="quick_login_line">
			<view class="line" />
			<text class="text">快速登录</text>
			<view class="line" />
		</view>
		<view class="quick_login_list">
			<image @tap="thirdLogin('wechat')" class="item" src="../../static/icons/wechat.png" />
		</view> -->
	</view>
</template>
<script>
	import apiUtils from '../../common/utils/api.js';
	export default {
		data() {
			return {
				username: '',
				userpwd: ''
			}
		},
		methods: {
			goSelfReg(){
				uni.navigateTo({
					url: 'userSelfReg'
				});
			},
			inputUsername(e) {
				this.username = e.target.value
			},
			inputPwd(e) {
				this.userpwd = e.target.value
			},
			goReg() {
				// 只允许通过相机扫码
				uni.scanCode({
					onlyFromCamera: true,
					success: function (res) {
						let snCode = res.result;
						if(snCode === ''){
							uni.showToast({
									title: "未扫到二维码，请检查",
									icon: 'none'
							});
							return;
						}
						apiUtils.checkSnCode(snCode, function(res){
							uni.navigateTo({
								url: 'userReg?snCode=' + snCode
							});
						});
						
					}
				});
			},
			login() {
				let _this = this;
				if (_this.username == '' || _this.userpwd == '') {
					uni.showToast({
							title: "请输入用户名和密码",
							icon: 'none'
					});
				}else{
					apiUtils.userLogin({
						username: _this.username,
						password: _this.userpwd
					}, function(res){
						uni.setStorage({
							key: "account",
							data : res.account,
						});
						uni.setStorage({
							key: "token",
							data : res.token.token,
						})
						//登陆成功之后，这边跳转主机选择页面选择主机。
						uni.showToast({
							title: "登陆成功",
							icon: 'none'
						});
						setTimeout(function(){
							uni.navigateBack();
						},1500)
					});
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	$logo-padding: 60px;
	$form-border-color: rgba(214, 214, 214, 1);
	$text-color: #B6B6B6;

	.page_login {
		width: 100%;
		margin-top: 50upx;
	}

	.head{
		image{
			margin-top: 14rpx;
			width: 240rpx;
			height: 240rpx;
			align-items: center;
			margin-left: 255rpx;
		}
		.jy{
			color: #B6B6B6;
			margin-top: 14rpx;
			font-size: 27rpx;
			text-align: center;
		}
	}

	.login_form {
		display: flex;
		margin: 20px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px solid $form-border-color;
		border-radius: 10px;

		.line {
			width: 100%;
			height: 1px;
			background-color: $form-border-color;
		}

		.input {
			width: 100%;
			max-height: 45px;
			display: flex;
			padding: 3px;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			.img {
				min-width: 40px;
				min-height: 40px;
				margin: 5px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.img_del {
				width: 21px;
				height: 21px;
			}

			.img_pwd_switch {
				width: 28px;
				height: 12px;
			}

			input {
				outline: none;
				height: 30px;
				width: 100%;

				&:focus {
					outline: none;
				}
			}
		}
	}

	.submit {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		color: white;
		background-color: #C00000;
	}

	.opts {
		margin-top: 5px;
		margin-left: 25px;
		margin-right: 25px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.text {
			font-size: 13px;
			color: $text-color;
		}
	}

	.quick_login_line {
		margin-top: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.line {
			height: 1px;
			width: 38%;
			background-color: rgba(211, 211, 213, 1);
		}

		.text {
			font-size: 13px;
			color: rgba(200, 200, 200, 1);
			margin: 2px;
		}
	}

	.quick_login_list {
		margin-top: 30px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.item {
			width: 50px;
			height: 50px;
			margin: 20px;
		}
	}
</style>