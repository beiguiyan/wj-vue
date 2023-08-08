<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div style="margin: auto;margin-bottom: 20px;margin-top: 20px;">
      <EditForm @onSubmit="loadBooks()" ref="edit"></EditForm>
      <ImportChats @onSubmit="loadBooks()" ref="importChats"></ImportChats>
      <el-button class="add-button" type="primary" @click="addChat">添加订单</el-button>
      <el-button class="add-button" type="primary" @click="download">导出全部数据</el-button>
      <el-button class="add-button" type="primary" @click="downloadTemple">下载导入模版</el-button>
      <el-button class="add-button" type="primary" @click="importDataChats">导入数据</el-button>
    </div>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
        :data="books"
        stripe
        style="width: 100%"
        :max-height="tableHeight">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item>
                <span>{{ props.row.abs }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="书名（展开查看摘要）"
          fit>
        </el-table-column>
        <el-table-column
          prop="category.name"
          label="分类"
          width="100">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          fit>
        </el-table-column>
        <el-table-column
          prop="date"
          label="出版日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="press"
          label="出版社"
          fit>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="abs"-->
          <!--label="摘要"-->
          <!--show-overflow-tooltip-->
          <!--fit>-->
        <!--</el-table-column>-->
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editBook(scope.row)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteBook(scope.row.id)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button>取消选择</el-button>
        <el-button @click="batchDelNotice">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import EditForm from './EditForm'
  import ImportChats from './ImportChats'
  export default {
    name: 'BookManagement',
    components: {EditForm, ImportChats},
    data () {
      return {
        books: []
      }
    },
    mounted () {
      this.loadBooks()
    },
    computed: {
      tableHeight () {
        return window.innerHeight - 320
      }
    },
    methods: {
      deleteBook (id) {
        this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios
              .post('/admin/content/books/delete', {id: id}).then(resp => {
              if (resp && resp.data.code === 200) {
                this.loadBooks()
              }
            })
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editBook (item) {
        this.$refs.edit.dialogFormVisible = true
        this.$refs.edit.form = {
          id: item.id,
          cover: item.cover,
          title: item.title,
          author: item.author,
          date: item.date,
          press: item.press,
          abs: item.abs,
          category: {
            id: item.category.id.toString(),
            name: item.category.name
          }
        }
      },
      loadBooks () {
        var _this = this
        this.$axios.get('/books').then(resp => {
          if (resp && resp.data.code === 200) {
            _this.books = resp.data.result
          }
        })
      },
      download () {
        this.$axios
          .get('/download', {responseType: 'blob'})
          .then(resp => {
            if (resp && resp.status === 200) {
              // 导出excel文件
              exportExcel(resp)
            } else {
              this.$message.error('数据导出失败，' + resp.status)
            }
          })
      },
      downloadTemple () {
        this.$axios
          .get('/downloadTemple', {responseType: 'blob'})
          .then(resp => {
            if (resp && resp.status === 200) {
              // 导出excel文件
              exportExcel(resp)
            } else {
              this.$message.error('模版导出失败，' + resp.status)
            }
          })
      },
      importDataChats () {
        this.$refs.importChats.centerDialogVisible = true
      },
      addChat () {
        this.$refs.edit.dialogFormVisible = true
      }
    }
  }

  function exportExcel (resp) {
    var blob = new Blob([resp.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
    var contentDisposition = resp.headers['content-disposition']
    var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
    var result = patt.exec(contentDisposition)
    var filename = result[1]
    var downloadElement = document.createElement('a')
    var href = window.URL.createObjectURL(blob) // 创建下载的链接
    downloadElement.href = href
    downloadElement.download = filename // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 释放掉blob对象
  }
</script>

<style scoped>
</style>
