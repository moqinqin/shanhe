<template>
	<view :style="{'background-image': 'url('+picc+')',
                    'background-size': '100% 100%'}" class="aa">
		<view class="padding" v-if="type1Scenes.length != 0" >
			<view class="title">
				手动
			</view>
			<view class="scenes_list">
				<view class="scene" v-for="(scene) in type1Scenes" :key="scene.id">
					<view class="scene_detail"  @tap="doScene(scene.id)">
						<view class="image">
							<image src="../../static/pics/scenes/sun.png"></image>
						</view>
						<view class="name">
							<view>{{ scene.name }}</view>
							<view class="house">{{ scene.containHouse }}</view>
						</view>
					</view>
					<view class="more">
						<image src="../../static/pics/mine/icon_compile.png" 
							@tap="sceneDetails(scene.id)"></image>
						<image v-if="scene.favorited == 0" src="../../static/pics/favourite.png"
							@tap="favoriteScene(scene.id, scene.favorited)"></image>
						<image v-else src="../../static/pics/favourite_select.png"
							@tap="favoriteScene(scene.id, scene.favorited)"></image>
					</view>
					<view class="clear"></view>
				</view>
			</view>
		</view>
		
		<view  class="padding" v-if="type0Scenes.length != 0">
			<view class="title">
				自动
			</view>
			<view class="scenes_list">
				<view class="scene" v-for="(scene) in type0Scenes" :key="scene.id">
					<view class="scene_detail"  @tap="doScene(scene.id)">
						<view class="image">
							<image src="../../static/pics/scenes/sun.png"></image>
						</view>
						<view class="name">
							<view>{{ scene.name }}</view>
							<view class="house">{{ scene.containHouse }}</view>
						</view>
					</view>
					<view class="more">
						<image src="../../static/pics/mine/icon_compile.png" 
							@tap="sceneDetails(scene.id)"></image>
						<image v-if="scene.favorited == 0" src="../../static/pics/favourite.png"
							@tap="favoriteScene(scene.id, scene.favorited)"></image>
						<image v-else src="../../static/pics/favourite_select.png"
							@tap="favoriteScene(scene.id, scene.favorited)"></image>
					</view>
					<view class="clear"></view>
				</view>
			</view>
		</view>
		<view class="addButton">
			<image src="../../static/index/add.png" @tap="addScene"></image>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniSection from '@/components/uni-section/uni-section.vue'
	
	import apiUtils from '../../common/utils/api.js';
	
	export default {
		data() {
			return {
				type0Scenes: [],
				type1Scenes: [],
				picc:"",
			}
		},
		components: {
			uniIcons,
			uniSection
		},
		onShow() {
			let _this = this;
			_this.picc= [];
		  uni.getStorage({
		  				key:"token",
		  				success(e){
		  					let tokens=e.data.split("_");
		  					if(tokens.length == 1){
		  						_this.picc='http://testimg.fuyoust.com/background_0001.png'}else {
		  							uni.getStorage({
		  				key: "backgroundpic",
		  				success(e){
		  				_this.picc=e.data;
		  				console.log(_this.picc);
		  				}
		  			});}
		  				}
		  			}),
	      apiUtils.getScenesByAccount(function(res){
				_this.type0Scenes = res["0"];//自动
				_this.type1Scenes = res["1"];//手动
			})
		},
		methods: {
			doScene(id){
				uni.showModal({
				    title: '提示',
				    content: "是否触发该场景？",
				    success: function (res) {
				        if (res.confirm) {
							uni.showToast({title: "触发成功",icon: 'none'});
						}
					},
				});
			},
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
								uni.showToast({title: "操作成功",icon: 'none'})
								apiUtils.getScenesByAccount(function(res){
									_this.type0Scenes = res["0"];//自动
									_this.type1Scenes = res["1"];//手动
								})
							});
						}
					},
				});
			},
			sceneDetails(e) {
				uni.navigateTo({
					url:'../../pages/smart/details?id=' + e
				});
			},
			addScene() {
				uni.navigateTo({
					url:'../../pages/smart/form'
				});
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
	.aa{
		width: 100%;
		height: 100%;
	}
	
	.padding{
		background-color: #F8F8F8;
		border-radius: 30upx;
		padding: 30rpx;
		margin: auto;
		width: 85%;
		margin-top: 25rpx;
	}
	.clear{
		clear: both;
	}
	.marginTop50{
		margin-top: 50upx;
	}
	.title{
		font-weight: 700;
		margin-bottom: 20rpx;
		margin-left: 10rpx;
	}
	.scenes_list{
		.scene{
			color: #333333;
			background-color: #D4D4D4;
			border-radius: 30upx;
			height: 160rpx;
			padding: 4rpx;
			box-shadow:1px 1px 1px 1px #bbb;
			margin-bottom: 16rpx;
			.scene_detail{
				float: left;
				height: 160rpx;
				width: 500rpx;
				.image{
					float: left;
					margin-top: 32rpx;
					image{
						margin-left: 30upx;
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
			}
			.more{
				float: right;
				margin-top: -130rpx;
				margin-right: 20rpx;
				image{
					margin-left: 20rpx;
					width: 50rpx; 
					height: 50rpx;
				}
			}
		}
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
</style>