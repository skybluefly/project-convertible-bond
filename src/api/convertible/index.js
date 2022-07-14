let preUrl = '/api'
import { request } from '@/utils/request';
export function get_all_comb() {
  return request({
    url: 'flow/get_combs',
    method: 'get',
  });
}

export function get_comb(id) {
  return request({
    url: 'flow/get_comb/'+id,
    method: 'get',
  });
}


export function get_jsl_data() {
  return request({
    url:'flow/getJslData',
    method: 'get',
  });
}


export function edit_comb(data) {
  return request({
    url:'flow/edit_comb',
    method: 'post',
    data
  });
}

export function get_all_data() {
  return request({
    url:'flow/allConvertible',
    method: 'get',
  });
}


export function cal_comb() {
  return request({
    url:'flow/cal_comb',
    method: 'get',
  });
}

