# Soul Oasis 心靈綠洲

Soul Oasis 是一個 AI 情緒陪伴與自我整理網站 MVP。它不是算命網站，也不是醫療或心理治療平台，而是一個溫柔、安靜、低壓的對話空間。

核心定位：

> 讓使用者願意安心地繼續說下去。

Version: 1.1 AI 陪伴對話版

## 專案目標

第一版只做 Web MVP，用來驗證以下流程：

1. 使用者進入首頁。
2. 點擊「立即體驗」。
3. 在體驗頁選擇模式並輸入問題。
4. 系統產生一段簡短自然的 AI 陪伴回應。
5. 未登入使用者可查看結果，但需註冊才能保存紀錄。
6. 已登入使用者可保存並查看「我的紀錄」。
7. 會員方案頁展示 Free / Plus 差異，第一版不串金流。

## 已完成功能

- 首頁 Landing Page
- AI 陪伴頁
- 對話結果頁
- 抽卡互動與洗牌動畫，卡片只作為反思提示
- 我的紀錄列表與單筆詳細頁
- Email / Password 登入與註冊
- Guest session 註冊後綁定會員帳號
- 紀錄刪除
- Free / Plus 方案展示
- 規範中心：免責聲明、隱私政策、危機協助、刪除申請
- 敏感詞危機提示
- 基本 API rate limit
- 響應式版面

## AI 陪伴原則

AI 必須維持一致人格：

- 溫和
- 安靜
- 不批判
- 不說教
- 不強迫正向
- 不假裝專業心理治療

每次回覆保持：

- 2 到 5 句
- 簡短自然
- 主動傾聽
- 適度反映情緒
- 使用開放式提問

若命中敏感詞，例如自傷、自殺、想消失、活不下去等，系統會回傳固定危機提示，不進行一般陪伴式回應。

## AI 對話模式

- 今日指引：可不輸入文字，提供輕陪伴與小提醒。
- 情緒提問：使用者輸入目前情緒或困擾，AI 反映情緒並延伸提問。
- 抽卡互動：系統隨機抽取一張卡，作為自我反思與情緒投射，不是命運預測。

## 技術架構

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Auth: 自建 Email / Password + JWT httpOnly cookie
- Password Hash: bcryptjs
- Database: Prisma schema + SQLite local MVP
- ORM Client: Prisma 7 + better-sqlite3 adapter
- Icons: lucide-react

## 本機開發

安裝依賴：

```bash
npm install
```

建立本機 SQLite 資料庫與卡片種子資料：

```bash
npm run db:setup
```

啟動開發伺服器：

```bash
npm run dev
```

打開：

```bash
http://localhost:3000
```

## 常用指令

```bash
npm run dev
npm run build
npm run lint
npm run db:setup
npm run prisma:generate
```

## 資料庫說明

主要資料表：

- `users`
- `sessions`
- `cards`

本機資料庫檔案為：

```bash
prisma/dev.db
```

此檔案已加入 `.gitignore`，不會被提交到 GitHub。

## 重要限制

第一版刻意不做以下功能：

- 真人諮詢預約
- 社群留言
- 複雜聊天房
- 金流串接
- LINE Bot
- 多角色 AI 人設切換
- 多語系
- App 版
- 後台管理頁

## 安全與免責

Soul Oasis 僅提供情緒陪伴、自我反思與紀錄整理，不構成醫療診斷、心理治療或危機處理服務。

若使用者有自傷、自殺、急性精神危機或立即危險，請立即尋求當地緊急協助，例如聯絡緊急服務、安心專線，或前往最近急診。

## 部署方向

建議正式版部署架構：

- Hosting: Vercel
- Database: Supabase / PostgreSQL
- ORM: Prisma
- Auth: 可維持自建 JWT，或後續改 Supabase Auth

目前 MVP 使用 SQLite 方便本機快速驗證；若要正式上線，建議改接 PostgreSQL。
