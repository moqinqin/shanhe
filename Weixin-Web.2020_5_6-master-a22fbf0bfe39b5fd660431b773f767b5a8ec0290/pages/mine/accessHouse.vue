<template>
    <view class="content">
		<view class="account_list">
			<view class="account" v-for="(item) in accounts" :key="item.id"
			>
				<view class="pic">
					<view class="face"><image :src="item.icon == null ? '../../static/missing-face.png' : item.icon"></image></view>
				</view>
				<view class="name">
					<view>{{item.name == null? '手机用户' + item.username : item.name}}</view>
					<view v-if="item.accessHouse.length != 0" class="house marginTop10">
						<span v-for="(itemHouse, index2) in item.accessHouse" :key="itemHouse.id">{{ itemHouse.name }}  
						  <span v-if="index2 != item.accessHouse.length - 1">、</span>
						</span>
					</view>
				</view>
				<view v-if="item.mainCount == 1" class="edit">
					<image src="../../static/pics/mine/icon_compile.png" @tap="editAccessHouse(item.id, item.name)"></image>
				</view>
				<view class="clear"></view>
			</view>
		</view>
    </view>
</template>

<script>
	import apiUtils from '../../common/utils/api.js';
    export default {
		data() {
			return {
				accounts: []
			}
		},
		onShow() {
			let _this = this;
			apiUtils.accountLists(function(res){
				_this.accounts = res;
			})
		},
        methods: {
			editAccessHouse(id, name) {
				uni.navigateTo({
					url: '/pages/mine/accessHouseForm?id=' + id + "&name=" + name
				})
			}
        },	
    }
</script>

<style lang="scss">
	page{
		background-color: #f1f1f1;
		background-image: url('http://testimg.fuyoust.com/background_0001.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment:fixed
	}
	.clear{
		clear: both;
	}
	.account_list{
		width: 690upx;
		padding: 30upx;
		height: 200upx;
		.account{
			margin-bottom: 30upx;
			border-radius: 20upx;
			padding: 25upx;
			background-color: #fff;
			.face{
				flex-shrink:0;
				width:150upx;
				height:150upx;
				float: left;
				image{
					width:100%;
					height:100%;
					border-radius:100%
				}
			}
			.name{
				margin-left: 40upx;
				float: left;
				.house{
					font-size:12px;
					margin-top:5px;
				}
			}
			.edit{
				//margin-top: 30rpx;
				float: right;
				image{
					margin-left: 20rpx;
					width: 50rpx;
					height: 50rpx;
				}
			}
		}
	}

</style>
