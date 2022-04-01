import req, {adornData, adornParams, adornUrl} from "@/utils/httpRequest"
import {getToken} from "@/utils/auth";

export const resignation = (ids) => {
    return req({
        url: '/api/sys/user/resignation',
        method: 'post',
        data: adornData(ids,false)
    })
}


export const disableUser = (ids) => {
    return req({
        url: '/api/sys/user/disableUser',
        method: 'post',
        data: adornData(ids,false)
    })
}


export const enableUser = (ids) => {
    return req({
        url: '/api/sys/user/enableUser',
        method: 'post',
        data: adornData(ids,false)
    })
}


export const list = ({pageIndex, pageSize, name, sex, mobile, account, workingStatus, jobType}) => {
    return req({
        url: '/api/sys/user/list',
        method: 'get',
        params: adornParams({
            'page': pageIndex,
            'limit': pageSize,
            'name': name,
            'sex': sex,
            'mobile': mobile,
            'account': account,
            'workingStatus': workingStatus,
            'jobType': jobType,
        })
    })
}

export const deleteUser = (ids) => {
    return req({
        url: '/api/sys/user/delete',
        method: 'post',
        data: adornData(ids, false)
    })
}


export const restPwd = ({id, jobType}) => {
    return req({
        url: '/api/sys/user/restPwd',
        method: 'post',
        data: adornData({
            id: id,
            jobType: jobType,
        }, false)
    })
}

export const queryUserDetail = ({id}) => {
    return req({
        url: '/api/sys/user/queryUserDetail',
        method: 'post',
        data: adornData({
            id: id
        })
    })
}

export const saveUser = ({id, name, sex, mobile, address, identityNo, lang, birthDate, jobType, entryDate, deptId, account, password, tenantIds, tenantId, roleIdList, personnelId,headUrl}) => {
    return req({
        url: `/api/sys/user/${!id ? 'save' : 'update'}`,
        method: 'post',
        data: adornData({
            id: id || undefined,
            name: name,
            sex: sex,
            mobile: mobile,
            address: address,
            identityNo: identityNo,
            lang: lang,
            birthDate: birthDate,
            jobType: jobType,
            entryDate: entryDate,
            deptId: deptId,
            account: account,
            password: password != '$$$$$$$$$$' ? password : null,
            tenantIds: tenantIds,
            tenantId: tenantId,
            roleIdList: roleIdList,
            personnelId: personnelId,
            headUrl:headUrl
        })
    })
}


export const switchLanguage = (lang) => {
    return req({
        url: '/api/sys/user/switchLanguage',
        method: 'post',
        params: adornParams({
            'lang': lang
        })
    })
}

export const switchTenantId = (tenantId) => {
    return req({
        url: `/api/sys/user/switchTenantId/${tenantId}`,
        method: 'get'
    })
}

export const password = ({password, newPassword}) => {
    return req({
        url: '/api/sys/user/password',
        method: 'post',
        data: adornData({
            'password': password,
            'newPassword': newPassword
        })
    })
}
