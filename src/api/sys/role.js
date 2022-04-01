import req, {adornData, adornParams} from "@/utils/httpRequest"

export const select = (tenantIds) => {
    return req({
        url: '/api/sys/role/select',
        method: 'post',
        data: adornData(tenantIds,false)
    })
}


export const list = ({page, limit, roleName}) => {
    return req({
        url: '/api/sys/role/list',
        method: 'get',
        params: adornParams({
            'page': page,
            'limit': limit,
            'roleName': roleName
        })
    })
}


export const deleteRole = (ids) => {
    return req({
        url: '/api/sys/role/delete',
        method: 'post',
        data: adornData(ids, false)
    })
}


export const info = (id) => {
    return req({
        url: `/api/sys/role/info/${id}`,
        method: 'get',
    })
}


export const saveOrUpdate = ({id, roleName,tenantId, remark, halfMenuIdList, menuIdList}) => {
    return req({
        url: `/api/sys/role/${!id ? 'save' : 'update'}`,
        method: 'post',
        data: adornData({
            roleId: id || undefined,
            roleName: roleName,
            tenantId:tenantId,
            remark: remark,
            halfMenuIdList: halfMenuIdList,
            menuIdList: menuIdList
        })
    })
}
