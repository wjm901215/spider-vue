import req, {adornData, adornParams} from "@/utils/httpRequest"


export const pause = (ids) => {
    return req({
        url: '/api/sys/schedule/pause',
        method: 'post',
        data: adornData(ids, false)
    })
}

export const resume = (ids) => {
    return req({
        url: '/api/sys/schedule/resume',
        method: 'post',
        data: adornData(ids, false)
    })
}


export const run = (ids) => {
    return req({
        url: '/api/sys/schedule/run',
        method: 'post',
        data: adornData(ids, false)
    })
}


export const listLog = ({page, limit, jobId}) => {
    return req({
        url: '/api/sys/scheduleLog/list',
        method: 'get',
        params: adornParams({
            'page': page,
            'limit': limit,
            'jobId': jobId
        })
    })
}

export const logInfo = id => {
    return req({
        url: `/api/sys/scheduleLog/info/${id}`,
        method: 'get',
    })
}


export const saveOrUpdate = (data) => {
    return req({
        url: `/api/sys/schedule/${!data.jobId ? 'save' : 'update'}`,
        method: "post",
        data: adornData(data, false)
    })
}
