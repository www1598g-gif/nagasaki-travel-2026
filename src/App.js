import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Utensils,
  Car,
  CloudSun,
  Wind,
  AlertCircle,
  Phone,
  Wallet,
  Plane,
  Home,
  ChevronDown,
  ChevronUp,
  Navigation,
  Loader2,
  CloudRain,
  Sun,
  Cloud,
  Thermometer,
  Lock,
  KeyRound,
  Info,
  Camera,
  Shirt,
  Mountain,
  Sparkles,
  Signal,
  Droplets,
  Calendar,
  ArrowRight,
  Clock,
  User,
  CheckCircle,
  Gavel,
  Coins,
  Banknote,
  Smile,
  FileText,
  AlertTriangle,
  Zap,
  HelpCircle,
  Settings,
  Upload,
  RefreshCw,
  Trash2,
  Coffee,
  Beer,
  Flower2,
  ShoppingBag,
  IceCream,
  UtensilsCrossed,
  Compass,
  Pin,
  Ban,
  Languages,
  Smartphone,
  X,
} from 'lucide-react';

// 🔥🔥🔥 Firebase RTDB 核心電路
import { ref, onValue, set, goOffline, goOnline, get } from "firebase/database";
import { db } from "./firebase"; // ⚠️ 前提：你要先建立 firebase.js 檔案

// 🪷 泰式/古典雙線條版 Icon (保留原結構，顏色交由 className 決定)
const LotusIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3C12 3 14.5 7 14.5 10C14.5 12.5 12 14 12 14C12 14 9.5 12.5 9.5 10C9.5 7 12 3 12 3Z" />
    <path d="M9.5 10C9.5 10 7 9.5 5.5 11C4 12.5 5 15 8 15.5" />
    <path d="M14.5 10C14.5 10 17 9.5 18.5 11C20 12.5 19 15 16 15.5" />
    <path d="M12 14C12 14 9 14.5 7 16.5C5 18.5 6 20.5 12 20.5" />
    <path d="M12 14C12 14 15 14.5 17 16.5C19 18.5 18 20.5 12 20.5" />
  </svg>
);

// 圖片處理自動對應
const getLocationImage = (imageId) => {
  if (!imageId) return 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?w=800&q=80';
  if (imageId.startsWith('http') || imageId.startsWith('data:')) {
    return imageId;
  }
  return process.env.PUBLIC_URL + `/images/${imageId}.jpg`;
};

// ============================================
// 初始行程資料 (2026 九州 V25 終極生存版精準注入)
// ============================================
const INITIAL_ITINERARY_DATA = [
  {
    day: 1,
    date: '2026-06-16',
    displayDate: '6/16 (二)',
    title: '佐賀入境 ➜ 豪斯登堡歐風街景 ➜ 深夜硬核歷史探險',
    weather: { temp: '24°C', icon: 'sunny', aqi: 35, realData: false },
    locations: [
      {
        imageId: 'day1_1',
        type: 'transport',
        time: '03:40',
        name: '【機場接送】出發前往桃機',
        note: '搭乘 UGO 機場接送休旅車（單號：U1941724）。',
        desc: '自竹北光明六路東二段出發前往桃園機場。',
        nav: '桃園國際機場',
        difficulty: '低 (無障礙設施)',
      },
      {
        imageId: 'day1_2',
        type: 'transport',
        time: '10:35',
        name: '班機抵達佐賀機場 ➜ 直奔佐賀站',
        note: '搭乘機場接駁巴士（約 30-35 分鐘）。',
        desc: '辦理入境。搭乘機場接駁巴士直達 JR 佐賀站。落地首要任務：現場購買「佐賀 ➜ 豪斯登堡」特急列車車票。',
        nav: '佐賀駅',
        difficulty: '零 (全程坐車)',
      },
      {
        imageId: 'day1_3',
        type: 'food',
        time: '12:00',
        name: '午餐: 三瀨雞便當 / 西西里飯',
        note: '放生季樂！體貼疲憊腸胃，儲備戰力。',
        desc: '改在佐賀站內享用清爽、快速但在地的「三瀨雞便當/定食」或「西西里飯」。省下大排長龍時間。',
        nav: '佐賀駅',
        highlight: '在地三瀨雞',
        difficulty: '低',
      },
      {
        imageId: 'day1_4',
        type: 'transport',
        time: '13:00',
        name: '鐵道移動: 搭乘 JR 特急列車',
        note: '搭乘 Midori 綠號 或 豪斯登堡號。',
        desc: '若搭綠號則至「早岐站」轉一站區間車即可抵達豪斯登堡站（車程 1 小時內）。',
        nav: '豪斯登堡駅',
        difficulty: '零',
      },
      {
        imageId: 'day1_5',
        type: 'sight',
        time: '15:00',
        name: '輕裝入園豪斯登堡',
        note: '行李交給場內行李寄送櫃檯直送飯店。',
        desc: '將 4 個大行李箱交給櫃檯，直接由系統送至阿姆斯特丹酒店，全員輕裝開始暢玩。',
        nav: 'ハウステンボス',
        difficulty: '中 (斜坡/階梯)',
      },
      {
        imageId: 'day1_6',
        type: 'sight',
        time: '18:30',
        name: '園區夜景 & 入住核心收費區',
        note: '入住豪斯登堡阿姆斯特丹酒店。',
        desc: '欣賞歐洲風情運河燈光秀與 3D 投影。入住核心區內飯店，自由進出專屬通道。',
        nav: 'Hotel Amsterdam Huis Ten Bosch',
        highlight: '歐風運河燈光秀',
        difficulty: '低',
      },
      {
        imageId: 'day1_7',
        type: 'sight',
        time: '22:00',
        name: '深夜硬核探險 / 超商補貨備案',
        note: '路線 A（Lawson 補貨）/ 路線 B（針尾電波塔遠眺）',
        desc: '路線 A：散步 20 分鐘至車站前唯一的 Lawson 買炸雞清酒。路線 B：步行 40-50 分鐘隔海遠眺 1922 年建的「舊佐世保海軍航空隊 針尾送信所」三座巨塔黑影，體驗深夜魔幻感。',
        nav: '針尾送信所',
        difficulty: '高 (需步行陡坡)',
      },
    ],
  },
  {
    day: 2,
    date: '2026-06-17',
    displayDate: '6/17 (三)',
    title: '豪斯登堡全日漫遊 ➜ 移防長崎（★新三大夜景與海鮮彈性夜）',
    weather: { temp: '25°C', icon: 'cloudy', aqi: 40, realData: false },
    locations: [
      {
        imageId: 'day2_1',
        type: 'sight',
        time: '09:30',
        name: '豪斯登堡續玩漫遊',
        note: '享受初夏花卉展與歐風大遊行。',
        desc: '享用阿姆斯特丹酒店早餐，隨後利用飯店續玩票暢玩園區。',
        nav: 'ハウステンボス',
        difficulty: '中 (範圍大)',
      },
      {
        imageId: 'day2_2',
        type: 'transport',
        time: '19:30',
        name: '夕陽鐵道移動: Seaside Liner',
        note: '直達長崎站，車程約 1.5 小時。',
        desc: '搭乘 JR 快速列車「Seaside Liner」，沿途可盡情欣賞大村灣夕陽落海的無敵海景。',
        nav: '長崎駅',
        difficulty: '零',
      },
      {
        imageId: 'day2_3',
        type: 'sight',
        time: '21:00',
        name: '長崎進駐 & 彈性對策評估',
        note: '辦理入住放行李。內含提早到站之海鮮/夜景彈性方案。',
        desc: '入住 Dormy Inn PREMIUM 長崎站前。若提早到站且天氣晴朗，晚餐可直接殺去【出島 Wharf】海岸碼頭，或搭計程車衝【稻佐山山頂展望台】搶先看世界新三大夜景。',
        nav: 'Dormy Inn PREMIUM 長崎站前',
        difficulty: '低',
      },
      {
        imageId: 'day2_4',
        type: 'food',
        time: '21:30',
        name: '常規宵夜: 免費拉麵 / 思案橋深夜探險',
        note: '享用飯店免費醬油拉麵。',
        desc: '直奔飯店餐廳享用免費的 Dormy Inn 宵夜醬油拉麵墊胃，隨後步行至旁邊的思案橋不夜城。',
        nav: '思案橋',
        highlight: '免費宵夜拉麵',
        difficulty: '低',
      },
    ],
  },
  {
    day: 3,
    date: '2026-06-18',
    displayDate: '6/18 (四)',
    title: '【戰鬥早鳥】軍艦島極限登島 ➜ 出島深度 ➜ ★新三大夜景 ➜ ★21:00和牛大賞',
    weather: { temp: '26°C', icon: 'sunny', aqi: 30, realData: false },
    locations: [
      {
        imageId: 'day3_1',
        type: 'sight',
        time: '07:00',
        name: '全行程唯一早起衝刺',
        note: '⚠️ 全團今天絕對不吃早餐，預防外海過大浪暈船。',
        desc: '起床戰力調整，空腹前往常盤棧橋以防風浪過大導致不適。',
        nav: '長崎港',
        difficulty: '低',
      },
      {
        imageId: 'day3_2',
        type: 'sight',
        time: '08:30',
        name: '長崎常盤棧橋報到',
        note: '準備軍艦島登島船票。',
        desc: '抵達常盤棧橋完成報到與切結手續。',
        nav: '長崎常盤ターミナル',
        difficulty: '低',
      },
      {
        imageId: 'day3_3',
        type: 'sight',
        time: '09:00',
        name: '核心歷史: 軍艦島（端島）登島作戰',
        note: '預約號碼：128734。',
        desc: '軍艦島登島與海上巡禮，見證極致的工業歷史現代廢墟。',
        nav: '軍艦島',
        highlight: '世界文化遺產',
        difficulty: '高 (需步行陡坡)',
      },
      {
        imageId: 'day3_4',
        type: 'food',
        time: '12:45',
        name: '海景午餐: 四海樓強棒麵',
        note: '若排隊人潮過多，立刻發動彈性對策放棄，改吃外帶「角煮饅頭」。',
        desc: '享用道地長崎強棒麵（Champon）並俯瞰長崎港。',
        nav: '四海樓',
        highlight: '長崎強棒麵始祖',
        difficulty: '中',
      },
      {
        imageId: 'day3_5',
        type: 'sight',
        time: '14:15',
        name: '老建築快閃巡禮',
        note: '大浦天主堂、哥拉巴園周邊。',
        desc: '大浦天主堂、哥拉巴園周邊精準快閃拍照。',
        nav: '大浦天主堂',
        difficulty: '中 (部分階梯)',
      },
      {
        imageId: 'day3_6',
        type: 'sight',
        time: '15:15',
        name: '深度精精华: 出島 (Dejima) 荷蘭商館',
        note: '⚠️ 建築內部 18:00 準時鎖門。',
        desc: '走進江戶幕府鎖國時期的歷史核心現場。',
        nav: '出島',
        difficulty: '中',
      },
      {
        imageId: 'day3_7',
        type: 'sight',
        time: '18:15',
        name: '唐人屋敷通 (夜遊點燈模式)',
        note: '紅燈籠亮起的魔幻歷史感街景。',
        desc: '夜遊點燈模式下的江戶時代華人社區遺址。',
        nav: '唐人屋敷跡',
        difficulty: '暢行中',
      },
      {
        imageId: 'day3_8',
        type: 'sight',
        time: '19:30',
        name: '長崎空中纜車 × 世界新三大夜景',
        note: '法拉利設計師操刀全景纜車！備案改搭斜面電車。',
        desc: '搭計程車前往「淵神社站」搭乘空中纜車直達稻佐山山頂展望台。飽覽港口夜景！如天候不佳改往中腹轉搭斜面電車（Slope Car）。',
        nav: '稻佐山山頂展望台',
        highlight: '新三大夜景',
        difficulty: '中',
      },
      {
        imageId: 'day3_9',
        type: 'food',
        time: '21:00',
        name: '晚餐: 大阪屋濱町店（和牛大賞）',
        note: '🔥 V25改版核心：移到今天！爽吃 A5 特選長崎和牛燒肉！',
        desc: '預約 21:00 晚鳥時段，不僅留出看夜景的餘裕，更徹底解放了 Day 4 下午不中斷的逛街血拼大戰！',
        nav: '大阪屋 浜町店',
        highlight: 'A5長崎和牛',
        difficulty: '低',
      },
    ],
  },
  {
    day: 4,
    date: '2026-06-19',
    displayDate: '6/19 (五)',
    title: '【晚鳥復原】傳奇早午餐 ➜ 原爆歷史巡禮 ➜ ★5.5小時不打斷血拼 ➜ ★自由海鮮夜',
    weather: { temp: '27°C', icon: 'sunny', aqi: 35, realData: false },
    locations: [
      {
        imageId: 'day4_1',
        type: 'food',
        time: '10:30',
        name: '傳奇早午餐: 珈琲冨士男',
        note: '品嚐 1946 年創業的老派傳奇雞蛋三明治。',
        desc: '不可預約，建議提早 10 分鐘到場漫步品嚐老派氛圍。',
        nav: '珈琲冨士男',
        highlight: '老派雞蛋三明治',
        difficulty: '低',
      },
      {
        imageId: 'day4_2',
        type: 'sight',
        time: '11:30',
        name: '原爆歷史深度巡禮',
        note: '平和公園、山王神社單柱鳥居。',
        desc: '依序深度參觀原爆資料館、平和公園、山王神社（單柱鳥居）、坂本國際墓地。',
        nav: '長崎原爆資料館',
        difficulty: '中',
      },
      {
        imageId: 'day4_3',
        type: 'sight',
        time: '15:30',
        name: '購物主戰場 (5.5小時絕不中斷！)',
        note: '🔥 觀光通 / 3COINS plus 火力全開大血拼。',
        desc: 'V25改版重點：因為今晚完全沒有卡死人的燒肉訂位壓力，全員可以自由控制時間，血拼免狼狽被打斷！',
        nav: '長崎 浜町空間通り',
        highlight: '5.5小時瘋狂購物',
        difficulty: '高 (範圍大)',
      },
      {
        imageId: 'day4_4',
        type: 'food',
        time: '21:00',
        name: '晚餐: 出島 Wharf 海鮮大賞 / 夜景最終補網',
        note: '自由挑選居酒屋。⚠️ 22:30 回飯店記得加購早餐券。',
        desc: '放完戰利品後前往碼頭，在海風與深藍碼頭夜景下痛快大啖海鮮！若前幾天因雨沒看到夜景，今晚是最後補網機會。',
        nav: '出島ワーフ',
        highlight: '現撈海鮮居酒屋',
        difficulty: '低',
      },
    ],
  },
  {
    day: 5,
    date: '2026-06-20',
    displayDate: '6/20 (六)',
    title: '狂吃傳奇早餐 ➜ 總鎮守朱印 ➜ 大正浪漫茶會 ➜ 雙星4047極準作戰',
    weather: { temp: '26°C', icon: 'sunny', aqi: 30, realData: false },
    locations: [
      {
        imageId: 'day5_1',
        type: 'food',
        time: '08:30',
        name: '進攻 Dormy Inn 傳奇早餐',
        note: '進攻現剁鰺魚刺身丼、長崎脆麵皿烏龍、現切長崎蛋糕！',
        desc: '狂吃飯店傳奇早餐。09:30 辦理 Check-out，將 4 個大行李箱拉至長崎車站寄物櫃鎖好，空手出發。',
        nav: '長崎駅',
        highlight: '鰺魚刺身丼無限吃',
        difficulty: '低',
      },
      {
        imageId: 'day5_2',
        type: 'sight',
        time: '10:30',
        name: '諏訪神社參拜',
        note: '長崎總鎮守，寫御朱印。',
        desc: '搭乘路面電車前往 諏訪神社 參拜。',
        nav: '諏訪神社',
        difficulty: '中 (部分階梯)',
      },
      {
        imageId: 'day5_3',
        type: 'food',
        time: '12:00',
        name: '靈魂老店: Café Sevilla 大正浪漫茶會',
        note: '預約號碼：A000913389。松翁軒二樓。',
        desc: '準時至【Café Sevilla】4名席報到。在玻璃窗前享用頂級五三燒長崎蛋糕配熱茶，悠閒看路面電車駛過。',
        nav: '松翁軒 本店',
        highlight: '金箔五三燒蛋糕',
        difficulty: '低',
      },
      {
        imageId: 'day5_4',
        type: 'sight',
        time: '13:50',
        name: '海鷗市場鐵道便當作戰 ＆ 取行李',
        note: '取回4個大行李箱，選購特產鐵道便當（駅弁）。',
        desc: '衝去「長崎街道海鷗市場」挑選厲害的在地便當與飲料，提早 20 分鐘抵達雙星 4047 月台。',
        nav: '長崎街道かもめ市場',
        difficulty: '中',
      },
      {
        imageId: 'day5_5',
        type: 'sight',
        time: '14:53',
        name: '重頭戲: 雙星 4047 觀光鐵道卡位戰',
        note: '由1號車廂上車秒塞大行李！衝2號共享車廂搶面海沙發座。',
        desc: '（長崎 ➜ 武雄溫泉）邊吃鐵道便當邊看無敵海景。「千綿站」下車暴動拍照 10 分鐘。',
        nav: '千綿駅',
        highlight: '雙星 4047 特級列車',
        difficulty: '中 (自然地面)',
      },
      {
        imageId: 'day5_6',
        type: 'transport',
        time: '17:54',
        name: '武雄溫泉 ➜ 佐賀減負移防',
        note: '原地月台轉乘特急列車（接力海鷗號），15分鐘直達佐賀。',
        desc: '省時省力直達佐賀站，入住 Comfort Hotel 佐賀放行李。',
        nav: 'Comfort Hotel Saga',
        difficulty: '零',
      },
      {
        imageId: 'day5_7',
        type: 'food',
        time: '19:00',
        name: '佐賀地雞晚餐 & 縣廳 360 燈光秀',
        note: '享用道地「三瀨雞串燒居酒屋」，配頂級名酒（如：鍋島）。',
        desc: '佐賀站周邊美食完美收尾，餐後步行前往欣賞佐賀縣廳 360 展望台燈光秀。',
        nav: '佐賀県庁',
        highlight: '三瀨雞串燒 × 鍋島清酒',
        difficulty: '低 (平地/座位多)',
      },
    ],
  },
  {
    day: 6,
    date: '2026-06-21',
    displayDate: '6/21 (日)',
    title: '最後伴手禮衝刺 ➜ 佐賀機場返台',
    weather: { temp: '24°C', icon: 'sunny', aqi: 30, realData: false },
    locations: [
      {
        imageId: 'day6_1',
        type: 'food',
        time: '08:30',
        name: '飯店免費自助早餐',
        note: '享受 Comfort Hotel 自助早餐。',
        desc: '享受 Comfort Hotel 免費自助早餐。',
        nav: 'Comfort Hotel Saga',
        difficulty: '低',
      },
      {
        imageId: 'day6_2',
        type: 'sight',
        time: '09:30',
        name: '最終大補貨: 佐賀工房',
        note: '退房後，在佐賀站內進行最後伴手禮大衝刺。',
        desc: '選購佐賀特產伴手禮。',
        nav: '佐賀工房',
        highlight: '伴手禮最終加碼',
        difficulty: '低',
      },
      {
        imageId: 'day6_3',
        type: 'transport',
        time: '10:00',
        name: '搭乘機場巴士直達佐賀機場',
        note: '於佐賀站巴士中心搭乘。',
        desc: '搭乘機場接駁巴士直達佐賀機場 (HSG)。',
        nav: '佐賀空港',
        difficulty: '低',
      },
      {
        imageId: 'day6_4',
        type: 'transport',
        time: '11:35',
        name: '搭乘虎航 IT247 班機返台',
        note: '13:10 抵達桃園機場，深度之旅圓滿結束！',
        desc: '準備回家囉！',
        nav: '桃園國際機場',
        difficulty: '低',
      },
    ],
  },
];
const USERS = ['佑任', '軒寶', '阿歪', '黃蔓'];

const DEFAULT_ITEMS = [
  '國際轉接插座220V(行前)',
  '過濾蓮蓬頭(行前)',
  'eSIM / 網卡(行前/入境)',
  '泰簽文件下載(行前)',
  '泰服搭配的鞋子',
  '乳液、凡士林',
  '防曬乳',
  '化妝品',
  '衣服、褲子',
  '睡衣',
  '內衣褲、襪子',
  '護照',
  '提款卡 (開國外提款)',
  '信用卡',
  '現金 (泰銖/台幣)',
  '牙膏、牙刷',
  '行李箱 (確認密碼)',
  '一般出門鞋子',
  '手機 & 充電器',
  '行動電源',
  '衛生紙/濕紙巾',
  '吹風機 (確認電壓)',
  '梳子',
  '旅行電熱壺',
  '暈車藥',
  '防蚊液',
  '身分證/健保卡',
  '國際駕照',
  '個人藥品',
  '雨傘/便利雨衣',
  '汽車導航架',
  '泳衣',
  '塑膠袋 (髒衣物用)',
  '沐浴乳/洗髮精',
  '數位相機/傳統相機/充電器/底片',
  '隱形眼鏡/藥水/器具',
  '眼鏡/眼鏡盒',
  '墨鏡',
  '刮鬍刀/刮鬍泡',
  '口罩(空汙)',
  '大象行程:毛巾/帽子/防蚊液/鞋子',
  '大象行程:換洗衣物/泳衣(建議)',
];
// ============================================
// 基礎工具資料配置 (2026 九州精準規格)
// ============================================
const UTILS_DATA = {
  flights: [
    {
      type: '去程',
      date: '6/16 (二)',
      flightNo: 'IT246',
      time: '06:55 - 10:35',
      airline: '台灣虎航',
      from: '台北',
      fromCode: 'TPE',
      fromTerminal: 'T1',
      to: '佐賀',
      toCode: 'HSG',
      toTerminal: '',
    },
    {
      type: '回程',
      date: '6/21 (日)',
      flightNo: 'IT247',
      time: '11:35 - 13:10',
      airline: '台灣虎航',
      from: '佐賀',
      fromCode: 'HSG',
      fromTerminal: '',
      to: '台北',
      toCode: 'TPE',
      toTerminal: 'T1',
    },
  ],
  accommodations: [
    {
      name: '豪斯登堡阿姆斯特丹酒店 (Hotel Amsterdam)',
      type: '歐風園區酒店',
      date: '6/16 (1晚)',
      address: '長崎県佐世保市ハウステンボス町1-1',
      phone: '+81-570-064-110',
      mapQuery: 'Hotel Amsterdam Huis Ten Bosch',
      note: '含飯店精緻早餐・豪華設計師四人房(一休預訂)',
    },
    {
      name: 'Dormy Inn PREMIUM 長崎站前',
      type: '溫泉市區連鎖飯店',
      date: '6/17 - 6/20 (3晚)',
      address: '長崎県長崎市五島町2-1',
      phone: '+81-95-820-5489',
      mapQuery: 'Dormy Inn PREMIUM Nagasaki Ekimae',
      note: '2間禁菸雙人房(官方預訂)・免費宵夜拉麵與傳奇早餐對策',
      airbnbUrl: '', // 保持結構一致
      guideUrl: '',
    },
    {
      name: 'Comfort Hotel 佐賀',
      type: '交通商務飯店',
      date: '6/20 - 6/21 (1晚)',
      address: '佐賀県佐賀市駅前中央1-14-38',
      phone: '+81-952-36-6311',
      mapQuery: 'Comfort Hotel Saga',
      note: '含飯店免費自助早餐・(skyticket預訂編號32006373)',
    },
  ],
  emergency: '日本警察通報: 110 \n火災/救護車: 119 \n台北駐日經濟文化代表處(福岡辦事處): +81-92-734-2810',
  notes: '🔥 2月是泰國燒山季，但我們六月在九州！注意防雨防海風。\n🚗 右駕左行，長崎山路多斜坡。',
  driveUrl: 'https://drive.google.com/drive/folders/1B7hzB79vrlLWe1-N7gOxVJrVRK9ho87i?usp=sharing',
};

// ============================================
// UIUX part - Miffy Neobrutalism Design
// ============================================

const WeatherHero = ({ isAdmin, versionText, updateVersion, onLock, showSecret, onHardRefresh, itinerary, setItinerary }) => {
  const [data, setData] = useState(null);
  const [aqi, setAqi] = useState(15);
  const [bannerText, setBannerText] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [secretLinks, setSecretLinks] = useState([]);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    const linksRef = ref(db, 'secretLinks');
    const unsubscribe = onValue(linksRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setSecretLinks(val);
      } else {
        const defaultLinks = [
          { name: '🚀 九州鐵道即時 JR 運行情報', url: 'https://www.jrkyushu.co.jp/trains/unkou.php' }
        ];
        setSecretLinks(defaultLinks);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddLink = () => {
    if (!newLinkName || !newLinkUrl) return alert("請輸入名稱和網址喔！");
    const newLinks = [...secretLinks, { name: newLinkName, url: newLinkUrl }];
    set(ref(db, 'secretLinks'), newLinks).then(() => {
      setNewLinkName('');
      setNewLinkUrl('');
    }).catch(() => alert("雲端同步失敗 🛜"));
  };

  const handleDeleteLink = (index) => {
    if (!window.confirm("確定要刪除這個傳送門嗎？")) return;
    const newLinks = secretLinks.filter((_, i) => i !== index);
    set(ref(db, 'secretLinks'), newLinks);
  };

  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=32.7503&longitude=129.8777&current=temperature_2m,weather_code,relative_humidity_2m&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,weather_code&forecast_days=16&timezone=Asia%2FTokyo'
      );
      const json = await res.json();
      let currentAqi = 15;
      let aqiSource = 'default';

      try {
        const waqiRes = await fetch(
          'https://api.waqi.info/feed/nagasaki/?token=6a1feb1b93b9f182f5ace9c2ffc8fdfc0e6e61c2'
        );
        const waqiData = await waqiRes.json();
        if (waqiData.status === 'ok' && waqiData.data?.aqi) {
          currentAqi = waqiData.data.aqi;
          aqiSource = 'WAQI';
        } else {
          throw new Error('WAQI API 回應異常');
        }
      } catch (waqiError) {
        console.warn('⚠️ WAQI 失敗，切換到 IQAir 備援...');
        try {
          const iqairRes = await fetch(
            'https://api.airvisual.com/v2/nearest_city?lat=32.7503&lon=129.8777&key=4743d035-1b8f-4a42-9ddf-66dee64f8b8a'
          );
          const iqairData = await iqairRes.json();
          if (iqairData.status === 'success' && iqairData.data?.current?.pollution) {
            currentAqi = iqairData.data.current.pollution.aqius;
            aqiSource = 'IQAir';
          }
        } catch (iqairError) {
          console.error('❌ 全部失敗，使用預設值');
          aqiSource = 'N/A';
        }
      }

      const cacheData = { weather: json, aqi: currentAqi, source: aqiSource, time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) };
      localStorage.setItem('cm_weather_cache', JSON.stringify(cacheData));
      setAqi(currentAqi);
      setLastUpdate(`${cacheData.time} (${aqiSource})`);

      if (json && json.current) {
        setData(json);
        if (json.daily && json.daily.time) {
          const forecastDates = json.daily.time;
          const maxTemps = json.daily.temperature_2m_max;
          const weatherCodes = json.daily.weather_code;
          const updatedItinerary = itinerary.map((day) => {
            const dateIndex = forecastDates.indexOf(day.date);
            if (dateIndex !== -1) {
              const code = weatherCodes[dateIndex];
              let iconStr = 'sunny';
              if (code >= 51) iconStr = 'rainy';
              else if ((code >= 1 && code <= 3) || code === 45 || code === 48) iconStr = 'cloudy';
              return { ...day, weather: { ...day.weather, temp: `${Math.round(maxTemps[dateIndex])}°C`, icon: iconStr, realData: true } };
            }
            return day;
          });
          setItinerary(updatedItinerary);
        }
        const currentHourInJp = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", hour: "numeric", hour12: false }).format(new Date()), 10);
        const next3HoursRain = json.hourly.precipitation_probability.slice(currentHourInJp, currentHourInJp + 3);
        const maxRainProb = Math.max(...next3HoursRain);
        let newAlerts = [];
        if (maxRainProb > 40) newAlerts.push({ type: 'rain', msg: `🌧️ 局部降雨機率 ${maxRainProb}%，攜帶雨具較安全！` });
        if (currentAqi > 100) newAlerts.push({ type: 'aqi', msg: `😷 AQI 數值偏高，戶外請戴口罩。` });
        setAlerts(newAlerts);
      }
    } catch (e) {
      const saved = localStorage.getItem('cm_weather_cache');
      if (saved) {
        const cache = JSON.parse(saved);
        setData(cache.weather);
        setAqi(cache.aqi);
        setLastUpdate(`${cache.time} (Offline)`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const jpTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
      const nowInJp = new Date(jpTimeStr);
      const startDate = new Date('2026-06-16T00:00:00');
      const endDate = new Date('2026-06-21T23:59:59');

      if (nowInJp < startDate) {
        const diff = startDate - nowInJp;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setBannerText(`✈️ 距離九州出發還有 ${days} 天！`);
      } else if (nowInJp > endDate) {
        setBannerText('👋 深度九州之旅結束了 QQ');
      } else {
        const diff = nowInJp - startDate;
        const dayNum = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
        if (dayNum >= 6) setBannerText('😭 旅程最後一天哭哭');
        else setBannerText(`🇯🇵 旅程第 ${dayNum} 天 (${dayNum}/6)`);
      }
    };
    calcTime();
    const timer = setInterval(calcTime, 60000);
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 20 * 60 * 1000);
    return () => { clearInterval(timer); clearInterval(weatherTimer); };
  }, []);

  const getWeatherIcon = (code, size = 20) => {
    if (code <= 1) return <Sun size={size} className="text-[#E8637A]" strokeWidth={2.5} />;
    if (code <= 3 || code === 45 || code === 48) return <Cloud size={size} className="text-[#2E5FA3]" strokeWidth={2.5} />;
    if (code >= 50) return <CloudRain size={size} className="text-[#4AABB8]" strokeWidth={2.5} />;
    return <CloudSun size={size} className="text-[#F5C842]" strokeWidth={2.5} />;
  };

  const getAqiColor = (val) => {
    if (val <= 50) return 'bg-[#4AABB8] text-white border-2 border-black';
    if (val <= 100) return 'bg-[#F5C842] text-black border-2 border-black';
    if (val <= 150) return 'bg-[#C06040] text-white border-2 border-black';
    return 'bg-[#E8637A] text-white border-2 border-black';
  };

  const getNext24Hours = () => {
    if (!data || !data.hourly || !data.hourly.time) return [];
    const currentHourIndex = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", hour: "numeric", hour12: false }).format(new Date()), 10);
    const startIndex = currentHourIndex + 1;
    const endIndex = startIndex + 24;
    return data.hourly.time.slice(startIndex, endIndex).map((t, i) => ({
      time: t.split('T')[1].slice(0, 5),
      temp: Math.round(data.hourly.temperature_2m[startIndex + i]),
      code: data.hourly.weather_code[startIndex + i],
      rain: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[startIndex + i] : 0,
    }));
  };
  const nextHours = getNext24Hours();

  return (
    <div className="relative bg-[#F5C842] dark:bg-stone-900 pt-0 pb-8 px-6 border-b-2 border-black rounded-b-[2.5rem] z-10 overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-colors duration-500">
      {bannerText && (
        <div className={`absolute top-0 left-0 right-0 py-1.5 z-20 shadow-[0_2px_0_0_rgba(0,0,0,1)] text-[10px] font-bold text-center border-b-2 border-black transition-colors duration-500
          ${bannerText.includes('結束') ? 'bg-[#2E5FA3] text-white' : 'bg-[#E8637A] text-white'}`}
        >
          {bannerText}
        </div>
      )}

      <button onClick={onLock} className="absolute top-0 right-0 z-30 h-[28px] w-[30px] flex items-center justify-center text-black hover:text-white transition-colors" title="鎖定畫面">
        <Lock size={12} strokeWidth={3} />
      </button>

      <div className="absolute top-[10px] right-[-20px] text-[6rem] font-serif font-black text-black opacity-10 select-none leading-none pointer-events-none tracking-tighter">
        Nagasaki
      </div>

      <div className="relative z-10 mt-10">
        {alerts.length > 0 && (
          <div className="mb-4 space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className="p-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)] animate-pulse border-2 border-black bg-[#4AABB8] text-white">
                <CloudRain size={16} strokeWidth={3} /> {alert.msg}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-[#2E5FA3] text-white text-[10px] font-bold tracking-wider rounded-full whitespace-nowrap border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                佑任・軒寶・阿歪・黃蔓
              </span>

              {isAdmin ? (
                <input type="text" value={versionText || ''} onChange={(e) => updateVersion(e.target.value)} className="w-16 bg-white border-2 border-black text-sm font-serif font-bold italic focus:outline-none text-center rounded-md" />
              ) : (
                <div className="flex items-center gap-1 ml-1 relative group">
                  <span className="text-xl font-bold text-black drop-shadow-sm tracking-wide ml-1.5 mt-0.5" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                    {versionText || '2026'}
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-serif font-black text-black tracking-tight leading-[1]">
              九州
              <br />
              <span className="text-[#E8637A]">生存戰</span>之旅
            </h1>
          </div>

          <div className="text-right flex-shrink-0 mt-2">
            <div onClick={fetchWeather} className="text-[10px] font-bold text-black mb-1 uppercase tracking-widest cursor-pointer border-b-2 border-black pb-0.5 inline-block">
              Nagasaki Now
            </div>

            {data ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-2 rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  {getWeatherIcon(data.current.weather_code, 36)}
                  <span className="text-5xl font-serif font-black text-black tracking-tighter">
                    {Math.round(data.current.temperature_2m)}°
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3">
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${getAqiColor(aqi)}`}>
                    <Wind size={10} strokeWidth={3} /> AQI {aqi}
                  </div>
                  <div className="text-xs text-black font-bold bg-white border-2 border-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    <Droplets size={10} strokeWidth={3} /> {data.current.relative_humidity_2m}%
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 cursor-pointer mt-2" onClick={fetchWeather}>
                  {lastUpdate && <span className="text-[10px] text-black font-bold font-mono tracking-tighter bg-white px-1 border-2 border-black">{lastUpdate}</span>}
                  <button disabled={isLoading} className="text-black bg-white border-2 border-black p-0.5 rounded-md shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                    <RefreshCw size={10} strokeWidth={3} className={isLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-pulse flex gap-2 items-center bg-white border-2 border-black p-3 rounded-2xl">
                <div className="w-8 h-8 bg-black rounded-full"></div>
                <div className="w-12 h-8 bg-black rounded"></div>
              </div>
            )}
          </div>
        </div>

        {data && nextHours.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="flex items-center">
              <div className="text-[10px] font-black text-black writing-vertical-rl border-l-2 pl-2 mr-3 border-black h-10 flex items-center justify-center tracking-widest flex-shrink-0"
              >FUTURE 24H</div>
              <div className="flex overflow-x-auto gap-4 pb-2 w-full no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {nextHours.map((h, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 min-w-[3.5rem] flex-shrink-0">
                    <span className="text-[10px] text-black font-bold whitespace-nowrap bg-[#F5C842] px-1 border-2 border-black rounded-sm">{h.time}</span>
                    <div className="py-1">{getWeatherIcon(h.code, 20)}</div>
                    <span className="text-sm font-black text-black">{h.temp}°</span>
                    {h.rain >= 0 && <span className="text-[9px] text-white bg-[#4AABB8] px-1 border-2 border-black font-bold rounded-sm shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{h.rain}%</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent('長崎 佐賀 2026 6月中旬 必吃美食與私房景點 歷史文化深度介紹 也請納入日本在地Tabelog與小紅書評價 以中文回答')}`, '_blank')}
          className="w-full mt-4 py-3 bg-white border-2 border-black rounded-2xl flex items-center justify-center gap-2 text-sm font-black text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all group"
        >
          <Sparkles size={16} strokeWidth={3} className="text-[#E8637A] group-hover:rotate-12 transition-transform" /> Ask AI (Perplexity 深度探索)
        </button>
      </div>
    </div>
  );
};

const FloatingStatus = ({ itinerary }) => {
  const [nextStop, setNextStop] = useState(null);

  useEffect(() => {
    const findNextStop = () => {
      const now = new Date();
      const allStops = [];
      itinerary.forEach((day) => {
        const dateStr = day.date;
        day.locations.forEach((loc) => {
          const timeMatch = loc.time.match(/(\d{1,2}):(\d{2})/);
          let stopTimeStr = `${dateStr}T23:59:00+09:00`;
          if (timeMatch) {
            const hh = timeMatch[1].padStart(2, '0');
            const mm = timeMatch[2].padStart(2, '0');
            stopTimeStr = `${dateStr}T${hh}:${mm}:00+09:00`;
          }
          const stopTime = new Date(stopTimeStr);
          allStops.push({ ...loc, fullDate: stopTime, dayTitle: day.title });
        });
      });

      const futureStops = allStops.filter((stop) => {
        const bufferTime = 20 * 60 * 1000;
        return new Date(stop.fullDate.getTime() + bufferTime) > now;
      });

      if (futureStops.length > 0) setNextStop(futureStops[0]);
      else setNextStop({ name: '旅程圓滿結束 🎉', time: 'See you next time!', nav: '', finished: true });
    };

    findNextStop();
    const timer = setInterval(findNextStop, 60000);
    return () => clearInterval(timer);
  }, [itinerary]);

  if (!nextStop) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30">
      <div className="bg-[#2E5FA3] text-white p-4 rounded-2xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] border-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black flex-shrink-0 ${nextStop.finished ? 'bg-[#F5C842]' : 'bg-[#E8637A] animate-pulse'}`}>
            {nextStop.finished ? <CheckCircle size={20} strokeWidth={3} /> : <Navigation size={20} strokeWidth={3} />}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-white uppercase tracking-wider font-bold mb-0.5 flex items-center gap-1 bg-black px-1.5 py-0.5 rounded-md shadow-[1px_1px_0_0_rgba(255,255,255,0.5)] w-max">
              {nextStop.finished ? 'COMPLETED' : 'COMING UP'} <Clock size={10} strokeWidth={3} />
            </div>
            <div className="font-bold text-sm truncate">{nextStop.name}</div>
            <div className="text-xs text-[#F5C842] font-bold truncate">{nextStop.time}</div>
          </div>
        </div>
        {nextStop.nav && (
          <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextStop.nav)}`, '_blank')} className="bg-[#F5C842] border-2 border-black p-2 rounded-xl text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all ml-2 flex-shrink-0">
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
};

const OutfitGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  if (!isOpen)
    return (
      <button onClick={() => setIsOpen(true)} className="mx-6 mt-6 bg-[#4AABB8] shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 text-white w-[calc(100%-3rem)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
      >
        <Info size={16} strokeWidth={3} className="text-white bg-black rounded-full" /> 查看初夏穿搭 & 爛腳等級說明
      </button>
    );

  return (
    <div className="mx-6 mt-6 bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative animate-fadeIn">
      <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-black hover:text-[#E8637A] transition-colors"><ChevronUp size={24} strokeWidth={3} /></button>
      <h3 className="flex items-center gap-2 font-serif font-black text-black text-lg mb-4">
        <Shirt size={20} strokeWidth={3} className="text-[#2E5FA3]" /> 6月日本九州穿搭指南
      </h3>
      <div className="space-y-4 text-sm font-bold text-black leading-relaxed mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-[#F5C842] p-2 rounded-xl border-2 border-black text-black flex-shrink-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"><Sun size={14} strokeWidth={3} /></div>
          <div><strong className="text-[#E8637A]">白天 (23-28°C)</strong><br />短袖舒適、梅雨季可能遇陣雨，隨身帶把摺疊傘。</div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-[#4AABB8] p-2 rounded-xl border-2 border-black text-white flex-shrink-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"><Wind size={14} strokeWidth={3} /></div>
          <div><strong className="text-[#2E5FA3]">海風與稻佐山夜景 (18-20°C)</strong><br />海邊與山頂展望台風大，體感稍冷，務必攜帶薄外套防風。</div>
        </div>
      </div>
      <div className="pt-4 border-t-2 border-black border-dashed">
        <h3 className="flex items-center gap-2 font-serif font-black text-black text-base mb-3">🦵 爛腳指數說明</h3>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <span className="bg-[#4AABB8] text-white border-2 border-black px-2 py-0.5 rounded font-black whitespace-nowrap">低 / 零</span>
            <span className="font-bold">全程坐車、特急列車、環境舒適。</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <span className="bg-[#F5C842] text-black border-2 border-black px-2 py-0.5 rounded font-black whitespace-nowrap">中</span>
            <span className="font-bold">一般步道景點參拜、有微斜坡、出島石板路。</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <span className="bg-[#E8637A] text-white border-2 border-black px-2 py-0.5 rounded font-black whitespace-nowrap">高 / 極高</span>
            <span className="font-bold">軍艦島廢墟爬坡、5.5小時連續血拼大戰。</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationCard = ({ item, day, index, isAdmin, updateTime, updateContent, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const BACKUP_IMAGE = 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?w=800&q=80';

  const getIcon = () => {
    switch (item.type) {
      case 'food': return <Utensils size={16} strokeWidth={3} className="text-[#C06040]" />;
      case 'transport': return <Car size={16} strokeWidth={3} className="text-[#2E5FA3]" />;
      default: return <MapPin size={16} strokeWidth={3} className="text-[#4AABB8]" />;
    }
  };

  const getDifficultyColor = (diff) => {
    if (!diff) return 'bg-white text-black border-2 border-black';
    if (diff.includes('低') || diff.includes('零')) return 'bg-[#4AABB8] text-white border-2 border-black';
    if (diff.includes('中')) return 'bg-[#F5C842] text-black border-2 border-black';
    return 'bg-[#E8637A] text-white border-2 border-black';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert('圖片請小於 2MB 🐹');
      const reader = new FileReader();
      reader.onloadend = () => { updateContent('imageId', reader.result); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div onClick={() => setIsExpanded(!isExpanded)} className={`bg-white rounded-2xl border-2 border-black mb-4 overflow-hidden transition-all duration-300 cursor-pointer ${isExpanded ? 'shadow-[6px_6px_0_0_rgba(0,0,0,1)] -translate-y-1' : 'shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}>
      <div className={`p-4 flex items-start gap-4 ${isExpanded ? 'bg-[#F5C842]' : 'bg-white'} transition-colors`}>
        <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {isAdmin ? (
              <input type="time" value={item.time ? item.time.substring(0, 5) : ''} onClick={(e) => e.stopPropagation()} onChange={(e) => updateTime(day, index - 1, e.target.value)} className="bg-white text-[14px] font-black border-2 border-black focus:outline-none px-1 h-7 font-mono rounded" />
            ) : (
              <span className="text-[12px] font-black text-black font-mono uppercase tracking-wide bg-white px-2 border-2 border-black rounded-md shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{item.time}</span>
            )}

            {isAdmin ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input type="text" value={item.difficulty || ''} onChange={(e) => updateContent('difficulty', e.target.value)} className="text-[10px] bg-white border-2 border-black font-bold rounded px-2 py-0.5 w-24" placeholder="自訂難度" />
                <select onChange={(e) => { if (e.target.value) updateContent('difficulty', e.target.value); }} className="w-4 h-6 bg-transparent text-black outline-none cursor-pointer">
                  <option value="">☰</option>
                  <option value="低 (環境舒適)">🟢 低</option>
                  <option value="中 (石板路/斜坡)">🟡 中</option>
                  <option value="高 (軍艦島攀爬)">🟠 高</option>
                </select>
              </div>
            ) : (
              item.difficulty && <span className={`text-[10px] px-2 py-0.5 rounded-md font-black shadow-[1px_1px_0_0_rgba(0,0,0,1)] ${getDifficultyColor(item.difficulty)}`}>{item.difficulty}</span>
            )}
            {item.highlight && <span className="text-[10px] px-2 py-0.5 rounded-md border-2 border-black bg-[#E8637A] text-white font-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]">★ {item.highlight}</span>}
          </div>

          {isAdmin ? (
            <input type="text" value={item.name} onClick={(e) => e.stopPropagation()} onChange={(e) => updateContent('name', e.target.value)} className="w-full font-black text-lg text-black bg-white border-2 border-black focus:outline-none px-2 mb-1 rounded-md" placeholder="輸入地點名稱..." />
          ) : (
            <h3 className="font-black text-black text-lg leading-tight mb-1 pr-2">{item.name}</h3>
          )}

          {isAdmin ? (
            <input type="text" value={item.note} onClick={(e) => e.stopPropagation()} onChange={(e) => updateContent('note', e.target.value)} className="w-full text-sm font-bold text-black bg-white border-2 border-black focus:outline-none px-2 py-1 rounded-md" placeholder="輸入簡短備註..." />
          ) : (
            <p className="text-sm text-black font-bold leading-relaxed">{item.note}</p>
          )}
        </div>
        <div className="mt-8 text-black bg-white border-2 border-black rounded-full p-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex-shrink-0">{isExpanded ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}</div>
      </div>

      {isExpanded && (
        <div className="animate-fadeIn border-t-2 border-black">
          <div className="w-full h-48 overflow-hidden relative bg-black border-b-2 border-black">
            <img src={hasError ? BACKUP_IMAGE : getLocationImage(item.imageId)} alt={item.name} decoding="async" onLoad={() => setIsImageLoaded(true)} onError={() => setHasError(true)} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-[10px] flex flex-col gap-2 font-mono font-bold">
              <div className="flex items-center gap-1 bg-black w-max px-2 py-0.5 rounded border border-white"><Camera size={10} /> {isAdmin ? '編輯圖片來源' : 'Image for reference'}</div>
              {isAdmin && (
                <div className="flex flex-col gap-1 bg-white p-2 rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
                  <input className="bg-white text-black text-[10px] font-bold w-full px-2 py-1 border-2 border-black rounded" value={item.imageId || ''} onChange={(e) => updateContent('imageId', e.target.value)} placeholder="貼上網址..." />
                  <label className="bg-[#2E5FA3] text-white text-[10px] font-bold px-2 py-1 rounded border-2 border-black cursor-pointer w-max shadow-[1px_1px_0_0_rgba(0,0,0,1)]"><Upload size={10} className="inline mr-1" strokeWidth={3} />上傳照片<input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} /></label>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 bg-white">
            <div className="mb-5">
              <h4 className="text-sm font-black text-black mb-2 flex items-center gap-2 uppercase tracking-wider bg-[#F5C842] w-max px-2 py-1 rounded-md border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"><Info size={16} strokeWidth={3} /> 導遊作戰故事環境</h4>
              {isAdmin ? (
                <div onClick={(e) => e.stopPropagation()} className="space-y-3 mt-3">
                  <textarea value={item.desc} onChange={(e) => updateContent('desc', e.target.value)} className="w-full font-bold text-sm text-black bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl p-3 min-h-[100px]" placeholder="輸入詳細介紹..." />
                  <div className="flex items-center gap-2 bg-white p-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl"><span className="text-xs font-black text-black bg-[#4AABB8] text-white px-2 py-1 rounded border-2 border-black">導航:</span><input type="text" value={item.nav || ''} onChange={(e) => updateContent('nav', e.target.value)} className="flex-1 font-bold text-sm focus:outline-none" placeholder="Google Maps 關鍵字" /></div>
                </div>
              ) : (
                <p className="text-sm text-black leading-relaxed text-justify whitespace-pre-line font-bold bg-[#4AABB8]/10 p-4 rounded-xl border-2 border-black mt-3 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">{item.desc || '暫無詳細介紹，但這裡絕對值得一去！'}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.nav)}`, '_blank'); }} className="flex items-center justify-center gap-2 py-3 bg-[#E8637A] border-2 border-black text-white rounded-xl active:translate-y-[2px] active:translate-x-[2px] active:shadow-none text-sm font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all">
                <Navigation size={18} strokeWidth={3} /> 導航前往
              </button>
              <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent('日本長崎景點介紹 與旅行隱藏玩法 ' + item.name)}`, '_blank'); }} className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-black text-black rounded-xl active:translate-y-[2px] active:translate-x-[2px] active:shadow-none text-sm font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all">
                <Sparkles size={18} strokeWidth={3} className="text-[#2E5FA3]" /> 問問 AI
              </button>
            </div>
            {isAdmin && (
              <div className="mt-5 pt-4 border-t-2 border-black border-dashed flex justify-between items-center">
                <div className="flex gap-3">
                  <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-2 bg-[#F5C842] border-2 border-black rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50 font-black">⬆️</button>
                  <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-2 bg-[#F5C842] border-2 border-black rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50 font-black">⬇️</button>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="px-4 py-2 rounded-xl bg-black text-white font-black text-xs shadow-[2px_2px_0_0_rgba(0,0,0,1)]">🗑️ 刪除</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DayCard = ({ dayData, isOpen, toggle, isAdmin, updateTime, updateContent, onAdd, onDelete, onMove }) => {
  const cardRef = useRef(null);
  const smoothScrollTo = (element, duration = 10) => {
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - 120;
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const ease = (t, b, c, d) => { t /= d; t--; return -c * (t * t * t * t - 1) + b; };
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
  };

  useEffect(() => {
    if (isOpen && cardRef.current) setTimeout(() => { smoothScrollTo(cardRef.current, 10); }, 50);
  }, [isOpen]);

  return (
    <div ref={cardRef} className="mb-4 px-2">
      <div onClick={toggle} className={`relative flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 border-black ${isOpen ? 'bg-[#2E5FA3] text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] -translate-y-1' : 'bg-white text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}>
        <div className="flex items-center gap-4">
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${isOpen ? 'bg-[#F5C842] text-black' : 'bg-white'}`}>
            <span className="text-[10px] font-black uppercase">Day</span>
            <span className="text-2xl font-serif font-black">{dayData.day}</span>
          </div>
          <div>
            <div className={`text-xs font-black mb-1 px-2 py-0.5 rounded-md border-2 border-black w-max shadow-[1px_1px_0_0_rgba(0,0,0,1)] ${isOpen ? 'bg-white text-black' : 'bg-[#E8637A] text-white'}`}>{dayData.displayDate}</div>
            <div className="font-black text-lg leading-tight">{dayData.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-2 bg-white px-2 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)] text-black">
            {dayData.weather.realData && (
              <>
                {dayData.weather.icon === 'sunny' && <Sun size={14} className="text-[#E8637A]" strokeWidth={3} />}
                {dayData.weather.icon === 'cloudy' && <Cloud size={14} className="text-[#2E5FA3]" strokeWidth={3} />}
                {dayData.weather.icon === 'rainy' && <CloudRain size={14} className="text-[#4AABB8]" strokeWidth={3} />}
              </>
            )}
            <span className="text-sm font-black">{dayData.weather.temp}</span>
          </div>
          <div className={`inline-block p-1 bg-white rounded-full border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)] ${isOpen ? 'text-black' : 'text-black'}`}>
            {isOpen ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pl-4 border-l-4 border-black space-y-5 pb-4 animate-fadeIn ml-4">
          {dayData.locations.map((loc, idx) => (
            <LocationCard
              key={idx} item={loc} day={dayData.day} index={idx + 1} isAdmin={isAdmin}
              updateTime={(d, l, t) => updateTime(d, idx, t)} updateContent={(field, val) => updateContent(dayData.day, idx, field, val)}
              onDelete={() => onDelete(idx)} onMoveUp={() => onMove(idx, -1)} onMoveDown={() => onMove(idx, 1)} isFirst={idx === 0} isLast={idx === dayData.locations.length - 1}
            />
          ))}
          {isAdmin && (
            <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="w-full py-4 bg-white border-2 border-black border-dashed rounded-xl text-black font-black flex items-center justify-center gap-2 hover:bg-[#F5C842] shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all text-lg">+ 新增行程</button>
          )}
        </div>
      )}
    </div>
  );
};

const FlightCard = ({ type, date, flightNo, time, airline, from, to, fromCode, toCode, fromTerminal, toTerminal }) => {
  const searchUrl = `https://www.google.com/search?q=${flightNo}+flight+status`;
  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-4 relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#4AABB8]/20 rounded-bl-full -mr-4 -mt-4 border-b-2 border-l-2 border-black z-0"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <span className={`px-3 py-1 rounded-md text-[10px] font-black tracking-wider border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${type === '去程' ? 'bg-[#E8637A] text-white' : 'bg-[#F5C842] text-black'}`}>{type}</span>
          <span className="text-xs font-black text-black bg-white px-2 py-1 rounded-md border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{date}</span>
        </div>

        <div className="flex justify-between items-center mb-5">
          <div className="text-center min-w-[4rem]">
            <div className="text-2xl font-black text-black leading-none mb-2">{from}</div>
            <div className="flex flex-col items-center">
              <span className="text-[12px] text-black font-black tracking-widest bg-white border-2 border-black px-2 rounded-sm shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{fromCode}</span>
              {fromTerminal && <span className="mt-2 text-[10px] font-black text-white bg-[#2E5FA3] px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{fromTerminal}</span>}
            </div>
          </div>
          <div className="flex-1 px-4 flex flex-col items-center">
            <div className="text-sm font-black text-black mb-2">{flightNo}</div>
            <div className="w-full h-[4px] bg-black relative rounded-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                <Plane size={16} strokeWidth={3} className="text-[#E8637A] rotate-90" />
              </div>
            </div>
            <div className="text-sm font-black text-black mt-3 whitespace-nowrap bg-[#F5C842] px-2 rounded-md border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{time}</div>
          </div>
          <div className="text-center min-w-[4rem]">
            <div className="text-2xl font-black text-black leading-none mb-2">{to}</div>
            <div className="flex flex-col items-center">
              <span className="text-[12px] text-black font-black tracking-widest bg-white border-2 border-black px-2 rounded-sm shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{toCode}</span>
              {toTerminal && <span className="mt-2 text-[10px] font-black text-white bg-[#4AABB8] px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]">{toTerminal}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t-2 border-black border-dashed">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-black"></div>
            <span className="text-sm text-black font-black">{airline}</span>
          </div>
          <a href={searchUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-black text-white bg-black px-4 py-2 rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
            即時動態 <ArrowRight size={14} strokeWidth={3} />
          </a>
        </div>
      </div>
    </div>
  );
};

const CurrencySection = ({ isAdmin, isMember }) => {
  const [rate, setRate] = useState(4.65);
  const [twd, setTwd] = useState('');
  const [jpy, setJpy] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const savedRate = localStorage.getItem('cm_exchange_rate');
    const savedRateTime = localStorage.getItem('cm_exchange_time');
    if (savedRate) { setRate(parseFloat(savedRate)); setLastUpdate(savedRateTime + ' (離線)'); }

    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/TWD');
        const data = await res.json();
        if (data?.rates?.JPY) {
          setRate(data.rates.JPY);
          const newTime = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
          setLastUpdate(newTime);
          localStorage.setItem('cm_exchange_rate', data.rates.JPY);
          localStorage.setItem('cm_exchange_time', newTime);
        }
      } catch (e) { console.log('匯率連線異常'); }
    };
    fetchRate();
  }, []);

  return (
    <section className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-6">
      <h3 className="flex items-center gap-2 font-serif font-black text-black mb-5 border-b-2 border-black pb-3 text-lg"><Wallet size={20} strokeWidth={3} className="text-[#C06040]" /> 匯率換算</h3>
      <div className="bg-[#4AABB8]/20 p-5 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
        <div className="text-xs text-black font-black mb-3 flex justify-between bg-white px-2 py-1 rounded border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]"><span>即時基準：1 TWD ≈ {rate} JPY</span><span>{lastUpdate}</span></div>
        <div className="flex items-center gap-3">
          <input type="number" value={twd} onChange={(e) => { setTwd(e.target.value); setJpy(e.target.value ? (parseFloat(e.target.value) * rate).toFixed(0) : ''); }} placeholder="台幣 TWD" className="w-full p-3 rounded-xl border-2 border-black bg-white outline-none focus:bg-[#F5C842] font-black text-black text-lg shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] transition-colors" />
          <span className="text-black font-black text-2xl">=</span>
          <input type="number" value={jpy} onChange={(e) => { setJpy(e.target.value); setTwd(e.target.value ? (parseFloat(e.target.value) / rate).toFixed(1) : ''); }} placeholder="日幣 JPY" className="w-full p-3 rounded-xl border-2 border-black bg-white outline-none focus:bg-[#E8637A] focus:text-white font-black text-black focus:placeholder:text-white text-lg shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] transition-colors" />
        </div>
      </div>
    </section>
  );
};

const GuidePage = ({ isAdmin, isMember, noticeText, updateNoticeText }) => {
  const [showPickyEater, setShowPickyEater] = useState(false);
  const [sharedStores, setSharedStores] = useState([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreUrl, setNewStoreUrl] = useState('');
  const [newStoreNote, setNewStoreNote] = useState('');
  const [showTaxRefund, setShowTaxRefund] = useState(false);
  const [adderName, setAdderName] = useState('佑任');

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'sharedStores'), (snapshot) => {
      if (snapshot.val()) setSharedStores(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  const handleAddStore = () => {
    if (!newStoreName.trim()) return;
    const finalUrl = newStoreUrl.trim() ? newStoreUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newStoreName)}`;
    const newList = [...sharedStores, { name: newStoreName, url: finalUrl, note: newStoreNote, adder: adderName }];
    set(ref(db, 'sharedStores'), newList).then(() => { setNewStoreName(''); setNewStoreUrl(''); setNewStoreNote(''); });
  };

  const pickyItems = [
    { en: 'No Raw Fish', th: '生魚・刺身NG', zh: '不吃生魚片' },
    { en: 'No Beef', th: '牛肉NG', zh: '不吃牛肉' },
    { en: 'No Coriander', th: 'パクチーNG', zh: '不加香菜' },
  ];

  const guideSections = [
    { title: '喫茶店地圖', icon: <Coffee strokeWidth={3} className="text-white" />, desc: '1946年創業珈琲冨士男、長崎老宅復古喫茶文化巡禮。', color: 'bg-[#C06040]', mapUrl: 'https://maps.app.goo.gl/nagasaki-cafe', aiQuery: '長崎老宅喫茶店推薦2026 以中文回答' },
    { title: '必吃清單', icon: <UtensilsCrossed strokeWidth={3} className="text-white" />, desc: '長崎強棒麵、角煮饅頭、A5和牛燒肉，沒吃到不算來過長崎。', color: 'bg-[#E8637A]', mapUrl: 'https://maps.app.goo.gl/nagasaki-food', aiQuery: '長崎必吃美食推薦2026 以中文回答' },
    { title: '甜點清單', icon: <IceCream strokeWidth={3} className="text-white" />, desc: '金箔五三燒長崎蛋糕、各式和菓子老鋪與網美咖啡甜點。', color: 'bg-[#F5C842]', mapUrl: 'https://maps.app.goo.gl/nagasaki-sweets', aiQuery: '長崎甜點推薦2026 以中文回答', iconBg: 'bg-black' },
    { title: '微醺音樂酒吧', icon: <Beer strokeWidth={3} className="text-white" />, desc: '思案橋不夜城、出島 Wharf 海景居酒屋，長崎夜晚的靈魂。', color: 'bg-[#2E5FA3]', mapUrl: 'https://maps.app.goo.gl/nagasaki-bar', aiQuery: '長崎居酒屋酒吧推薦2026 以中文回答' },
    { title: '購物商舖', icon: <ShoppingBag strokeWidth={3} className="text-white" />, desc: '濱町觀光通、3COINS plus、海鷗市場免稅血拼完全攻略。', color: 'bg-[#4AABB8]', mapUrl: 'https://maps.app.goo.gl/nagasaki-shopping', aiQuery: '長崎購物免稅推薦2026 以中文回答' },
  ];

  return (
    <div className="p-6 space-y-6 pb-24 animate-fadeIn">
      <section>
        <div className="bg-white border-2 border-black rounded-[2rem] p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-4 text-black font-black text-sm uppercase tracking-widest bg-[#F5C842] w-max px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"><Pin size={16} strokeWidth={3} className="rotate-45" /> 團隊重要通知公佈欄</div>
          {isAdmin ? (
            <textarea value={noticeText} onChange={(e) => updateNoticeText(e.target.value)} className="w-full bg-[#FDFBF7] border-2 border-black rounded-2xl p-4 text-sm font-bold min-h-[100px] outline-none shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] focus:border-[#E8637A]" />
          ) : (
            <div className="text-sm text-black font-bold leading-relaxed whitespace-pre-line p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)]">{noticeText}</div>
          )}
        </div>
      </section>

      <section>
        <button onClick={() => setShowPickyEater(!showPickyEater)} className="w-full bg-[#E8637A] text-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-between active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"><Ban size={20} strokeWidth={3} /></div>
            <div className="font-black text-base">挑食避雷救援卡 (日本餐廳出示)</div>
          </div>
          <div className="bg-white text-black rounded-full border-2 border-black p-1">
            {showPickyEater ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
          </div>
        </button>
        {showPickyEater && (
          <div className="mt-4 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden">
            <div className="divide-y-2 divide-black">
              {pickyItems.map((item, i) => (
                <div key={i} className="px-5 py-4 flex justify-between items-center hover:bg-[#FDFBF7]">
                  <div className="flex flex-col"><span className="text-[10px] text-black bg-[#F5C842] border-2 border-black px-1.5 rounded-sm w-max font-black shadow-[1px_1px_0_0_rgba(0,0,0,1)] mb-1">{item.en}</span><span className="font-black text-black text-sm">{item.zh}</span></div>
                  <div className="text-right"><span className="text-xl font-black text-[#E8637A] font-serif border-b-2 border-black">{item.th}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-5">
        {guideSections.map((section, idx) => (
          <div key={idx} className={`p-6 rounded-[2rem] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${section.color} text-white`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 ${section.iconBg || 'bg-black'} rounded-2xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]`}>{section.icon}</div>
              <h3 className="text-xl font-serif font-black">{section.title}</h3>
            </div>
            <p className="text-sm font-bold mb-6 bg-white/20 p-3 rounded-xl border border-white/40">{section.desc}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.open(section.mapUrl, '_blank')}
                className="flex items-center justify-center gap-2 py-3 bg-black text-white border-2 border-black rounded-xl text-sm font-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <MapPin size={16} strokeWidth={3} /> 開啟清單
              </button>
              <button
                onClick={() => window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent('長崎 ' + section.aiQuery)}`, '_blank')}
                className="flex items-center justify-center gap-2 py-3 bg-white text-black border-2 border-black rounded-xl text-sm font-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <Sparkles size={16} strokeWidth={3} className="text-[#2E5FA3]" /> 問問 AI
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};





// ============================================================
// ✂️ 從這裡接 Gemini 停掉的地方：UtilsPage 的 Settings icon 之後
// 完整補完 UtilsPage、KyushuTips、PackingPage、BackToTop、TravelApp
// ============================================================

// ── 接回 UtilsPage 內部，從 Settings size={20} strokeWidth={3} 接上 ──
// 原本是:  <Settings size={20} strokeWidth={3} （斷在這）

const UtilsPage = ({ isAdmin, isMember, systemInfo, updateSystemInfo }) => {
  const handleAppDownload = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.open('https://itunes.apple.com/eg/app/safety-tips/id858357174?mt=8', '_blank');
    } else {
      window.open('https://play.google.com/store/apps/details?id=jp.co.rcsc.safetyTips.android&hl=en', '_blank');
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24 bg-[#FDFBF7]">
      <h2 className="text-3xl font-serif font-black text-black border-b-4 border-black pb-3">實用工具及資訊</h2>

      {/* 管理員設定 */}
      {isAdmin && (
        <section className="bg-black p-6 rounded-2xl border-2 border-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <h3 className="flex items-center gap-2 font-black text-[#F5C842] mb-4 border-b-2 border-white/20 pb-3 text-lg">
            <Settings size={20} strokeWidth={3} /> 管理端設定
          </h3>
          <input
            type="text"
            value={systemInfo || ''}
            onChange={(e) => updateSystemInfo(e.target.value)}
            className="w-full bg-[#1a1a1a] border-2 border-[#F5C842] rounded-xl px-4 py-3 text-sm text-[#F5C842] font-black focus:outline-none focus:border-white"
          />
        </section>
      )}

      {/* Lightsplit 分帳 */}
      {isMember && (
        <section className="bg-[#4AABB8] p-6 rounded-2xl border-2 border-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full border-2 border-white/20"></div>
          <h3 className="flex items-center gap-2 font-black text-white mb-2 text-lg">
            <Wallet size={20} strokeWidth={3} /> 公款記帳與分帳
          </h3>
          <p className="text-white font-bold text-sm mb-5 bg-white/20 p-3 rounded-xl border border-white/30">
            所有公費支出請統一記錄，系統自動結算每人應付金額。
          </p>
          <a
            href="https://liff.line.me/1655320992-Y8GowEpw/g/t6Tf4q8GCMHz2D3YgoWyMX"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 rounded-xl font-black border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-sm"
          >
            開啟 Lightsplit 分帳群組 <ArrowRight size={16} strokeWidth={3} />
          </a>
        </section>
      )}

      {/* 航班資訊 */}
      <section className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <h3 className="flex items-center gap-2 font-black text-black mb-5 border-b-2 border-black pb-3 text-lg">
          <Plane size={20} strokeWidth={3} className="text-[#2E5FA3]" /> 航班詳細資訊
        </h3>
        {UTILS_DATA.flights.map((f, i) => <FlightCard key={i} {...f} />)}
        {isMember && (
          <a
            href={UTILS_DATA.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 mt-4 rounded-xl bg-[#2E5FA3] text-white font-black border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-sm"
          >
            <Info size={16} strokeWidth={3} /> 開啟電子機票 / 各種憑證
          </a>
        )}
      </section>

      {/* 住宿導航 */}
      <section className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <h3 className="flex items-center gap-2 font-black text-black mb-5 border-b-2 border-black pb-3 text-lg">
          <Home size={20} strokeWidth={3} className="text-[#C06040]" /> 住宿飯店導航
        </h3>
        <div className="space-y-4">
          {UTILS_DATA.accommodations.map((acc, idx) => (
            <div key={idx} className="bg-[#FDFBF7] rounded-2xl p-5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] text-black font-black bg-[#4AABB8] text-white px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)] inline-block mb-1">{acc.type}</span>
                  <h4 className="font-black text-black text-base leading-tight">{acc.name}</h4>
                </div>
                <span className="text-xs font-black bg-[#F5C842] text-black px-2 py-1 rounded-md border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)] whitespace-nowrap ml-2">{acc.date}</span>
              </div>
              <p className="text-xs text-black font-bold mb-4 bg-white p-2 rounded-lg border-2 border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
                <MapPin size={10} className="inline mr-1" strokeWidth={3} />{acc.address}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(acc.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-[#E8637A] text-white border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                >
                  <Navigation size={14} strokeWidth={3} /> 導航
                </a>
                <a
                  href={`tel:${acc.phone}`}
                  className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-black text-black rounded-xl text-xs font-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                >
                  <Phone size={14} strokeWidth={3} /> 聯絡
                </a>
              </div>
            </div>
          ))}
        </div>
        {(isAdmin || isMember) && (
          <a
            href={UTILS_DATA.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 mt-4 rounded-xl bg-[#C06040] text-white font-black border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-sm"
          >
            <Info size={16} strokeWidth={3} /> 查看住宿憑證
          </a>
        )}
      </section>

      {/* 旅行必備 App */}
      <section className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <h3 className="flex items-center gap-2 font-black text-black mb-5 border-b-2 border-black pb-3 text-lg">
          <Smartphone size={20} strokeWidth={3} className="text-[#2E5FA3]" /> 旅行必備 App
        </h3>
        <div className="space-y-3">
          <a
            href="https://studio--studio-9206745680-de144.us-central1.hosted.app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-2xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            <div>
              <div className="font-black text-black text-sm">DIGEST 菜單翻譯</div>
              <div className="text-[10px] text-black font-bold bg-[#4AABB8] text-white px-1.5 py-0.5 rounded-md border border-black mt-1 w-max">拍照即時翻譯日文菜單</div>
            </div>
            <div className="bg-[#E8637A] border-2 border-black rounded-xl p-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <ArrowRight size={18} strokeWidth={3} className="text-white" />
            </div>
          </a>

          <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-2xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <div>
              <div className="font-black text-black text-sm">ecbo cloak 行李寄放</div>
              <div className="text-[10px] font-bold mt-1">找附近寄放行李的店家</div>
            </div>
            <div className="flex gap-2">
              <a
                href="https://apps.apple.com/tw/app/ecbo-cloak-%E6%97%A5%E6%9C%AC%E5%AF%84%E7%89%A9%E6%9C%8D%E5%8B%99/id1443707795"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-black bg-[#2E5FA3] text-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] transition-all"
              >iOS</a>
              <a
                href="https://play.google.com/store/apps/details?id=io.ecbo.cloak&pcampaignid=web_share"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-black bg-[#4AABB8] text-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] transition-all"
              >Android</a>
            </div>
          </div>
        </div>
      </section>

      {/* 緊急救援中心 */}
      <section className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <h3 className="flex items-center gap-2 font-black text-[#E8637A] mb-5 border-b-2 border-black pb-3 text-lg">
          <AlertCircle size={20} strokeWidth={3} /> 緊急救援中心
        </h3>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <a href="tel:110" className="bg-[#E8637A] border-2 border-black p-4 rounded-2xl flex flex-col items-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
              <span className="text-4xl font-black text-white leading-none">110</span>
              <span className="text-xs font-black text-white mt-1 bg-black px-2 py-0.5 rounded-md">警察報案</span>
            </a>
            <a href="tel:119" className="bg-[#E8637A] border-2 border-black p-4 rounded-2xl flex flex-col items-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
              <span className="text-4xl font-black text-white leading-none">119</span>
              <span className="text-xs font-black text-white mt-1 bg-black px-2 py-0.5 rounded-md">救護車/火災</span>
            </a>
          </div>

          <div className="bg-black rounded-2xl p-5 border-2 border-black text-white space-y-3">
            <div
              onClick={handleAppDownload}
              className="bg-[#F5C842] rounded-xl p-4 flex items-center gap-3 cursor-pointer border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all group"
            >
              <div className="bg-black border-2 border-black rounded-xl p-2 flex-shrink-0">
                <Smartphone size={20} strokeWidth={3} className="text-[#F5C842]" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black text-black uppercase tracking-widest">必備救命工具</div>
                <div className="font-black text-black text-sm">下載 Japan Safety Tips</div>
                <div className="text-[10px] text-black font-bold">地震海嘯警報・多國語言緊急通知</div>
              </div>
              <ArrowRight size={16} strokeWidth={3} className="text-black" />
            </div>

            <div className="space-y-0 divide-y divide-white/10">
              {[
                { label: '🇹🇼 駐日辦事處 (福岡)', phone: '+81-92-734-2810', href: 'tel:+81927342810', color: 'text-[#F5C842]' },
                { label: '🇹🇼 駐日辦事處 (急難)', phone: '+81-92-734-2810', href: 'tel:+81927342810', color: 'text-[#E8637A]' },
                { label: '👮 警察 (Police)', phone: '110', href: 'tel:110', color: 'text-white' },
                { label: '🚑 救護車/火災', phone: '119', href: 'tel:119', color: 'text-white' },
                { label: '💳 Visa 掛失', phone: '0053-111-0001', href: 'tel:00531110001', color: 'text-[#4AABB8]' },
                { label: '💳 JCB 掛失', phone: '0053-111-0011', href: 'tel:00531110011', color: 'text-[#4AABB8]' },
                { label: '💳 Mastercard 掛失', phone: '0053-111-0086', href: 'tel:00531110086', color: 'text-[#4AABB8]' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3">
                  <span className="text-sm text-white/80 font-bold">{item.label}</span>
                  <a href={item.href} className={`${item.color} font-black text-sm bg-white/10 px-2 py-0.5 rounded-lg border border-white/20`}>{item.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CurrencySection isAdmin={isAdmin} isMember={isMember} />
    </div>
  );
};

// ============================================================
// KyushuTips — 展開式作戰警告區塊
// ============================================================
const KyushuTips = ({ onTrigger }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mx-6 mt-6 mb-6">
      <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 bg-[#F5C842] text-black font-black border-b-2 border-black hover:bg-[#E8637A] hover:text-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-black rounded-xl p-2 border-2 border-black">
              <AlertCircle size={18} strokeWidth={3} className="text-[#F5C842]" />
            </div>
            <span className="text-base font-black">2026 九州作戰天候防範禁忌</span>
          </div>
          <div className="bg-white border-2 border-black rounded-full p-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            {isOpen ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
          </div>
        </button>

        {isOpen && (
          <div className="p-5 space-y-4 bg-white">
            <div className="flex gap-3 bg-[#FDFBF7] p-4 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <div className="min-w-[36px] h-9 bg-[#2E5FA3] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap size={16} strokeWidth={3} className="text-[#F5C842]" />
              </div>
              <div>
                <strong className="text-black font-black block mb-1">行動電源攜帶鐵律</strong>
                <ul className="list-disc pl-4 text-xs text-black font-bold space-y-1">
                  <li>手提行動電源<span className="text-[#E8637A] font-black">絕對嚴禁託運</span>，必須隨身攜帶。</li>
                  <li>依虎航規範，嚴禁放置頭頂置物櫃，必須放在前方座位下方。</li>
                </ul>
              </div>
            </div>

            <div
              className="flex gap-3 bg-[#E8637A]/10 p-4 rounded-xl border-2 border-[#E8637A] shadow-[2px_2px_0_0_rgba(0,0,0,1)] cursor-pointer active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              onClick={onTrigger}
            >
              <div className="min-w-[36px] h-9 bg-[#E8637A] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} strokeWidth={3} className="text-white" />
              </div>
              <div>
                <strong className="text-black font-black block">軍艦島風浪備對策</strong>
                <p className="text-xs text-black font-bold mt-1">若 Day 3 因外海浪大無法登島，立刻啟動備案改往出島深度慢遊。當天全團嚴禁吃早餐防劇烈嘔吐！</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// PackingPage — 行李準備清單
// ============================================================
const PackingPage = ({ isKonamiActive, isAdmin, isMember, onSecretTrigger }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [packingData, setPackingData] = useState({});
  const [newItem, setNewItem] = useState('');
  const [showToast, setShowToast] = useState(false);

  const USER_COLORS = {
    佑任: { bg: 'bg-[#E8637A]', text: 'text-white', activeBg: 'bg-[#E8637A]' },
    軒寶: { bg: 'bg-[#2E5FA3]', text: 'text-white', activeBg: 'bg-[#2E5FA3]' },
    阿歪: { bg: 'bg-[#F5C842]', text: 'text-black', activeBg: 'bg-[#F5C842]' },
    黃蔓: { bg: 'bg-[#4AABB8]', text: 'text-white', activeBg: 'bg-[#4AABB8]' },
  };

  useEffect(() => {
    const saved = localStorage.getItem('cm_packing_list_v2');
    if (saved) {
      setPackingData(JSON.parse(saved));
    } else {
      const initialData = {};
      USERS.forEach((user) => {
        initialData[user] = DEFAULT_ITEMS.map((item) => ({ name: item, checked: false }));
      });
      setPackingData(initialData);
      localStorage.setItem('cm_packing_list_v2', JSON.stringify(initialData));
    }
  }, []);

  const saveToStorage = (newData) => {
    localStorage.setItem('cm_packing_list_v2', JSON.stringify(newData));
    setPackingData(newData);
  };

  const toggleItem = (user, index) => {
    if (!isAdmin && !isMember) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    const newData = { ...packingData };
    newData[user][index].checked = !newData[user][index].checked;
    saveToStorage(newData);
  };

  const addItem = () => {
    if (!newItem.trim() || !currentUser) return;
    const newData = { ...packingData };
    newData[currentUser] = [{ name: newItem, checked: false }, ...newData[currentUser]];
    saveToStorage(newData);
    setNewItem('');
  };

  const deleteItem = (index) => {
    if (!window.confirm('確定刪除此項目？')) return;
    const newData = { ...packingData };
    newData[currentUser].splice(index, 1);
    saveToStorage(newData);
  };

  const getProgress = (user) => {
    if (!packingData[user]) return 0;
    const total = packingData[user].length;
    const checked = packingData[user].filter((i) => i.checked).length;
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  };

  return (
    <div className="pb-24 min-h-screen bg-[#FDFBF7] relative">
      <KyushuTips onTrigger={onSecretTrigger} />

      {/* Visit Japan Web */}
      <div className="mx-6 mb-6">
        <a
          href="https://vjw-lp.digital.go.jp/zh-hant/"
          target="_blank"
          rel="noreferrer"
          className="bg-white border-2 border-black py-4 px-5 rounded-2xl flex items-center justify-between gap-3 w-full shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2E5FA3] rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <FileText size={20} strokeWidth={3} className="text-white" />
            </div>
            <div>
              <div className="font-black text-black text-sm">Visit Japan Web</div>
              <div className="text-[10px] font-bold text-black bg-[#F5C842] px-1.5 py-0.5 rounded border-2 border-black mt-0.5 w-max shadow-[1px_1px_0_0_rgba(0,0,0,1)]">入境申報 / 免稅 / 簽證</div>
            </div>
          </div>
          <div className="bg-[#E8637A] border-2 border-black rounded-xl p-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <ArrowRight size={18} strokeWidth={3} className="text-white" />
          </div>
        </a>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-6 right-6 z-50">
          <div className="bg-black text-white p-5 rounded-2xl border-2 border-[#F5C842] shadow-[6px_6px_0_0_rgba(245,200,66,1)] flex items-center gap-4">
            <div className="bg-[#F5C842] border-2 border-black rounded-xl p-2">
              <Lock size={20} strokeWidth={3} className="text-black" />
            </div>
            <div>
              <div className="font-black text-sm text-[#F5C842]">訪客唯讀模式 Read Only</div>
              <div className="text-[11px] text-white/70 font-bold">請輸入密碼解鎖後編輯項目</div>
            </div>
          </div>
        </div>
      )}

      {/* 標題 */}
      <div className="px-6 mb-6">
        <h2 className="text-3xl font-serif font-black text-black flex items-center gap-3">
          <span className="w-2 h-8 bg-[#E8637A] rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] inline-block"></span>
          行李防呆準備清單
        </h2>
      </div>

      {/* 用戶選擇按鈕 */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {USERS.map((user) => {
            const colors = USER_COLORS[user];
            const isActive = currentUser === user;
            return (
              <button
                key={user}
                onClick={() => setCurrentUser(user)}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-black py-3 px-1 transition-all ${
                  isActive
                    ? `${colors.bg} ${colors.text} shadow-[4px_4px_0_0_rgba(0,0,0,1)] -translate-y-1`
                    : 'bg-white text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
                }`}
              >
                <span className="font-black text-sm">{user}</span>
                <span className={`text-[10px] font-black mt-1 px-1.5 py-0.5 rounded-md border border-black ${isActive ? 'bg-white/30' : 'bg-black text-white'}`}>
                  {getProgress(user)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {currentUser ? (
        <div className="px-6 animate-fadeIn">
          {/* 進度條 */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-serif font-black text-black">{currentUser} 的打包清單</h2>
            <span className="text-xs text-black font-black bg-[#F5C842] px-2 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              {packingData[currentUser]?.filter(i => i.checked).length} / {packingData[currentUser]?.length}
            </span>
          </div>
          <div className="h-3 w-full bg-white border-2 border-black rounded-full mb-6 overflow-hidden shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${USER_COLORS[currentUser].bg} border-r-2 border-black`}
              style={{ width: `${getProgress(currentUser)}%` }}
            />
          </div>

          {/* 新增輸入 */}
          {(isAdmin || isMember) && (
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="自訂行李項目..."
                className="flex-1 p-3 rounded-xl border-2 border-black focus:outline-none focus:border-[#E8637A] bg-white font-bold text-black shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)] placeholder:text-black/40"
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <button
                onClick={addItem}
                className="bg-[#E8637A] text-white border-2 border-black px-5 rounded-xl font-black text-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >+</button>
            </div>
          )}

          {/* 項目列表 */}
          <div className="space-y-2">
            {packingData[currentUser]?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleItem(currentUser, idx)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 border-black transition-all cursor-pointer ${
                  item.checked
                    ? 'bg-black/5 opacity-60 shadow-none'
                    : 'bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.checked ? `${USER_COLORS[currentUser].bg} shadow-none` : 'bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
                }`}>
                  {item.checked && <CheckCircle size={16} strokeWidth={3} className={USER_COLORS[currentUser].text === 'text-white' ? 'text-white' : 'text-black'} />}
                </div>
                <span className={`flex-1 font-bold text-sm ${
                  item.checked ? 'text-black/40 line-through' : 'text-black'
                }`}>{item.name}</span>
                {(isAdmin || isMember) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteItem(idx); }}
                    className="text-black/30 hover:text-[#E8637A] font-black text-lg leading-none transition-colors"
                  >×</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-10 py-20 text-center">
          <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)] mx-auto max-w-xs">
            <div className="text-4xl mb-3">👆</div>
            <p className="text-sm font-black text-black">請先點選上方按鈕<br />開啟專屬清單</p>
            <p className="text-xs text-black/50 font-bold mt-2 bg-[#F5C842] border-2 border-black rounded-lg px-2 py-1">(此處有彩蛋喔~提示:上下左右)</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// BackToTop
// ============================================================
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return isVisible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-40 p-3 bg-[#F5C842] text-black rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
    >
      <ArrowRight size={22} strokeWidth={3} className="-rotate-90" />
    </button>
  ) : null;
};

// ============================================================
// TravelApp — 主核心 (鎖屏 + 解鎖後完整 UI)
// ============================================================
export default function TravelApp() {
  const [isLocked, setIsLocked] = useState(() => localStorage.getItem('isUnlocked') !== 'true');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const isConnectedRef = useRef(false);
  const [inputPwd, setInputPwd] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [showHelloKitty, setShowHelloKitty] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [showShakeEgg, setShowShakeEgg] = useState(false);
  const pressTimerRef = useRef(null);

  const [activeTab, setActiveTab] = useState('itinerary');
  const [openDay, setOpenDay] = useState(0);

  const touchStartRef = useRef({ x: 0, y: 0 });
  const [konamiSequence, setKonamiSequence] = useState([]);
  const [isKonamiActive, setIsKonamiActive] = useState(false);

  const JUNGLE_BG = process.env.PUBLIC_URL + '/images/jungle1.jpeg';

  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY_DATA);
  const [appVersion, setAppVersion] = useState('V25 終極版');
  const [systemInfo, setSystemInfo] = useState('System Ver. 1.0 九州生存戰 🚀');
  const [noticeText, setNoticeText] = useState('載入中...');
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleSecretTrigger = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount === 5) {
      setShowSecret(true);
      alert("😈 禁忌解除！Kuromi Mode 九州隱藏大麻卡片開啟！🌿");
    }
  };

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'ODY4Njc3MDg=') { setIsAdmin(true); setIsMember(true); }
    else if (savedRole === 'MTMxNDUyMA==') { setIsAdmin(false); setIsMember(true); }
  }, []);

  // Firebase 同步
  useEffect(() => {
    const itineraryRef = ref(db, 'itinerary');
    const connectedRef = ref(db, '.info/connected');
    setIsLoadingData(true);
    goOnline(db);

    let unsubscribeItinerary = null;
    let unsubscribeConnected = null;

    get(itineraryRef).then((snapshot) => {
      if (snapshot.exists()) {
        setItinerary(snapshot.val());
        localStorage.setItem('cm_itinerary_backup', JSON.stringify(snapshot.val()));
      } else {
        setItinerary(INITIAL_ITINERARY_DATA);
      }
    }).catch(() => {
      const saved = localStorage.getItem('cm_itinerary_backup');
      if (saved) setItinerary(JSON.parse(saved));
    }).finally(() => {
      setTimeout(() => { setIsLoadingData(false); }, 800);
    });

    unsubscribeConnected = onValue(connectedRef, (snap) => {
      const connected = snap.val();
      setIsFirebaseConnected(connected === true);
      isConnectedRef.current = connected === true;
    });

    unsubscribeItinerary = onValue(itineraryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setItinerary(data);
        localStorage.setItem('cm_itinerary_backup', JSON.stringify(data));
        setIsLoadingData(false);
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(() => {
          if (!isConnectedRef.current) {
            goOffline(db);
            setTimeout(() => goOnline(db), 300);
          }
        }, 500);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (unsubscribeItinerary) unsubscribeItinerary();
      if (unsubscribeConnected) unsubscribeConnected();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    onValue(ref(db, 'appVersion'), (snap) => { if (snap.val()) setAppVersion(snap.val()); });
    onValue(ref(db, 'systemInfo'), (snap) => { if (snap.val()) setSystemInfo(snap.val()); });
    onValue(ref(db, 'noticeBoard'), (snap) => {
      if (snap.val() !== null) setNoticeText(snap.val());
      else setNoticeText('📌 點擊編輯公佈欄，記錄重要資訊');
    });
  }, []);

  const updateFirebase = (newItinerary) => {
    setItinerary(newItinerary);
    set(ref(db, 'itinerary'), newItinerary).catch(() => alert("雲端同步失敗 🛜"));
  };

  const handleUpdateNotice = (newText) => { setNoticeText(newText); set(ref(db, 'noticeBoard'), newText); };
  const updateSystemInfo = (newText) => { setSystemInfo(newText); set(ref(db, 'systemInfo'), newText); };
  const handleUpdateVersion = (newVal) => { setAppVersion(newVal); set(ref(db, 'appVersion'), newVal); };

  const handleContentUpdate = (dayNum, locIndex, field, value) => {
    const newItinerary = [...itinerary];
    const dayData = newItinerary.find((d) => d.day === dayNum);
    if (dayData && dayData.locations[locIndex]) {
      dayData.locations[locIndex][field] = value;
      updateFirebase(newItinerary);
    }
  };

  const handleTimeUpdate = (dayNum, locIndex, newTime) => {
    const newItinerary = [...itinerary];
    const dayData = newItinerary.find((d) => d.day === dayNum);
    if (dayData && dayData.locations[locIndex]) {
      dayData.locations[locIndex].time = newTime;
      updateFirebase(newItinerary);
    }
  };

  const handleAddLocation = (dayNum) => {
    const newItinerary = [...itinerary];
    const dayData = newItinerary.find((d) => d.day === dayNum);
    if (dayData) {
      dayData.locations.push({ imageId: '', type: 'sight', time: '00:00', name: '新行程', note: '請編輯內容', desc: '', nav: '', difficulty: '中' });
      updateFirebase(newItinerary);
    }
  };

  const handleDeleteLocation = (dayNum, locIndex) => {
    if (!window.confirm('確定要刪除這個行程嗎？')) return;
    const newItinerary = [...itinerary];
    const dayData = newItinerary.find((d) => d.day === dayNum);
    if (dayData) { dayData.locations.splice(locIndex, 1); updateFirebase(newItinerary); }
  };

  const handleMoveLocation = (dayNum, locIndex, direction) => {
    const newItinerary = [...itinerary];
    const dayData = newItinerary.find((d) => d.day === dayNum);
    if (dayData) {
      const newIndex = locIndex + direction;
      if (newIndex >= 0 && newIndex < dayData.locations.length) {
        const temp = dayData.locations[locIndex];
        dayData.locations[locIndex] = dayData.locations[newIndex];
        dayData.locations[newIndex] = temp;
        updateFirebase(newItinerary);
      }
    }
  };

  // 搖動彩蛋
  useEffect(() => {
    let lastShakeTime = 0;
    const handleShake = (e) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;
      const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
      if (total > 22) {
        const now = Date.now();
        if (now - lastShakeTime > 1500) { setShakeCount(1); lastShakeTime = now; return; }
        if (now - lastShakeTime < 300) return;
        lastShakeTime = now;
        setShakeCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 8) { setShowShakeEgg(true); return 0; }
          return newCount;
        });
      }
    };
    window.addEventListener('devicemotion', handleShake);
    return () => window.removeEventListener('devicemotion', handleShake);
  }, []);

  // 滑動 Konami
  useEffect(() => {
    const handleStart = (clientX, clientY) => { touchStartRef.current = { x: clientX, y: clientY }; };
    const handleEnd = (clientX, clientY) => {
      const diffX = clientX - touchStartRef.current.x;
      const diffY = clientY - touchStartRef.current.y;
      if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;
      let direction = Math.abs(diffX) > Math.abs(diffY) ? (diffX > 0 ? 'right' : 'left') : (diffY > 0 ? 'down' : 'up');
      setKonamiSequence((prev) => [...prev, direction].slice(-4));
    };
    const onTouchStart = (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = (e) => handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (konamiSequence.join(' ') === 'up down left right') {
      setIsKonamiActive((prev) => {
        alert(!prev ? '🌟 隱藏三麗鷗模式啟動！' : '關閉隱藏模式 👋');
        return !prev;
      });
      setKonamiSequence([]);
    }
  }, [konamiSequence]);

  const handleUnlock = () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().catch(console.error);
    }
    const encodedInput = btoa(inputPwd);
    const validCodes = ['ODY4Njc3MDg=', 'MTMxNDUyMA==', 'ODg4OA=='];
    if (validCodes.includes(encodedInput)) {
      localStorage.setItem('isUnlocked', 'true');
      localStorage.setItem('userRole', encodedInput);
    }
    if (encodedInput === 'ODY4Njc3MDg=') {
      setIsAdmin(true); setIsMember(true); setIsUnlocking(true);
      setTimeout(() => setIsLocked(false), 800);
    } else if (encodedInput === 'MTMxNDUyMA==') {
      setIsAdmin(false); setIsMember(true); setIsUnlocking(true);
      setTimeout(() => setIsLocked(false), 800);
    } else if (encodedInput === 'ODg4OA==') {
      setIsAdmin(false); setIsMember(false); setIsUnlocking(true);
      setTimeout(() => setIsLocked(false), 800);
    } else {
      alert('密碼錯誤！🔒');
      setInputPwd('');
    }
  };

  // ── 底部導覽列 icon 設定 ──
  const NAV_TABS = [
    { id: 'itinerary', label: '行程', Icon: MapPin },
    { id: 'packing',   label: '準備', Icon: CheckCircle },
    { id: 'guide',     label: '指南', Icon: Compass },
    { id: 'utils',     label: '工具', Icon: Wallet },
  ];

  const NAV_COLORS = ['bg-[#E8637A]', 'bg-[#2E5FA3]', 'bg-[#4AABB8]', 'bg-[#F5C842]'];
  const NAV_TEXT   = ['text-white',   'text-white',   'text-white',   'text-black'];

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        svg, img { user-select: none; pointer-events: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media print {
          #main-app-container { display: none !important; }
          #print-zone { display: block !important; background: white !important; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out both; }
      `}</style>

      <div className={`min-h-screen font-sans text-black max-w-md mx-auto relative overflow-hidden ${isLocked ? 'bg-black' : 'bg-[#FDFBF7]'}`}>

        {/* 橫向提示 */}
        <div className="fixed inset-0 z-[9999] bg-black text-white flex-col items-center justify-center hidden landscape:flex">
          <Phone size={48} className="animate-pulse mb-4" />
          <p className="text-lg font-black">請將手機轉為直向</p>
        </div>

        {/* ───── 鎖屏畫面 ───── */}
        {isLocked && (
          <div className="fixed inset-0 z-[100] flex justify-center bg-black h-screen w-full">
            <div className="relative w-full max-w-md h-full flex flex-col items-center overflow-hidden">

              {/* 背景圖片左右分開 */}
              <div
                className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${isUnlocking ? '-translate-x-full' : 'translate-x-0'}`}
                style={{ backgroundImage: `url(${JUNGLE_BG})`, backgroundSize: '200% 120%', backgroundPosition: 'left center' }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div
                className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${isUnlocking ? 'translate-x-full' : 'translate-x-0'}`}
                style={{ backgroundImage: `url(${JUNGLE_BG})`, backgroundSize: '200% 120%', backgroundPosition: 'right center' }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              {/* 鎖屏內容 */}
              <div className={`relative z-10 flex flex-col items-center w-full px-8 h-full pt-32 transition-opacity duration-500 ${isUnlocking ? 'opacity-0' : 'opacity-100'}`}>

                {/* Logo 區 */}
                <div
                  onMouseDown={() => pressTimerRef.current = setTimeout(() => setShowHelloKitty(true), 2000)}
                  onMouseUp={() => clearTimeout(pressTimerRef.current)}
                  className="bg-[#F5C842] border-4 border-black p-6 rounded-3xl mb-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] cursor-pointer active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
                >
                  <HelpCircle size={44} strokeWidth={3} className="text-black" />
                </div>

                {/* 五色條 */}
                <div className="flex gap-0 w-full mb-6 rounded-full overflow-hidden border-2 border-white/50" style={{ height: '6px' }}>
                  {['#E8637A','#2E5FA3','#F5C842','#4AABB8','#C06040'].map((c, i) => (
                    <div key={i} className="flex-1" style={{ background: c }}></div>
                  ))}
                </div>

                <h2 className="text-4xl font-serif font-black mb-1 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Kyushu 2026
                </h2>
                <p className="text-white font-black text-sm mb-1 tracking-widest bg-[#E8637A] border-2 border-black px-3 py-1 rounded-full shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                  佑任・軒寶・阿歪・黃蔓
                </p>
                <p className="text-white/50 text-[11px] uppercase font-bold text-center mb-4 mt-2">{systemInfo}</p>

                <button
                  onClick={() => window.location.reload()}
                  className="absolute top-10 right-6 p-3 rounded-xl bg-white/10 text-white border-2 border-white/30 shadow-[2px_2px_0_0_rgba(255,255,255,0.2)]"
                >
                  <RefreshCw size={20} strokeWidth={3} />
                </button>

                {/* 密碼輸入 */}
                <form
                  className="w-full relative mt-auto"
                  onSubmit={(e) => { e.preventDefault(); handleUnlock(); }}
                  style={{ marginBottom: 'calc(60px + env(safe-area-inset-bottom))' }}
                >
                  <div className="relative mb-4">
                    <KeyRound size={20} strokeWidth={3} className="absolute left-4 top-4 text-black" />
                    <input
                      type="password"
                      value={inputPwd}
                      onChange={(e) => setInputPwd(e.target.value)}
                      placeholder="Passcode"
                      className="w-full bg-[#F5C842] border-4 border-black rounded-2xl pl-12 pr-5 py-4 text-xl text-black text-center font-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] focus:outline-none placeholder:text-black/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-[#F5C842] font-black py-4 rounded-2xl border-4 border-[#F5C842] shadow-[6px_6px_0_0_rgba(245,200,66,0.8)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all text-lg"
                  >
                    Start Journey <ArrowRight size={20} strokeWidth={3} className="inline ml-1" />
                  </button>
                </form>
              </div>

              {showHelloKitty && (
                <div onClick={() => setShowHelloKitty(false)} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn p-8">
                  <div className="bg-[#F5C842] border-4 border-black p-8 rounded-3xl text-center shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                    <p className="text-black font-black text-lg">Surprise! 🎉</p>
                    <p className="text-black font-bold mt-1">系統檢測正常！旅程安全</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───── 解鎖主畫面 ───── */}
        {!isLocked && (
          <>
            {isLoadingData ? (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5C842]">
                <div className="bg-black border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-6">
                  <Loader2 size={48} strokeWidth={3} className="text-[#F5C842] animate-spin" />
                </div>
                <p className="text-black font-black text-lg tracking-widest">正在同步雲端行程...</p>
                <div className="flex gap-0 w-48 mt-4 rounded-full overflow-hidden border-2 border-black" style={{ height: '6px' }}>
                  {['#E8637A','#2E5FA3','#F5C842','#4AABB8','#C06040'].map((c, i) => (
                    <div key={i} className="flex-1 animate-pulse" style={{ background: c, animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
            ) : (
              <div id="main-app-container" className="bg-[#FDFBF7] min-h-screen">
                <WeatherHero
                  isAdmin={isAdmin}
                  itinerary={itinerary}
                  setItinerary={setItinerary}
                  versionText={appVersion}
                  updateVersion={handleUpdateVersion}
                  showSecret={showSecret}
                  onLock={() => {
                    setIsLocked(true); setIsUnlocking(false); setInputPwd('');
                    setIsAdmin(false); setIsMember(false);
                    localStorage.removeItem('isUnlocked');
                    localStorage.removeItem('userRole');
                  }}
                  onHardRefresh={() => window.location.reload()}
                />

                <main className="pb-28">
                  {/* 行程頁 */}
                  {activeTab === 'itinerary' && (
                    <div className="pb-4">
                      <OutfitGuide />
                      <div className="p-4 mt-2">
                        {itinerary.map((day, idx) => (
                          <DayCard
                            key={day.day}
                            dayData={day}
                            isOpen={openDay === idx}
                            toggle={() => setOpenDay(openDay === idx ? -1 : idx)}
                            isAdmin={isAdmin}
                            updateTime={handleTimeUpdate}
                            updateContent={handleContentUpdate}
                            onAdd={() => handleAddLocation(day.day)}
                            onDelete={(locIdx) => handleDeleteLocation(day.day, locIdx)}
                            onMove={(locIdx, dir) => handleMoveLocation(day.day, locIdx, dir)}
                          />
                        ))}
                        <div className="text-center text-sm text-black font-black mt-12 mb-4 border-t-2 border-black pt-4">
                          — Journey to Kyushu 2026 —
                        </div>
                        <div className="flex justify-center mb-8">
                          <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black text-xs font-black text-black bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all"
                          >
                            <FileText size={14} strokeWidth={3} /> 匯出 PDF 精裝行程
                          </button>
                        </div>
                      </div>
                      <FloatingStatus itinerary={itinerary} />
                    </div>
                  )}

                  {activeTab === 'packing' && (
                    <PackingPage
                      isKonamiActive={isKonamiActive}
                      isAdmin={isAdmin}
                      isMember={isMember}
                      onSecretTrigger={handleSecretTrigger}
                    />
                  )}

                  {activeTab === 'guide' && (
                    <GuidePage
                      isAdmin={isAdmin}
                      isMember={isMember}
                      noticeText={noticeText}
                      updateNoticeText={handleUpdateNotice}
                    />
                  )}

                  {activeTab === 'utils' && (
                    <div>
                      {/* 深色/淺色切換 */}
                      <div className="px-6 pt-6">
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                          <div className="flex items-center gap-3 font-black">
                            {darkMode
                              ? <div className="bg-[#2E5FA3] border-2 border-black p-2 rounded-xl"><Sun size={18} strokeWidth={3} className="text-[#F5C842]" /></div>
                              : <div className="bg-[#F5C842] border-2 border-black p-2 rounded-xl"><CloudRain size={18} strokeWidth={3} className="text-black" /></div>
                            }
                            <span>{darkMode ? '深色模式 On' : '淺色模式 Off'}</span>
                          </div>
                          <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-14 h-8 rounded-full border-2 border-black p-1 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${darkMode ? 'bg-[#2E5FA3]' : 'bg-[#F5C842]'}`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 border-black bg-white shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                      <UtilsPage
                        isAdmin={isAdmin}
                        isMember={isMember}
                        systemInfo={systemInfo}
                        updateSystemInfo={updateSystemInfo}
                      />
                    </div>
                  )}
                </main>

                <BackToTop />

                {/* 搖動彩蛋 */}
                {showShakeEgg && (
                  <div onClick={() => setShowShakeEgg(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8">
                    <div className="bg-[#F5C842] border-4 border-black p-8 rounded-3xl text-center shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                      <p className="text-black font-black text-xl">🍀 搖出驚喜！</p>
                      <p className="text-black font-bold mt-2">祝全團九州生存戰大順利！</p>
                    </div>
                  </div>
                )}

                {/* ── 底部導覽列 ── */}
                <nav className="fixed bottom-0 w-full max-w-md bg-white border-t-2 border-black flex justify-around py-2 pb-3 z-40 select-none shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
                  {NAV_TABS.map(({ id, label, Icon }, i) => {
                    const isActive = activeTab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2 transition-all ${
                          isActive
                            ? `${NAV_COLORS[i]} ${NAV_TEXT[i]} border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]`
                            : 'bg-white text-black border-transparent'
                        }`}
                      >
                        <Icon size={22} strokeWidth={isActive ? 3 : 2} />
                        <span className="text-[10px] font-black">{label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* 精裝列印專區 */}
            <div id="print-zone" className="hidden print:block bg-white text-black p-10">
              <h1 className="text-3xl font-serif font-black border-b-4 border-black pb-4 mb-8 text-center">
                KYUSHU SURVIVAL 2026<br />
                <span className="text-sm text-black/50 font-sans tracking-widest uppercase">Nagasaki & Saga Itinerary</span>
              </h1>
              {itinerary.map((day) => (
                <div key={day.day} className="mb-12">
                  <div className="flex items-baseline gap-3 mb-4 border-b-2 border-black pb-1">
                    <span className="text-4xl font-serif font-black text-[#E8637A]">D{day.day}</span>
                    <span className="text-lg font-black text-black">{day.displayDate} — {day.title}</span>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {day.locations.map((loc, idx) => (
                        <tr key={idx} className="align-top border-b border-black/10">
                          <td className="py-4 pr-4 font-mono font-black text-xs text-black/50 w-16">{loc.time}</td>
                          <td className="py-4">
                            <div className="font-black text-black text-sm mb-0.5">{loc.name}</div>
                            <div className="text-[11px] text-[#E8637A] font-black mb-1">{loc.note}</div>
                            <div className="text-[10px] text-black/60 font-bold leading-relaxed">{loc.desc}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
