import req from "@/utils/httpRequest"
export const select = () => {
    return req({
        url: '/api/base/tenant/select',
        method: 'get'
    })
}
export const selectTenantData = () => {
    return req({
        url: '/api/base/tenant/selectTenantData',
        method: 'get'
    })
}
