<template>
	<view class="a"
	:style="{'background-image': 'url('+picc+')',
                    'background-size': '100% 100%'}">
	<view class="list">
		<view class="account_list"><button class="button" @click="click1(0)"><image src="../../static/backgroundpic/1.jpg" mode="aspectFill"></image></button></view>
		<view class="account_list"><button class="button" @click="click1(1)"><image src="../../static/backgroundpic/2.jpg" mode="aspectFill"></image></button></view>
		<view class="account_list"><button class="button" @click="click1(2)"><image src="../../static/backgroundpic/3.jpg" mode="aspectFill"></image></button></view>
		<view class="account_list"><button class="button" @click="click1(3)"><image src="../../static/backgroundpic/4.jpg" mode="aspectFill"></image></button></view>
	</view>
</view>
</template>

<script>
	import apiUtils from '../../common/utils/api.js';
	export default {
		data() {
			return {
				backgroundpic: "",
				picc:""
		           }
		},
		methods: {
			onShow(){
				let _this=this;
				_this.picc=[];
				uni.getStorage({
					key:'backgroundpic',
					success(e) {
						_this.picc = e.data;
						console.log(_this.picc);
					}
				})
			},
			click1(id){
			    let pics =["../../static/backgroundpic/1.jpg","../../static/backgroundpic/2.jpg","../../static/backgroundpic/3.jpg","../../static/backgroundpic/4.jpg"];
				let _this=this;
				uni.setStorage({
					key : 'backgroundpic',
					data : pics[id],
				    success:function(){
					console.log('success');
				}
				});
				uni.redirectTo({
					url:'../../pages/mine/backgroundPic'
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f1f1f1;
		background-image: url('http://testimg.fuyoust.com/background_0001.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-attachment:fixed;
		height: 100%;
	
	}
	.a{
		height: 100%;
	}
	.account_list{
		border-radius: 90rpx;
		margin: auto;
		width: 95%;
		height: 100%;
		background-color: #FEFEFE;
		margin-top: 10rpx;
	}
	.button{
		width: 100%;
		height: 200rpx;
	}

   
</style>
