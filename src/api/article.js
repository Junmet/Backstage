import axios from '@/axios/axios'

export const getPostLiset = (params) => {
  return axios({
    url: '/post',
    params
  })
}
