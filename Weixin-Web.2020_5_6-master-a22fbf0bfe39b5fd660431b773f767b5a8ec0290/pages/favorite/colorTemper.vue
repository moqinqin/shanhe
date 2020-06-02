<template>
	<view>
		<view class="nav_tabs">
			<view class="nav_tab">
				<view :class="active_nav == 0? 'choose': ''" @tap="chooseModel(0)">手动模式</view>
			</view>
			<view class="nav_tab">
				<view :class="active_nav == 1? 'choose': ''" @tap="chooseModel(1)">智能模式</view>
			</view>
			<view style="clear: both;"></view>
		</view>
		<view class="color_temper">
			<view class="color_detail">亮度{{ light_size }}% | 色温值 {{ color_temper }}k</view>
			<view class="color_contro">
				<movable-area>
					<movable-view :x="80" :y="80" class="target" direction="all" @change="getNodeInfo"></movable-view>
				</movable-area>
			</view>
			<view class="color_title">调节色温</view>
		</view>
		
		<view v-if="active_nav == 0">
			<view class="switch">
				<view style="float: left;">
					<view style="line-height: 80upx;margin-left: 10upx;">手动模式</view>
				</view>
				<view style="float: right;">
					<switch style="transform:scale(0.8)" color="orange"/>
				</view>
				<view style="clear: both;"></view>
			</view>
			<view class="light_slider">
				<view class="title">调节亮度</view>
				<view class="slider">
					<view class="number_tip">
						{{ light_size }}%
					</view>
					<view>
						<slider :value="light_size" @change="sliderChange" activeColor="orange"/>
					</view>
					<view class="total_number_tip">
						<view class="left_tip">0%</view>
						<view class="right_tip">100%</view>
						<view style="clear: both;"></view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="active_nav == 1">
			<view class="switch">
				<view style="float: left;">
					<view style="line-height: 80upx;margin-left: 10upx;">智能模式</view>
				</view>
				<view style="float: right;">
					<switch style="transform:scale(0.8)" color="orange"/>
				</view>
				<view style="clear: both;"></view>
			</view>
			<view class="smart_model">
				<view class="timer">
					<view class="close" @tap="choose_timer_contro">
						<image v-if="timer_contro == 0" src="../../static/index/close.png"></image>
						<image v-else src="../../static/index/open.png"></image>
					</view>
					<view class="smart_title">
						<view style="float: left;">定时模式</view>
						<view class="smart_litter_title">（最多设置5个时间段）</view>
						<view v-if="timer_contro == 1" class="smart_right_button" @tap="set_timers">调整</view>
					</view>
					<view style="clear: both;"></view>
					
					<view class="timers" v-if="timer_contro == 1">
						<view class="timer_detail" v-for="(item, index) in timers" :key="index">
							<view class="text">{{item.begin}}~{{item.end}}</view>
							<view class="text">色温{{item.color_temper}}k</view>
							<view class="text">亮度{{item.light_size}}%</view>
						</view>
						<view style="clear: both;"></view>
					</view>
				</view>
				<view class="location">
					<view class="close"  @tap="choose_location_contro">
						<image v-if="location_contro == 0" src="../../static/index/close.png"></image>
						<image v-else src="../../static/index/open.png"></image>
					</view>
					<view class="smart_title">
						<view>经纬度模式</view>
						<view class="smart_litter_title">根据当前经纬度系统智能设置时间段、色温、亮度。</view>
					</view>
					<view class="location_detaill">
						当前值：经度<text>{{ longitude }}</text>、纬度<text>{{ latitude }}</text>
					</view>
					<view style="clear: both;"></view>
				</view>
			</view>
		</view>
		
		<button @tap="submitSet" style="margin-bottom: 20upx;margin-top: 20upx;background-color: #ebe9dd!important;">确定保存</button>
		
		<view v-if="show_model" class="modal">
			<view class="modal-content">
				<view class="modal-header">
					<view class="model_title">定时模式</view>
					<view class="model_litter_title">最多设置5个时间段</view>
					<image src="../../static/index/x.png" @tap="close_model"
						style="width: 60upx;height: 60upx;float: right;margin-top: -100upx;"></image>
				</view>
				<view class="modal-body" style="margin-top: 30upx;">
					<view v-for="(item, index) in timers_model" :key = 'index'>
						<view class="choose_timer" style="height: 80upx;font-size: 28upx;">
							<picker @change="timePicker($event, index, 'begin')" :value="index"  style="width: 20%;float: left;font-size: 28upx;margin-top: 8upx;" :range="array">
								<view style="color: #555555;">{{ item.begin == ''? '开始时间' : item.begin}} </view>
							</picker>
							<picker @change="timePicker($event, index, 'end')" :value="index"  style="width: 20%;float: left;font-size: 28upx;margin-top: 8upx;" :range="array">
								<view style="color: #555555;">{{ item.end == ''? '结束时间' : item.end}} </view>
							</picker>
							<input type="number" style="width: 25%;float: left;font-size: 28upx" v-model="item.color_temper" placeholder="输入色温"/>
							<input type="number" style="width: 25%;float: left;font-size: 28upx" v-model="item.light_size"  placeholder="输入亮度"/>
							<image src="../../static/pics/mine/icon_roundclose.png" @tap="clearTimer(index)"
								style="width: 60upx;height: 60upx;float: right;line-height: 70upx;"></image>
							<view style="clear: both;"></view>
						</view>
					</view>

					<view>
						<button @tap="submitTimer" style="margin-bottom: 20upx;margin-top: 20upx;background-color: #ebe9dd!important;">确定</button>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import apiUtils from '../../common/utils/api.js';
	export default {
		data() {
			return {
				id: '',
				active_nav: 0,//手动模式还是智能模式

				timer_contro: 0,//是否定时模式
				location_contro: 0,//是否经纬度模式
				
				light_size: 0,//灯光亮度
				color_temper: 0,//颜色选择色温
				
				color_temper_min: 50,//色温最小值
				color_temper_max: 4000,//色温最大值
				
				longitude: '0',//经纬度
				latitude: '0',
				
				timers: [],
				timers_model: [],
				
				show_model: false,
				array: [
					"01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
					"13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"
				],
				info: []
			}
		},
		onLoad(e) {
			let _this = this;
			_this.id = e.id;
			
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
					_this.longitude = res.longitude;
					_this.latitude = res.latitude;
			    }
			});
		},
		onShow() {
			let _this = this;
			apiUtils.hardwareDetail({
				id: _this.id
			}, function(res){
				console.log(res);
				_this.timer_contro = res.timerContro == null ? 0 : res.timerContro ;
				_this.location_contro =  res.locationContro == null ? 0 : res.locationContro ;
				_this.light_size = res.lightSize == null ? 0 : res.lightSize;
				_this.color_temper = res.colorTemper == null ? 0 : res.colorTemper;
				_this.timers = JSON.parse(res.timers == null? "[]": res.timers);
			})
		},
		methods: {
			submitSet(){
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: "确定保存？",
				    success: function (res) {
				        if (res.confirm) {
							apiUtils.updateHardwareColorTemper({
								id: _this.id,
								timer_contro: _this.timer_contro,
								location_contro: _this.location_contro,
								light_size: _this.light_size,
								color_temper: _this.color_temper,
								timers: JSON.stringify(_this.timers)
							},function(){
								uni.showToast({title: "操作成功",icon: 'none'});
								uni.navigateBack();
							});
						}
					},
				});
			},
			getNodeInfo(e) {
				let _this = this;
				uni.createSelectorQuery().select('.target').boundingClientRect().exec((ret) => {
					const rect = ret[0]
					if (rect) {
			            const sort = ['left','right','top','bottom','width','height'];
						const info = [];
						let width = rect.width;
						let left = rect.left * 80 /width - 170;
						let top = rect.top * 80 / width - 194;
						
						//亮度
						let around_x = 160 - left;
						let around_y = 160 - top;
						let light_size = Math.sqrt((Math.pow(around_x, 2) + Math.pow(around_y, 2))) / 1.6;
						light_size = light_size > 100 ? 100 : light_size;
						_this.light_size = Math.round(light_size / 1);
						
						//色温
						let pi_tan = around_x / around_y;
						_this.color_temper = Math.round(Math.atan(pi_tan) / 3.141592653589793 * 4000, 1);
						_this.color_temper = _this.color_temper * 2;
						_this.color_temper = _this.color_temper < 0 ? _this.color_temper * -1 : _this.color_temper;
					}
				});
			},
			submitTimer(){
				let _this = this;
				for( let i = 0; i < _this.timers_model.length; i++ ){
					if( (_this.timers_model[i].begin == '' || _this.timers_model[i].end == '' || _this.timers_model[i].color_temper == '' || _this.timers_model[i].light_size == '') && 
						!(  _this.timers_model[i].begin == '' && _this.timers_model[i].end == '' && _this.timers_model[i].color_temper == '' && _this.timers_model[i].light_size == '' ) ){
						uni.showToast({title: "操作失败，第" + (i+1) + "个定时请必填。",icon: 'none'});
						return;
					}
				}
				
				_this.timers = [];
				for( let i = 0; i < _this.timers_model.length; i++){
					if(_this.timers_model[i].begin != ''){
						_this.timers = _this.timers.concat(_this.timers_model[i]);
					}
				}
				_this.show_model = false;
			},
			clearTimer(index){
				let _this = this;
				_this.timers_model.splice(index, 1);
				_this.timers_model[4] = {begin: '', end: '', 'color_temper': '', 'light_size': ''};
			},
			timePicker(e, index, type){
				let _this = this;
				if( type == 'begin' ){
					_this.timers_model[index].begin = _this.array[e.target.value];
				}else{
					_this.timers_model[index].end = _this.array[e.target.value];
				}
			},
			chooseModel(model){
				let _this = this;
				_this.active_nav = model;
			},
			sliderChange(e){
				let _this = this;
				_this.light_size = e.detail.value;
			},
			choose_location_contro(){
				let _this = this;
				_this.location_contro = _this.location_contro == 0 ? 1:0;
				uni.showToast({title: "操作成功",icon: 'none'});
			},
			choose_timer_contro(){
				let _this = this;
				_this.timer_contro = _this.timer_contro == 0 ? 1:0;
				uni.showToast({title: "操作成功",icon: 'none'});
			},
			set_timers(){
				let _this = this;
				_this.show_model = true;
				_this.timers_model = _this.timers;
				if( _this.timers_model.length < 5 ){
					let size = 5 - _this.timers_model.length;
					for(let i = 0; i < size; i++){
						let timer_detail = 	{begin: '', end: '', 'color_temper': '', 'light_size': ''};
						_this.timers_model = _this.timers_model.concat(timer_detail);
					}
				}
			},
			close_model(){
				let _this = this;
				_this.show_model = false;
			}
		}
	}
</script>

<style>
	page{
		background-color: #F1F1F1;
	}
	.uni-list-cell-db{
		font-weight: bold;
		font-size: 36upx;
	}
	.nav_tabs {
		background-color: white;
	}
	.nav_tabs .nav_tab{
		width: 375upx;
		line-height: 100upx;
		font-size: 36upx;
		color: gray;
		float: left;
		text-align: center;
	}
	.choose{
		color: #000000;
		border-bottom:3px solid orange;
	}
	.color_temper{
		height: 525upx;
		text-align: center;
		padding: 30upx;
	}
	.color_temper .color_detail{
		color: #555555;
		font-size: 28upx;
	}
	.color_temper .color_contro image{
		margin-top: 20upx;
		height: 400upx;
		width: 400upx;
		border-radius: 200upx;
	}
	.color_temper .color_title{
		font: 32upx;
		margin-top: 20upx;
	}
	
	.slider{
		margin-top: 20upx;
	}
	.light_slider{
		padding: 30upx;
		margin-top: 20upx;
		background-color: white;
	}
	.light_slider .title{
		font-size:35upx;
		line-height: 60upx;
	}
	
	.number_tip{
		text-align: center;
		font-size:32upx;
	}
	
	.total_number_tip .left_tip{
		float: left;
		font-size:32upx;
	}
	.total_number_tip .right_tip{
		float: right;
		font-size:32upx;
	}
	
	.smart_model{
		margin-top: 20upx;
		background-color: #FFFFFF;
		padding: 20upx;
	}
	.smart_model .close image{
		width: 50upx;
		height: 50upx;
		float: left;
	}
	.smart_model .timer{
		border:1px solid #F1F1F1;
		padding: 30upx;
	}
	.smart_model .location{
		margin-top: 20upx;
		border:1px solid #F1F1F1;
		padding: 30upx;
	}
	.smart_model .smart_title{
		font-size: 30upx;
		line-height: 50upx;
		margin-left: 60upx;
	}
	.smart_model .smart_litter_title{
		color: #555555;
		float: left;
		font-size: 28upx;
	}
	.smart_right_button{
		float: right;
		border:2px solid #008000;
		color: #008000;
		width: 120upx;
		margin-top: -3rpx;
		text-align: center;
		font-size: 26upx;
		border-radius: 30upx;
	}
	.location_detaill{
		font-size: 30upx;
		margin-left: 60upx;
		line-height: 80upx;
	}
	.location_detaill text{
		font-size: 35upx;
		font-weight: bold;
	}
	.timer_detail{
		margin-top: 10upx;
	}
	.timer_detail .text{
		line-height: 50upx;
		color: #555555;
		text-align: center;
		font-size: 28upx;
		width: 215rpx;
		float: left;
	}
	
	/*模态窗*/
	/*模态框*/
	.modal {
	    position: fixed; /* 根据浏览器定位 */
	    z-index: 1; /* 放在顶部 */
	    left: 0;
	    bottom: 0;
	    width: 100%; /* 全宽 */
	    height: 100%; /* 全高 */
	    overflow: auto; /* 允许滚动 */
	    background-color: rgba(0,0,0,0.4); /* 背景色 */
	}
	/*模态框内容*/
	.modal-content {
		padding: 20upx;
		border-radius: 19rpx;
		top: 20%; 
	    display: flex; /*采用flexbox布局*/
	    flex-direction: column; /*垂直排列*/
	    position: relative;
	    background-color: #fefefe;
		bottom: 0px;
/* 	    animation: topDown 0.4s; /*自定义动画，从模态框内容上到下出现*/ 
	}
	.modal-close {
	    color: #aaa;
	    float: right;
	    font-size: 28px;
	    font-weight: bold;
	}
	.modal-close:hover {
	    color: black;
	    text-decoration: none;
	    cursor: pointer;
	}
	.model_title{
		text-align: center;
		font-size: 35upx;
	}
	.model_litter_title{
		margin-top: 20upx;
		text-align: center;
		font-size: 25upx;
		color: #555555;
	}
	.modal-body{
		height: 550upx;
	}
	
	.switch{
		background-color: #FFFFFF;
		margin-bottom: 20upx;
		padding: 20upx;
	}
	
	movable-area {
		margin-top: 20upx;
		height: 400upx;
		width: 400upx;
		background-color: #FFFFFF;
		border-radius: 200upx;
		position: relative;
		margin-left: 140upx;
		background:url(http://testimg.fuyoust.com/color_temper.png) no-repeat;
		background-size: 400upx 400upx;
	}
	.target {
		height: 80rpx;
		width: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #FFFFFF;
		background-color: #4cd964;
		font-size: 28rpx;
		position: absolute;
		background: url(http://testimg.fuyoust.com/color_temper_target.png) no-repeat;
		background-size: 80upx 80upx;
	}
</style>
