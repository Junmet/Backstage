export const dateFormatting = (data, spa) => {
  spa = spa || '/'
  data = new Date(data)
  let year = data.getFullYear()
  let month = data.getMonth() + 1
  let day = data.getDate()
  return year + spa + month + spa + day
}
