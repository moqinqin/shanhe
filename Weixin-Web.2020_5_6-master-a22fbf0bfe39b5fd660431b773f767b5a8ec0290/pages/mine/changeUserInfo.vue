<template>
	<view>
		<view class="icon">
			<image @tap="changeUserIcon" :src="account.icon"></image>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>昵称</view>
				<input v-model="account.name" type="text" placeholder="请输入昵称" style="text-align: right;"/>
			</view>
		</view>	
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>手机号</view>
				<input disabled="true" v-model="account.username" type="text" placeholder="请输入手机号" style="text-align: right;"/>
			</view>
		</view>	
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span v-if="save" class="red">*</span>密码</view>
				<input v-model="account.password" type="password" placeholder="请输入密码" style="text-align: right;"/>
			</view>
		</view>	
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span v-if="save" class="red">*</span>确认密码</view>
				<input v-model="account.passwordAgain" type="password" placeholder="请确认密码" style="text-align: right;"/>
			</view>
		</view>

		<view class="uni-padding-wrap uni-common-mt">
		    <button @tap="formSubmit" style="margin-bottom: 20upx;margin-top: 20upx;background-color: #ebe9dd!important;">提交</button>
		</view>
	</view>
</template>

<script>

	import apiUtils from '../../common/utils/api.js';
	
    export default {
		data() {
			return {
				account: {
					id: '',
					name: '',
					username: '',
					password: '',
					passwordAgain: '',
					icon: ''
				},
				save: false
			}
		},
		onLoad(e) {
			let _this = this;
			_this.account.id = e.id
		},
		onShow() {
			let _this = this;
			apiUtils.accountDetail({
				accountId: _this.account.id
			},function(resp){
				console.log(resp);
				_this.account.id = resp.id;
				_this.account.name = resp.name;
				_this.account.username = resp.username;
				_this.account.icon = (resp.icon == '' || resp.icon == null) ? '../../static/missing-face.png' : resp.icon;
			})
		},
        methods: {
			changeUserIcon(){
				let _this = this;
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						apiUtils.uploadFileToLocal(tempFilePaths, function(res){
							let response = JSON.parse(res.data);
							let icon = apiUtils.getHostIp() + '/common/showImage/' + response.data.id;
							_this.account.icon = icon;
						});
				    }
				});
			},
			formSubmit(e) {
				let _this = this;
				if( _this.account.name == ''){
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					})
					return;
				}else if( _this.account.username == ''){
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return;
				}else if( !_this.checkMobile( _this.account.username ) ){
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return;
				}else if( _this.save && _this.account.password == ''){
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return;
				}else if( _this.save && _this.account.passwordAgain == ''){
					uni.showToast({
						title: '请确认密码',
						icon: 'none'
					})
					return;
				}else if( (_this.save && _this.account.passwordAgain !== _this.account.password) || 
					(!_this.save && _this.account.password !== '' && _this.account.passwordAgain !== _this.account.password) ){
					uni.showToast({
						title: '两次密码不一致',
						icon: 'none'
					})
					return;
				}
				
				//校验通过
				let msg = "确认修改？";
				uni.showModal({
				    title: '提示',
				    content: msg,
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.updateMineAccount({
								name: _this.account.name,
								password: _this.account.password,
								icon: _this.account.icon
							},function(res){
								uni.setStorage({
									key: "account",
									data : res,
								});
								uni.navigateBack();
								uni.showToast({title: "修改成功",icon: 'none'})
							})
						}
					},
				});
			},
			checkMobile(mobile){
			    return RegExp(/^1[34578]\d{9}$/).test(mobile);
			}
        }
    }
</script>

<style lang="scss">
	page{
		background-color: #F1F1F1;
	}
	button{
		background: #6E8DD2!important;
	}
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
