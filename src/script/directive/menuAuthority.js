exports.menuAuthority = (permission, loginInfo) => {
    // 菜单权限
    let menuTree = loginInfo ? loginInfo.permissionTree || [] : [];
    // 菜单集的key
    let keyArr = permission.split(",");
    // 是否有权限，默认没有
    let hasPermission = false;
    if (keyArr[0]) {
      // 验证父节点有没有权限
      for (let i = 0; i < menuTree.length; i++) {
        if (menuTree[i].resKey == keyArr[0]) {
          // 验证子节点有没有权限
          if (keyArr[1]) {
            for (let j = 0; j < menuTree[i].children.length; j++) {
              if (menuTree[i].children[j].resKey == keyArr[1]) {
                hasPermission = true;
                break;
              }
            }
          } else {
            hasPermission = true;
          }
          break;
        }
      }
    }
    return hasPermission;
  };
  