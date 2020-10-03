<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="listUser">
            <el-button slot="append" icon="el-icon-search" @click="listUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"/>
        <el-table-column prop="role_name" label="角色"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="mobile" label="手机号"/>
        <el-table-column prop="create_time" label="创建时间"/>
        <el-table-column label="状态" width="70">
          <template slot-scope="scope">
            <el-switch @change="changeState(scope.row.id,scope.row.mg_state)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="openEditUserDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="handlerDeleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20,30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
      </el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" :before-close="closeAddUserDialog">
      <!--内容主体去-->
      <el-form ref="addUserFormRef" :model="user" :rules="addUserRules">
        <el-form-item prop="username" label="用户名" label-width="70px">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="70px">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="70px">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号" label-width="70px">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddUserDialog">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" :before-close="closeEditUserDialog">
      <!--内容主体去-->
      <el-form ref="addUserFormRef" :model="user">
        <el-form-item prop="username" label="用户名" label-width="70px">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="70px">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="70px">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号" label-width="70px">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditUserDialog">取 消</el-button>
          <el-button type="primary" @click="editUser">修 改</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        data() {
            const checkEmail = (rule, email, callback) => {
                const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (emailReg.test(email)) {
                    return callback();
                }
                return callback(new Error('请输入合法的邮箱'));
            };
            const checkPhone = (rule, phone, callback) => {
                if (!(/^1[3456789]\d{9}$/.test(phone))) {
                    return callback();
                }
                return callback(new Error('请输入合法的手机号'));
            };
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                userList: [],
                total: 0,
                addDialogVisible: false,
                editDialogVisible: false,
                user: {
                    id: '',
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addUserRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
            }
        },
        created() {
            this.listUser();
        },
        methods: {
            async listUser() {
                let {data} = await this.$http.get('/users', {params: this.queryInfo});
                this.userList = data.data.users;
                this.total = data.data.total;
            },
            changeState(id, state) {
                this.$http.put('/users/' + id + '/state/' + state);
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.listUser();
            },
            // 页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.listUser();
            },
            async addUser() {
                let {data} = await this.$http.post('/users', this.user);
                if (data.meta.status !== 201) {
                    this.$message.error(data.meta.msg);
                    return;
                }
                this.$message.success("添加成功");
                this.user = {};
                this.listUser();
                this.addDialogVisible = false;
            },
            closeAddUserDialog() {
                this.user = {};
                this.addDialogVisible = false;
            },
            closeEditUserDialog() {
                this.user = {};
                this.editDialogVisible = false;
            },
            openEditUserDialog(user) {
                this.user = user;
                this.editDialogVisible = true;
            },
            async editUser() {
                let {data} = await this.$http.put('/users/' + this.user.id, this.user);
                if (data.meta.status !== 200) {
                    this.$message.error(data.meta.status);
                    return;
                }
                this.$message.success("更新成功");
                this.editDialogVisible = false;
            },
            handlerDeleteUser(userId) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let {data} = await this.$http.delete('/users/' + userId);
                    if (data.meta.status === 200) {
                        this.$message.success("删除成功");
                        this.listUser();
                    }
                }).catch((err) => {
                    console.log(err)
                });
            }
        }
    }
</script>

<style scoped>

</style>
