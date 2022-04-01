import req, {adornData} from "@/utils/httpRequest"


export const nav = () => {
    return req({
        url: '/api/sys/menu/nav',
        method: 'get',
    })
}


export const menuList = () => {
    return req({
        url: '/api/sys/menu/list',
        method: 'get',
    })
}

export const deleteOne = (id) => {
    return req({
        url: `/api/sys/menu/delete/${id}`,
        method: 'post',
    })
}

export const select = () => {
    return req({
        url: '/api/sys/menu/select',
        method: 'get',
    })
}

export const info = (id) => {
    return req({
        url: `/api/sys/menu/info/${id}`,
        method: 'get',
    })
}

export const saveOrUpdate = ({menuId, type, name, parentId, url, perms, orderNum, icon}) => {
    return req({
        url: `/api/sys/menu/${!menuId ? 'save' : 'update'}`,
        method: 'post',
        data: adornData({
            'menuId': menuId || undefined,
            'type': type,
            'name': name,
            'parentId': parentId,
            'url': url,
            'perms': perms,
            'orderNum': orderNum,
            'icon': icon
        })
    })
}
