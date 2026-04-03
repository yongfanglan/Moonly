# 🌙 Moonly

> 让每一个孤独的深夜，都有人陪伴

AI 情感陪伴工具，面向海外市场的 MVP 产品。

## 功能特性

- 💬 **AI 即时聊天** — 7x24 小时情感陪伴，基于通义千问
- 😊 **情绪打卡** — 每日心情追踪 + AI 解读，打卡获 bonus 消息
- 🌙 **深夜模式** — 默认深色主题，护眼舒适
- 🔐 **用户体系** — 访客/注册/Pro 三级用户
- 📴 **隐私优先** — 对话仅存本地会话，刷新即清

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **AI**: 阿里云 DashScope (qwen-turbo)
- **部署**: Cloudflare Pages

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 填入 DASHSCOPE_API_KEY

# 3. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 生产部署

### Cloudflare Pages

1. Fork/推送代码到 GitHub
2. 在 Cloudflare Pages 创建项目，连接 GitHub 仓库
3. 设置：
   - **Build command**: `npm run build`
   - **Output directory**: `.next`
4. 添加环境变量 `DASHSCOPE_API_KEY`

### 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `DASHSCOPE_API_KEY` | ✅ | 阿里云 DashScope API Key |

## 用户限额

| 用户类型 | 每日消息 | 情绪打卡 |
|---------|---------|---------|
| 访客 | 3 条 | 可打卡（+3 bonus）|
| 注册用户 | 10 条 | 可打卡 |
| Pro 用户 | ∞ | 可打卡 |

## MVP 里程碑

- [x] MVP 需求文档
- [x] NextJS 基础框架
- [x] AI 聊天 (F01)
- [x] 情绪打卡 (F02)
- [x] 用户注册/登录 (F03)
- [x] 深夜模式 (F07)
- [ ] 对话历史-内存 (F04)
- [ ] AI 记忆功能 (F05)
- [ ] Pro 订阅系统

## License

MIT
