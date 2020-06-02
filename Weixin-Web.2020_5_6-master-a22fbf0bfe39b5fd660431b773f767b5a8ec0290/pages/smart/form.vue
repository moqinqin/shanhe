<template>
	<view>
		<view class="example-body">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db"><span class="red">*</span>场景名称</view>
					<input v-model="scene.name" type="text" placeholder="请输入场景名称" style="text-align: right;"/>
				</view>
			</view>	
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db"><span class="red">*</span>场景类型</view>
					<view>
						<radio-group @change="changeSceneType">
							<label v-if="scene.sceneType == 0">
								<radio value="1" color="#6E8DD2"/><text>手动</text>
								<radio value="0" style="margin-left: 10upx;" color="#6E8DD2" checked/><text>自动</text>
							</label>
							<label v-else>
								<radio value="1" color="#6E8DD2" checked/><text>手动</text>
								<radio value="0" color="#6E8DD2" style="margin-left: 10upx;"/><text>自动</text>
							</label>
						</radio-group>
					</view>
				</view>
			</view>	
		</view>

		<view class="house_list" v-for="(house) in houses" :key="house.id">
			<uni-section :title= "house.name" type="line"></uni-section>
			<view v-for="(sceneHardware) in house.sceneHardwares" :key="sceneHardware.id">
				<uni-swipe-action>
					<uni-swipe-action-item :options="options1" @click="removeHardware(sceneHardware.id)">
						<view class="uni-list">
							<view class="uni-list-cell uni-list-cell-pd">
								<view class="uni-list-cell-db">{{ sceneHardware.customerHardwareName }}</view>
								<switch v-if="sceneHardware.control == 0" checked style="transform:scale(0.8)" 
									color="#6E8DD2" @change="closeOrOpen(sceneHardware.id)"/>
								<switch v-else style="transform:scale(0.8)" color="#6E8DD2" 
									@change="closeOrOpen(sceneHardware.id)"/>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		
		<view class="uni-padding-wrap uni-common-mt">
		    <button @tap="formSubmit" style="margin-bottom: 20upx;margin-top: 20upx;background-color: #ebe9dd!important;">提交</button>
		</view>
		<view class="addButton">
			<image src="../../static/index/add.png" @tap="addHardware"></image>
		</view>
		
	</view>
</template>

<script>
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	
	import apiUtils from '../../common/utils/api.js';
	export default {
		components: {
			uniSection,
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				options1: [{
					text: '移除设备',
					style: {
						backgroundColor: 'rgb(255,58,49)'
					}
				}],
				id: '',
				houses: [],
				scene: {
					id: "",
					name: "",
					sceneType: 0
				},
				isOpened: false
			}
		},
		onLoad(e) {
			let _this = this;
			_this.id = e.id;
		},
		onShow() {
			let _this = this;
		},
		methods: {
			addHouseHardware: function(house, hardware){
				let _this = this;
				if(!_this.checkHasHouse(house.id)){
					let sceneHardwares = [];
					sceneHardwares.push(hardware);
					house.sceneHardwares = sceneHardwares;
					_this.houses.push(house);
				}else{
					for( let i = 0; i < _this.houses.length; i ++ ){
						if(_this.houses[i].id == house.id){
							_this.houses[i].sceneHardwares.push(hardware);
						}
					}
				}
			},
			checkHasHouse: function (houseId){
				let _this = this;
				for( let i = 0; i < _this.houses.length; i++ ){
					if(_this.houses[i].id == houseId){
						return true;
					}
				}
				return false;
			},
			addHardware(){
				uni.navigateTo({
					url:'../../pages/smart/hardwareForm'
				})
			},
			closeOrOpen(e) {
				let hardwareId = e;
				let _this = this;
				for( let i = 0; i < _this.houses.length; i++ ){
					let sceneHardwares = [];
					let hasSceneHardwares = _this.houses[i].sceneHardwares;
					for(let j = 0 ; j < hasSceneHardwares.length; j ++){
						if(hasSceneHardwares[j].id == e){
							hasSceneHardwares[j].control = (hasSceneHardwares[j].control == 1? 0:1);
							sceneHardwares.push(hasSceneHardwares[j]);
						}else{
							sceneHardwares.push(hasSceneHardwares[j]);
						}
						_this.houses[i].sceneHardwares = sceneHardwares;
					}
				}
			},
			removeHardware(e) {
				let hardwareId = e;
				let _this = this;
				let currentHouse = _this.houses;
				for( let i = 0; i < currentHouse.length; i++ ){
					let sceneHardwares = [];
					let hasSceneHardwares = currentHouse[i].sceneHardwares;
					console.log(hasSceneHardwares);
					for(let j = 0 ; j < hasSceneHardwares.length; j ++){
						if(hasSceneHardwares[j].id != e){
							sceneHardwares.push(hasSceneHardwares[j]);
						}
						currentHouse[i].sceneHardwares = sceneHardwares;
					}
				}
				_this.houses = currentHouse;
			},
			changeSceneType(e) {
				let _this = this;
				_this.scene.sceneType = e.detail.value;
			},
			formSubmit: function(e) {
				let _this = this;
				if( _this.scene == {} || _this.scene.name == ''){
					uni.showToast({
						title: '请填写场景名称',
						icon: 'none'
					})
					return;
				};
				
				let newSceneHardwares = [];
				for( let i = 0; i < _this.houses.length; i++ ){
					let hasSceneHardwares = _this.houses[i].sceneHardwares;
					for(let j = 0 ; j < hasSceneHardwares.length; j ++){
						let hardwareControl = {
							hardwareId: hasSceneHardwares[j].customerHardwareId,
							control: hasSceneHardwares[j].control
						};
						newSceneHardwares.push(hardwareControl);
					}
				}

				let sceneHardwareString = JSON.stringify(newSceneHardwares);
				apiUtils.saveOrUpdateScene({
					id: "",
					name: _this.scene.name,
					sceneType: _this.scene.sceneType,
					sceneHardwareString: sceneHardwareString
				},function(res){
					uni.navigateBack();
					uni.showToast({title: "添加成功",icon: 'none'})
				});
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