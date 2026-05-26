# 题库助手 (Question Bank Helper)

一个完全本地运行的个人题库复习桌面应用，帮助你高效复习考试。

## 功能特点

- **题目管理**：支持创建科目和章节，按两层结构组织题库
- **两种题型**：纯文本题（闪卡式问答）和单选题
- **完整 CRUD**：添加、编辑、删除题目
- **复习模式**：支持顺序做题和乱序做题
- **答案隐藏**：答案不会立即显示，点击后才出现
- **进度记录**：自动保存复习进度，下次可继续
- **数据本地存储**：所有数据保存在本地，隐私安全

## 安装

### macOS

1. 在 [Releases](../../releases) 页面下载最新的 `.zip` 文件
2. 下载完成后，打开终端运行以下命令解除 macOS 安全限制：
   ```bash
   xattr -cr ~/Downloads/题库助手-0.1.0-arm64.zip
   ```
3. 解压 zip，将 `题库助手.app` 拖入 Applications 文件夹
4. 首次打开：右键点击应用 → 选「打开」→ 弹窗中点「打开」

> 因为应用未经 Apple 签名，macOS 会阻止直接运行。上述步骤仅需首次安装时操作一次。

## 开发

### 环境要求

- Node.js >= 18
- npm >= 8

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发模式
npm run dev
```

### 构建

```bash
# 构建生产版本
npm run build

# 打包 macOS .dmg
npm run package
```

## 技术栈

- [Electron](https://www.electronjs.org/) - 桌面应用框架
- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [electron-store](https://github.com/sindresorhus/electron-store) - 本地数据持久化

## 许可证

MIT
