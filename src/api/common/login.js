 import req, {adornData} from '@/utils/httpRequest'

export const login = ({account, password}) => {
    return req({
        url: '/api/sys/login',
        method: 'post',
        data: adornData({
            'username': account,
            'password': password
        })
    })
}

export const logout = () => {
    return req({
        url: '/api/sys/logout',
        method: 'post',
    })
}

export const getUserInfo = () => {
    return req({
        url: '/api/sys/user/info',
        method: 'get',
    })
}
