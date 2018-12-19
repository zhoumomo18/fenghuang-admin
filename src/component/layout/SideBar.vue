<template>
    <Row>
        <Col span="8">
            <Menu :theme="theme2" width="200px" accordion @on-select="selectMenu">
                <Submenu v-for="(firstNav,firstNavIndex) in navList" 
                :name="firstNavIndex+''" :key="firstNav.key">
                    <template slot="title">
                        <Icon :type="firstNav.icon" />
                        {{firstNav.name}}
                    </template>
                    <p  v-for="(secondNav,secondNavIndex) in firstNav.childList" 
                            :key="secondNav.key">
                        <router-link :to="secondNav.path" v-if="secondNav.path">
                            <MenuItem :name="firstNavIndex+'-'+secondNavIndex">{{secondNav.name}}</MenuItem>
                        </router-link>
                    </p>
                </Submenu>
            </Menu>
        </Col>
    </Row>
</template>

<script>
let {common} = require('../../script/common.js');
export default {
    name: "Sidebar",
    data () {
        return {
            theme2: 'dark',
            navList: [
                // {
                // 'parentMenuName': '首页配置',
                // 'icon': 'ios-warning',
                // secondNav: [{
                //         title: '模块入口',
                //         url: '/moduleEntrance'
                //     }
                // ]},
                // {
                // 'parentMenuName': '旅游攻略',
                // 'icon': 'md-paw',
                // secondNav: [{
                //         title: '攻略管理',
                //         url: '/strategyManage'
                //     }, {
                //         title: '栏目管理',
                //         url: '/columnManage'
                //     }
                // ]},
                // {
                // 'parentMenuName': '广告管理',
                // 'icon': 'md-photos',
                // secondNav: [{
                //         title: '广告列表',
                //         url: '/adsList'
                //     }, {
                //         title: '广告位管理',
                //         url: '/adSenseManage'
                //     }
                // ]},
                // {
                // 'parentMenuName': '用户中心',
                // 'icon': 'ios-person',
                // secondNav: [{
                //         title: '用户列表',
                //         url: '/userList'
                //     }
                // ]},
                // {
                // 'parentMenuName': '系统配置',
                // 'icon': 'md-settings',
                // secondNav: [{
                //         title: '系统成员',
                //         url: '/handyPeople'
                //     }, {
                //         title: '角色与权限',
                //         url: '/favourableCompany'
                //     }
                // ]}
            ],
            activeMenu: ''
        }
    },
    created() {
       this.getNavList()
    //    this.$nextTick(() => {
    //         this.$refs.menuList.updateOpened()
    //         this.$refs.menuList.updateActiveName()
    //     })
    },
    methods: {
        getNavList() {
            let that = this,
                requestConfig = {
                    method: "GET",
                    publicUrlType: 1,
                    url: "/sysmenu/getall",
                    successCallback: (res) => {
                        if (res && res.code == 200 && res.data) {
                            that.navList = res.data
                        } else {
                            that.$Meassage.error(res.msg)
                        }
                    }
                }
            common.ajax.request(requestConfig)
        },
        selectMenu(name) {
            let index  = name.split('-')[0],  // 父级索引
                subIndex = name.split('-')[1],  // 子级索引
                childObj = this.navList[index].childList[subIndex]
            localStorage.setItem('childObj', JSON.stringify(childObj))
        }
    }
}
</script>

