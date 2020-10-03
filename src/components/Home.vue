<template>
  <el-container class="home-container">
    <!--头部区-->
    <el-header>
      <div class="header-div">
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="collapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <!--侧边栏菜单区域-->
        <el-menu v-for="menu in menuList" :key="menu.id" background-color="#333744" text-color="#fff" active-text-color="#409EFF" :collapse="collapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="'/'+menu.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item @click="saveNavState('/'+child.path)" v-for="child in menu.children" :key="child.id" :index="'/'+child.path">
              {{child.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        data() {
            return {
                menuList: [],
                collapse: false,
                activePath: ''
            }
        },
        methods: {
            logout() {
                window.sessionStorage.removeItem("token");
                this.$router.push("/login");
            },
            // 获取所有菜单
            async listMenu() {
                let {data} = await this.$http.get("/menus");
                if (data.meta.status !== 200) {
                    this.$message.error("失败");
                }
                this.menuList = data.data;
            },
            toggleCollapse() {
                this.collapse = !this.collapse;
            },
            saveNavState(path) {
                window.sessionStorage.setItem('activePath', path);
                this.activePath = path;
            }
        },
        created() {
            this.listMenu();
            this.activePath = window.sessionStorage.getItem('activePath');
        }
    }
</script>

<style scoped>
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #EAEDF1;
  }

  .el-menu {
    border-right: none;
  }

  .home-container {
    width: 100%;
    height: 100%;
  }

  .header-div {
    display: flex;
    align-items: center;
  }

  .header-div span {
    margin-left: 15px;
  }

  .toggle-button {
    background-color: #333744;
    color: #fff;
    text-align: center;
    padding: 10px;
    letter-spacing: 0.2em;
  }

  .toggle-button:hover {
    background-color: #3F4153;
  }

</style>
