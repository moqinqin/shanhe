<template>
	<view>
		<view v-for="(house) in houses" :key="house.id" class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db">{{ house.name }}</view>
				<switch v-if="house.accessed == 1" checked style="transform:scale(0.8)" 
					color="#6E8DD2" @change="accessHouse(house.id)"/>
				<switch v-else style="transform:scale(0.8)" color="#6E8DD2" 
					@change="accessHouse(house.id)"/>
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
				id: "",
				name: "",
				houses: []
			}
		},
		onShow() {
			let _this = this;
			apiUtils.findAllAccountHousesList({
				accountId: _this.id
			} ,function(res){
				_this.houses = res;
			})
		},
		onLoad(e) {
			let _this = this;

			_this.id = e.id;
			_this.name = e.name;

			uni.setNavigationBarTitle({
				title: _this.name
			});
		},
		methods: {
			accessHouse(id) {
				let _this = this;
				let houseList = _this.houses;
				for( let i = 0 ; i < houseList.length; i++ ){
					if( houseList[i].id == id ){
						houseList[i].accessed = (houseList[i].accessed == 1 ? 0 : 1);
						break;
					}
				}
				_this.houses = houseList;
			},
			formSubmit(){
				let _this = this;
				let accessHouses = _this.houses;
				
				let accesshouseAfter = [];
				for( let i = 0; i< accessHouses.length; i++ ){
					if( accessHouses[i].accessed == 1 ){
						accesshouseAfter.push(accessHouses[i].id);
					}
				}
				
				let houseIdString = accesshouseAfter.join(",");
				
				uni.showModal({
				    title: '提示',
				    content: "确认修改？",
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.accountAccess({
								houseIds: houseIdString,
								accountId: _this.id
							},function(){
								uni.navigateBack();
								uni.showToast({title: "操作成功",icon: 'none'});
							});
						}
					},
				});
			}
		}
	}
</script>

<style>
	page{
		background: #F1F1F1;
	}
	button{
		background: #6E8DD2!important;
	}
</style>
