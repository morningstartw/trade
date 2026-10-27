# UniTrade 校園二手市集 🎓

> 專為台灣大專院校學生設計的校園二手教材、生活雜物與 3C 用品交易與以物易物平台。

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)

---

## 🌟 核心特色與功能架構

### 1. 🎓 大學生校園身分驗證
- **.edu 校園信箱驗證**：填寫學校發配之學生專屬信箱，接收即時校驗碼完成在學生認證。
- **學生證證件審查**：支援上傳學生證正面照片與學號核驗。
- **官方認證徽章**：通過認證後即獲得校園盾牌標章與「在學證明卡」，享有同校面交優先權。

### 2. 🔐 會員註冊、登入與訪客模式
- **預設訪客模式**：一開始處於安全登出狀態，可自由瀏覽市集好物與同校專區。
- **身分切換與帳號系統**：支援註冊新帳號、會員登入，並提供示範帳號（一般學生、已認證同學、平台管理員）快速體驗。

### 3. 🏫 學校與地區篩選系統
- **全台大專院校分區**：涵蓋北部、中部、南部、東部等全台院校。
- **同校面交專區**：自動辨識並推薦同校同學出清物品，下課即可在校內總圖、學餐或宿舍面交，免去寄送運費與包裝。
- **多維度複合篩選**：關鍵字即時檢索、交易方式（現售 / 換物 / 贈送）、品況成色、價格區間篩選與排序。

### 4. 📦 商品管理與狀態切換
- **三種交易模式**：
  - 💵 **現售出清**：自訂定價與面交地點。
  - 🔄 **以物易物**：標註希望交換物品，可設定補貼差額。
  - 🎁 **免費贈送**：學長姐畢業傳承教材與生活好物。
- **商品狀態標示**：賣家可隨時將商品標示為：
  - 🟢 **上架中 (Available)**
  - 🟡 **預約中 (Reserved - 面交洽談中)**
  - ⚪ **交易完成 (Sold)**
- **編輯與下架**：支援即時編輯商品標題、價格、品況、新增或刪除面交地點，亦可一鍵下架商品。

### 5. 👤 個人中心與頭像管理
- **頭像管理**：提供精選男女學生插畫與照片預設集，同時支援本地圖片上傳與預覽。
- **個人賣場**：分類查看「我的商品（上架中/預約中/交易完成）」、「我的收藏清單」以及「歷史交易紀錄與評價」。
- **公開問答與私訊洽談**：買賣雙方可於商品頁面公開提問，或透過私訊即時出價與約定面交時間地點。

### 6. 🛡️ 社群安全與管理員後台
- **違規檢舉機制**：防範校外詐騙、要求私下匯款或洩漏個資。
- **管理員專屬後台**：管理員帳號可審核學生證認證申請與受理檢舉案件。

---

## 🛠️ 技術棧 (Tech Stack)

- **前端核心**：React 19, TypeScript
- **建置工具**：Vite 8
- **樣式系統**：Tailwind CSS v4
- **圖示庫**：Lucide React
- **動畫效果**：Motion

---

## 🚀 本地開發與建置步驟

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動本機開發伺服器
```bash
npm run dev
```
啟動後於瀏覽器開啟 `http://localhost:3000` 即可預覽。

### 3. 生產環境編譯打包
```bash
npm run build
```

---

## 📁 專案目錄結構

```text
├── src/
│   ├── components/         # UI 元件 (市集、詳情、認證、管理、頭像)
│   │   ├── AdminModal.tsx               # 平台管理員後台
│   │   ├── AuthModal.tsx                # 會員登入與註冊彈窗
│   │   ├── AvatarModal.tsx              # 個人頭像更換與管理
│   │   ├── EditProductModal.tsx         # 商品修改與狀態標示彈窗
│   │   ├── ExploreTab.tsx               # 探索市集與學校地區篩選
│   │   ├── Header.tsx                   # 頂部導覽列與通知計數
│   │   ├── HomeTab.tsx                  # 首頁看板與熱門分類
│   │   ├── MessagesTab.tsx              # 私訊聊天與面交出價
│   │   ├── PostTab.tsx                  # 發布二手商品
│   │   ├── ProductCard.tsx              # 商品卡片展示
│   │   ├── ProductDetailModal.tsx       # 商品詳情與問答互動
│   │   ├── ProfileTab.tsx               # 個人主頁與賣場管理
│   │   └── StudentVerificationModal.tsx # 大學生身分認證中心
│   ├── context/
│   │   └── AppContext.tsx  # 全局市集狀態管理
│   ├── data/
│   │   └── mockData.ts     # 大專院校清單、商品資料與測試會員
│   ├── types/
│   │   └── index.ts        # TypeScript 型別定義
│   ├── App.tsx             # 應用程式主進入點
│   ├── index.css           # 全域 Tailwind CSS 樣式
│   └── main.tsx            # React DOM 掛載點
├── index.html              # HTML 模板與中繼資料
├── package.json            # 依賴管理與腳本設定
└── tsconfig.json           # TypeScript 編譯設定
```

---

## 📝 授權聲明 (License)

本專案遵循 Apache-2.0 授權條款開源。
