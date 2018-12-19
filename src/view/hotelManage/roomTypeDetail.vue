<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <p class="infoBox">配置</p>
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <FormItem label="名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入配置名称" style="width: 800px;"/>
                </FormItem>
                <FormItem label="价格：" prop="price">
                    <Input v-model="formData.price" placeholder="请输入价格" style="width: 280px;"/>
                </FormItem>
                <FormItem label="是否支持退订：" prop="isUnsubscribe">
                    <RadioGroup v-model="formData.isUnsubscribe">
                        <Radio v-for="item in returnList" :label="item.value" :key="item.value" class="radio">
                            {{ item.label }}
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="退订规则说明：" prop="unsubscribeRules">
                    <Input v-model="formData.unsubscribeRules" placeholder="请输入退订规则说明" type="textarea" />
                </FormItem>
                <FormItem label="详细配置：" prop="detailConfigList">
                    <CheckboxGroup v-model="formData.detailConfigList">
                        <Checkbox v-for="item in detailedDeployList" :label="item.name" :key="item.name" class="checkBox">
                            {{ item.name }}
                        </Checkbox>
                    </CheckboxGroup>
                    <span @click="addCheckBoxItem" style="margin-top: 10px;color: #09f;cursor: pointer;">添加自定义</span>
                </FormItem>
                <Button type="info" @click="submitNewDeploy('ruleForm')" style="margin-left: 18px;">添加配置</Button>
                <FormItem v-if="housingConfigurationList.length == 0">
                    <Row type="flex" justify="center">
                        <Col span="3">
                            <Button type="primary" @click="submitNewDeploy('ruleForm')">保存</Button>
                        </Col>
                        <Col span="3"> 
                            <Button type="default" @click="handleCancelBtn">返回</Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>

            <Modal
                v-model="isShowModal"
                title="添加自定义"
                @on-cancel="cancel">
                <div style="text-align:center">
                    <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px;margin-left:100px;">
                        <FormItem
                                v-for="(item, index) in formDynamic.items"
                                :key="index"
                                :label="'字段名' + item.index"
                                :prop="'items.' + index + '.value'"
                                :rules="{required: true, message: '字段名不能为空', trigger: 'blur'}">
                            <Row>
                                <Col span="18">
                                    <Input type="text" v-model="item.value" placeholder="请输入字段名"></Input>
                                </Col>
                                <!-- <Col span="4" offset="1">
                                    <Button @click="handleRemove(index)">删除</Button>
                                </Col> -->
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" style="color: #09f" @click="handleAdd" icon="md-add">继续添加</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
                <p slot="footer" style="text-align:center">
                    <Button type="primary" @click="handleSubmit('formDynamic')">确定</Button>
                    <Button @click="handleCancel('formDynamic')" style="margin-left: 8px">取消</Button>
                </p>
            </Modal>

            <!-- deployList -->
            <!-- 使用相同的rule验证 -->
            <div v-for="(item, index) in housingConfigurationList">
                <Form ref="ruleListForm" :rules="ruleForm" :model="item" :label-width="120">
                    <p class="dividerLine"></p>
                    <FormItem label="名称：" prop="name">
                        <Input v-model="item.name" placeholder="请输入票种名称" style="width: 800px;"/>
                    </FormItem>
                    <FormItem label="价格：" prop="price">
                        <Input v-model="item.price" placeholder="请输入价格" style="width: 280px;"/>
                    </FormItem>
                    <FormItem label="是否支持退订：" prop="isUnsubscribe">
                        <RadioGroup v-model="item.isUnsubscribe">
                            <Radio v-for="radioItem in returnList" :label="radioItem.value" :key="radioItem.value" class="radio">
                                {{ radioItem.label }}
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="退订规则说明：" prop="unsubscribeRules">
                        <Input v-model="item.unsubscribeRules" placeholder="请输入退订规则说明" type="textarea" />
                    </FormItem>
                    <FormItem label="详细配置：" prop="detailedConfiguration">
                        <CheckboxGroup v-model="item.detailedConfiguration">
                            <Checkbox v-for="checkItem in item.detailConfigList" :label="checkItem.name" :key="checkItem.name" class="checkBox">
                                {{ checkItem.name }}
                            </Checkbox>
                        </CheckboxGroup>
                        <span @click="addCheckBoxItem(index)" style="margin-top: 10px;color: #09f;cursor: pointer;">添加自定义</span>
                    </FormItem>
                    <Button type="warning" @click="submitDeleteDeploy(item, index)" style="margin-left: 18px;">删除配置</Button>
                    <FormItem v-if="index == (housingConfigurationList.length - 1)">
                        <Row type="flex" justify="center">
                            <Col span="3">
                                <Button type="primary" @click="handleSubmitData">保存</Button>
                            </Col>
                            <Col span="3">
                                <Button type="default" @click="handleCancelBtn">返回</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
let { hotelMethod } = require('../../script/page.js')
import breadcrumb from "../../component/template/breadCrumb.vue"
export default {
    data () {
        let that = this;
        let validatePrice = (rule, value, callback) => {
            if(value === "") {
                return callback(new Error('价格不能为空'))
            } else if (value < 0 || isNaN(value)) {
                return callback(new Error('请输入正确的价格'));
            } else {
                callback()
            }
        };
        let validateDetailDeploy = (rule, value, callback) => {
            if(value.length == 0) {
                return callback(new Error('详细配置不能为空'))
            } else if (value.length > 4) {
                return callback(new Error('详细配置不能选择超过4项'));
            } else {
                callback()
            }
        };
        return {
            breadcrumbs: ['酒店预订','酒店管理'],
            subTitle: '房型配置',
            currentItemId: that.$route.query.id, // 房型id
            updateIcon: '',
            returnList: [ // 是否支持退订radio list 0:否 1:是
                { value: 1, label: '支持退订' },
                { value: 0, label: '不支持退订' }
            ],
            detailedDeployList: [ // 详细配置checkBox list(需获取 接口未完)
                { name: '阳台', isChecked: 0 }, // 是否选择 0:否 1:是
                { name: '有窗', isChecked: 0 },
                { name: '湖景房', isChecked: 0 },
                { name: '海景房', isChecked: 0 },
                { name: '早餐', isChecked: 0 }
            ],
            formData: {
                name: "",
                price: "", 
                isUnsubscribe: "", // 是否支持退订 0:否 1:是
                unsubscribeRules: "", // 退订规则说明 string
                detailConfigList: [] // 详细配置 list
            },
            housingConfigurationList: [ // 获取的该房型的配置list

            ],
            ruleForm: {
                name: [
                    { required: true, message: '房型名称不能为空', trigger: 'blur' }
                ],
                price: [
                    { required: true, validator: validatePrice, tirgger: 'blur' }
                ],
                isUnsubscribe: [
                    { required: true, message: '是否支持退订不可为空' }
                ],
                unsubscribeRules: [
                    { required: true, message: '退订规则说明不可为空', trigger: 'blur' }
                ],
                // detailConfigList: [
                //     { required: true, type: 'array', min: 1, max: 4, message: '请选择1-4个详细配置', trigger: 'change' }
                // ],
                detailConfigList: [
                    { required: true, validator: validateDetailDeploy, tirgger: 'blur' }
                ],
                detailedConfiguration: [
                    { required: true, validator: validateDetailDeploy, tirgger: 'blur' }
                ]
            },
            //******************************
            isShowModal: false,
            formDynamic: {
                items: [
                    { value: '', index: 1 }
                ]
            },
            index: 1,
            listIndex: -1
        }
    },
    components: {
        breadcrumb
    },
    mounted () {
        this.getHouseConfigurationList()
    },
    methods: {
        //******************* 自定义弹出框modal **********************
        handleSubmit(name) {
            let self = this;
            console.log("self.listIndex:")
            console.log(self.listIndex)
            self.$refs[name].validate((valid) => {
                if (valid) {
                    console.log(isNaN(self.listIndex))
                    if(self.listIndex >= 0) {
                        console.log("list")
                        self.formDynamic.items.map(item => {
                            self.housingConfigurationList[self.listIndex].detailConfigList.push({
                                name: item.value, isChecked: 0
                            })
                        })
                    } else {
                        console.log("new")
                        self.formDynamic.items.map(item => {
                            self.detailedDeployList.push({
                                name: item.value, isChecked: 0
                            })
                        })
                    }
                    self.$Message.success('Success!');
                    self.isShowModal = false;
                } 
            })
        },
        handleAdd() {
            this.index++;
            this.formDynamic.items.push({
                value: '',
                index: this.index
            });
        },
        handleCancel(name) {
           this.$refs[name].resetFields();
           this.isShowModal = false; 
        },
        cancel() {
            this.isShowModal = false;
        },
        // handleRemove(index) {
        //     console.log(index)
        //     this.formDynamic.items.splice(index, 1);
        // },
        // 添加自定义 (normal)
        addCheckBoxItem(listIndexValue) {
            this.isShowModal = true;
            this.formDynamic.items = [ { value: '', index: 1 } ];
            if(!isNaN(listIndexValue)) {
                this.listIndex = listIndexValue;
            } else {
                this.listIndex = -1;
            }
        },
        //************************* 调用接口 ******************************
        // 获取当前房型信息列表 (normal)
        getHouseConfigurationList () {
            let that = this
            if(that.currentItemId) {
                let params = {
                    hosingTypeId: that.currentItemId,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            console.log("res.data:")
                            console.log(res.data)
                            that.$Message.success("数据请求成功");
                            that.housingConfigurationList = [];
                            res.data.map(item => {
                                let obj = {};
                                obj.detailConfigList = item.detailConfigList
                                obj.detailedConfiguration = [] // 用来记录checkBox中的选中项，只需name
                                obj.houseTypeId = item.houseTypeId
                                obj.id = item.id
                                obj.isUnsubscribe = item.isUnsubscribe
                                obj.name = item.name
                                obj.price = item.price
                                obj.unsubscribeRules = item.unsubscribeRules
                                that.housingConfigurationList.push(obj)
                            })

                            that.housingConfigurationList.map(item => {
                                let newConfigList = [];
                                item.detailConfigList.map(configItem => {
                                    let obj = {
                                        id: configItem.id,
                                        isChecked: configItem.isChecked,
                                        name: configItem.name
                                    }
                                    newConfigList.push(obj)
                                })
                                item.detailConfigList = newConfigList
                            })

                            // 处理详细配置checkBox list
                            that.housingConfigurationList.map(item => {
                                // item.detailedConfiguration = []; 
                                item.detailConfigList.map(delItem => { // detailConfigList包含checkBox所有选项信息
                                    if(delItem.isChecked == 1) {
                                        item.detailedConfiguration.push(delItem.name)
                                    }
                                })
                            })
                            console.log("that.housingConfigurationList:")
                            console.log(that.housingConfigurationList)
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                };
                hotelMethod.getConfigurationList(params);
            }
        },
        // 提交新增的配置信息 (normal)
        submitNewDeploy(name) {
            let that = this;
            // 处理详细配置list
            that.detailedDeployList.map((itemAll, indexAll) => {
                that.detailedDeployList[indexAll].isChecked = 0 // 初始选中状态重置为0
                that.formData.detailConfigList.map(itemSelect => {
                    if(itemAll.name == itemSelect) {
                        that.detailedDeployList[indexAll].isChecked = 1
                    }
                })
            })
		    that.$refs[name].validate(valid => {
				if (valid) {	
					let data = {
                        houseTypeId: that.currentItemId, // 房型id
                        name: that.formData.name,
                        price: that.formData.price, 
                        isUnsubscribe: that.formData.isUnsubscribe, // 是否支持退订 0:否 1:是
                        unsubscribeRules: that.formData.unsubscribeRules, // 退订规则说明 string
                        detailConfigList: that.detailedDeployList, // 详细配置 string
                        callBack: res => {
                            if (res && res.code == 200) {
                                that.$Message.success("操作成功");
                                that.$refs[name].resetFields()
                                that.getHouseConfigurationList() // 新增成功后重新获取列表
							} else {
								that.$Message.error(res.msg);
							}
						}
                    };
                    hotelMethod.submitNewDeploy(data);
				} else {
					this.$Message.error("请检查必填项");
				}
			})
        },
        // 删除配置list中的配置item (normal)
        submitDeleteDeploy(item, index) {
            let that = this
            that.$Modal.confirm({
                title: '删除配置',
                content: '<p>删除配置【' + item.name + '】?</p>',
                onOk: () => {
                    let data = {
                        id: item.id * 1, // 获取的是配置id
                        callBack: (res) => {
                            if (res && res.code == 200) {
                                that.$Message.success('删除成功')
                                // that.getHouseConfigurationList()
                                that.housingConfigurationList.splice(index, 1)
                            } else {
                                that.$Message.error(res.msg)
                            }
                        }
                    }
                    hotelMethod.configurationListItemDelete(data);
                }
            });
        },
        // 保存列表
        handleSubmitData() {
            let that = this, checkResult = true;
            that.$refs.ruleListForm.map(item => {
                item.validate(valid => {
                    if(!valid) {
                        checkResult = false;
                    }
                });
            })

            // 处理详细配置list
            that.housingConfigurationList.map(item => { // item列表对象
                item.detailConfigList.map((delItem, delIndex) => { // detailConfigList包含checkBox所有选项信息
                    delItem.isChecked = 0
                    item.detailedConfiguration.map(checkedItem => {
                        if(delItem.name == checkedItem) {
                            delItem.isChecked = 1
                        }
                    })
                })
            })

            if(checkResult) {
                // detailedConfiguration不可作为参数，只有校验成功才删除
                that.housingConfigurationList.map(item => {
                    delete item.detailedConfiguration 
                })
                let data = {
                    housingConfigurationList: that.housingConfigurationList,
                    callBack: res => {
                        if (res && res.code == 200) {
                            that.$Message.success("保存成功");
                        } else {
                            console.log(res)
                            that.$Message.error(res.msg);
                        }
                    }
                };
                hotelMethod.SubmitConfigurationListData(data);
            } else {
                this.$Message.error("请检查必填项");
            }
        },
        // 取消按钮，返回上一级
        handleCancelBtn () {
            this.$Modal.confirm({
                title: '返回房型配置列表页？',
                onOk: () => {
                    // this.$router.go(-1)
                    this.$router.push({
                        path:'/roomTypeManage'
                    })
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.page-form-group{
    padding: 24px;
    font-size: 14px;
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
    .infoBox {
        height: 36px;
        line-height: 36px;
        text-indent: 15px;
        margin-bottom: 20px;
        font-size: 12px;
        background-color: #eeebeb;
    }
    .checkBox, .radio {
        margin-right: 50px;
    }
    .dividerLine {
        height: 5px;
        width: 100%;
        margin: 30px 0;
        background-color: #ddd
    }
}
.ivu-select-dropdown{
    z-index: 9999;
}
</style>
