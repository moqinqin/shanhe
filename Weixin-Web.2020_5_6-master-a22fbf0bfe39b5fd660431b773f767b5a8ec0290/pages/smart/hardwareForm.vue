<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>房间</view>
				<picker @change="bindPickerHouseChange" :value="index" :range="houseArray" range-key="name">
					<view v-if="house.id!=''" class="uni-input">
						{{ house.name }}
					</view>
					<view v-else class="uni-input low_color">
						请选择...
					</view>
				</picker>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>设备</view>
				<picker @change="bindPickerHardwareChange" :value="index" :range="hardwareArray" range-key="name">
					<view v-if="hardware.id!=''" class="uni-input">
						{{ hardware.name }}
					</view>
					<view v-else class="uni-input low_color">
						请选择...
					</view>
				</picker>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>开关</view>
				<view>
					<switch v-if="control == 0" checked style="transform:scale(0.8)"
						color="#6E8DD2" @change="closeOrOpen"/>
					<switch v-else style="transform:scale(0.8)" color="#6E8DD2" 
						@change="closeOrOpen"/>
				</view>
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
				control: 1,
				houseArray: [],
				house: {
					id: '',
					name: '请选择...'
				},
				hardwareArray: [],
				hardware: {
					id: '',
					name: '请选择...',
					control: 1,
					customerHardwareId: "",
					customerHardwareName: ""
				}
			}
		},
		onShow() {
			let _this = this;
			apiUtils.houseAll(function(res){
				_this.houseArray = res;
			});
		},
		methods:{
			closeOrOpen: function(e){
				let _this = this;
				if( _this.hardware.id == '' ){
					uni.showToast({
						title: '请选择房间以及设备',
						icon: 'none'
					})
					return;
				}
				_this.control = _this.control == 0 ? 1 : 0;
				_this.hardware.control = _this.control;
			},
			bindPickerHouseChange: function(e) {
				let _this = this;
				_this.house = _this.houseArray[e.target.value];
				_this.hardwareArray = [];
				_this.hardware = {
					id: '',
					name: '请选择...'
				};
				apiUtils.findHouseDetailsById({id: _this.house.id}, function(res){
					_this.hardwareArray = res;
				})
			},
			bindPickerHardwareChange: function(e){
				let _this = this;
				_this.hardware = _this.hardwareArray[e.target.value];
				_this.hardware.control = _this.control;
			},
			formSubmit: function(e) {
				let _this = this;
				if( _this.house.id == '' || _this.hardware.id == ''){
					uni.showToast({
						title: '请选择房间以及设备',
						icon: 'none'
					})
					return;
				};
				
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2]; //上一个页面 

				let sceneHouses = prevPage.data.houses;
				if(_this.checkHasHardware(sceneHouses)){
					uni.showToast({
						title: '该情景中已经存在该设备',
						icon: 'none'
					})
					return;
				}
				_this.hardware.customerHardwareId = _this.hardware.id;
				_this.hardware.customerHardwareName = _this.hardware.name;

				console.log(sceneHouses);
				prevPage.$vm.addHouseHardware(_this.house, _this.hardware);
				uni.navigateBack();
				uni.showToast({title: "添加成功",icon: 'none'})
			},
			checkHasHardware: function(houses){
				let _this = this;
				for( let i = 0; i < houses.length; i++ ){
					if(houses[i].id == _this.house.id){
						let hasSceneHardwares = houses[i].sceneHardwares;
						for(let j = 0 ; j < hasSceneHardwares.length; j ++){
							if(hasSceneHardwares[j].customerHardwareId == _this.hardware.id){
								return true;
							}
						}
					}
				}
				return false;
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
</style>
