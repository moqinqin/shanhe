<template>
	<view :style="{'background-image': 'url('+picc+')',
                    'background-size': '100% 100%'}" > 
		<view class="padding10">
			
			<view class="padding" style="background-color: #ebe7db;" v-if="weather.city != ''">
				<view class="weather">
					
					<view class="title">
						{{ weather.city }}
					</view>
					<view class="details">
						<view class="main">
							{{weather.weather}}
						</view>
						<view class="other">
							<image src="../../static/weather/shidu_black.png"></image>
							<view>{{weather.humidity}}%</view>
						</view>
						<view class="other">
							<image src="../../static/weather/wendu_black.png"></image>
							<view>{{weather.temperature}}℃</view>
						</view>
						<view class="other">
							<image src="../../static/weather/feng_black.png"></image>
							<view>{{weather.winddirection}}{{weather.windpower}} </view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
			</view>
		</view>
		
		<view class="padding10" v-if="scenes.length != 0">
			<view class="padding">
				<view class="title">
					常用情景
				</view>
				  <scroll-view scroll-x="true" style="white-space: nowrap;display: inline-block;">
					<block v-for="(scene) in scenes" :key="scene.id">
						<view class="scene">
							<view class="image">
								<image src="../../static/pics/scenes/sun.png"></image>
							</view>
							<view class="name">
								<view style="font-size: 32rpx;">{{ scene.name }}</view>
								<view class="house">{{ scene.containHouse }}</view>
							</view>
							<view class="more">
							<image v-if="scene.favorited == 0" src="../../static/pics/favourite.png" 
								@tap="favoriteScene(scene.id, scene.favorited)"></image>
							<image v-else src="../../static/pics/favourite_select.png"
								@tap="favoriteScene(scene.id, scene.favorited)"></image>
							</view>
							<view class="clear"></view>
						</view>
					</block>
				</scroll-view>
			</div>
		</view>
		
		<view class="" v-if="hardwares.length != 0">
			<view class="padding">
				<view class="title">
					常用设备
				</view>
				<view class="hardware">
					
					<view class="hardware_detail" v-for="(hardware) in hardwares" :key="hardware.id"><view class="hardware_title">
							{{ hardware.name }}
						</view>
						<view v-if="hardware.hardwareType!==3">
						<view class="hardware_status">
							<image v-if="hardware.onoff == 0"
							src="../../static/pics/hardwares/Light-Bulb-close.png"></image>
							<image v-else
								src="../../static/pics/hardwares/Light-Bulb.png"></image>
						</view></view>
						<view class="hardware_favorited">
							<image v-if="hardware.favorited == 0" src="../../static/pics/favourite.png"
								@tap="favoriteHardware(hardware.id, hardware.favorited)"></image>
							<image v-else src="../../static/pics/favourite_select.png"
								@tap="favoriteHardware(hardware.id, hardware.favorited)"></image>
						</view>
						<view class="hardware_pic">
					<view v-if="hardware.hardwareType==3"><button @tap="openvideo()"><image :src="hostIp + '/common/showImage/' + hardware.icon" @tap="openvideo"></image></button></view>
								<view v-else><image :src="hostIp + '/common/showImage/' + hardware.icon " @tap="toHardwarePage(hardware.id, hardware.hardwareType)"></image></view>
								
						</view>
						<view class="hardware_switch" v-if="hardware.hardwareType==3"></view>
						<view class="hardware_switch" v-else>
						<image src="../../static/pics/close.png"
								@tap="closeOrOpenHardware(hardware.id, hardware.onoff)"></image>
						</view>
						
					</view>
				</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	
	import apiUtils from '../../common/utils/api.js';
	
	import aMap from '../../components/amap-wx/lib/amap-wx.js'
	export default {
		data() {
			return {
				hardwares: [],
				scenes: [],
				hostIp: '',
				weather: {
					city: ''
				},
				picc:"",
				token:""
			}
		},
		components: {
			uniSection,
			uniIcons
		},
		onLoad() {
			let _this = this;
			_this.hostIp = apiUtils.getHostIp();
		},
		onShow() {
			let _this = this;
			_this.picc=[];
			_this.token=[];
			_this.scenes = [];
			_this.hardwares = [];
			uni.getStorage({
						key: "backgroundpic",
						success(e){
						_this.picc=e.data;
						console.log(_this.picc);
						}});
			uni.getStorage({
				key:"token",
				success(e){
					_this.token=e.data
					console.log(_this.token)
				}
			});
			apiUtils.favoriteScenes(function(res){
				_this.scenes = res;
			});
			apiUtils.favoriteHardwares(function(res){
				_this.hardwares = res;
			});
			let myAmapFun = new aMap.AMapWX({key:'8708d833af213c0ad3faf34c66d73b4e'});
			myAmapFun.getWeather({
			  success: function(data){
			    _this.weather = data.liveData;
			  },
			  fail: function(info){
				uni.showToast({
					title: info,
					icon: 'none'
				})
			  }
			});
		},
		methods: {
			favoriteScene(id, favorited) {
				let msg = '是否取消收藏？';
				if (favorited == 0){
					msg = "是否加入收藏？";
				}
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: msg,
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.updateFavoriteScene({
								sceneId: id
							},function(){
								apiUtils.favoriteScenes(function(res){
									_this.scenes = res;
								});
								uni.showToast({title: "操作成功",icon: 'none'})
							});
						}
					},
				});
			},
			openvideo(){
				uni.navigateTo({
					url:'../../pages/houses/testVedio'})
			
			},
			sliderChange(event, id) {
				let _this = this;
				let lightSize = event.detail.value;
				//修改设备状态
				apiUtils.updateHardwareLightSize({
					id: id,
					lightSize: lightSize
				}, function(res){
					//修改完之后，重新获取房间详情
					apiUtils.favoriteHardwares(function(res){
						_this.hardwares = res;
					});
					uni.showToast({title: "操作成功",icon: 'none'})
				});
			},
			favoriteHardware(id, favorited){
				let msg = '是否取消收藏？';
				if (favorited == 0){
					msg = "是否加入收藏？";
				}
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: msg,
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.updateFavoriteHardware({
								hardwareId: id
							},function(){
								apiUtils.favoriteHardwares(function(res){
									_this.hardwares = res;
								});
								uni.showToast({title: "操作成功",icon: 'none'})
							});
				        }
				    }
				});
			},
			closeOrOpenHardware(id, onoff) {
				let _this = this;
				let status = (onoff == 0 ? 1: 0);
				//修改设备状态
				apiUtils.updateHardwareOnoffStatus({
					id: id,
					onoff: status
				}, function(res){
					apiUtils.favoriteHardwares(function(res){
						_this.hardwares = res;
					});
					uni.showToast({title: "操作成功",icon: 'none'})
				});
			},
			toHardwarePage(id, hardwareType){
				if( hardwareType == 2 ){
					uni.navigateTo({
						url: '/pages/favorite/colorTemper?id=' + id
					});	
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-image: url('http://testimg.fuyoust.com/background_0001.png');
		background-color: #f1f1f1;
		padding: 5rpx;
		width:auto;
		background-size: cover;
		background-attachment:fixed
	}
	.hardware{
		width: 690upx;
		flex-direction: row;
		flex-wrap: wrap;
		display: inline-flex;
		justify-content: flex-start;
		.hardware_detail{
			margin-top: 10upx;
			margin-left: 10upx;
			padding: 10upx;
			background-color: #FFFFFF;
			width: 310upx;
			box-shadow:1px 1px 1px 1px #bbb;
			border-radius: 30upx;
			height: 400upx;
			.hardware_status{
				image{
					float: left;
					width: 60upx;
					height: 60upx;
				}
			}
			.hardware_favorited{
				image{
					float: right;
					width: 60upx;
					height: 60upx;
				}
			}
			.hardware_title{
				margin-top: 10upx;
				text-align: center;
				// margin-top: 350rpx;
				font-size: 30upx;
			}
			.hardware_switch{
				margin-top: 10upx;
				text-align: center;
				image{
					width: 60upx;
					height: 60upx;
					border-radius: 100upx;
					box-shadow:2px 2px 2px 2px #bbb;
				}
			}
			.hardware_pic{
				margin-top: 60upx;
				text-align: center;
				image{
					border-radius: 50upx;
					width: 200upx;
					height: 200upx;
				}
			}
		}
	}
	.padding{
		background-color: #ebe7db;
		border-radius: 30upx;
		padding: 20rpx;
		margin-top: 25rpx;
	}
	.clear{
		clear: both;
	}
	.title{
		font-size: 31rpx;
		margin-top: 30rpx;
		font-weight: 200;
		margin-bottom: 30rpx;
		margin-left: 20upx;
	}
	.scene{
		box-shadow:1px 1px 1px 1px #bbb;
		white-space: nowrap;display: inline-block;
		width: 500rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 30upx;
		height: 160rpx;
		margin-left: 20rpx;
		padding: 4rpx;
		margin-bottom: 16rpx;
		.image{
			float: left;
			margin-top: 32rpx;
			image{
				margin-left: 20upx;
				width: 100rpx;
				height: 100rpx;
			}
		}
		.name{
			margin-top: 32rpx;
			margin-left: 40rpx;
			font-size: 32rpx;
			float: left;
			.house{
				font-size: 24rpx;
				margin-top: 10rpx;
			}
		}
		.more{
			float: right;
			margin-top: 30rpx;
			margin-right: 20rpx;
			image{
				width: 50rpx; 
				height: 50rpx;
			}
		}
	}
	.weather{
		border-radius: 30upx;
		image{
			width: 80rpx;
			height: 80rpx;
		}
		.main{
			float: left;
			line-height: 120upx;
			font-size: 56rpx;
			margin-left: 30upx;
		}
		.other{
			float: right;
			text-align: center;
			width: 100upx;
			font-size: 28rpx;
			margin-left: 20upx;
		}
	}
</style>
