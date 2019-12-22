import axios from '@/axios/axios'

export const userLogin = (data) => {
  return axios({
    method: 'post',
    url: '/login',
    data
  })
}
