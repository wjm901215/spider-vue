import req, {adornData, adornParams} from "@/utils/httpRequest"


export const queryCascadeList = () => {
    return req({
        url: '/api/sys/dept/queryCascadeList',
        method: 'post',
    })
}
