<template>
    <view class="content">
        <view class="account_list">
            <view class="account" v-for="(item) in accounts" :key="item.id">
                <view class="pic">
                    <view class="face">
                        <image :src="item.icon == null ? '../../static/missing-face.png' : item.icon"></image>
                    </view>
                </view>
                <view class="name">
                    <view>{{item.name == null? '手机用户' + item.username : item.name}}</view>
                    <view class="fontSize14 marginTop10">{{ item.username }}</view>
                    <view v-if="item.accessHouse.length != 0" class="house marginTop10">
                        <span v-for="(itemHouse, index2) in item.accessHouse" :key="itemHouse.id">{{ itemHouse.name }}
                            <span v-if="index2 != item.accessHouse.length - 1">、</span>
                        </span>
                    </view>
                </view>
                <view v-show="accountOwn.mainCount==0" class="edit">
                    <image src="../../static/pics/mine/icon_compile.png" @tap="editAccount(item.id, item.name)"></image>
                    <image src="../../static/pics/mine/icon_roundclose.png" @tap="removeAccount(item.id)"></image>
                </view>
                <view class="clear"></view>
            </view>
        </view>
        <view v-show="accountOwn.mainCount==0" class="addButton">
            <image src="../../static/index/add.png" @tap="addAccount"></image>
        </view>
    </view>
</template>

<script>
    import apiUtils from '../../common/utils/api.js';
    export default {
        data() {
            return {
                accounts: [],
                accountOwn: {},
                account: [],
            }
        },
        onShow() {
            let _this = this;
            uni.getStorage({
                key: "account",
                success(e) {
                    _this.account = e.data.id;
                    apiUtils.accountOwn({
                        accountId: e.data.id
                    }, function(res1) {
                        _this.accountOwn = res1;
                        console.log("accountOwn",res1);
                    });

                }
            });

            apiUtils.accountLists(function(res) {
                _this.accounts = res;
                console.log(res);
            });



        },
        methods: {
            addAccount(e) {
                uni.navigateTo({
                    url: '../../pages/mine/chooseFamily'
                });
            },
            editAccount(id, name) {
                name = name == null ? "" : name;
                uni.navigateTo({
                    url: '../../pages/mine/familyForm?id=' + id + '&name=' + name
                });
            },
            removeAccount(id) {
                let _this = this;
                uni.showModal({
                    title: '提示',
                    content: "确认删除该账号吗？",
                    success: function(res) {
                        if (res.confirm) {
                            apiUtils.deleteAccount({
                                    accountId: id
                                },
                                function(res) {
                                    apiUtils.accountLists(function(res) {
                                        _this.accounts = res;
                                    });
                                    uni.showToast({
                                        title: "账户删除成功",
                                        icon: 'none'
                                    })
                                })
                        }
                    },
                });
            }
        },
    }
</script>

<style lang="scss">
    page {
        background-color: #f1f1f1;
        background-image: url('http://testimg.fuyoust.com/houseBackground.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-attachment: fixed
    }

    .clear {
        clear: both;
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

    .account_list {
        width: 690upx;
        padding: 30upx;
        height: 200upx;

        .account {
            margin-bottom: 30upx;
            border-radius: 20upx;
            padding: 25upx;
            background-color: #fff;

            .face {
                flex-shrink: 0;
                width: 150upx;
                height: 150upx;
                float: left;

                image {
                    width: 100%;
                    height: 100%;
                    border-radius: 100%
                }
            }

            .name {
                margin-left: 40upx;
                float: left;

                .house {
                    font-size: 12px;
                    margin-top: 5px;
                }
            }

            .edit {
                //margin-top: 30rpx;
                float: right;

                image {
                    margin-left: 20rpx;
                    width: 50rpx;
                    height: 50rpx;
                }
            }
        }
    }
</style>
