import req, {adornData, adornParams} from "@/utils/httpRequest"


export const list = (params, namespace) => {
    return req({
        url: `/api/${namespace}/list`,
        method: 'get',
        params: adornParams(params)
    })
}


export const deleteList = (ids, namespace) => {
    return req({
        url: `/api/${namespace}/delete`,
        method: 'post',
        data: adornData(ids, false)
    })
}


export const saveOrUpdate = (data, namespace) => {
    return req({
        url: `/api/${namespace}/${!data.id ? 'save' : 'update'}`,
        method: "post",
        data: adornData(data, false)
    })
}

export const info = (id, namespace) => {
    return req({
        url: `/api/${namespace}/info/${id}`,
        method: 'get',
    })
}

export const upload = file => {
    let formData = new FormData();
    formData.append("file", file)
    return req({
        method: 'post',
        url: '/api/common/upload',
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData
    })
}

export const queryForSelector = (params, namespace) => {
    return req({
        url: `/api/${namespace}/queryForSelector`,
        method: 'post',
        params: adornData(params)
    })
}

export function download(params, namespace) {
    return req({
        url: `/api/${namespace}/export`,
        method: 'get',
        responseType: 'blob',
        params: adornParams(params)
    })
}

export const importExcel = (file,namespace) =>{
    let formData = new FormData();
    formData.append("file", file)
    return req({
        method: 'post',
        url: `/api/${namespace}/importExcel`,
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData
    })
}
