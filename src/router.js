import { resolve } from "url";

export default {
    // mode: 'history',
    routes: [
        {
            path: '/image',
            redirect: ''
        },
        {
            path: '/',
            redirect: '/login'
        }, 
        {
            path: '/login',
            component: resolve => require(['./view/login.vue'], resolve),
            meta: {
                title: '登录页'
            }
        }, 
        {
            path: '/index',
            component: resolve => require(['./component/layout/home.vue'], resolve),
            children: [
                { path: '/moduleEntrance', component: resolve => require(['./view/indexConfig/moduleEntrance.vue'], resolve), meta: { title: '模块入口' } },
                { path: '/moduleEntranceDetail', component: resolve => require(['./view/indexConfig/moduleEntranceDetail.vue'], resolve), meta: { title: '新增模块' } },
                { path: '/hotScenicsList', component: resolve => require(['./view/indexConfig/hotScenicsList.vue'], resolve), meta: { title: '景区列表' } },

                { path: '/userList', component: resolve => require(['./view/userCenter/userList.vue'], resolve), meta: { title: '用户列表' } },
                { path: '/adsList', component: resolve => require(['./view/adsManage/adsList.vue'], resolve), meta: { title: '广告列表' } },
                { path: '/adItemDetail', component: resolve => require(['./view/adsManage/adItemDetail.vue'], resolve), meta: { title: '广告管理' } },
                { path: '/viewAdDetail', component: resolve => require(['./view/adsManage/viewAdDetail.vue'], resolve), meta: { title: '广告详情' } },
                { path: '/adSenseManage', component: resolve => require(['./view/adsManage/adSenseManage.vue'], resolve), meta: { title: '广告位管理' } },
                { path: '/adSenseDetail', component: resolve => require(['./view/adsManage/adSenseDetail.vue'], resolve), meta: { title: '新建广告位' } },
                { path: '/strategyManage', component: resolve => require(['./view/tourManage/strategyManage.vue'], resolve), meta: { title: '攻略管理' } },
                { path: '/strategyManageDetail', component: resolve => require(['./view/tourManage/strategyManageDetail.vue'], resolve), meta: { title: '新建/编辑攻略' } },
                { path: '/viewStrategyDetail', component: resolve => require(['./view/tourManage/viewStrategyDetail.vue'], resolve), meta: { title: '查看详情' } },
                { path: '/columnManage', component: resolve => require(['./view/tourManage/columnManage.vue'], resolve), meta: { title: '栏目管理' } },
                { path: '/memberManage', component: resolve => require(['./view/systemManage/memberManage.vue'], resolve), meta: { title: '系统配置/系统成员' } },
                { path: '/memberDetail', component: resolve => require(['./view/systemManage/memberDetail.vue'], resolve), meta: { title: '新建/编辑成员' } },
                { path: '/roleManage', component: resolve => require(['./view/systemManage/roleManage.vue'], resolve), meta: { title: '角色权限' } },
                { path: '/roleCreates', component: resolve => require(['./view/systemManage/roleCreates.vue'], resolve), meta: { title: '新建/编辑角色' } },
                { path: '/roleCheck', component: resolve => require(['./view/systemManage/roleCheck.vue'], resolve), meta: { title: '查看角色相关' } },

                { path: '/scenicsManage', component: resolve => require(['./view/scenicsAndTickets/scenicsManage.vue'], resolve), meta: { title: '景区列表' } },
                { path: '/scenicsDetail_1', component: resolve => require(['./view/scenicsAndTickets/scenicsDetail_1.vue'], resolve), meta: { title: '景区新建/修改首页' } },
                { path: '/scenicsDetail_2', component: resolve => require(['./view/scenicsAndTickets/scenicsDetail_2.vue'], resolve), meta: { title: '景区新建/修改下一步' } },
                { path: '/scenicsDetail', component: resolve => require(['./view/scenicsAndTickets/scenicsDetail.vue'], resolve), meta: { title: '景区新建/修改' } },
                { path: '/ticketsCenter', component: resolve => require(['./view/scenicsAndTickets/ticketsCenter.vue'], resolve), meta: { title: '票务中心' } },
                { path: '/ticketsDetail', component: resolve => require(['./view/scenicsAndTickets/ticketsDetail.vue'], resolve), meta: { title: '票种新建/修改' } },

                { path: '/storesManage', component: resolve => require(['./view/storesAndCates/storesManage.vue'], resolve), meta: { title: '商家美食/商家管理' } },
                { path: '/storeManageDetail', component: resolve => require(['./view/storesAndCates/storeManageDetail.vue'], resolve), meta: { title: '商家美食/商家管理' } },
                { path: '/menuItemDetail', component: resolve => require(['./view/storesAndCates/menuItemDetail.vue'], resolve), meta: { title: '商家美食/商家管理' } },

                { path: '/hotelManage', component: resolve => require(['./view/hotelManage/hotelList.vue'], resolve), meta: { title: '酒店管理/酒店列表' } },
                { path: '/hotelDetail', component: resolve => require(['./view/hotelManage/hotelDetail.vue'], resolve), meta: { title: '酒店管理/酒店详情'} },
                { path: '/HouseTypeDetail',component: resolve => require(['./view/hotelManage/houseType.vue'], resolve), meta: {title: '酒店管理/添加房型' }},
                { path: '/roomTypeManage', component: resolve => require(['./view/hotelManage/roomTypeManage.vue'], resolve), meta: { title: '酒店管理/房型配置'} },
                { path: '/roomTypeDetail', component: resolve => require(['./view/hotelManage/roomTypeDetail.vue'], resolve), meta: { title: '酒店管理/配置详情'} }
            ]
        }
    ]
}