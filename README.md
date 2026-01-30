# iDOTOOLS 年会抽奖（手游抽卡风）

一个面向年会现场的大屏互动抽奖项目，视觉风格参考手游十连抽卡：光效、卡背、翻牌与稀有度闪光，包含配置、抽奖与结果展示三页面。

## 功能概览
- **Home（首页）**：配置参与名单 / 奖品池 / 抽奖规则（中奖人数、是否移除）
- **10pull（十连）**：10 张卡牌翻转揭晓，点击卡牌进入详情
- **Roles（结果）**：奖品详情页（图片 + 描述 + 占位属性）
- CSV 导入名单与奖品
- 本地持久化（localStorage）

## 技术栈
- Vite + React + TypeScript
- Tailwind CSS
- GSAP（卡牌翻转动效）
- PapaParse（CSV 解析）

## 目录结构
```
.
├─ public/
│  ├─ card-back-sprite.png    # 从 UI 截图裁切卡背
│  └─ placeholder-prize.svg   # 奖品占位图
├─ src/
│  ├─ pages/                  # Home / TenPull / Roles
│  ├─ store/raffleStore.tsx   # 抽奖与数据存储逻辑
│  └─ index.css               # 全局样式与特效
├─ ui/                        # 参考 UI（home / 10pull / roles）
└─ ...
```

## 本地运行
```bash
npm install
npm run dev
```

构建与预览：
```bash
npm run build
npm run preview
```

## 说明与注意
- 卡背裁切位置在 `src/index.css` 的 `.card-back-crop` 中配置。若需要精确对齐，可继续微调 `background-position`。
- 奖品图片与描述当前使用占位图与文本，可后续替换为真实素材。

---
如需继续完善动效、音效或抽奖策略，请直接提需求。
