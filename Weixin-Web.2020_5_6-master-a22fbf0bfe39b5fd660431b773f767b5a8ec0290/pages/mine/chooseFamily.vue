<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>用户手机号</view>
				<input v-model="name" type="text" placeholder="请输入用户手机号" style="text-align: right;"/>
			</view>
		</view>	
		<view class="uni-padding-wrap uni-common-mt">
		    <button @tap="searchAccount" style="margin-bottom: 20upx;margin-top: 20upx;background-color: #ebe9dd!important;">搜索用户</button>
		</view>
		
		<view>
			<uni-section title= "查询结果" type="line"></uni-section>
			
			<view class="icon">
				<image @tap="changeUserIcon" :src="account.icon == null? '../../static/missing-face.png' : account.icon"></image>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">昵称</view>
					<input disabled="true"  v-model="account.name" type="text" placeholder="昵称" style="text-align: right;"/>
				</view>
			</view>	
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">手机号</view>
					<input disabled="true" v-model="account.username" type="text" placeholder="手机号" style="text-align: right;"/>
				</view>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<button @tap="formSubmit" style="margin-bottom: 20upx;margin-top: 20upx;background-color: #ebe9dd!important;">确认添加</button>
		</view>
	</view>
</template>

<script>
	import apiUtils from '../../common/utils/api.js';
	import uniSection from '@/components/uni-section/uni-section.vue'
	export default {
		data() {
			return {
				name: '',
				account: {
					id: '',
					icon: '',
					name: '',
					username: ''
				}
			}
		},
		methods: {
			checkMobile(mobile){
			    return RegExp(/^1[34578]\d{9}$/).test(mobile);
			},
			searchAccount: function(){
				let _this = this;
				if( _this.name == '' || !_this.checkMobile(_this.name)){
					uni.showToast({
						title: '请确认要搜索的手机号',
						icon: 'none'
					})
				}else{
					apiUtils.searchUserAccountByTel({tel: _this.name}, function(res){
						_this.account = res;
						if( res.name == null || res.name == '' ){
							_this.account.name = "手机用户:" + _this.name;
						}
					});
				}
			},
			formSubmit: function(){
				let _this = this;
				if( _this.account.id == '' ){
					uni.showToast({
						title: '请先搜索用户',
						icon: 'none'
					})
				}else{
					uni.showModal({
					    title: '提示',
					    content: "是否确认添加该家庭成员？",
					    success: function (res) {
					        if (res.confirm) {
								uni.getStorage({
									key: "token",
									success(e){
										let tokens = e.data.split("_");

										let customerId = tokens[1];
										let accountId = _this.account.id;
										
										apiUtils.addCustomerAccount({
											customerId: customerId,
											accountId: accountId
										}, function(res){
											uni.navigateBack();
											uni.showToast({title: "家庭用户添加成功",icon: 'none'});
										});
									}
								});
							}
						},
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.icon{
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		image{
			margin-left: 275upx;
			width: 200upx;
			height: 200upx;
			border-radius: 30rpx;
		}
	}
</style>
