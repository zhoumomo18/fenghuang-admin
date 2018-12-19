exports.hasAuthority = (permission, loginInfo) => {

    let permissionList = loginInfo ? loginInfo.permissionList || [] : [];
    // 菜单集的key
    let key = permission.substr(0, permission.indexOf(":"));
    // 系统管理-账号管理 中的权限特殊，因为有人员和部门两种增删改权限，权限resPermission值不是以 resParentKey 值开头的，所以当验证账单管理相关权限时将 AccUser 和 AccDept 手动更改 为 bosAcc
    // if(key == "AccUser" || key == "AccDept")
    // 	key = "bosAcc"
    let hasAllPermission = false; // 是否拥有所有权限
    if (key == "") { //如果为空，不校验权限按钮
      return true
    } else {
      // 需要校验 ，匹配权限列表里是否有改权限，若匹配到，则返回true表示有权限，否则，返回false，无权限
      for (var i = 0; i < permissionList.length; i++) {
        if (permission == permissionList[i].resPermission) {
          // return true;
          hasAllPermission = true
          break;
        }
      }
      return hasAllPermission
    }
  };
  