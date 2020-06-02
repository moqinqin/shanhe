<template>
	<view>
		<view class="icon">
			<image @tap="changeHardwareIcon" 
				:src="hardware.icon == ''? '../../static/index/phone.png' : hardware.icon "></image>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>名称</view>
				<input v-model="hardware.name" type="text" placeholder="请输入名称" style="text-align: right;"/>
			</view>
		</view>	
		
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>品牌</view>
				<input v-model="hardware.brand" type="text" placeholder="请输入品牌" style="text-align: right;"/>
			</view>
		</view>	
		
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>型号</view>
				<input v-model="hardware.model" type="text" placeholder="请输入型号" style="text-align: right;"/>
			</view>
		</view>	
		
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>是否启用</view>
				<switch checked style="transform:scale(0.8)" color="#6E8DD2"/>
			</view>
		</view>
		
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>设备类型</view>
				<picker @change="bindPickerHardwareTypeChange" :value="index" :range="hardwareTypes" range-key="name">
					<view v-if="hardware.hardwareTypeName!=''" class="uni-input">
						{{ hardware.hardwareTypeName }}
					</view>
					<view v-else class="uni-input low_color">
						请选择...
					</view>
				</picker>
			</view>
		</view>
		
		<view>
			<uni-section title= "小度音响" type="line"></uni-section>
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db"><span class="red">*</span>设备类型</view>
					<picker @change="duerosDeviceTypeChange" value="id" :range="duerosDeviceType" range-key="name">
						<view v-if="hardware.duerosDeviceTypeId!=''" class="uni-input">
							{{ hardware.duerosDeviceTypeName }}
						</view>
						<view v-else class="uni-input low_color">
							请选择...
						</view>
					</picker>
				</view>
				
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db"><span class="red">*</span>设备控制</view>
					<checkbox-group @change="duerosControllerTypeChange">
						<label v-for="(duerosControllerTypeDetail) in duerosControllerType" :key="duerosControllerTypeDetail.id">
							<checkbox :value="duerosControllerTypeDetail.value" 
							color="#6E8DD2" style="transform:scale(0.7)" />{{duerosControllerTypeDetail.name}}
						</label>
					</checkbox-group>
				</view>
			</view>
		</view>
		
		<view>
			<uni-section title= "天猫精灵" type="line"></uni-section>
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db"><span class="red">*</span>设备类型</view>
					<picker @change="aligenieDeviceTypeChange" value="id" :range="aligenieDeviceType" range-key="name">
						<view v-if="hardware.aligenieDeviceTypeId!=''" class="uni-input">
							{{ hardware.aligenieDeviceTypeName }}
						</view>
						<view v-else class="uni-input low_color">
							请选择...
						</view>
					</picker>
				</view>
				
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db"><span class="red">*</span>设备控制</view>
					<checkbox-group @change="aligenieControllerTypeDetailChange">
						<label v-for="(aligenieControllerTypeDetail) in aligenieControllerType" 
							:key="aligenieControllerTypeDetail.id">
							<checkbox :value="aligenieControllerTypeDetail.value" 
							color="#6E8DD2" style="transform:scale(0.7)" />{{aligenieControllerTypeDetail.name}}
						</label>
					</checkbox-group>
				</view>
			</view>
		</view>
		
		<view class="uni-padding-wrap uni-common-mt">
		    <button @tap="formSubmit" style="margin-bottom: 20upx;margin-top: 20upx;background-color: #ebe9dd!important;">提交</button>
		</view>
	</view>
</template>

<script>
	import uniSection from '@/components/uni-section/uni-section.vue'
	
	import apiUtils from '../../common/utils/api.js';
	export default {
		components: {
			uniSection
		},
		data() {
			return {
				hardware: {
					houseId:'',
					icon: '',
					iconId: '',
					name: '',
					brand: '',
					model: '',
					enabled: 'true',
					hardwareType: 0,
					hardwareTypeName: '',
					
					duerosDeviceTypeId: '',
					duerosDeviceTypeName: '',
					duerosControllers: [],
					
					aligenieDeviceTypeId: '',
					aligenieDeviceTypeName: '',
					aligenieControllers: []
				},
				hardwareTypes:[
					{name: '家电'},
					{name: '灯'},
					{name: '门锁'},
					{name: '监控'},
					{name: '安防'}
				],
				aligenieDeviceType: [],
				aligenieControllerType:[],
				
				duerosDeviceType: [],
				duerosControllerType: []
			}
		},
		onLoad(e) {
			let _this = this;
			_this.hardware.houseId = e.houseId;
		},
		onShow(){
			let _this = this;
			apiUtils.findDictsByKey("duerosDeviceType", function(res){
				_this.duerosDeviceType = res;
			});
			apiUtils.findDictsByKey("aligenieDeviceType", function(res){
				_this.aligenieDeviceType = res;
			});
			apiUtils.findDictsByKey("aligenieControllerType", function(res){
				_this.aligenieControllerType = res;
			});
			apiUtils.findDictsByKey("duerosControllerType", function(res){
				_this.duerosControllerType = res;
			});
		},
		methods: {
			formSubmit: function(){
				let _this = this;
				if("" === _this.hardware.iconId || 
					"" === _this.hardware.name || 
					"" === _this.hardware.brand || 
					"" === _this.hardware.model){
					uni.showToast({
						title: '必填项必填',
						icon: 'none'
					})
					return;
				}else if("" === _this.hardware.hardwareTypeName){
					uni.showToast({
						title: '请选择设备类型',
						icon: 'none'
					})
					return;
				}else if( "" === _this.hardware.duerosDeviceTypeId){
					uni.showToast({
						title: '请选择小度音响设备类型',
						icon: 'none'
					})
					return;
				}else if(_this.hardware.duerosControllers.length == 0){
					uni.showToast({
						title: '请勾选小度音响控制方式',
						icon: 'none'
					})
					return;
				}else if( "" === _this.hardware.aligenieDeviceTypeId){
					uni.showToast({
						title: '请选择天猫精灵音响设备类型',
						icon: 'none'
					})
					return;
				}else if(_this.hardware.aligenieControllers.length == 0){
					uni.showToast({
						title: '请勾选天猫精灵音响控制方式',
						icon: 'none'
					})
					return;
				}
				
				uni.showModal({
				    title: '提示',
				    content: "确认提交添加该设备？",
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.addHouseHardware({
								data: JSON.stringify(_this.hardware)
							},function(res){
								uni.navigateBack();
								uni.showToast({title: "添加成功！",icon: 'none'})
							})
						}
					},
				});
			},
			changeHardwareIcon: function(){
				let _this = this;
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						apiUtils.uploadFileToLocal(tempFilePaths, function(res){
							let response = JSON.parse(res.data);
							let icon = apiUtils.getHostIp() + '/common/showImage/' + response.data.id;
							_this.hardware.icon = icon;
							_this.hardware.iconId = response.data.id;
						});
				    }
				});
			},
			aligenieControllerTypeDetailChange: function(e){
				let _this = this;
				_this.hardware.aligenieControllers = e.detail.value;
			},
			duerosControllerTypeChange: function(e){
				let _this = this;
				_this.hardware.duerosControllers = e.detail.value;
			},
			aligenieDeviceTypeChange: function(e){
				let index = e.detail.value;
				let _this = this;
				_this.hardware.aligenieDeviceTypeId = _this.aligenieDeviceType[index].value;
				_this.hardware.aligenieDeviceTypeName = _this.aligenieDeviceType[index].name;
			},
			duerosDeviceTypeChange: function(e){
				let index = e.detail.value;
				let _this = this;
				_this.hardware.duerosDeviceTypeId = _this.duerosDeviceType[index].value;
				_this.hardware.duerosDeviceTypeName = _this.duerosDeviceType[index].name;
			},
			bindPickerHardwareTypeChange: function(e){
				let _this = this;
				_this.hardware.hardwareType = e.target.value;
				_this.hardware.hardwareTypeName = _this.hardwareTypes[_this.hardware.hardwareType].name;
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F1F1F1;
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
