<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>房间</view>
				<input v-model="house.name" type="text" placeholder="请输入房间名称" style="text-align: right;"/>
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
				house: {
					id: '',
					name: ''
				}
			}
		},
		methods: {
			
			formSubmit: function(e) {
				let _this = this;
				if( _this.house.name == ''){
					uni.showToast({
						title: '请填写房间名称',
						icon: 'none'
					})
					return;
				};
				uni.showModal({
				    title: '提示',
				    content: "确认操作？",
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.saveOrUpdateHouse(
								_this.house,
							function(res){
								uni.navigateBack();
								uni.showToast({title: "房间添加成功，非主账户账号，请设置权限后可见。",icon: 'none'})
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	button{
		background: #6E8DD2!important;
	}
</style>
