import axios from '@/axios/axios'

// 1.获取文章列表数据
export const getPostLiset = (params) => {
  return axios({
    url: '/post',
    params
  })
}

// 发布文章
export const publishPost = (data) => {
  return axios({
    method: 'post',
    url: '/post',
    data
  })
}
