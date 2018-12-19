<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="formValidate" :label-width="120" :rules="ruleValidate" :model="formData">
                <FormItem label="广告图：" prop="photo" class="ivu-form-item-required">
                    <div class="upload-list" v-for="item in uploadList">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView(item.name)"></Icon>
                            <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                        </div>
                    </div>
                    <Upload 
                        ref="upload"
                        multiple
                        :format="['jpg','jpeg','png']" 
                        action="/tourManager/v1.0/other/filedonothing/anon" 
                        :show-upload-list="false"
                        :on-format-error="handleFormatError"
                        :before-upload="handleBeforeUpload">
                        <div class="ivu-cover-image">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="visible">
                        <img :src="uploadList[0].url" v-if="visible" style="width: 100%">
                    </Modal>
                    <p>690 x 300，请上传 .png .jpg图片</p>
                </FormItem>
                <FormItem label="广告名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入广告名称（30字以内）"/>
                </FormItem>
                <FormItem label="广告位：" prop="adsenseId">
                    <Select v-model="formData.adsenseId" @on-change="handleChangeStatus" style="width: 300px;">
                        <Option v-for="item in adsenseList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="有效期限" class="ivu-form-item-required">
                    <Row>
                        <Col span="8">
                            <FormItem prop="startDate">
                                <DatePicker
                                v-model="formData.startDate"
                                format="yyyy-MM-dd HH:mm:ss"
                                :editable="false"
                                @on-change="onStartTimeChange" 
                                :options="startTimeOption" 
                                style="width:100%;max-width: 300px;" 
                                type="date" placeholder="请选择开始时间"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="1" style="text-align: center">至</Col>
                        <Col span="8">
                            <FormItem prop="endDate">
                                <DatePicker 
                                format="yyyy-MM-dd HH:mm:ss"
                                v-model="formData.endDate"
                                :editable="false"
                                @on-change="onEndTimeChange" 
                                :options="endTimeOption" 
                                style="width:100%;max-width: 300px;" 
                                type="date" placeholder="请选择结束时间"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="链接：" prop="linkUrl">
                    <Input v-model="formData.linkUrl" placeholder="请输入链接" />
                </FormItem>

                <FormItem>
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                        <Button type="default" @click="handleCancel">返回</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let { adManageMethod } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this,
            uploadImageValid = (rule, value, callBack) => {
                // console.log(this.uploadList)
                if (that.uploadList.length==0){
                    return callBack(new Error('请上传图片'))
                } else {
                    callBack();
                }
            },
            startDateValid = (rule, value, callBack) => {
                if (!that.formData.startDate){
                    return callBack(new Error('请选择开始时间'))
                } else {
                    callBack();
                }
            },
            endDateValid = (rule, value, callBack) => {
                if (!that.formData.endDate){
                    return callBack(new Error('请选择结束时间'))
                } else {
                    callBack();
                }
            }
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['广告管理','广告列表'],
            subTitle: (that.$route.query.id)? '编辑广告':'新建广告',
            currentItemId: that.$route.query.id,
            uploadList: [],
            adsenseList: [],
            visible: false,
            formData: {
                name: '',
                adsenseId: '',
                linkUrl: '',
                startDate: '',
                endDate: ''
            },
            startTimeOption: {
                // 不可选今天之前的日期
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            endTimeOption: {
                // 不可选今天之前的日期
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            ruleValidate: {
                photo: [
                    { validator: uploadImageValid, trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '广告名称不能为空', trigger: 'blur' },
                    { max: 30, message: '广告名称不能超过30个字', trigger: 'blur' }
                ],
                adsenseId: [
                    { required: true, message: '请选择广告位', trigger: 'blur', type: 'number'}
                ],
                startDate: [
                    { validator: startDateValid, trigger: 'blur' }
                ],
                endDate: [
                    { validator: endDateValid, trigger: 'blur' }
                ]
            }
        }
    },
    components:{
        breadcrumb
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList
        if(this.currentItemId) this.getAdById()
        this.getAdsenseList()
    },
    methods: {
        // 预览上传的图片
        handleView (item) {
            this.visible = true;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleBeforeUpload (file) {
            const that = this
            const check = that.uploadList.length < 1;
            let uploadNewItem = {},
                uploadList = []
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 1 张图片。'
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
                // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
                // 读取文件作为 URL 可访问地址
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    file.url = reader.result
                    file.suffix=file.type.split('/')[1] // 获取图片后缀
                    file.body=file.url.split(',')[1]  // 获取图片base64格式的地址
                    file.source='localSource',
                    uploadList.push(file)
                    that.uploadList = uploadList
                }
            }
        },
        handleCancel () {
            let that = this
            that.$router.go(-1)
        },
        // 删除上传的图片
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList=[]
        },

        // 选择广告位
        handleChangeStatus(value) {
            this.formData.adsenseId = value
            if(this.formData.adsenseId) this.getDisableDateByAdsense() // 未选择广告位时，不执行函数。否则保存提交后，会提示'未选择广告位id'
        },
        /**
         * 开始时间发生变化时触发,设置结束时间不可选择的日期
         * 结束时间应大于等于开始时间,且小于等于当前时间
         * @param {string} startTime 格式化后的日期
         * @param {string} type 当前的日期类型
        */
        onStartTimeChange (startTime, type) {
            this.submitStartTime = startTime.substr(0,10) // 单独保存年月日，解决提交时，formdate里的日期被转成中国标准时间
            this.formData.startDate = startTime
            this.getDisableDateByAdsense(1, startTime)  // 选择日期后，再次点击时重置不可选日期
            // this.endTimeOption = {
            //     disabledDate(endTime) {
            //         return endTime < new Date(startTime)
            //     }
            // }
        },
        /**
         * 结束时间发生变化时触发,设置开始时间不可选择的日期
         * 开始时间小于等于结束时间,且小于等于当前时间
         * @param {string} date 格式化后的日期
         * @param {string} type 当前的日期类型
        */
       onEndTimeChange(endTime, type) {
           this.submitEndTime = endTime.substr(0,10) // 单独保存年月日，解决提交时，formdate里的日期被转成中国标准时间
           this.formData.endDate = endTime.replace("00:00:00","23:59:59")
           this.getDisableDateByAdsense(2, endTime)  // 选择日期后，再次点击时重置不可选日期
        //    this.startTimeOption = {
        //        disabledDate(startTime) {
        //            return startTime > new Date(endTime) || startTime.valueOf() < Date.now() - 86400000;
        //        }
        //    }
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
                            // 单独保存年月日，解决提交时，formdate里的日期被转成中国标准时间
                            that.submitStartTime=res.data.startDate
                            that.submitEndTime=res.data.endDate
                            that.formData.startDate=res.data.startDate+" 00:00:00"
                            that.formData.endDate=res.data.endDate+" 23:59:59"
                            for (let item of res.data.file) {
                                item.url = that.imagePrefix + item.src
                                item.source = 'internetSource'
                            }
                            that.uploadList = res.data.file
                            that.getDisableDateByAdsense()  // 初始时请求默认值
                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            adManageMethod.getAdById(params)
        },
        // 获取不可选日期
        getDisableDateByAdsense(type, nowTime){
            let that = this,
                params = {
                    params: {
                        adsenseid: that.formData.adsenseId,
                        id: that.currentItemId
                    },
                    callBack: (res) => {
                        if (res && res.code==200 && res.data){
                            switch (type) {
                                case 1:
                                that.startTimeOption =  {
                                    // 开始日期不可选今天之前及后台返回的不可选的日期
                                    disabledDate (date) {
                                        let date1 = new Date(date)
                                        for (let item of res.data) {
                                            let itemDate = new Date(item.replace(/\-/g, "\/"))  // 转成yyyy/mm/dd格式 否则比较时返回false
                                            if (date - itemDate ==0) return true
                                        }
                                        return date && date.valueOf() < Date.now() - 86400000;
                                    }
                                }
                                that.endTimeOption = {
                                    // 结束日期不可选今天之前及后台返回的不可选的日期，及小于开始日期的日期
                                    disabledDate (date) {
                                        let date1 = new Date(date)
                                        for (let item of res.data) {
                                            let itemDate = new Date(item.replace(/\-/g, "\/"))  // 转成yyyy/mm/dd格式 否则比较时返回false
                                            if (date - itemDate ==0) return true
                                        }
                                        return date && date.valueOf() < Date.now() - 86400000 || date < new Date(nowTime);
                                    }
                                }
                                break
                                case 2:
                                that.startTimeOption =  {
                                    // 开始日期不可选今天之前及后台返回的不可选的日期，及大于结束日期的日期
                                    disabledDate (date) {
                                        let date1 = new Date(date)
                                        for (let item of res.data) {
                                            let itemDate = new Date(item.replace(/\-/g, "\/"))  // 转成yyyy/mm/dd格式 否则比较时返回false
                                            if (date - itemDate ==0) return true
                                        }
                                        return date && date.valueOf() < Date.now() - 86400000 || date > new Date(nowTime);
                                    }
                                }
                                that.endTimeOption = {
                                    // 结束日期不可选今天之前及后台返回的不可选的日期
                                    disabledDate (date) {
                                        let date1 = new Date(date)
                                        for (let item of res.data) {
                                            let itemDate = new Date(item.replace(/\-/g, "\/"))  // 转成yyyy/mm/dd格式 否则比较时返回false
                                            if (date - itemDate ==0) return true
                                        }
                                        return date && date.valueOf() < Date.now() - 86400000;
                                    }
                                }
                                break
                                default:
                                that.startTimeOption =  that.endTimeOption = {
                                    // 不可选今天之前及后台返回的不可选的日期
                                    disabledDate (date) {
                                        let date1 = new Date(date)
                                        for (let item of res.data) {
                                            let itemDate = new Date(item.replace(/\-/g, "\/"))  // 转成yyyy/mm/dd格式 否则比较时返回false
                                            if (date - itemDate ==0) return true
                                        }
                                        return date && date.valueOf() < Date.now() - 86400000;
                                    }
                                }
                            }

                        } else {
                            that.$Message.error(res.msg)
                        }
                    }
                }
            adManageMethod.getDisableDateByAdsense(params)
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
        },
        // 新增、编辑广告
        handleSubmit (name) {
            let that =this,
                currentUrl = (that.currentItemId) ? '/adviertisement/update':'/adviertisement/create',
                currentMethod = (that.currentItemId) ? 'PUT':'POST'   
            that.$refs[name].validate((valid) => {
                if (valid) {
                    let  base64File
                    if (that.uploadList[0].source == 'localSource') {
                        base64File = [{
                            body: that.uploadList[0].body,
                            suffix: that.uploadList[0].suffix
                        }]
                    } else if (that.uploadList[0].source == 'internetSource'){
                        base64File = []
                    }
                    if (new Date(that.submitStartTime) > new Date(that.submitEndTime)) {
                        that.$Message.error('开始日期不可大于结束日期')
                        return false
                    }
                    let params = {
                        method: currentMethod,
                        url: currentUrl,
                        id: that.currentItemId,
                        adsenseId: that.formData.adsenseId,
                        endDate: that.submitEndTime,
                        startDate: that.submitStartTime,
                        linkUrl: that.formData.linkUrl,
                        name: that.formData.name,
                        base64File: base64File,
                        fileID: (base64File.length>0) ? that.formData.fileID:'',
                        callBack: (res) => {
                            that.getDisableDateByAdsense() // 保存后，重置不可选日期
                            if (res && res.code==200){
                                that.$Message.success(res.data)
                                if(!that.currentItemId) that.$refs[name].resetFields()
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    adManageMethod.handleAdItemSubmit(params)
                    
                } else {
                    return false
                }
            })
        },

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
}
</style>
