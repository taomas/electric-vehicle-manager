import axios from "axios";
import $q from "q";
import { $util } from "@/helper";
import Vue from "vue";
const vm = new Vue();

function getErrorTips(code) {
  const errorMap = {
    "10000": "无错误",
    "10001": "处理异常",
    "10002": "登录失败",
    "10003": "账户不存在",
    "10004": "参数错误",
    '10005': "Token无效",
    '10006': "帐号已启用",
    '10007': "角色编码或者名称重复",
    '10008': "手机已预约",
    '10009': "预约不存在",
    '10010': "预约无法删除",
    '10011': "图片上传失败",
    '10012': "图片生成失败",
    '10013': "预约状态异常",
    '10014': "文件类型错误",
    '10015': "发送验证码失败",
    '10016': "账户或者密码错误",
    '10017': "资讯记录不存在",
    '10018': "设备入库失败"
  };
  return errorMap[code] || '服务器开小差了'
}

function requestHandle(params) {
  let defer = $q.defer();
  axios(params)
    .then(res => {
      console.log("axios", res);
      if (res.data) {
        if (res.data.code && res.data.code === "10000") {
          defer.resolve(res.data);
        } else {
          defer.reject(res.data);
          vm.$message.error(`${getErrorTips(res.data.code)}！错误码：${res.data.code}`);
        }
      } else {
        defer.reject();
      }
    })
    .catch(err => {
      defer.reject(err);
    });

  return defer.promise;
}

export default {
  post: function(url, params, op) {
    return requestHandle({
      method: "post",
      url: url,
      data: params
    });
  },
  get: function(url, params, op) {
    console.log("method: get, params: ", params);
    return requestHandle({
      method: "get",
      url: $util.queryString(url, params)
    });
  }
};
