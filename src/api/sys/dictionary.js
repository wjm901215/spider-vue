import req, {adornData, adornParams} from "@/utils/httpRequest"

export const queryDictionaryList = () => {
    return req({
        url: "/api/sys/dictionary/queryInfoByCodeName",
        method: "post",
    })
}


export const list = ({page, limit, codeName,codeType}) => {
    return req({
        url: '/api/sys/dictionary/list',
        method: 'get',
        params: adornParams({
            'page': page,
            'limit': limit,
            'codeType': codeType,
            'codeName': codeName
        })
    })
}


export const deleteDictionary = (ids) => {
    return req({
        url: '/api/sys/dictionary/delete',
        method: 'post',
        data: adornData(ids, false)
    })
}


export const saveOrUpdate = ({id, codeType, codeValue, codeText, codeName, isCommon, orderNum}) => {
    return req({
        url: `/api/sys/dictionary/${!id ? 'save' : 'update'}`,
        method: 'post',
        data: adornData({
            id: id || undefined,
            codeType: codeType,
            codeValue: codeValue,
            codeText: codeText,
            codeName: codeName,
            isCommon: isCommon,
            orderNum: orderNum
        })
    })
}

export const updateState = ({id, state}) => {
    return req({
        url: `/api/sys/dictionary/${!id ? 'save' : 'update'}`,
        method: 'post',
        data: adornData({
            id: id || undefined,
            state: state
        })
    })
}
