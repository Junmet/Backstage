<template>
  <div>
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>文章管理</el-breadcrumb-item>
  <el-breadcrumb-item>文章列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 列表 -->
  <template>
    <el-table :data="postList" style="width: 100%" border>
         <el-table-column type="index" width="50">
    </el-table-column>
      <el-table-column prop="title" label="标题"  width="400">
      </el-table-column>
      <el-table-column prop="create_date" label="日期" width="180">
           <template slot-scope="scope">
                {{scope.row.create_date |dateFormatting("-")}}
            </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="160">
            <template slot-scope="scope">
                {{scope.row.type===1?"文章":"视频"}}
            </template>
      </el-table-column>
      <el-table-column prop="user.nickname" label="作者" width="160">
      </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
           <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="primary" icon="el-icon-edit" @click="enit(scope.row)"></el-button>
           </el-tooltip>
           <el-tooltip class="item" effect="dark" content="分享" placement="top">
                 <el-button type="success" icon="el-icon-share"></el-button>
           </el-tooltip>
           <el-tooltip class="item" effect="dark" content="删除" placement="top">
                 <el-button type="warning" icon="el-icon-delete"></el-button>
           </el-tooltip>
      </template>
      </el-table-column>
    </el-table>
  </template>
  <!-- 分页 -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[`${pageSize}`, `${pageSize + 2}`,`${pageSize + 4}`, `${pageSize + 8}`]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getPostLiset } from '@/api/article'
import { dateFormatting } from '@/utils/filter'
export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 2,
      postList: [],
      total: 0
    }
  },
  //   过滤器 格式化时间
  filters: {
    dateFormatting
  },
  mounted () {
    this.init()
  },
  methods: {
    //   获取文章数据
    async init () {
      let res = await getPostLiset({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      // console.log(res)
      if (res.status === 200) {
        this.postList = res.data.data
        this.total = res.data.total
      }
    // console.log(this.total)
    },
    // 获取表格  每一列的数据内容
    enit (row) {
      console.log(row)
    },
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
    //   console.log(`当前页: ${val}`)
      this.pageIndex = val
      this.init()
    }
  }
}
</script>

<style leng="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px
}
.el-pagination{
    margin-top: 15px;
    text-align: center
}
</style>
