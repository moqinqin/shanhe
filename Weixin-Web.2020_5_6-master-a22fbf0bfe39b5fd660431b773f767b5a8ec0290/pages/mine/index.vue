<template>
	<view  class="a"  :style="{'backgroundImage': 'url('+picc+')',
                    'background-size': '100% 100%'}" >
	<view class="content">
		<view class="header">
			<view v-if="hasLogin" class="userinfo" @tap="changeUserInfo">
					<view class="face"><image :src="account.icon == null || account.icon == '' ? '../../static/missing-face.png' : account.icon"></image></view>
					<view class="info">
						<view class="username">{{account.name == null? '手机用户' + account.username : account.name}}</view>
					</view>
			</view>
			<view v-else class="userinfo">
				<view class="face"><image src="../../static/missing-face.png"></image></view>
				<view class="info">
					<view class="username" @click="navToLogin">登录/注册</view>
				</view>
			</view>
			<!-- <view class="setting"><image src="../../static/center/setting.png"></image></view>-->
		</view>

		<view class="list" style="background-color:white;border-radius: 30upx;" v-for="(list,list_i) in severList" :key="list_i">
			<view class="li" v-for="(li,li_i) in list" @tap="toPage(list_i,li_i)" v-bind:class="{'noborder':li_i==list.length-1}"  hover-class="hover" :key="li.name" >
				<view class="icon"><image :src="'../../static/pics/mine/mine/'+li.icon"></image></view>
				<view class="text">{{li.name}}</view>
				<image class="to" src="../../static/index/to.png"></image>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import api from '../../common/utils/api.js';

	export default {
		data() {
			return {
				hasLogin: false,
				account: {},
				picc:"",
				severList:[
					[
						{name:'通知管理',router: 'notices', icon:'tongzhi.png'},
						{name:'家庭管理',router: 'families', icon:'jiating.png'},
						// {name:'墙纸与皮肤', router: 'skins' ,icon:'pifu.png'}
					],
					[
						{name:'通用设置', router: 'system' ,icon:'shezhi.png'}
					],
					[
						{name:'添加主机', router: 'addHardware' ,icon:'add.png'},
						{name:'切换主机', router: 'changeHardware' ,icon:'change.png'},
						{name:'退出登录', router: 'logout' ,icon:'tuichu.png'}
					]
				]
			}
		},
		onShow() {
			let _this = this;
			_this.picc=[];
			uni.hideToast();
			
			uni.getStorage({
				key: "account",
				success(e){
					_this.hasLogin = true;
					_this.account = e.data;
				}
			});
			uni.getStorage({
				key:"token",
				success(e){
					let tokens=e.data.split("_");
					if(tokens.length == 1){
						_this.picc='http://testimg.fuyoust.com/background_0001.png'}else {uni.getStorage({
				key: "backgroundpic",
				success(e){
				_this.picc=e.data;
				console.log(_this.picc);
				}
			});}
				}
			})
		},
		methods: {
			changeUserInfo(){
				uni.navigateTo({
					url: '/pages/mine/changeUserInfo?id=' + this.account.id
				});
			},
			toPage(list_i,li_i){
				let _this = this;
				let router =  _this.severList[list_i][li_i].router;
				
				
				uni.getStorage({
					key: "token",
					success(e) {
						let tokens = e.data.split("_");
						console.log(tokens.length);	
						if( router == 'families' ){
							if(tokens.length == 1){
								uni.showToast({
									title: "请先切换主机",
									icon: 'none'
								});
								return;
							}
							uni.navigateTo({
								url: '/pages/mine/families'
							})
							return;
						}else if( router == 'accessHouse' ){
							if(tokens.length == 1){
								uni.showToast({
									title: "请先切换主机",
									icon: 'none'
								});
								return;
							}
							uni.navigateTo({
								url: '/pages/mine/accessHouse'
							})
							return;
						}else if( router == 'notices' ){
							if(tokens.length == 1){
								uni.showToast({
									title: "请先切换主机",
									icon: 'none'
								});
								return;
							}
							uni.navigateTo({
								url: '/pages/mine/families'
							})
							return;
						}else if( router == 'system' ){
							if(tokens.length == 1){
								uni.showToast({
									title: "请先切换主机",
									icon: 'none'
								});
								return;
							}
							uni.navigateTo({
								url: '/pages/mine/backgroundPic'
							})
							return;
						}else if( router == 'skins' ){
							if(tokens.length == 1){
								uni.showToast({
									title: "请先切换主机",
									icon: 'none'
								});
								return;
							}
							uni.navigateTo({
								url: '/pages/mine/families'
							})
							return;
						}else if(router == 'changeHardware'){
							uni.navigateTo({
								url:'../login/chooseHardware'
							})
							return;
						}else if(router == 'addHardware'){
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
									api.checkSnCode(snCode, function(res){
										uni.navigateTo({
											url: 'addHardware?snCode=' + snCode
										});
									});
								}
							});
						}else if(router == 'logout'){
							uni.showModal({
							    title: '提示',
							    content: "是否确认登出？",
							    success: function (res) {
							        if (res.confirm) {
										uni.removeStorage({
											key: 'account',
											success: function (res) {
												uni.removeStorage({
													key: 'token',
													success: function (res) {
														uni.showToast({
															title: "退出登录成功",
															icon: 'none'
														});
														_this.account = {};
														_this.hasLogin = false;
														uni.switchTab({
															url: '/pages/favorite/index'  
														});
													}
												});
											}
										});
									}
								},
							});
						}
					},
					fail(e) {
						console.log(e);
						uni.showToast({
							title: "请先登录",
							icon: 'none'
						});
					}
				})
			},
			navToLogin(){
				uni.navigateTo({
					url: '../login/userLogin'
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-image: url('http://testimg.fuyoust.com/background_0001.png');
	background-color: #f1f1f1;
	height: 100%;
}
.a{
	height: 100%;
}
.header{
	&.status{padding-top:var(--status-bar-height);}
	width:92%;height:30vw;padding:0 4%;display:flex;align-items:center;
	.userinfo{
		width:90%;display:flex;
		.face{flex-shrink:0;width:15vw;height:15vw;
			image{width:100%;height:100%;border-radius:100%}
		}
		.info{
			display:flex;flex-flow:wrap;padding-left:30upx;
			.username{width:100%;color:#666;font-size:36upx;line-height:70upx;margin-left: 20upx;}
			.integral{display:flex;align-items:center;padding:0 20upx;height:40upx;color:#fff;background-color:rgba(0,0,0,0.1);border-radius:20upx;font-size:24upx}
		}
	}
	.setting{
		flex-shrink:0;width:6vw;height:6vw;
		image{width:100%;height:100%}
	}
	margin-bottom: 26upx
}

.list{
	width:100%;margin-bottom: 26upx;
	.li{
		width:92%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
		&.noborder{border-bottom:0}
			.icon{
				flex-shrink:0;width:50upx;height:50upx;
				image{width:50upx;height:50upx}
			}
			.text{padding-left:20upx;width:100%;color:#666}
			.to{flex-shrink:0;width:40upx;height:40upx}
		}
}
</style>
