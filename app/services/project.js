/**
 * Created by yoe on 2017/6/22.
 */
import config from '../common/config';
const ip = config.url + '/api/';
export function get(url,params,callback){
    url = ip + url;
    if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    //fetch请求
    fetch(url,{
        method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJSON) => {
        callback(responseJSON)
    }).done();
}

export function post(url,params,callback){
    url = ip + url;
    //fetch请求
    fetch(url,{
        method: 'POST',
        body:JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseJSON) => {
        callback(responseJSON)
    }) .done();
}