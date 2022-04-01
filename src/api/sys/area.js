import req, {adornData, adornParams} from "@/utils/httpRequest"


export const queryCascadeList = () => {
    return req({
        url: '/api/sys/area/queryCascadeList',
        method: 'post',
    })
}


export const list = ({name, code}) => {
    return req({
        url: '/api/sys/area/list',
        method: 'get',
        params: adornParams({
            'name': name,
            'code': code,
        })
    })
}

export const deleteList = (ids) => {
    return req({
        url: 'sys/area/delete',
        method: 'post',
        data: adornData(ids, false)
    })
}


export const regionNationalList = ({level, parentCode}) => {
    return req({
        url: '/api/sys/regionnational/list',
        method: "post",
        data: adornData({
            level,
            parentCode
        }, true)
    })
}


export const save = ({id, name, code, provinceCode, cityCode, regionCode, longitudeGaode, latitudeGaode, orderNum, remark}) => {
    return req({
        url: `/api/sys/area/${!id ? 'save' : 'update'}`,
        method: "post",
        data: adornData({
            id,
            name,
            code,
            provinceCode,
            cityCode,
            regionCode,
            longitudeGaode,
            latitudeGaode,
            orderNum,
            remark,
        })
    })
}


