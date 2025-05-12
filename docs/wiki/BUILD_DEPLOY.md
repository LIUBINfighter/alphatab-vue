# 构建与部署指南

## 构建流程
1. 生产环境构建
   ```bash
   bun run build
   ```
   构建产物将输出到 `dist` 目录

2. 预览构建结果
   ```bash
   bun run preview
   ```

## 部署指南
1. 静态文件部署
   - 将 `dist` 目录内容上传至静态文件服务器
   - 配置服务器路由重定向到 `index.html`

2. Docker部署示例
   ```dockerfile
   FROM nginx:alpine
   COPY dist /usr/share/nginx/html
   EXPOSE 80
   ```

3. 注意事项
   - 确保服务器配置支持HTML5 History模式
   - 配置正确的MIME类型