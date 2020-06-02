<template>
    <view class="content" :style="{'background-image': 'url('+picc+')',
                    'background-size': '100% 100%'}">
        <view class="house_list">
            <view class="house" v-for="(house) in houses" :key="house.id" :style="{'backgroundImage': 'url('+house.backgroundImage+');background-repeat:no-repeat;background-size: scaleToFill'}"
                @tap.stop="chooseHouse(house.id, house.name)">
                <view class="deleteroom">
                    <button plain=true @tap.stop="deleteHouseById(house.id, house.name)" class="deletebutton">
                        <image src="../../static/pics/delete.png" class="deleteimage"></image>
                    </button>
                </view>

                <view class="name">
                    <view>
                        <view style="float: left;">
                            <uni-icons type="minus" color="#8f8f94" size="30" />
                        </view>
                        <view style="float: left;line-height: 62upx;margin-left: 20upx;">{{ house.name }}</view>
                        <!-- <view style="float: right;"><uni-icons type="more" color="#8f8f94" size="30" /></view> -->
                        <view class="clear"></view>
                    </view>
                    <view class="house_buttom">详细信息 > </view>
                </view>
            </view>

        </view>
        <view v-show="accountOwn.mainCount==0" class="addButton">
            <image src="../../static/index/add.png" @tap="addHouse"></image>
        </view>
    </view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue'
    import uniSection from '@/components/uni-section/uni-section.vue'

    import apiUtils from '../../common/utils/api.js';

    export default {
        data() {
            return {
                houses: [],
                accountOwn: {},
                account: [],
				picc: "",
            }
        },
        components: {
            uniIcons,
            uniSection
        },
        onShow() {
            let _this = this;
			_this.picc= [];
            _this.houses = [];
			
			uni.getStorage({
				key: "backgroundpic",
				success(e){
				_this.picc=e.data;
				console.log(_this.picc);
				}
			}),
            uni.getStorage({
                key: "account",
                success(e) {
                    _this.account = e.data.id;
                    apiUtils.accountOwn({
                        accountId: e.data.id
                    }, function(res1) {
                        _this.accountOwn = res1;
                        console.log("accountOwn", res1);
                        _this.accountOwnHouses = res1.accessHouse;
                        console.log("accountOwnHouses", res1.accessHouse);
                    });

                }
            });

            apiUtils.houseAll(function(res) {
                _this.houses = res;
            })
        },
        methods: {
            addHouse() {
                uni.navigateTo({
                    url: '../../pages/houses/new',
                })
            },
            chooseHouse(id, name) {
                uni.navigateTo({
                    url: '../../pages/houses/details?id=' + id + "&name=" + name
                })
            },
            deleteHouseById(id) {
                console.log("accessHouse", this.accountOwn.accessHouse)
                console.log("id", id)

                for (let arr in this.accountOwn.accessHouse) {
                    console.log(arr, this.accountOwn.accessHouse[arr].id);
                    
                    if (this.accountOwn.accessHouse[arr].id.indexOf(id) > -1) {
                        console.log("ok")
                        uni.showModal({
                            title: '提示',
                            content: "确认删除？",
                            success: res => {
                                if (res.confirm) {
                                    apiUtils.deleteHouseById({
                                            id: id
                                        },
                                        function(res) {
                                            uni.navigateBack();
                                            uni.showToast({
                                                title: "删除成功",
                                                icon: 'none'
                                            })
                                        });
                                }
                            }
                        });
                        return;
                    } else {
                        console.log("err")
                        uni.showModal({
                            title: "提示",
                            content: "没有本房间权限",
                            showCancel: false,
                        });
                        
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    page {
      background-image: url('http://testimg.fuyoust.com/background_0001.png');
      background-color: #f1f1f1;
	  height: 100%;
    }
	.content{
		height: 100%;
	}
    .clear {
        clear: both;
    }
    .house_list {
        width: auto;
        padding: 30upx;
		height: 100%;
        .house {
            font-size: 35rpx;
            color: white;
            margin-bottom: 30upx;
            border-radius: 30upx;
            padding: 25upx;
            background-color: #fff;
            height: 240upx;
            background-image: url('~@/static/pics/test1.jpg');
        }

        .house_buttom {
            font-size: 20rpx;
            margin-left: 40px;
        }

        .deleteroom {
            width: 10%;
            button::after {
                border: none;
            }

            ;

            .deletebutton {
                border: none;
                left: 830%;
                height: 85rpx;
                right: 60rpx;
                width: 110rpx;

                .deleteimage {
                    width: 100%;
                    height: 80rpx;
                }

            }
        }

    }

    .addButton {
        float: right;
        margin-bottom: 0rpx;
        position: fixed;
        right: 50upx;
        bottom: 0px;
        z-index: 9999;

        image {
            border-radius: 100upx;
            width: 100rpx;
            height: 100rpx;
            -moz-box-shadow: 2px 2px 5px #8F8F94;
            -webkit-box-shadow: 2px 2px 5px #8F8F94;
            box-shadow: 2px 2px 5px #8F8F94;
        }
    }
</style>
