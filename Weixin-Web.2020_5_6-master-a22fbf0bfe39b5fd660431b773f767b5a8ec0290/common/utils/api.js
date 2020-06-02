import requestUtils from '../../common/utils/request.js';

//房间模块
function getHouseByAccount(successFunction){
	requestUtils.doPost("/houses/all", {}, successFunction)
}
function houseAll(resultFunction){
  requestUtils.doPost("/houses/all", {}, resultFunction);
}
function findHouseDetailsById(data, resultFunction){
  requestUtils.doPost("/houses/details", data, resultFunction);
}
function saveOrUpdateHouse(data, resultFunction){
  requestUtils.doPost("/houses/saveOrUpdateHouse", data, resultFunction);
}
function addHouseHardware(data, resultFunction){
  requestUtils.doPost("/houses/addHouseHardware", data, resultFunction);
}
function deleteHouseById(data, resultFunction){
  requestUtils.doPost("/houses/deleteHouseById", data, resultFunction);
}


//设备模块
function updateHardwareOnoffStatus(data, resultFunction){
  requestUtils.doPost("/hardwares/onoff", data, resultFunction);
}
function updateHardwareLightSize(data, resultFunction){
  requestUtils.doPost("/hardwares/lightSize", data, resultFunction);
}
function updateHardwareColorTemper(data, resultFunction){
  requestUtils.doPost("/hardwares/updateHardwareColorTemper", data, resultFunction);
}
function hardwareDetail(data, resultFunction){
  requestUtils.doPost("/hardwares/detail", data, resultFunction);
}

//场景模块
function getScenesByAccount(successFunction){
	requestUtils.doPost("/scenes/all", {}, successFunction)
}
function getScenesDetailsById(data, successFunction){
	requestUtils.doPost("/scenes/details", data, successFunction)
}
function saveOrUpdateScene(data, successFunction){
	requestUtils.doPost("/scenes/saveOrUpdateScene", data, successFunction)
} 

//登录action
function userLogin(data, resultFunction){
  requestUtils.doPostRequest("/mine/doLogin", data, resultFunction);
}
function userRegs(data, resultFunction){
  requestUtils.doPostRequest("/mine/doReg", data, resultFunction);
}
function allCustomerHostBox(data, resultFunction){
  requestUtils.doPostRequest("/hostboxs/allCustomerHostBox", data, resultFunction);
}

//家庭账户模块
function accountLists(resultFunction){
  requestUtils.doPost("/mine/accountLists", {}, resultFunction);
}
function searchUserAccountByTel(data, resultFunction){
  requestUtils.doPost("/mine/searchUserAccountByTel", data, resultFunction);
}
function addCustomerAccount(data, resultFunction){
  requestUtils.doPost("/mine/addCustomerAccount", data, resultFunction);
}
function accountOwn(data,resultFunction){
    requestUtils.doPost("/mine/accountOwn",data,resultFunction);
}

//收藏页面
function favoriteHouses(resultFunction){
  requestUtils.doPost("/favorites/favoriteHouses", {}, resultFunction);
}
function favoriteScenes(resultFunction){
  requestUtils.doPost("/favorites/favoriteScenes", {}, resultFunction);
}
function favoriteHardwares(resultFunction){
  requestUtils.doPost("/favorites/favoriteHardwares", {}, resultFunction);
}
function updateFavoriteHardware(data, resultFunction){
  requestUtils.doPost("/favorites/updateFavoriteHardware", data, resultFunction);
}
function updateFavoriteScene(data, resultFunction){
  requestUtils.doPost("/favorites/updateFavoriteScene", data, resultFunction);
}

//我的页面
function findAllAccountHousesList(data, resultFunction){
  requestUtils.doPost("/mine/findAllAccountHousesList", data, resultFunction);
}
function accountAccess(data, resultFunction){
  requestUtils.doPost("/mine/accountAccess", data, resultFunction);
}
function insertUserAccount(data, resultFunction){
  requestUtils.doPost("/mine/insertUserAccount", data, resultFunction);
}
function deleteAccount(data, resultFunction){
  requestUtils.doPost("/mine/deleteAccount", data, resultFunction);
}
function accountDetail(data, resultFunction){
  requestUtils.doPost("/mine/accountDetail", data, resultFunction);
}
function updateMineAccount(data, resultFunction){
  requestUtils.doPost("/mine/updateMineAccount", data, resultFunction);
}
function addCustomerHostBox(data, resultFunction){
  requestUtils.doPost("/hostboxs/addCustomerHostBox", data, resultFunction);
}

/**
 * 文件上传模块
 */
function getHostIp(){
	return requestUtils.getHostIp();
}
function uploadFileToLocal(chooseImageRes, resultFunction){
	requestUtils.uploadFileToLocal(chooseImageRes, resultFunction);
}

/**
 * 数据字典模块
 */
function findDictsByKey(key, resultFunction){
	let data = {"key": key}
	requestUtils.doPost("/common/dict", data, resultFunction);
}

/**
 * 主机模块
 */
function checkSnCode(snCode, resultFunction){
	let data = {"snCode": snCode}
	requestUtils.doPostRequest("/hostboxs/checkSnCode", data, resultFunction);
}

export default {
	userRegs,
	checkSnCode,
	getHouseByAccount,
	getScenesByAccount,
	getScenesDetailsById,
	userLogin, 
	accountLists,
	houseAll,
	findHouseDetailsById,
	saveOrUpdateScene,
	updateHardwareOnoffStatus,
	updateHardwareLightSize,
	favoriteHouses,
	favoriteScenes,
	favoriteHardwares,
	updateFavoriteHardware,
	updateFavoriteScene,
	findAllAccountHousesList,
	accountAccess,
	insertUserAccount,
	deleteAccount,
	accountDetail,
	updateMineAccount,
	uploadFileToLocal,
	getHostIp,
	saveOrUpdateHouse,
	findDictsByKey,
	addHouseHardware,
	allCustomerHostBox,
	addCustomerHostBox,
	searchUserAccountByTel,
	addCustomerAccount,
	updateHardwareColorTemper,
	hardwareDetail,
	deleteHouseById,
	accountOwn
}
