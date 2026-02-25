# 快速启动指南

## 🚀 5分钟快速开始

### 第1步：准备环境（1分钟）
```bash
# 确保已安装 Node.js 14+ 和 npm
node --version
npm --version
```

### 第2步：进入项目目录（30秒）
```bash
cd /Users/licheng/Desktop/tufaqixiang/tufaqixiang
```

### 第3步：安装依赖（2分钟）
```bash
npm install
```

### 第4步：启动开发服务器（1分钟30秒）
```bash
# 方式1：使用npm脚本
npm run dev:h5

# 方式2：使用HBuilderX
# 在HBuilderX中右键项目 → 运行 → 运行到浏览器 / 运行到手机
```

### 第5步：打开应用
```
浏览器自动打开：http://localhost:8080
或在HBuilderX中查看运行结果
```

---

## 📱 项目包含的5个完整页面

```
启动页 (splash)
    ↓
登录注册页 (login)  
    ↓
首页 (index) ←→ 论坛页 (forum)
    ↓           ↓
个人中心 (mine) ←─┘

使用底部三个TabBar标签在[首页、论坛、我的]之间切换
```

---

## 🎯 主要功能

### 首页 (Index)
- 轮播图展示
- 搜索功能
- 快速菜单（规划路线、AI规划、附近路线、骑行活动）
- 精选路线列表
- 热门话题推荐
- 骑行进度统计

### 论坛页 (Forum)
- 分类浏览
- 搜索功能
- 置顶话题
- 图片预览
- 点赞评论统计
- 发布新话题

### 个人中心 (Mine)
- 用户信息（使用 /image.png 头像）
- 数据统计
- 骑行记录
- 成就勋章
- 账户设置
- 退出登录

### 登录页 (Login)
- 手机号登录
- 验证码注册
- 第三方登录（微信、QQ、支付宝）
- 表单验证

### 启动页 (Splash)
- 品牌展示
- 2秒后自动跳转

---

## 🎨 设计亮点

| 特点 | 说明 |
|------|------|
| 🎭 统一设计语言 | 完整的色彩、字体、间距规范 |
| 🎪 精致交互 | 按钮反馈、加载动画、列表效果 |
| 📱 响应式布局 | rpx单位自适配所有屏幕 |
| 🌍 多平台支持 | iOS、Android、H5、小程序 |
| ⚡ 高效代码 | 清晰的代码结构和注释 |

---

## 📁 项目文件位置

```
tufaqixiang/
├── pages/                 ← 所有页面文件
│   ├── splash/           ← 启动页
│   ├── login/            ← 登录页
│   ├── index/            ← 首页
│   ├── forum/            ← 论坛
│   └── mine/             ← 个人中心
├── static/               ← 静态资源
├── App.vue               ← 根组件
├── pages.json            ← 路由配置
├── manifest.json         ← 应用配置
└── main.js              ← 入口文件
```

---

## 🔧 常用命令

```bash
# 启动H5开发服务器
npm run dev:h5

# 编译H5版本
npm run build:h5

# 编译App版本（需要环境配置）
npm run build:app

# 清理node_modules和重装
rm -rf node_modules && npm install
```

---

## 🎨 自定义配置

### 修改应用名称
编辑 `manifest.json`:
```json
{
    "name": "你的应用名"
}
```

### 修改主题色
全局搜索 `#FA541C` (橙色) 替换为你的颜色。  
主要位置：
- `App.vue` - 全局样式
- 所有 `.vue` 页面文件

### 修改页面标题
编辑 `index.html`:
```html
<title>兔发骑想 - 你的新标题</title>
```

---

## 📊 项目统计

```
✅ 完成的页面：5个
✅ 完成的功能：核心交互 + 导航 + 设计
💻 代码行数：~1880行
🎨 设计规范：完整统一
📱 平台支持：5个平台
🔗 模块数量：50+个Vue组件/模块
```

---

## ⚠️ 注意事项

1. **确保Node.js版本** ≥ 14.0
2. **npm install 可能需要几分钟** - 请耐心等待
3. **首次运行可能需要编译** - 这是正常的
4. **如出现错误** - 尝试删除 node_modules 后重新安装

---

## 📚 下一步学习

1. 📖 查看 [README.md](README.md) 了解项目详情
2. 📋 查看 [PROJECT_GUIDE.md](PROJECT_GUIDE.md) 详细开发指南
3. 📊 查看 [COMPLETION_REPORT.md](COMPLETION_REPORT.md) 项目完成报告
4. 🎓 学习 [uniapp文档](https://uniapp.dcloud.io/)
5. 💻 学习 [Vue.js文档](https://v2.cn.vuejs.org/)

---

## 🆘 常见问题

**Q: 运行时找不到webpack？**
A: 运行 `npm install` 重新安装依赖

**Q: 端口被占用？**
A: 修改环境变量或使用其他端口

**Q: 页面显示不正常？**
A: 清除浏览器缓存或 Ctrl+Shift+R 强制刷新

**Q: 如何实现真机调试？**
A: 使用HBuilderX的真机运行功能

---

## 🎉 祝你开发愉快！

现在你已经拥有了一个完整的骑行路线规划应用框架！  
接下来的工作包括集成地图API、后端服务等功能增强。

**需要帮助？** 查看项目文档或 uniapp 官方文档

---

**最后更新**: 2026年2月24日  
**版本**: 1.0.0  
**框架**: uniapp (Vue.js)
