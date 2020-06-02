<template>
	<view>
		<view class="host_box" v-for="(item) in customers" :key="item.id" 
		 :style="{'backgroundImage': 'url('+item.backgroundImage+');background-repeat:no-repeat;background-size: cover'}"
		 @tap="chooseHardware(item.id)">
			<view>
				<image src="../../static/pics/hardwares/hostBox.jpg" mode="widthFix"></image>
			</view>
			<view>
				<text :class="item.status == 'A'? 'green':'red' ">{{ item.status == 'A'? '在线':'离线' }}</text>
			</view>
			<view>
				{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script>
	import apiUtils from '../../common/utils/api.js';
	export default {
		data() {
			return {
				customers: []
			}
		},
		onShow() {
			let _this = this;
			uni.getStorage({
				key: "account",
				success(e){
					apiUtils.allCustomerHostBox({accountId: e.data.id}, function(res){
						_this.customers = res;
					});
				}
			});
		},
		methods: {
			chooseHardware: function(id){
				uni.getStorage({
					key: "token",
					success(e){
						let tokens = e.data.split("_");
						let token = tokens[0] + "_" + id;
						uni.setStorage({
							key: "token",
							data : token
						});
						uni.showToast({
							title: "切换成功",
							icon: 'none'
						});
						setTimeout(function(){
							uni.navigateBack();
						},1500)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-image: url('http://testimg.fuyoust.com/background_0001.png');
		padding: 10upx;
	}
	.green{
		color: green;
		font-size: 30upx;
		line-height: 50rpx;
	}
	.red{
		color: red;
		font-size: 30upx;
		line-height: 50rpx;
	}
	.host_box{
		width: 220upx;
		padding: 10upx;
		float: left;
		font-size: 25upx;
		text-align: center;
		image{
			width: 180upx;
			border-radius: 50px;
		}
	}
</style>
