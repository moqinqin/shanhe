<template>
	<view>
		<view class="video">
			<video :src=" address " style="width: 100%"> 
			</video>
		</view>
		<!-- 圆盘操控 -->
		<view class="button-box">
			<view class="btn-group">
			   <view class="btn bt bl" hover-class="active"><button  @touchstart="move(0)" @touchend="rel()"></button></view>  
			   <view class="btn bl bb" hover-class="active"><button  @touchstart="move(3)" @touchend="rel()" ></button></view> 
			   <view class="btn bt br" hover-class="active"><button  @touchstart="move(2)" @touchend="rel()" ></button></view> 
			   <view class="btn br bb" hover-class="active"><button  @touchstart="move(1)" @touchend="rel()"></button></view>
			</view>
			<view class="btn-top" id="web">
			   <view class="btn-cen"><image src="../../static/logo/shanhelogo.jpg"></image></view>
			</view>
		</view>
		<view class="a">
			<view><button hover-class="active" @touchstart="move(8)" @touchend="rel()">放大</button></view>
			<view><button hover-class="active" @touchstart="move(9)" @touchend="rel()">缩小</button></view>
		</view>
		</view>
		
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniSection from '@/components/uni-section/uni-section.vue'
	
	import apiUtils from '../../common/utils/api.js';
	export default{
		data() {
			return {
		 	address : "",
			url: "",
			accessToken: "",
			deviceSerial: "",
			channelNo: ""
		}},
		methods:{
			onShow() {
				let _this=this;
				// let obj=[{value: "https://hls.open.ys7.com/openlive/e48bf8b18776468495e583a8128c8f69.m3u8"},{url: "https://open.ys7.com/api/lapp/device/ptz/start"},{accessToken: "at.90a79g8d3vphtcao5sfeqund8km7d3gf-39jevs8vir-1vg9bbb-6jyr6a5im"},{deviceSerial:"D15330330"},{channelNo:"4"}];
				let obj=[{value: "https://hls.open.ys7.com/openlive/e48bf8b18776468495e583a8128c8f69.m3u8"},{url: "https://open.ys7.com/api/lapp/device/ptz/start"},{accessToken: "at.90a79g8d3vphtcao5sfeqund8km7d3gf-39jevs8vir-1vg9bbb-6jyr6a5im"},{deviceSerial:"D15330330"},{channelNo:"4"}];
				_this.address=obj[0].value;
				_this.url=obj[1].url;
				_this.accessToken=obj[2].accessToken;
				_this.deviceSerial=obj[3].deviceSerial;
				_this.channelNo=obj[4].channelNo;
			},
			// onLoad(e){
			// 	let param = JSON.parse(e.data);
			// 	this.address=param[0].value;
			// 	this.url=param[1].url;
			// 	this.accessToken=param[2].accessToken;
			// 	this.deviceSerial=param[3].deviceSerial;
			// 	this.channelNo=param[4].channelNo;
			// },
			move(id){
			 uni.request({
				url: this.url,
				data: {
					accessToken: this.accessToken,
					deviceSerial: this.deviceSerial,
					channelNo: this.channelNo,
					direction: id,
					speed:1},	
			    header: {'content-type': 'application/x-www-form-urlencoded'},
				method: 'POST',
				success: (res) => {console.log(res.data);}
				         })
			 },
			
			rel(){
					uni.request({
					url: 'https://open.ys7.com/api/lapp/device/ptz/stop',
					data: {
						accessToken: this.accessToken,
						deviceSerial: this.deviceSerial,
						channelNo: this.channelNo,
						direction: 0,
						speed: 1},	
					header: {'content-type': 'application/x-www-form-urlencoded'},
					method: 'POST',
					success: (res) => {console.log(res.data);
					}})		
				},
			cruise(){
				    uni.request({
				    	url: this.url,
						data:{
							accessToken: this.accessToken,
							deviceSerial: this.deviceSerial,
							channelNo: this.channelNo,
							},
						header: {'content-type': 'application/x-www-form-urlencoded'},
						method: 'POST',	
					    success: (res)=> {
							console.log(res.data);
						}
				    })
			}
               }
	        } 
</script>

<style>
	.a{ 
		padding: 200rpx;
		padding-top: 650rpx;
		display: flex;
		justify-content:flex-end;
		justify-content: space-between;
	}
    .button-box {
        width: 500rpx;
        height: 500rpx;
        border: 2rpx solid #ccc;
        border-radius: 450rpx;
        overflow: hidden;
        position: absolute;
        right:0;
        left: 0;
        margin: 80rpx auto;
		
    }
    .btn-group {
        width: 100%;
        height: 101%;
        transform: rotate(45deg)
    }
    .btn-top {
		
        width: 30%;
        height: 30%;
        border: none;
        outline: none; 
        border: 2rpx solid #ccc;
        border-radius: 50%;
        position: absolute;
        overflow: hidden;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .btn {
        width: 49%;
        height: 49%;
        border: 1px solid #ccc;
         float: left;
         overflow: hidden;
		 background-color:#FEFEFE
    }
    /* .btn button:hover,.btn-top button:hover {
        background-color: #FFA200;
    }  */
	.active {
		background-color: #FFA200;
	}
    .btn button {
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent; 
        outline: none;
		text-align: center;
    }
    .btn-top button {
        width: 100%;
        height: 130%;
        border: none;
        outline: none; 
    }
	.btn-cen> image {
	   left: -20rpx;
	   width: 190rpx;
	   height: 150rpx;
	}
    .bl{
        border-left: none;
    }
    .bt {
        border-top: none
    }
    .br {
        border-right: none
    }
    .bb {
        border-bottom: none
    }

	
</style>

