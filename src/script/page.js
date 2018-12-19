let {common} = require('./common.js')
/*
* 首页配置模块
* */
let indexConfigMethod = {
    /*查询模块入口列表信息
    * params obj object
    *{
    *  pageNo
    *  pageSize
    *  name // 模块名称
    *  status // 模块状态
    *}
    * */
    getAllModuleList: (obj) => {
        let params = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
                name: obj.name,
                status: obj.status
            },
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: '/module/getallpagemodule',
                params: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*模块的发布/取消发布
    * params obj object
    *{
    *  id
    *  type  // 1:发布 2：取消发布
    *}
    * */
    handleRelease: (obj) => {
        let params = {
                id: obj.id,
                type: obj.type
            },
            requestConfig = {
                method: 'PUT',
                url: '/module/updatestatus',
                publicUrlType: 1,
                data: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*模块的上移/下移
    * params obj object
    *{
    *  id
    *  type  // 1:发布 2：取消发布
    *}
    * */
    moveDownUp: (obj) => {
        let params = {
                id: obj.id,
                type: obj.type
            },
            requestConfig = {
                method: 'PUT',
                url: '/module/updateorder',
                publicUrlType: 1,
                data: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*模块的删除操作
    * params obj object
    *{
    *  id
    *}
    * */
    handlDelEntrance: (obj) => {
        let requestConfig = {
            method: 'DELETE',
            url: '/module/deletebyid',
            publicUrlType: 1,
            data: obj.id,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*获取当前模块入口的详情
    * params obj object
    *{
    *  id
    *}
    * */
    getModuleDetailById: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: '/module/getmodulebyid/' + obj.id,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*新增/编辑模块的提交
    * params obj object
    *{
    *  id
    *}
    * */
    handleSubmitData: (obj) => {
        console.log(obj)
        let params = {
                id: obj.id,
                base64File: obj.base64File,
                name: obj.name,
                linkUrl: obj.linkUrl,
                fileID: obj.fileID
            },
            requestConfig = {
                method: 'POST',
                url: '/module/save',
                publicUrlType: 1,
                data: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /********************* 热门景点 **********************/
    /* 热门景区列表
    *  params obj object
    *{ name 模块名称
    *  pageNo
    *  pageSize }
    * */
    getHotScenicsList: (obj) => {
        let params = {
                name: obj.name,
                pageNo: obj.pageNo,
                pageSize: obj.pageSize
            },
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: '/hotscenicspots/getallpage',
                params: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 热门景点的上移 下移
    *  params obj object
    * */
    changeHotListOrder: (obj) => {
        let data = {
                id: obj.id,
                type: obj.type
            },
            requestConfig = {
                method: 'PUT',
                url: '/hotscenicspots/updatehotsort',
                publicUrlType: 1,
                data,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 取消该景点热门
    *  params obj object
    * */
    cancelHotScenics: (obj) => {
        let requestConfig = {
            method: 'PUT',
            publicUrlType: 1,
            url: '/hotscenicspots/updateIsHot',
            data: {id: obj.id},
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    }

}

/**
 * 景区门票模块
 **/
let scenicsTicketsMethod = {
    /* 
    * 获取景区管理分页列表
    * params obj object
    * */
    getScenicsList: (obj) => {
        let params = {
            name: obj.name,
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            status: obj.status
        };
        let requestConfig = {
            method: 'GET',
            url: "/scenicspot/getall",
            publicUrlType: 1,
            params,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 景区列表排序
    * { id: 景点id,
    *   hotSort: 排序值 }
    * */
    scenicsSort: (obj) => {
        let data = {
                id: obj.id,
                sort: obj.sort
            },
            requestConfig = {
                method: 'PUT',
                url: '/scenicspot/sort',
                publicUrlType: 1,
                data,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 景点管理 删除景点
    * */
    scenicsDelete: (obj) => {
        console.log("obj.id:")
        console.log(obj.id)
        let requestConfig = {
            method: 'DELETE',
            publicUrlType: 1,
            url: `/scenicspot/delete?id=${obj.id}`,
            successCallback: action,
            errorCallback: action
        }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 景点发布 取消发布
    * { id: 景点id, 
    *   publishState: 发布状态 }
    * */
    changeScenicsStatus: (obj) => {
        let data = {
            id: obj.id,
            publishstate: obj.publishstate
        };
        let requestConfig = {
            method: "PUT",
            url: `/scenicspot/publish`,
            data,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 景点推到热门
    * { id:景点id
    *   isHot:是否热门 }
    * */
    changeScenicsIsHot: (obj) => {
        let data = {
            id: obj.id,
            isHot: 1
        };
        let requestConfig = {
            method: "PUT",
            url: `/scenicspot/hot`,
            data,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 获取当前景点详情
    * params obj object
    * { id }
    * */
    getScenicsById: (obj) => {
        let requestConfig = {
            method: "GET",
            url: `/scenicspot/getbyid/${obj.id * 1}`,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*
    * 保存/直接发布景点(新增/修改)
    * params obj object
    * { id }
    * */
    handleSubmitScenics: (obj) => {
        console.log(obj)
        let urlStr = obj.id ? "/scenicspot/update" : "/scenicspot/create",
            methodType = obj.id ? "PUT" : "POST";
        let data = {
            id: obj.id == 0 ? null : obj.id,
            name: obj.name,
            address: obj.address,
            longitude: obj.longitude,
            dimension: obj.dimension,
            opentime: obj.opentime, // openTime
            peoplenum: obj.peoplenum ,
            ratings: obj.ratings,
            remark: obj.remark,
            ticklabelname: obj.ticklabelname,
            subscriberule: obj.subscriberule,
            returnticketrule: obj.returnticketrule,
            subscriberemark: obj.subscriberemark,
            notice: obj.notice,
            specialPopulationPolicyRemark: obj.specialPopulationPolicyRemark,
            otherremark: obj.otherremark,
            publishstate: obj.publishstate,
            ishot: obj.ishot,
            titleBase64: obj.base64File, // 景区封面
            imgBase64: obj.base64File1, // 图集
            imgInfo: obj.imgInfo // 删除的图集图片的id List
        }
        console.log("handleSubmitData: data")
        console.log(data)
        let requestConfig = {
            method: methodType,
            url: urlStr,
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }
        common.ajax.request(requestConfig)
    },
    /************************** 票务中心 *****************************/
    /* 
    * 获取票种信息列表
    * params obj object
    * */
    getTicketsList: (obj) => {
        let params = {
            scenicName: obj.scenicName,
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            status: obj.status * 1
        };
        console.log("params:")
        console.log(params)
        let requestConfig = {
            method: 'GET',
            url: "/ticket/getall",
            publicUrlType: 1,
            params,
            successCallback: action,
            errorCallback: action
        };
        function action(response) {
            obj.callBack && obj.callBack(response)
        }
        common.ajax.request(requestConfig)
    },
    /* 
    * 票种发布 取消发布
    * params obj object
    * */
    changeTicketsStatus: (obj) => {
        let data = {
            id: obj.id,
            status: obj.status
        };
        let requestConfig = {
            method: "PUT",
            url: `/ticket/release`,
            data,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 票种管理 删除票种
    * params obj object
    * */
    ticketsDelete: (obj) => {
        let requestConfig = {
            method: 'DELETE',
            publicUrlType: 1,
            url: '/ticket/delete',
            data: obj.id,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 获取当前票种详情
    * params obj object
    * { id }
    * */
    getTicketsById: (obj) => {
        let requestConfig = {
            method: "GET",
            url: `/ticket/getbyid/${obj.id * 1}`,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 获取景区下拉框options
    * params obj object
    * */
    getScenicsOptions: (obj) => {
        let params = {
            name: obj.name
        };
        let requestConfig = {
            method: 'GET',
            url: "/scenicspot/select",
            publicUrlType: 1,
            params,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*
    * 保存票种
    * params obj object
    * { id }
    * */
    handleSubmitTickets: (obj) => {
        let data = {
            id: obj.id,
            name: obj.name,
            scenicid: obj.scenicid,
            price: obj.price,
            expirydate: obj.expirydate,
            status: obj.status
        }
        let requestConfig = {
            method: "POST",
            url: "/ticket/saveenable",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    }
}

/*
* 广告管理模块
* */
let adManageMethod = {
    /*查询广告列表信息
    * params obj object
    *{
    *  pageNo
    *  pageSize
    *  name // 模块名称
    *  status // 模块状态
    *}
    * */
    getAllAdList: (obj) => {
        let params = {
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            name: obj.name,
            status: obj.status,
            adsenseId: obj.adsenseId
        },
        requestConfig = {
            method: 'GET',
            publicUrlType: 1,
            url: '/adviertisement/getall',
            params: params,
            successCallback: action,
            errorCallback: action
        }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*广告的删除操作
    * params obj object
    *{
    *  id
    *}
    * */
    handleDelete: (obj) => {
        let requestConfig = {
            method: 'DELETE',
            publicUrlType: 1,
            url: '/adviertisement/delete',
            data: obj.id,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*广告的发布/取消发布
    * params obj object
    *{
    *  id
    *  type // 1 发布 2 取消发布
    *}
    * */
    handleRelease: (obj) => {
        let params = {
                id: obj.id,
                type: obj.type
            },
            requestConfig = {
                method: 'PUT',
                publicUrlType: 1,
                url: '/adviertisement/release',
                data: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*获取当前广告详情
    * params obj object
    *{
    *  id
    *}
    * */
    getAdById: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: '/adviertisement/getbyid/' + obj.id,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 通过广告位，获取当前广告已选的时间
    * params obj object
    *{
    *  id
    *  adsenseid
    *}
    * */
    getDisableDateByAdsense: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: '/adviertisement/getbyadsenseid',
            params: obj.params,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*获取广告位列表
    * params obj object
    *{
    *  id
    *}
    * */
    getAdsenseList: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: '/adsense/getadsense',
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*新增、编辑广告
    * params obj object
    *{
    *  id // 当前广告id
    *  adsenseId  // 广告位
    *  endDate  // 广告结束时间
    *  startDate // 广告开始时间
    *  linkUrl // 广告链接
    *  name // 广告名称
    *  photo // 上传的图片
    *}
    * */
    handleAdItemSubmit: (obj) => {
        console.log(obj)
        let params = {
                "id": obj.id,
                "adsenseId": obj.adsenseId,
                "endDate": obj.endDate,
                "startDate": obj.startDate,
                "linkUrl": obj.linkUrl,
                "name": obj.name,
                "base64File": obj.base64File
            },
            requestConfig = {
                method: obj.method,
                url: obj.url,
                publicUrlType: 1,
                data: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*************************************/
    /* 获取广告位分页列表
    * params obj object
    * {  name: obj.name,
    *    pageNo: obj.currentPage,
    *    pageSize: obj.pageSize,
    *    status: obj.selectedStatus }
    * */
    getAdsensePageList: (obj) => {
        let params = {
            name: obj.name,
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            status: obj.status
        };
        console.log("getAdsensePageList:")
        console.log(params)
        let requestConfig = {
            method: 'GET',
            url: "/adsense/getpageadsense",
            publicUrlType: 1,
            params,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 修改广告位 启用/禁用
    * params obj object
    * { id: obj.id,
        name: obj.name,
        status: obj.status,
        type: obj.changeToStatus,us }
    * */
    changeAdsenseStatus: (obj) => {
        let data = {
            id: obj.id,
            name: obj.name,
            status: obj.status,
            type: obj.type,
        };
        let requestConfig = {
            method: "PUT",
            url: `/adsense/updatestatus`,
            data,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 获取当前广告位详情
    * params obj object
    * {
    *  id
    * }
    * */
    getAdsenseById: (obj) => {
        console.log("obj.id * 1")
        console.log(obj.id * 1)
        let requestConfig = {
            method: "GET",
            url: `/adsense/getadsensebyid/${obj.id * 1}`,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*新增、编辑广告
    * params obj object
    *{
    *  id // 当前广告id
    *  adsenseId  // 广告位
    *  endDate  // 广告结束时间
    *  startDate // 广告开始时间
    *  linkUrl // 广告链接
    *  name // 广告名称
    *  photo // 上传的图片
    *}
    * */
    handleAdsenseSubmit: (obj) => {
        let data = {
            id: obj.id,
            name: obj.name,
            status: obj.status
        }
        let requestConfig = {
            method: "POST",
            url: "/adsense/save",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    }
}
/*旅游攻略模块
*
* */
let tourManageMethod = {
    /*查询广告列表信息
    * params obj object
    *{
    *  pageNo
    *  pageSize
    *  name // 模块名称
    *  status // 模块状态
    *}
    * */
    getAllColumnList: (obj) => {
        let params = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
                name: obj.name,
                status: obj.status
            },
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: '/column/getall',
                params: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*栏目的上移/下移
    * params obj object
    *{
    *  id
    *  type  // 1:上移 2：下移
    *}
    * */
    moveDownUp: (obj) => {
        let params = {
                id: obj.id,
                type: obj.type
            },
            requestConfig = {
                method: 'PUT',
                url: '/column/updatesort',
                publicUrlType: 1,
                data: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*保存新增/编辑栏目
    * params obj object
    *{
    *  id // 当前广告id
    *  adsenseId  // 广告位
    *  endDate  // 广告结束时间
    *  startDate // 广告开始时间
    *  linkUrl // 广告链接
    *  name // 广告名称
    *  photo // 上传的图片
    *  method // 请求方法 PUT编辑 POST 新增
    *  url // 请求地址
    *}
    * */
    handleItemSubmit: (obj) => {
        let params = {
                "id": obj.id,
                "name": obj.name
            },
            requestConfig = {
                method: obj.method,
                url: obj.url,
                publicUrlType: 1,
                data: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*栏目的启用/禁用
    * params obj object
    *{
    *  id
    *  type // 1 启用 2 禁用
    *}
    * */
    handleColumnDisable: obj => {
        let params = {
                id: obj.id,
                type: obj.type
            },
            requestConfig = {
                method: 'PUT',
                url: '/column/disable',
                data: params,
                publicUrlType: 1,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    }
}
/*用户信息模块
*
* */
let userManageMethod = {
    /*查询用户列表信息
    * params obj object
    *{
    *  pageNo
    *  pageSize
    *  gender // 性别
    *  nickName // 昵称
    *}
    * */
    getUserList: obj => {
        let params = {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
                nickName: obj.nickName,
                gender: obj.gender
            },
            requestConfig = {
                method: 'GET',
                url: '/constumer/selectbypage',
                params: params,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    }
}
/*
* 商家美食模块
* */
let storesAndCatesMethod = {
    /* 
    * 获取商家管理分页列表
    * params obj object
    * */
    getStoresList: (obj) => {
        let params = {
            name: obj.name,
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            status: obj.status
        };
        let requestConfig = {
            method: 'GET',
            url: "/foodbusiness/getall",
            publicUrlType: 1,
            params,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 商家管理 删除商家
    * */
    storesDelete: (obj) => {
        let requestConfig = {
            method: 'DELETE',
            publicUrlType: 1,
            url: '/foodbusiness/delete',
            data: obj.id,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 商家发布 取消发布
    * { id: 商家id, 
    *   publishState: 发布状态 }
    * */
    changeStoresStatus: (obj) => {
        let data = {
            id: obj.id,
            type: obj.type
        };
        let requestConfig = {
            method: "PUT",
            url: `/foodbusiness/disable`,
            data,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 商家列表排序
    * { id: 商家id,
    *   hotSort: 排序值 }
    * */
    storesSort: (obj) => {
        let data = {
                id: obj.id,
                sort: obj.sort
            },
            requestConfig = {
                method: 'PUT',
                url: '/foodbusiness/updatesort',
                publicUrlType: 1,
                data,
                successCallback: action,
                errorCallback: action
            }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 获取当前商家详情
    * params obj object
    * { id }
    * */
    getStoresById: (obj) => {
        let requestConfig = {
            method: "GET",
            url: `/foodbusiness/getbyid/${obj.id * 1}`,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 获取菜系列表
    * params obj object
    * { id }
    * */
    getCateStylesOptions: (obj) => {
        let requestConfig = {
            method: "GET",
            url: "/foodbusiness/getallgroup",
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*
    * 保存商家信息
    * params obj object
    * publishState只判断接口地址，不作为参数
    * */
    handleSubmitStoreInfo: (obj) => {
        let data = {
            id: obj.id,
            name: obj.name,
            address: obj.address,
            longitude: obj.longitude,
            dimension: obj.dimension,
            openTime: obj.openTime,
            ratings: obj.ratings,
            averageConsume: obj.averageConsume,
            base64File: obj.base64File,
            base64File1: obj.base64File1,
            cuisineList: obj.cuisineList,
            deleteIds: obj.deleteIds
        }
        let urlStr = obj.publishState == 1 ? "/foodbusiness/saveenable" : "/foodbusiness/save";
        console.log("111111:")
        console.log(data)
        let requestConfig = {
            method: "POST",
            url: urlStr,
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    //保存菜单
    saveMenuItem: function (obj) {
        let requestConfig = {
            method: "post",
            url: "/businessfood/save",
            publicUrlType: 1,
            data: obj.params,
            successCallback: obj.callBack,
            errorCallback: obj.callBack
        }
        common.ajax.request(requestConfig)
    },
    //获取商家菜单列表
    getMenuList: function (obj) {
        let requestConfig = {
            method: "get",
            url: "/businessfood/getbyid/" + obj.id,
            publicUrlType: 1,
            successCallback: obj.callBack,
            errorCallback: obj.callBack
        };
        common.ajax.request(requestConfig);
    },
    //删除菜单
    deleteMenu: function (obj) {
        let requestConfig = {
            method: "delete",
            url: '/businessfood/delete',
            data:obj.params,
            publicUrlType: 1,
            successCallback: obj.callBack,
            errorCallback: obj.callBack
        };
        common.ajax.request(requestConfig);
    },
    //设置为特色菜 （1.设置 2.取消）
    setSpeciality:function (obj) {
        let requestConfig = {
            method: "put",
            url: '/businessfood/disable',
            data:obj.params,
            publicUrlType: 1,
            successCallback: obj.callBack,
            errorCallback: obj.callBack
        };
        common.ajax.request(requestConfig);
    }
}

// 酒店管理模块
let hotelMethod = {
    /* 
     * 获取酒店管理分页列表
     * params obj object
     * */
    getHotelList: (obj) => {
        let params = {
            name: obj.name,
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            status: obj.status
        };
        let requestConfig = {
            method: 'GET',
            url: "/hotel/getallpage",
            publicUrlType: 1,
            params,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 酒店发布、取消发布
     * params obj object
     * */
    updateStatus: (obj) => {
        let data = {
            id: obj.id,
            type: obj.type
        };
        let requestConfig = {
            method: 'PUT',
            url: "/hotel/updatestatus",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 酒店排序
     * params obj object
     * */
    handleSort: (obj) => {
        let data = {
            id: obj.id,
            sort: obj.sort
        };
        let requestConfig = {
            method: 'PUT',
            url: "/hotel/updatesort",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 酒店删除
     * params obj object
     * */
    deleteHotel: (obj) => {
        let data = obj.id;
        let requestConfig = {
            method: 'DELETE',
            url: "/hotel/delete",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 获取景点下拉
     * params obj object
     * */
    getScenicsSelect: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: '/scenicspot/select',
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 获取酒店详情
     * params obj object
     * */
    getHotelById: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: '/hotel/getbyid/'+ obj.id,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 酒店保存
     * params obj object
     * */
    hotelSave: (obj) => {
        let data = obj.form;
        let requestConfig = {
            method: 'POST',
            url: "/hotel/save",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 酒店保存并发布
     * params obj object
     * */
    hotelSaveAndRelease: (obj) => {
        let data = obj.form;
        let requestConfig = {
            method: 'POST',
            url: "/hotel/saveandrelease",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 酒店修改
     * params obj object
     * */
    hotelUpdate: (obj) => {
        let data = obj.form;
        let requestConfig = {
            method: 'PUT',
            url: "/hotel/update",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 房型保存
     * params obj object
     * */
    houseTypeSave: (obj) => {
        let data = obj.form;
        let requestConfig = {
            method: 'POST',
            url: "/housetype/create",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 房型修改
     * params obj object
     * */
    houseTypeUpdate: (obj) => {
        let data = obj.form;
        let requestConfig = {
            method: 'PUT',
            url: "/housetype/update",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 获取房型详情
     * params obj object
     * */
    getHouseTypeById: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: '/housetype/getbyid/' + obj.id,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /************************** 房型配置 **************************/
    /* 
     * 获取房型配置分页列表
     * */
    getRoomTypeList: (obj) => {
        let params = {
            name: obj.name,
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            status: obj.status
        },
        requestConfig = {
            method: 'GET',
            publicUrlType: 1,
            url: '/housetype/getall',
            params: params,
            successCallback: action,
            errorCallback: action
        }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 在分页列表上删除该房型item
     * id: 房型id
     * */
    roomTypeDelete: (obj) => {
        let requestConfig = {
            method: 'DELETE',
            publicUrlType: 1,
            url: '/housingconfiguration/deletebyhosingtypeid',
            data: obj.id,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*
    * 获取当前房型下的配置list
    * params obj object
    * id: 房型id
    * */
    getConfigurationList: (obj) => {
        let requestConfig = {
            method: 'GET',
            url: `/housingconfiguration/getall?hosingTypeId=${obj.hosingTypeId}`,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        }

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*
    * 对当前房型 添加配置
    * params obj object
    * id: 房型id
    * */
    submitNewDeploy: (obj) => {
        let data = {
            houseTypeId: obj.houseTypeId,
            name: obj.name,
            price: obj.price, 
            isUnsubscribe: obj.isUnsubscribe,
            unsubscribeRules: obj.unsubscribeRules,
            detailConfigList: obj.detailConfigList
        }
        let requestConfig = {
            method: "POST",
            url: "/housingconfiguration/create",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        }
        console.log("submitData111111:")
        console.log(data)

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
     * 在房型配置页的配置列表中删除某一个配置item
     * id: 配置id
     * */
    configurationListItemDelete: (obj) => {
        let requestConfig = {
            method: 'DELETE',
            publicUrlType: 1,
            url: '/housingconfiguration/delete',
            data: obj.id,
            successCallback: action,
            errorCallback: action
        }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*
    * 修改配置列表list
    * */
    SubmitConfigurationListData: (obj) => {
        let data = {
            housingConfigurationList: obj.housingConfigurationList
        }
        let requestConfig = {
            method: "POST",
            url: "/housingconfiguration/update",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        }
        console.log("configurationList:")
        console.log(data)

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    }
}

// 系统配置-系统成员模块
let systemConfigMethod = {
    /* 
    * 获取系统成员分页列表
    * params obj object
    * */
    getMemberList: (obj) => {
        let params = {
            pageNo: obj.pageNo,
            pageSize: obj.pageSize,
            roleId: obj.roleId,
            status: obj.status,
            userNameOrRealName: obj.userNameOrRealName
        };
        let requestConfig = {
            method: 'GET',
            url: "/SysUser/getlist",
            publicUrlType: 1,
            params,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 系统成员启用 禁用
    * */
    changeMemberStatus: (obj) => {
        let requestConfig = {
            method: "PUT",
            url: `/SysUser/updatestatus?userId=${obj.userId}`,
            publicUrlType: 1,
            successCallback: action,
            errorCallback: action
        };

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /* 
    * 系统成员删除
    * */
    memberDelete: (obj) => {
        let requestConfig = {
            method: 'DELETE',
            publicUrlType: 1,
            url: `/SysUser/delete?id=${obj.id}`,
            successCallback: action,
            errorCallback: action
        }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    /*
    * 新建系统成员账号
    * params obj object
    * */
    submitMemberData: (obj) => {
        let data = {
            userName: obj.userName,
            realName: obj.realName,
            password: obj.password,
            roleId: obj.roleId,
            tel: obj.tel,
            status: obj.status
        }
        let requestConfig = {
            method: "POST",
            url: "/SysUser/create",
            publicUrlType: 1,
            data,
            successCallback: action,
            errorCallback: action
        }
        console.log("submitData_member:")
        console.log(data)

        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },

}

// 系统配置-角色与权限模块
let systemPrivileges = {
    getRoleList: (obj) => {
        let params = {
            roleId:obj.roleId,
            pageNo: obj.pageNo,
            pageSize: obj.pageSize
        },
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: 'sysrole/getall',
                params: params,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    getTopMemu: (obj) => {
        let params = {
        },
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: 'sysmenu/getall',
                params: params,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    getCliMemus: (obj) => {
        let params = {
        },
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: 'sysmenu/getmenuallandbutton',
                params: params,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }
        common.ajax.request(requestConfig)
    },
   
    getDiary: (obj) => {
           let  requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: 'sysrole/getlogbyid/' + obj.id,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }
        common.ajax.request(requestConfig)
    },
    postNewRole: (obj) => {
        let params = {
            name: obj.roleName,
            code: obj.roleCode,
        },
            requestConfig = {
                method: 'POST',
                publicUrlType: 1,
                url: 'sysbutton/create',
                data: params,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    getSelRoles: (obj) => {
        let params = {
        },
            requestConfig = {
                method: 'GET',
                publicUrlType: 1,
                url: 'sysbutton/getall',
                params: params,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }
        common.ajax.request(requestConfig)
    },
    putRoleManage: (obj) => {
        let params = {
        },
            requestConfig = {
                method: 'PUT',
                publicUrlType: 1,
                url: 'sysbutton/update',
                params: params,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }
        common.ajax.request(requestConfig)
    },
    postNewManageBtn: (obj) => {
        let params = {
            buttons: obj.buttons,
            menuIds: obj.menuIds,
        },
            requestConfig = {
                method: 'POST',
                publicUrlType: 1,
                url: 'sysmenubutton/create',
                data: params,
                successCallback: action,
                errorCallback: action
            }
        function action(response) {
            obj.callBack && obj.callBack(response)
        }

        common.ajax.request(requestConfig)
    },
    
}

export {
    indexConfigMethod,
    scenicsTicketsMethod,
    adManageMethod,
    tourManageMethod,
    userManageMethod,
    storesAndCatesMethod,
    hotelMethod,
    systemConfigMethod,
    systemPrivileges
}