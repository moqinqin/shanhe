<template>
	<view>
		<view class="hardware">
			<view class="hardware_detail" v-for="(hardware) in hardwares" :key="hardware.id">
				<view class="hardware_title">
					{{ hardware.name }}
				</view>
				<view v-if="hardware.hardwareType!==3">
				<view class="hardware_status" >
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
					
				     <button v-if="hardware.hardwareType==3" @tap="openvideo()"><image :src="hostIp + '/common/showImage/' + hardware.icon" class="hardware_pic1"></image></button>	
						<image v-else :src="hostIp + '/common/showImage/' + hardware.icon" 
						@tap="toHardwarePage(hardware.id, hardware.hardwareType)"></image>
				</view>
				<view class="hardware_switch" v-if="hardware.hardwareType==3"></view>
				<view class="hardware_switch" v-else>
					<image src="../../static/pics/close.png"
						@tap="closeOrOpenHardware(hardware.id, hardware.onoff)"></image>
				</view>
			</view>
		</view>
		<view class="addButton">
			<image src="../../static/index/add.png" @tap="addHouseHardWare()"></image>
		</view>
	</view>
</template>

<script>
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	
	import apiUtils from '../../common/utils/api.js';
	export default {
		data() {
			return {
				id: "",
				name: "",
				hardwares: [],
				hostIp: ''
			}
		},
		components: {
			uniSection,
			uniIcons
		},
		onLoad(e) {
			let _this = this;
			_this.id = e.id;
			_this.name = e.name;
			uni.setNavigationBarTitle({
				title: _this.name
			});
		},
		onShow(){
			let _this = this;
			_this.hostIp = apiUtils.getHostIp();
			apiUtils.findHouseDetailsById({id: _this.id}, function(res){
				_this.hardwares = res;
			})
		},
		methods: {
			toHardwarePage(id, hardwareType){
				if( hardwareType == 2 ){
					uni.navigateTo({
						url: '/pages/favorite/colorTemper?id=' + id
					});	
				}
			},
			openvideo(){
					uni.navigateTo({url:'../../pages/houses/testVedio'})
						}
			,
			sliderChange(event, id) {
				let _this = this;
				let lightSize = event.detail.value;
				//修改设备状态
				apiUtils.updateHardwareLightSize({
					id: id,
					lightSize: lightSize
				}, function(res){
					//修改完之后，重新获取房间详情
					apiUtils.findHouseDetailsById({id: _this.id}, function(res){
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
								apiUtils.findHouseDetailsById({id: _this.id}, function(res){
									_this.hardwares = res;
								});
								uni.showToast({title: "操作成功",icon: 'none'})
							});
						}
					},
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
					apiUtils.findHouseDetailsById({id: _this.id}, function(res){
						_this.hardwares = res;
					});
					uni.showToast({title: "设备开关成功",icon: 'none'})
				});
			},
			addHouseHardWare(){
				uni.navigateTo({
					url:'../../pages/houses/addHouseHardWare?houseId=' + this.id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f1f1f1;
		background-image: url('http://testimg.fuyoust.com/houseBackground.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment:fixed;
		padding: 10upx;
	}
	
	.addButton{
		float: right;
		margin-bottom: 0rpx;
		position:fixed; 
		right:50upx; 
		bottom:0px; 
		z-index:9999;
		image{
			border-radius: 100upx;
			width: 100rpx;
			height: 100rpx;
			-moz-box-shadow:2px 2px 5px #8F8F94; 
			-webkit-box-shadow:2px 2px 5px #8F8F94; 
			box-shadow:2px 2px 5px #8F8F94;
		}
	}
	.hardware{
		width: 100%;
		flex-direction: row;
		flex-wrap: wrap;
		display: inline-flex;
		justify-content: flex-start;
		.hardware_detail{
			margin: 3rpx;
			margin-top: 10upx;
			padding: 15rpx;
			background-color: #FFFFFF;
			width: 45%;
			box-shadow:1px 1px 1px 1px #bbb;
			border-radius: 30upx;
			height: 430upx;
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
			
			.buttonvideo{
				display: flex;
			}
		}
	}
</style>
