<template>
    <div>
        <breadcrumb :breadcrumbs="breadcrumbs" :subTitle="subTitle"></breadcrumb>

        <div class="page-form-group bg-white">
            <Form ref="ruleForm" :rules="ruleForm" :model="formData" :label-width="120">
                <FormItem label="票种名称：" prop="name">
                    <Input v-model="formData.name" placeholder="请输入票种名称" style="width: 800px;"/>
                </FormItem>
                <FormItem label="景点名称：" prop="scenicid">
                    <!-- <Input v-model="formData.scenicid" placeholder="请输入景点名称" style="width: 800px;"/> -->
                    <Select v-model="formData.scenicid" filterable :disabled="isSelectDisabled" placeholder="请选择景点" style="width: 800px;">
                        <Option v-for="item in scenicsOptions" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="有效期限：" prop="expirydate">
                    <Select v-model="formData.expirydate" style="width:360px">
                        <Option v-for="item in timeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="价格：" prop="price">
                    <Input v-model="formData.price" placeholder="请输入价格" style="width: 280px;"/>
                </FormItem>

                <FormItem>
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
let { scenicsTicketsMethod } = require('../../script/page.js')
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
        return {
            breadcrumbs: ['景区门票','票务中心'],
            subTitle: (that.$route.query.id) ? '编辑票种' : '新建票种',
            currentItemId: that.$route.query.id,
            updateIcon: '',
            timeOptions: [
                {value: 1, label: '有效期一个月'},
                {value: 2, label: '有效期两个月'},
                {value: 3, label: '有效期三个月'}
            ],
            scenicsOptions: [],
            isSelectDisabled: false,
            formData: {
                name: "",
                scenicid: "",
                price: "",
                expirydate: 1
            },
            ruleForm: {
                name: [
                    { required: true, message: '票种名称不能为空', trigger: 'blur' }
                ],
                scenicid: [
                    { required: true, message: '请选择景点' }
                ],
                expirydate: [
                    { required: true, message: '有效期限不能为空' }
                ],
                price: [
                    { required: true, validator: validatePrice, tirgger: 'blur' }
                ]
            }
        }
    },
    components: {
        breadcrumb
    },
    mounted () {
        this.getScenicsDetailById()
        this.getScenicsOptions()
        // 景区-添加票种跳转 存在scenicid，带入景区名称并禁用下拉框
        if(this.$route.query.scenicid) {
            this.formData.scenicid = this.$route.query.scenicid * 1;
            this.isSelectDisabled = "disabled";
        }
    },
    methods: {
        // 获取当前票种的详情 (normal)
        getScenicsDetailById () {
            let that = this
            if(that.currentItemId) {
                let params = {
                    id: that.currentItemId,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            console.log(res)
                            that.$Message.success("数据请求成功");
                            that.formData = res.data;
                            that.formData.scenicid = res.data.scenicid * 1
                        } else {
                            that.$Message.error(res.msg);
                        }
                    }
                };
                scenicsTicketsMethod.getTicketsById(params);
            }
        },
        //  获取景点下拉列表options
        getScenicsOptions() {
            let that = this,
                params = {
                    name: that.name,
                    callBack: res => {
                        if (res && res.code == 200 && res.data) {
                            that.scenicsOptions = res.data;
                        } else {
                            that.$Message.error(res.msg);
                        }
                    },
                };
            scenicsTicketsMethod.getScenicsOptions(params);
        },
        // 保存/直接发布票种 (normal)
        handleSubmitData(type, name) {
			let that = this;
		    that.$refs[name].validate(valid => {
				if (valid) {	
					let data = {
						id: that.currentItemId ? that.currentItemId * 1 : null,
                        name: that.formData.name,
                        scenicid: that.formData.scenicid,
                        price: that.formData.price * 1,
                        expirydate: that.formData.expirydate * 1,
                        status: type,
                        callBack: res => {
							if (res && res.code == 200) {
                                if(type == 1) {
                                    that.$Message.success("发布成功");
                                } else {
                                    that.$Message.success("保存成功");
                                }
                                that.$router.go(-1); // 保存成功，返回上一级
							} else {
								that.$Message.error(res.msg);
							}
						}
                    };
                    scenicsTicketsMethod.handleSubmitTickets(data);
				} else {
					that.$Message.error("请检查必填项");
				}
			});
        },
        // 取消按钮，返回上一级
        handleCancelBtn () {
            this.$Modal.confirm({
                title: '放弃此次票种编辑？',
                onOk: () => {
                    this.$router.go(-1)
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
}
.ivu-select-dropdown{
    z-index: 9999;
}
</style>
