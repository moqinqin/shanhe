<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>主机名称</view>
				<input v-model="name" type="text" placeholder="请输入主机名称" style="text-align: right;"/>
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
				snCode: '',
				name: '',
				account: {}
			}
		},
		onLoad(e) {
			let _this = this;
			_this.snCode = e.snCode;
			uni.getStorage({
				key: "account",
				success(e){
					_this.account = e.data;
				}
			});
		},
		methods: {
			formSubmit(e) {
				let _this = this;
				if( _this.name === '' ){
					uni.showToast({
						title: '请输入主机名称',
						icon: 'none'
					});
				}else{
					uni.showModal({
					    title: '提示',
					    content: '确认注册该主机？',
					    success: function (res) {
					        if (res.confirm) {
								apiUtils.addCustomerHostBox({
									snCode: _this.snCode,
									accountId: _this.account.id,
									name: _this.name
								},function(){
									uni.navigateBack();
									uni.showToast({title: "主机添加成功，请到切换页面查看",icon: 'none'});
								});
							}
						},
					});
				}
			}
		}
	}
</script>

<style>

</style>
