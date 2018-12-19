<template>
    <div class="page-head-title bg-white">
        <Breadcrumb>
            <BreadcrumbItem v-for="(item,index) in breadcrumbs" :key="item.key" v-if="index==0">当前位置：{{item}}</BreadcrumbItem>
            <BreadcrumbItem v-else>{{item}}</BreadcrumbItem>
        </Breadcrumb>
        <h3 v-if="subTitle">{{subTitle}}</h3>
        <div v-if="subTitle == '房型配置'" style="margin-top: 12px; height: 20px;line-height: 20px;">
            <Icon v-if="subTitle == '房型配置'" type="md-information-circle" size="18" color="red"/>
            <span>房型及配置将按照添加顺序优先排序</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        breadcrumbs: Array,
        subTitle: String
    },
}
</script>


<style lang="less" scoped>
.page-head-title{
    padding: 24px;
    background: #fff;
    margin-bottom: 12px;
    h3{
        font-size: 18px;
        margin-top: 12px;
    }
}
</style>

