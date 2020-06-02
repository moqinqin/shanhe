<template>
	<view>
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
				<input type="password" v-model="userpwd" placeholder="请输入密码">
			</view>
			<view class="line" />
			<view class="input">
				<view class="img">
					<image style="width:20px;height: 25px;" src="../../static/icons/icon_pwd.png" />
				</view>
				<input type="password" v-model="userpwdcomf" placeholder="请确认密码">
			</view>
		</view>
		<!-- 登录提交 -->
		<button class="submit" type="primary" @tap="doRegs"">确认提交</button>
	</view>
	
</template>

<script>
	import apiUtils from '../../common/utils/api.js';
	export default {
		data() {
			return {
				username: '',
				userpwd: '',
				userpwdcomf: ''
			}
		},
		onLoad(e) {
		},
		methods: {
			checkMobile(mobile){
			    return RegExp(/^1[34578]\d{9}$/).test(mobile);
			},
			doRegs: function(){
				let _this = this;
				if( _this.username === '' ){
					uni.showToast({
						title: "请输入手机号",
						icon: 'none'
					});
				}else if( !_this.checkMobile( _this.username ) ){
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return;
				}else if(_this.userpwd === ''){
					uni.showToast({
						title: "请输入密码",
						icon: 'none'
					});
				}else if(_this.userpwdcomf === ''){
					uni.showToast({
						title: "请重复用户密码",
						icon: 'none'
					});
				}else if(_this.userpwdcomf !== _this.userpwd){
					uni.showToast({
						title: "两次输入的密码不一致",
						icon: 'none'
					});
				}else{
					uni.showModal({
						content: '确认操作？',
						success: (e)=>{
							if(e.confirm){
								apiUtils.userRegs({
									username: _this.username,
									userpwd: _this.userpwd
								}, function(res){
									uni.showModal({
										content: '注册成功，请返回登陆！',
										success: (e2)=>{
											if(e2.confirm){
												uni.navigateBack();
											}
										}
									});
								});
							}
						}
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