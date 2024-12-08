# AI Love Match

AI Love Match 是一个基于Next.js构建的情侣契合度测评系统。通过智能算法分析用户的性格特征、价值观念和生活习惯，为用户提供关系契合度评估和改善建议。

## 功能特点

- 📝 个性化测评
  * 单人/双人模式选择
  * 基础/高级测评选择
  * 多维度问题评估

- 🤖 AI智能分析
  * DeepSeek API集成
  * 结构化分析报告
  * 个性化改善建议

- 📊 可视化展示
  * 分数环形图表
  * 契合度评价
  * 打字机效果
  * Markdown渲染

- 💡 用户体验
  * 响应式设计
  * 深色模式支持
  * 流畅动画效果
  * 优雅错误处理

## 技术栈

- **框架**: Next.js 15.0.4
- **语言**: TypeScript
- **样式**: Tailwind CSS + Typography
- **AI**: DeepSeek API
- **部署**: Vercel

## 项目结构

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx          # 首页
│   │   ├── test/             # 测评页面
│   │   ├── result/           # 结果页面
│   │   └── api/              # API路由
│   ├── components/            # 共享组件
│   │   ├── assessment/       # 测评相关组件
│   │   └── ui/              # UI组件
│   ├── lib/                   # 工具函数
│   └── types/                 # 类型定义
├── public/                     # 静态资源
└── 配置文件
```

## 开发说明

### 本地开发

1. 克隆项目

```bash
git clone [repository-url]
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 访问 http://localhost:3000

### 环境变量

创建 .env.local 文件并添加：

```
DEEPSEEK_API_KEY=your_api_key
```

## 后续规划

### 1. 首要改进
- [ ] 添加本地存储防止数据丢失
- [ ] 优化移动端适配
- [ ] 添加声音开关选项

### 2. 功能扩展
- [ ] 实现分享功能
- [ ] 添加历史记录
- [ ] 扩充问题库

### 3. 商业化准备
- [ ] 添加用户系统
- [ ] 实现数据分析
- [ ] 增加会员功能

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 许可证

MIT
