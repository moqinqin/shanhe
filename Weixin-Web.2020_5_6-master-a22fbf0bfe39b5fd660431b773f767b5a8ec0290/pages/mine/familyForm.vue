<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-list-cell-db"><span class="red">*</span>称谓</view>
				<input v-model="account.name" type="text" placeholder="请输入称谓" style="text-align: right;"/>
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
		
		<view>
			<uni-section title= "房间权限" type="line"></uni-section>
			<view v-for="(house) in houses" :key="house.id" class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">{{ house.name }}</view>
				<switch v-if="house.accessed == 1" checked style="transform:scale(0.8)" 
					color="#6E8DD2" @change="accessHouse(house.id)"/>
				<switch v-else style="transform:scale(0.8)" color="#6E8DD2" 
					@change="accessHouse(house.id)"/>
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
				account: {
					id: '',
					name: '',
					username: '',
					password: '',
					passwordAgain: ''
				},
				save: true,
				houses: []
			}
		},
		onLoad(e) {
			let _this = this;
			
			//这边需要注意，是主账号进入新建页面，所以他可以看到所有的房间列表
			//如果是子账户进来，只能看到自己账户下的房间列表（tips：子账户进不了新建页面）
			apiUtils.houseAll(function(res){
				let houseList = res;
				
				console.log(e.id)
				
				if( e.id !== undefined ){
					
					_this.save = false;
					_this.account.id = e.id;
					_this.account.name = e.name;
					
					uni.setNavigationBarTitle({
						title: e.name
					});
					
					apiUtils.accountDetail({
						accountId: e.id
					},function(resp){
						_this.account.username = resp.username;
						for(let i = 0; i < houseList.length; i++){
							for( let j = 0; j < resp.accessHouse.length; j++ ){
								if(houseList[i].id == resp.accessHouse[j].id){
									houseList[i].accessed = 1;
								}
							}
						}
						_this.houses = houseList;
					})
				}
				
				_this.houses = houseList;

			})
		
		},
		onShow() {
			let _this = this;
		},
        methods: {
			formSubmit(e) {
				let _this = this;
				if( _this.account.name == ''){
					uni.showToast({
						title: '请输入称谓',
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
				let accessHouses = _this.houses;
				let accesshouseAfter = [];
				for( let i = 0; i< accessHouses.length; i++ ){
					if( accessHouses[i].accessed == 1 ){
						accesshouseAfter.push(accessHouses[i].id);
					}
				}
				let houseIdString = accesshouseAfter.join(",");
				
				let msg = "确认新增？";
				if(!_this.save){
					msg = "确认修改？";
				}
				
				uni.showModal({
				    title: '提示',
				    content: msg,
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.insertUserAccount({
								id: _this.account.id,
								houseIds: houseIdString,
								name: _this.account.name,
								tel: _this.account.username,
								password: _this.account.passwordAgain
							},function(){
								uni.navigateBack();
								uni.showToast({title: "账户添加成功",icon: 'none'});
							});
						}
					},
				});
			},
			checkMobile(mobile){
			    return RegExp(/^1[34578]\d{9}$/).test(mobile);
			},
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
			}
        }
    }
</script>

<style>
	page{
		background-color: #F1F1F1;
	}
	button{
		background: #6E8DD2!important;
	}
</style>
