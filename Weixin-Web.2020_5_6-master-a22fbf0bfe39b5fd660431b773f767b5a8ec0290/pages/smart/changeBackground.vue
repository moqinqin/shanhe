<template>
	<view>
		<view class="changeBackground" @click="changeBackground"><span>更换背景</span></view>
	</view>
</template>

<script>
	import apiUtils from '../../common/utils/api.js';
	data(){
		return{};
		onshow(){};
		methods:{}
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