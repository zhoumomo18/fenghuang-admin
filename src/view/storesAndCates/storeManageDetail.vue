<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <p class="infoBox">基本信息</p>
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <FormItem label="* 上传封面：">
                    <div class="upload-list" v-for="item in uploadList">
                        <img :src="item.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView()"></Icon>
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
                        <img :src="uploadList[0].url" v-if="visible" style="width: 480px; height: 300px;">
                    </Modal>
                    <p style="color: #999;">请上传 .png .jpg 图片</p>
                </FormItem>
                <FormItem label="商户名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入商户名称" style="width: 800px;" />
                </FormItem>
                <FormItem label="商户地址：" prop="address">
                    <Input v-model="formData.address" placeholder="请输入商户地址" style="width: 800px;" />
                </FormItem>
                <FormItem label="经度：" prop="longitude" style="display: inline-block;">
                    <Input v-model="formData.longitude" placeholder="请输入经度" style="width: 200px;"/>
                </FormItem>
                <FormItem label="纬度：" prop="dimension" style="display: inline-block;">
                    <Input v-model="formData.dimension" placeholder="请输入纬度" style="width: 200px;"/>
                </FormItem>
                <FormItem label="营业时间：" prop="openTime">
                    <Input v-model="formData.openTime" placeholder="请输入营业时间" style="width: 800px;" />
                </FormItem>
                <FormItem label="推荐指数：" prop="ratings">
                    <Input v-model="formData.ratings" placeholder="请输入0-5之间的数字" style="width: 200px;"/>
                    <span style="padding-left: 10px;">最高分5.0分</span>
                </FormItem>
                <FormItem label="人均消费：" prop="averageConsume">
                    <Input v-model="formData.averageConsume" placeholder="请输入人均消费" style="width: 200px;"/>
                    <span style="padding-left: 10px;">元</span>
                </FormItem>
                <FormItem label="菜系：" prop="selectStyles">
                    <Select v-model="selectStyles" multiple :on-change="onSelectStyles(selectStyles)" style="width:360px">
                        <Option v-for="item in stylesList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <p class="infoBox">商家图集</p>
                <FormItem label="* 商家图片：">
                    <div class="upload-list" v-for="(item, index) in uploadAlbumList" style="display: block;">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleAlbumView(index)"></Icon>
                            <Icon type="ios-trash-outline" @click="handleAlbumRemove(item)"></Icon>
                        </div>
                        <img :src="item.url">
                    </div>
                    <Upload
                        ref="uploadAlbum"
                        multiple
                        :format="['jpg','jpeg','png']" 
                        action="/tourManager/v1.0/other/filedonothing/anon"
                        :show-upload-list="false"
                        :on-format-error="handleFormatError"
                        :before-upload="handleBeforeAlbumUpload">
                        <div class="ivu-cover-image">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="albumvisible">
                        <img :src="uploadAlbumList[picIndex].url" v-if="albumvisible" style="width: 480px; height: 300px;">
                    </Modal>
                    <p style="color: #999;">请上传 .png .jpg 图片, 最多30张</p>
                </FormItem>

                <FormItem style="margin-top: 60px">
                    <Row type="flex" justify="center">
                        <Button type="primary" @click="handleSubmitData(1, 'ruleForm')">直接发布</Button>
                        <Button type="primary" @click="handleSubmitData(2, 'ruleForm')">保存</Button>
                        <Button type="default" @click="handleCancelBtn">取消</Button>
                    </Row>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
let { storesAndCatesMethod } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this
        let validateLongitude = (rule, value, callback) => {
            if(value === "") {
                return callback(new Error('经度值不能为空'))
            } else if(value < -180 || value > 180 || isNaN(value)) {
                callback(new Error('请输入-180到180之间的经度值'))
            } else {
                callback();
            }
        };
        let validateDimension = (rule, value, callback) => {
            if(value === "") {
                return callback(new Error('纬度值不能为空'))
            } else if(value < -90 || value > 90 || isNaN(value)) {
                callback(new Error('请输入-90到90之间的纬度值'));
            } else {
                callback();
            }
        };
        let validateRatings = (rule, value, callback) => {
            var reg = /^\d+\.?\d{0,1}$/;
            if (!value || isNaN(value)) {
                return callback(new Error('请输入正确的推荐指数'));
            } else if( value < 0 || value > 5) {
                callback(new Error('请输入0到5之间的推荐指数'));
            } else if( !reg.test(value) ) {
                callback(new Error('最多允许一位小数'));
            } else {
                callback()
            }
        };
        let validateAverageConsume = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入正确的人均消费值'));
            } else {
                callback()
            }
        };
        return {
            imagePrefix: that.imagePrefix,
            breadcrumbs: ['商家美食','商家管理'],
            subTitle: (that.$route.query.id) ? '编辑商家' : '新建商家',
            currentItemId: that.$route.query.id,
            updateIcon: '',
            stylesList: [
                // {id: 0, name: '川菜'},
                // {id: 1, name: '粤菜'},
                // {id: 2, name: '湘菜'}
            ],
            selectStyles: [],
            formData: {
                id: 0,
                name: "",
                address: "",
                longitude: "",
                dimension: "",
                openTime: "",
                ratings: "",
                averageConsume: "",
                base64File: [],
                base64File1: [],
                deleteIds: []
            },
            imgName: '',
            visible: false,
            albumvisible: false,
            picIndex: "",
            uploadList: [], // 封面
            uploadAlbumList: [], // 图集
            ruleForm: {
                name: [
                    { required: true, message: '商家名称不能为空', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '商家地址不能为空', trigger: 'blur' }
                ],
                longitude: [
                    { required: true, validator: validateLongitude, trigger: 'blur' }
                ],
                dimension: [
                    { required: true, validator: validateDimension, tirgger: 'blur' }
                ],
                openTime: [
                    { required: true, message: '营业时间不能为空', trigger: 'blur' }
                ],
                ratings: [
                    { required: true, validator: validateRatings, trigger: 'blur' }
                ],
                averageConsume: [
                    { required: true, validator: validateAverageConsume, type: 'number', min: 0, trigger: 'blur' }
                ],
                // selectStyles: [
                //     { required: false, type: 'array', min: 0, max: 3, message: '请选择1-3个菜系', trigger: 'change' }
                // ]
            }
        }
    },
    components:{
        breadcrumb
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
        this.uploadAlbumList = this.$refs.uploadAlbum.fileList;
        this.getStoresDetailById()
        this.getColumnOptions()
    },
    methods: {
        // 限制选择菜系名称的数量
        onSelectStyles(selectStylesList) {
            if(selectStylesList.length > 3) {
                this.$Message.warning("菜系名称不能选择超过3个");
                this.selectStyles = selectStylesList.length > 3 ? selectStylesList.splice(0, 3): selectStylesList;
            }
        },
        // 预览上传的图片
        handleView () {
            this.visible = true;
        },
        handleAlbumView (index) {
            this.picIndex = index;
            this.albumvisible = true;
        },
        // 验证要上传的图片格式
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        // 限制要上传的图片数量(封面)
        handleBeforeUpload (file) {
            let that = this
            const check = that.uploadList.length < 1;
            if (!check) {
                that.$Notice.warning({
                    title: `最多只能上传 1 张封面图片`
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    let picFormat = reader.result.split(";")[0].split("/")[1]
                    if(picFormat == "png" || picFormat == "jpeg") {  
                        file.url = reader.result
                        that.uploadList = []
                        that.uploadList.push(file)
                        
                        let tempObj = {
                            body: reader.result.split(",")[1], // 图片的文件编码string
                            suffix: picFormat // 图片的格式string
                        }
                        that.formData.base64File = []
                        that.formData.base64File.push(tempObj)
                    }
                }
            }
            return check;
        },
        // 限制要上传的图片不超过10张(图集)
        handleBeforeAlbumUpload (file) {
            let that = this
            const check = that.uploadAlbumList.length < 10;
            if (!check) {
                that.$Notice.warning({
                    title: `最多只能上传 10 张商家图片`
                });
            } else {
                // 创建一个 FileReader 对象
                let reader = new FileReader()
                reader.readAsDataURL(file)            
                reader.onloadend = function (e) {
                    let picFormat = reader.result.split(";")[0].split("/")[1]
                    if(picFormat == "png" || picFormat == "jpeg") {
                        file.url = reader.result

                        that.uploadAlbumList.splice(that.uploadAlbumList.length - 1, 1)
                        that.uploadAlbumList.push(file)

                        let tempObj = {
                            body: reader.result.split(",")[1], // 图片的文件编码string
                            suffix: picFormat // 图片的格式string
                        };
                        if(!that.formData.base64File1) { // 编辑时，formData中没有base64File1数组，无法push
                            that.formData.base64File1 = []
                        }
                        that.formData.base64File1.push(tempObj)
                    }
                }
            }
            return check;
        },
        // 删除上传的封面
        handleRemove (file) {
            let fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            this.uploadList = [];
        },
        // 删除上传的图集
        handleAlbumRemove (file) {
            let fileList = this.$refs.uploadAlbum.fileList;
            if(file.id) {
                this.uploadAlbumList.splice(fileList.indexOf(file), 1); // 删除图集列表中该项
                // 添加id到deleteIds
                this.formData.deleteIds.push(file.id)
            } else {
                this.formData.base64File1.splice(fileList.indexOf(file), 1); // 删除提交的图集信息中的该项
                this.$refs.uploadAlbum.fileList.splice(fileList.indexOf(file), 1); // 删除upload中fileList的该项
                console.log("this.formData.base64File1:")
                console.log(this.formData.base64File1)
            }
        },
        /*********************************** 调用接口 ************************************/
        // 获取当前商家详情 (normal)
        getStoresDetailById () {
            let that = this
            if(that.currentItemId) {
                let params = {
                    id: that.currentItemId,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            console.log(res)
                            that.formData = res.data;
                            // 显示选中的菜系
                            res.data.cuisineList.map(item => {
                                that.selectStyles.push(item.id)
                            })
                            // 将获取的封面和图集放在展示列表uploadList uploadAlbumList中
                            that.uploadList = [ 
                                { url: that.imagePrefix + res.data.file[0].src }
                            ];
                            res.data.fileList.map(item => {
                                that.uploadAlbumList.push({
                                    id: item.id,
                                    url: that.imagePrefix + item.src
                                })
                            })
                            console.log(that.uploadList)
                            console.log(that.uploadAlbumList)
                            that.formData.deleteIds = []
                            that.formData.longitude = res.data.longitude * 1 // 校验规则校验初始数据经纬度为number
                            that.formData.dimension = res.data.dimension * 1
                        } else {
                            console.log(res)
                            that.$Message.error(res.msg);
                        }
                    }
                };
                storesAndCatesMethod.getStoresById(params);
            }
        },
        // 直接发布/保存
        handleSubmitData(publishValue, name) {
            let that = this, picNotNull = true;
            // 封面和图集不能为空
            if(that.uploadAlbumList.length == 0 || that.uploadList.length == 0) {
                picNotNull = false
                that.$Message.warning("封面图片和图集图片不能为空");
            }

		    that.$refs[name].validate(valid => {
				if (valid && picNotNull) {
                    let that = this;
                    let stylesList = []
                    that.selectStyles.map(item => {
                        stylesList.push({id: item})
                    })
                    let data = {
                        id: that.currentItemId,
                        name: that.formData.name,
                        address: that.formData.address,
                        longitude: that.formData.longitude,
                        dimension: that.formData.dimension,
                        openTime: that.formData.openTime,
                        ratings: that.formData.ratings,
                        averageConsume: that.formData.averageConsume,
                        base64File: that.formData.base64File,
                        base64File1: that.formData.base64File1,
                        cuisineList: stylesList,
                        publishState: publishValue,
                        deleteIds: that.formData.deleteIds, // 删除图片id的list
                        callBack: res => {
                            if (res && res.code == 200) {
                                if(publishValue == 1) {
                                    that.$Message.success("发布成功");
                                } else {
                                    that.$Message.success("保存成功");
                                }
                                that.$router.push({ path: "/storesManage" });
                            } else {
                                console.log(res)
                                that.$Message.error(res.msg);
                            }
                        },
                    };
                    console.log("submitData:")
                    console.log(data)
                    storesAndCatesMethod.handleSubmitStoreInfo(data);
				} else {
					that.$Message.error("请检查必填项");
				}
			});
        },
        // 获取菜系options (normal)
        getColumnOptions() {
            let that = this,
                params = {
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.$Message.success("数据请求成功");
                            that.stylesList = res.data;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                };
            storesAndCatesMethod.getCateStylesOptions(params);
        },
        // 取消按钮，返回上一级
        handleCancelBtn () {
            this.$Modal.confirm({
                title: '放弃此次编辑？',
                onOk: () => {
                    this.$router.push({ path:'/storesManage' })
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.page-form-group{
    padding: 24px;
    .infoBox {
        height: 36px;
        line-height: 36px;
        text-indent: 15px;
        margin-bottom: 20px;
        background-color: #eeebeb;
    }
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
.ivu-select-dropdown{
    z-index: 9999;
}
</style>
