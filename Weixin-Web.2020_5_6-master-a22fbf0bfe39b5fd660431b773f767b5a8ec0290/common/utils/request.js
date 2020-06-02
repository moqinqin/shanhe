// var houstIp = 'https://m1.shanhelinks.com'  http://192.168.0.151:9099 http://192.168.0.147:9099;
var houstIp = 'http://192.168.0.147:9099';
var apiUrl = houstIp + '/api/v1/mp';
var appid = 'wxdd76c88376394864';
var token = 'token';
function getHostIp() {
	return apiUrl;
}
function uploadFileToLocal(chooseImageRes, resultFunction) {
	uni.getStorage({
		key: "token",
		success(e) {
			let tokens = e.data.split("_");
			if(tokens.length == 1){
				uni.showToast({
					title: "请先切换主机",
					icon: 'none'
				});
				return;
			}
			uni.uploadFile({
				url: apiUrl + '/common/uploadLocal',
				filePath: chooseImageRes[0],
				name: 'file',
				header: {
					'token': tokens[0],
					'customerId': tokens[1]
				},
				success: resultFunction,
				fail: function() {
					uni.showToast({
						title: "网络请求失败",
						icon: 'none'
					});
				},
				complete: function() {
					// uni.hideLoading();
				}
			});
		}
	});
}

function doPost(url, data, successFunction) {
	uni.getStorage({
		key: "token",
		success(e) {
			let tokens = e.data.split("_");
			if(tokens.length == 1 && url != '/mine/accountDetail' && url != "/mine/updateMineAccount"){
				uni.showToast({
					title: "请先切换主机",
					icon: 'none'
				});
				return;
			}
			uni.request({
				url: apiUrl + url,
				data: data,
				method: 'POST',
				header: {
					'token': tokens[0],
					'customerId': tokens[1],
					'content-type': 'application/x-www-form-urlencoded',
				},
				success: function(res) {
					if (res.data.code == '0') {
						successFunction(res.data.data)
					} else {
						uni.showToast({
							title: res.data.info,
							icon: 'none'
						});
					}
				},
				fail: function() {
					uni.showToast({
						title: "网络请求失败",
						icon: 'none'
					});
				},
				complete: function() {
					// uni.hideLoading();
				}
			});
		},
		fail(e) {
			console.log(e);
			uni.showToast({
				title: "请先登录",
				icon: 'none'
			});
		}
	})
}

function doPostRequest(url, data, successFunction) {
	// uni.showLoading({
	// 	title: '执行中'
	// });
	uni.request({
		url: apiUrl + url,
		data: data,
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		success: function(res) {
			if (res.data.code == '0') {
				successFunction(res.data.data)
			} else {
				uni.showToast({
					title: res.data.info,
					icon: 'none'
				});
			}
		},
		fail: function() {
			uni.showToast({
				title: "网络请求失败",
				icon: 'none'
			});
		},
		complete: function() {
			// uni.hideLoading();
		}
	});
}


export default {
	doPost,
	doPostRequest,
	uploadFileToLocal,
	getHostIp
}
