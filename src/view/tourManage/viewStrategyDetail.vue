<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <p class="strategyTitle">{{ formData.title }}</p>
            <div class="secondTitle">
                <span>新建日期</span>
                <p class="createTime">
                    <span class="createYear">{{ formData.createDate }}</span>
                </p>
                <span>编辑</span>
                <span class="authorName">{{ formData.editUser }}</span>
            </div>
            <p class="favorCount">
                <span>总点赞</span>
                <span class="countAll">{{ formData.totalPraise }}</span>
                <span>实际点赞</span>
                <span class="countActually">{{ formData.actualPraise }}</span>
            </p>
            <p class="contentTitle">正文</p>
            <div class="content" v-html="formData.content"></div>
            <p class="coverTitle">封面</p>
            <div class="coverImgBox">
                <img :src="fileUrl" alt="" style="width: 220px;height: 140px;">
            </div>

            <div class="editLogBox">
                <p class="logBoxTitle">编辑日志</p>
                <ul class="logUl">
                    <li v-for="(item, index) in listLogs" :key="index">
                        <span>编辑：</span>
                        <span class="editor">{{ item.userName }}</span>
                        <span>编辑时间：</span>
                        <p class="editTime" v-if="item.updateDate">
                            <span class="editYear">{{ item.updateDate.substring(0, 10) }}</span>
                            <span>{{ item.updateDate.substring(11, 19) }}</span>
                        </p>
                    </li>
                </ul>
                <span class="viewMoreBtn" @click="showAllLogs" v-if="isShowMoreBtn">更多</span>
            </div>

            <Row type="flex" justify="center">
                <Button type="primary" class="backConfirmBtn" @click="handleCancelConfirm">确定</Button>
            </Row>
        </div>
    </div>
</template>

<script>
let { common } = require('../../script/common.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['旅游攻略','攻略管理'],
            subTitle: '查看详情',
            logData: [
                { editor: "admin1", editTime: "2017-1-12 12:12" },
                { editor: "admin2", editTime: "2017-1-15 12:12" },
                { editor: "admin3", editTime: "2017-1-16 12:12" },
            ],
            formData: {},
            listLogs: [],
            fileUrl: "",
            isShowMoreBtn: false,
            currentItemId: that.$route.query.id
        }
    },
    components:{
        breadcrumb
    },
    mounted () {
        console.log("this.currentItemId:")
        console.log(this.currentItemId)
        this.getModuleDetailById()
    },
    methods: {
        // 获取当前模块入口的详情
        getModuleDetailById () {
            let that = this,
            requestConfig = {
                method: 'GET',
                url: `/strategy/getbyid/${that.currentItemId}`,
                publicUrlType: 1,
                successCallback: res => {
                    if (res && res.code == 200 && res.data) {
                        console.log(res.data)
                        that.formData = res.data
                        if(res.data.listLogs.length <= 2) {
                            that.isShowMoreBtn = false; // 小于2条不显示更多按钮
                        } else {
                            that.isShowMoreBtn = true; // 多于2条初始显示按钮并截取列表
                        }
                        // 编辑日志显示listLogs反序0、1
                        that.listLogs = res.data.listLogs.reverse().slice(0, 2)
                        that.fileUrl = that.imagePrefix + res.data.file[0].src
                    } else {
                        that.$Message.error(res.msg)
                    }
                },
                errorCallback: err => {
                    console.log(err)
                }
            }
            common.ajax.request(requestConfig);
        },
        // 点击更多，显示所有log信息并隐藏更多按钮
        showAllLogs() {
            this.listLogs = this.formData.listLogs;
            this.isShowMoreBtn = false;
        },
        // 取消按钮，返回上一级
        handleCancelConfirm () {
            this.$Modal.confirm({
                title: '返回攻略管理页？',
                onOk: () => {
                    this.$router.go(-1)
                }
            });
        },
    }
}
</script>


<style lang="less" scoped>
.page-form-group{
    padding: 24px;
    .strategyTitle {
        font-size: 28px;
        color: #333;
    }
    .secondTitle {
        font-size: 14px;
        color: #999;
        margin-top: 16px;
        .createTime {
            display: inline-block;
            width: 180px;
            padding-left: 15px;
            .createYear {
                padding-right: 10px;
            }
        }
        .authorName {
            padding-left: 10px;
        }
    }
    .favorCount {
        margin-top: 16px;
        font-size: 18px;
        color: #333;
        .countAll {
            display: inline-block;
            width: 180px;
            padding-left: 15px;
        }
        .countActually {
            padding-left: 10px;
        }
    }
    .contentTitle {
        margin: 16px 0;
        font-size: 18px;
        color: #333;
    }
    .coverTitle {
        margin: 20px 0 10px 0;
        font-size: 18px;
        color: #333;
    }
    .coverImgBox {
        background-color: #ddd;
        width: 220px;
        height: 142px;
    }
    .editLogBox {
        margin-top: 35px;
        border: 1px solid #ddd;
        .logBoxTitle {
            height: 40px;
            line-height: 40px;
            text-indent: 30px;
            font-size: 14px;
            font-weight: bold;
            background-color: #f5f5f5;
            border-bottom: 1px solid #ddd;
        }
        .logUl {
            margin: 20px 30px;
            line-height: 40px;
            font-size: 14px;
            li {
                .editor {
                    display: inline-block;
                    width: 320px;
                    padding-left: 15px;
                }
                .editTime {
                    display: inline-block;
                    .editYear {
                        padding-right: 10px;
                    }
                }
            }
        }
        .viewMoreBtn {
            display: inline-block;
            text-indent: 30px;
            font-size: 14px;
            height: 40px;
            text-decoration: none;
            color: #09f;
            cursor: pointer;
        }
    }
    .backConfirmBtn {
        margin-top: 30px;
    }
}
</style>
