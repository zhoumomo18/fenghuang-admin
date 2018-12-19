<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="formValidate" :label-width="120">
                <FormItem label="广告图：" prop="photo">
                    <div class="upload-list" v-for="item in uploadList">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView(item.name)"></Icon>
                            <!-- <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon> -->
                        </div>
                    </div>
                    <Modal title="View Image" v-model="visible">
                        <img :src="uploadList[0].url" v-if="visible" style="width: 100%">
                    </Modal>
                </FormItem>
                <FormItem label="广告名称：" prop="name">
                    <Row>{{formData.name}}</Row>
                </FormItem>
                <FormItem label="广告位：" prop="adsenseId">
                    <Row>{{formData.adsenseName}}</Row>
                </FormItem>
                <FormItem label="有效期限：">
                    <Row>{{formData.startDate}} 至 {{formData.endDate}}</Row>
                </FormItem>
                <FormItem label="链接：" prop="linkUrl">
                    <Row>{{formData.linkUrl}}</Row>
                </FormItem>
            </Form>
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
                <span class="viewMoreBtn" @click="showAllLogs" :disabled="isdisabled" v-if="listLogs.length>2">更多</span>
            </div>
            <Row type="flex" justify="center">
                <Button type="default" @click="handleCancel">确定</Button>
            </Row>
        </div>
    </div>
</template>

<script>
let { adManageMethod } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['广告管理','广告列表'],
            subTitle: '查看广告',
            currentItemId: that.$route.query.id,
            uploadList: [],
            visible: false,
            formData: {
                name: '',
                adsenseId: '',
                linkUrl: '',
                startDate: '',
                endDate: ''
            },
            listLogs: [],
            isdisabled: false,
        }
    },
    components:{
        breadcrumb
    },
    mounted () {
        this.getAdById()
    },
    methods: {
        // 预览上传的图片
        handleView (item) {
            this.visible = true;
        },
        // 点击更多，显示所有log信息
        showAllLogs() {
            if(this.isdisabled == false) {
                this.listLogs = this.formData.listLogs
                this.isdisabled = true
            }
        },
        // 取消按钮，返回上一级
        handleCancel () {
            this.$router.go(-1)
        },

        /***********************************调用接口************************************************************/
        // 获取当前广告详情
        getAdById() {
            let that = this,
                params = {
                    id: that.currentItemId,
                    callBack: (res) => {
                        if (res && res.code==200 && res.data){
                            that.formData = res.data
                            that.formData.startDate=res.data.startDate+" 00:00:00"
                            that.formData.endDate=res.data.endDate+" 23:59:59"
                            for (let item of res.data.file) {
                                item.url = that.imagePrefix + item.src
                                item.source = 'internetSource'
                            }
                            that.uploadList = res.data.file
                            that.listLogs = res.data.listLogs.reverse().slice(0, 2)
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            adManageMethod.getAdById(params)
        },
        // 获取广告位列表
        getAdsenseList () {
            let that = this,
                params = {
                    callBack: (res) => {
                        if (res && res.code==200 && res.data){
                            that.adsenseList = res.data
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            adManageMethod.getAdsenseList(params)
        }
    }
}
</script>


<style lang="less" scoped>
.page-form-group{
    padding: 24px;
    .ivu-row-flex{
        padding-top: 20px;
        margin-bottom: 16px;
        .ivu-btn{
            margin-right: 24px
        }
    }
    .ivu-cover-image{
        width: 180px;
        height:100px;
        line-height: 100px;
        text-align: center; 
        border: 1px dashed #dcdee2;
    }
    .red{
        color: #f00;
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
}
</style>
