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
  Pin,      // 🔥 補上這個
  Ban,       // 🔥 補上這個
  Languages,
  Smartphone, // 🔥 補上這個
  X,
} from 'lucide-react';

// 🔥🔥🔥 Firebase RTDB 核心電路
import { ref, onValue, set, goOffline, goOnline, get } from "firebase/database";
import { db } from "./firebase"; // ⚠️ 前提：你要先建立 firebase.js 檔案



// 🌷 加大版三色鬱金香 Icon（花朵更大、更顯眼）
const TulipIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 莖（加長） */}
    <path d="M12 20 L12 13.5" stroke="#4A9C4F" strokeWidth="1.9" strokeLinecap="round" />

    {/* 葉子 - 左 */}
    <path d="M12 15.5 Q7.5 12.5 6.5 16.5" stroke="#4A9C4F" strokeWidth="1.7" fill="none" />
    {/* 葉子 - 右 */}
    <path d="M12 15.5 Q16.5 12.5 17.5 16.5" stroke="#4A9C4F" strokeWidth="1.7" fill="none" />

    {/* 左花瓣（紫） - 加大 */}
    <path 
      d="M8.5 11 Q6.5 7 9 4.5 Q11.5 3.5 12.5 6" 
      fill="#A855F7" 
      stroke="#7C3AED" 
      strokeWidth="1" 
    />

    {/* 中花瓣（紅） - 明顯加大 */}
    <path 
      d="M12 4 Q15.5 6.5 15.8 10.5 Q14.5 13.5 12 14.5 Q9.5 13.5 8.2 10.5 Q8.5 6.5 12 4Z" 
      fill="#E8334A" 
      stroke="#C0262E" 
      strokeWidth="1.1" 
    />

    {/* 右花瓣（黃） - 加大 */}
    <path 
      d="M15.5 11 Q17.5 7 15 4.5 Q12.5 3.5 12.5 6" 
      fill="#FACC15" 
      stroke="#D97706" 
      strokeWidth="1" 
    />

    {/* 花瓣高光（增加立體感） */}
    <path 
      d="M11.5 5.5 Q12.8 7 13.2 9" 
      fill="none" 
      stroke="#ffffff" 
      strokeWidth="1" 
      strokeOpacity="0.45" 
    />
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
    title: '佐賀入境 ➜ 豪斯登堡歐風街景',
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
        imageId: 'day1_8',
        type: 'sight',
        time: '22:00',
        name: '超商補貨備案',
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
    title: '豪斯登堡全日漫遊 ➜ gogo長崎（★新三大夜景與海鮮彈性夜）',
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
        imageId: 'day2_5',
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
        name: '深度精華: 出島 (Dejima) 荷蘭商館',
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
    title: '狂吃傳奇早餐 ➜ 總鎮守朱印 ➜ 大正浪漫茶會（松翁軒已預約） ➜ 雙星4047極準作戰',
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
        imageId: 'day5_6',
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
    title: '飯店早餐 ➜ 佐賀機場返台',
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
        type: 'transport',
        time: '10:00',
        name: '搭乘機場巴士直達佐賀機場',
        note: '於佐賀站巴士中心搭乘。',
        desc: '搭乘機場接駁巴士直達佐賀機場 (HSG)。',
        nav: '佐賀空港',
        difficulty: '低',
      },
      {
        imageId: 'day6_3',
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
  'eSIM / 網卡(行前/入境)',
  'Visit Japan Web填妥(行前)',
  '乳液、凡士林',
  '防曬乳',
  '化妝品',
  '衣服、褲子',
  '睡衣',
  '內衣褲、襪子',
  '護照',
  '提款卡 (開國外提款)',
  '信用卡',
  '身分證/健保卡',
  '現金 (日幣/台幣)',
  '牙膏、牙刷(飯店有)',
  '行李箱 (確認密碼)',
  '一般出門鞋子',
  '室內拖/室外拖',
  '手機 & 充電器',
  '行動電源(請用透明袋裝好)',
  '衛生紙/濕紙巾',
  '吹風機(飯店有)',
  '梳子',
  '旅行電熱壺',
  '暈車藥',
  '防蚊液',
  '國際駕照/日文譯本(佑任)',
  '汽車導航架',
  '個人藥品',
  '雨傘',
  '塑膠袋 (髒衣物用)',
  '沐浴乳/洗髮精(飯店也有)',
  '數位相機/傳統相機/充電器/底片',
  '隱形眼鏡/藥水/器具',
  '眼鏡/眼鏡盒',
  '墨鏡',
  '刮鬍刀/刮鬍泡',
  '口罩(看自己)',
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
  notes: '六月注意防雨防海風。\n🚗 右駕左行，長崎山路多斜坡。',
  driveUrl: 'https://drive.google.com/drive/folders/1B7hzB79vrlLWe1-N7gOxVJrVRK9ho87i?usp=sharing',

};

// ============================================
// UIUX part
// ============================================

const WeatherHero = ({ isAdmin, versionText, updateVersion, onLock, showSecret, onHardRefresh, itinerary, setItinerary }) => {
  const [data, setData] = useState(null);
  const [aqi, setAqi] = useState(15);
  const [bannerText, setBannerText] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOutfitPicker, setShowOutfitPicker] = useState(false);
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
          { name: '🚀 九州鐵道即時 JR 運行情報', url: 'https://www.jrkyushu.co.jp/trains/info/' }
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
      // 🎯 自動切換為日本長崎座標 (緯度 32.7503, 經度 129.8777, 日本東京時區)
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

      const cacheData = {
        weather: json,
        aqi: currentAqi,
        source: aqiSource,
        time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
      };
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
              if (code >= 51) {
                iconStr = 'rainy';
              } else if ((code >= 1 && code <= 3) || code === 45 || code === 48) {
                iconStr = 'cloudy';
              }

              return {
                ...day,
                weather: {
                  ...day.weather,
                  temp: `${Math.round(maxTemps[dateIndex])}°C`,
                  icon: iconStr,
                  realData: true,
                }
              };
            }
            return day;
          });
          setItinerary(updatedItinerary);
        }


        const nowInJp = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
       const currentHourInJp = nowInJp.getHours();
      
        const next3HoursRain = json.hourly.precipitation_probability.slice(currentHourInJp, currentHourInJp + 3);
        const maxRainProb = Math.max(...next3HoursRain);

        let newAlerts = [];
        if (maxRainProb > 40) {
          newAlerts.push({ type: 'rain', msg: `🌧️ 局部降雨機率 ${maxRainProb}%，攜帶雨具較安全！` });
        }
        if (currentAqi > 100) { // ← 補回這段
          newAlerts.push({ type: 'aqi', msg: `😷 AQI 數值偏高，戶外請戴口罩。` });
        }
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

      const startDate = new Date('2026-06-16T00:00:00'); // 改為 6/16 出發
      const endDate = new Date('2026-06-21T23:59:59');   // 6/21 結束

      if (nowInJp < startDate) {
        const diff = startDate - nowInJp;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setBannerText(`✈️ 距離九州出發還有 ${days} 天！`);
      } else if (nowInJp > endDate) {
        setBannerText('👋 深度九州之旅結束了 QQ');
      } else {
        const diff = nowInJp - startDate;
        const dayNum = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
        if (dayNum >= 6) {
          setBannerText('😭 旅程最後一天哭哭');
        } else {
          setBannerText(`🇯🇵 旅程第 ${dayNum} 天 (${dayNum}/6)`);
        }
      }
    };
    calcTime();
    const timer = setInterval(calcTime, 60000);
    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 20 * 60 * 1000);

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const getWeatherIcon = (code, size = 20) => {
    if (code <= 1) return <Sun size={size} className="text-amber-500" strokeWidth={2.5} />;
    if (code <= 3 || code === 45 || code === 48)
      return <Cloud size={size} className="text-stone-400 dark:text-stone-300" strokeWidth={2.5} />;
    if (code >= 50) return <CloudRain size={size} className="text-blue-400" strokeWidth={2.5} />;
    return <CloudSun size={size} className="text-amber-400" strokeWidth={2.5} />;
  };

  // 修復後（泰國版四段）
  const getAqiColor = (val) => {
    if (val <= 50) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
    if (val <= 100) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    if (val <= 150) return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  };

  const getNext24Hours = () => {
    if (!data || !data.hourly || !data.hourly.time) return [];

    const nowInJp = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const currentHourIndex = nowInJp.getHours();
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
   <div className="relative bg-[#FDFBF7] dark:bg-stone-900 pt-0 pb-8 px-6 border-b border-stone-200 dark:border-stone-800 rounded-b-[2.5rem] z-10 overflow-visible transition-colors duration-500">
      {bannerText && (
        <div className={`absolute top-0 left-0 right-0 py-1.5 z-20 shadow-sm text-[10px] font-bold text-center transition-colors duration-500
          ${bannerText.includes('結束') ? 'bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'}`}
        >
          {bannerText}
        </div>
      )}

      <button onClick={onLock} className="absolute top-0 right-0 z-30 h-[28px] w-[30px] flex items-center justify-center text-amber-800/40 hover:text-amber-800 dark:text-amber-200/40 dark:hover:text-amber-200 transition-colors" title="鎖定畫面">
        <Lock size={12} strokeWidth={2.5} />
      </button>

      <div className="absolute top-[-20px] right-[-20px] text-[8rem] font-serif text-amber-50 dark:text-stone-800 opacity-50 select-none leading-none pointer-events-none">
        Japan
      </div>

      <div className="relative z-10 mt-10">
        {alerts.length > 0 && (
          <div className="mb-4 space-y-2">
            {alerts.map((alert, idx) => (
              <div key={idx} className="p-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm animate-pulse border bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
                <CloudRain size={16} /> {alert.msg}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-400 text-[10px] font-bold tracking-wider rounded-full whitespace-nowrap">
                佑任・軒寶・阿歪・黃蔓
              </span>

              {isAdmin ? (
                <input type="text" value={versionText || ''} onChange={(e) => updateVersion(e.target.value)} className="w-16 bg-transparent border-b border-amber-300 text-sm font-serif font-bold italic focus:outline-none text-center dark:text-stone-300" />
              ) : (
                <div className="flex items-center gap-1 ml-1 relative group">
                  <TulipIcon className="w-6 h-6 text-amber-400 dark:text-amber-300 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]" />
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F3E5AB] via-[#FDB931] to-[#996515] drop-shadow-sm tracking-wide ml-1.5 mt-0.5" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                    {versionText || '2026'}
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-serif text-stone-800 dark:text-stone-100 tracking-tight leading-[0.9]">
              Miffy
              <br />
              <span className="text-amber-600 dark:text-amber-500">荷蘭物語</span>
            </h1>
          </div>

          <div className="text-right flex-shrink-0 mt-2">
            <div onClick={fetchWeather} className="text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-widest cursor-pointer">
              Nagasaki Now
            </div>

            {data ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(data.current.weather_code, 36)}
                  <span className="text-5xl font-serif font-medium text-stone-800 dark:text-stone-100 tracking-tighter">
                    {Math.round(data.current.temperature_2m)}°
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 mt-2">
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${getAqiColor(aqi)}`}>
                    <Wind size={10} /> AQI {aqi}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-medium bg-white/50 dark:bg-stone-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Droplets size={10} /> {data.current.relative_humidity_2m}%
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 cursor-pointer mt-2" onClick={fetchWeather}>
                  {lastUpdate && <span className="text-[10px] text-stone-300 dark:text-stone-600 font-mono tracking-tighter">{lastUpdate}</span>}
                  <button disabled={isLoading} className="text-stone-300 dark:text-stone-700 transition-all duration-300">
                    <RefreshCw size={10} className={isLoading ? 'animate-spin text-blue-500' : ''} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-pulse flex gap-2 items-center">
                <div className="w-8 h-8 bg-stone-200 dark:bg-stone-700 rounded-full"></div>
                <div className="w-12 h-8 bg-stone-200 dark:bg-stone-700 rounded"></div>
              </div>
            )}
          </div>
        </div>

        {data && nextHours.length > 0 && (
          <div className="backdrop-blur-sm rounded-2xl p-4 border border-stone-100 dark:border-stone-700 shadow-sm" style={{background: '#fcef8b'}}> 

            <div className="flex items-center">
              <div className="text-[10px] font-bold text-stone-400 writing-vertical-rl border-l pl-3 mr-3 border-stone-200 dark:border-stone-700 dark:border-stone-600 h-10 flex items-center justify-center tracking-widest flex-shrink-0"
              >FUTURE 24H</div>
              <div className="flex overflow-x-auto gap-4 pb-2 w-full no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {nextHours.map((h, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 min-w-[3.5rem] flex-shrink-0">
                    <span className="text-[10px] text-stone-400 font-bold whitespace-nowrap">{h.time}</span>
                    <div className="py-1">{getWeatherIcon(h.code, 20)}</div>
                    <span className="text-sm font-bold text-stone-700 dark:!text-white">
  {h.temp}°
</span>
                    {h.rain >= 0 && <span className="text-[9px] text-blue-400 font-bold">{h.rain}%</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* 穿搭 AI 按鈕 */}
<button
  onClick={() => setShowOutfitPicker(true)}
  className="w-full mt-3 py-3 bg-white/90 dark:bg-stone-800/90 backdrop-blur-md border border-stone-200 dark:border-stone-700 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-200 active:scale-95 shadow-sm group"
>
  <Shirt size={16} className="text-amber-500 group-hover:rotate-12 transition-transform" /> 今日穿搭 AI 建議
</button>

{/* Ask AI 原本按鈕，維持不動 */}
<button
  onClick={() => window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent('長崎 佐賀 2026 6月中旬 長崎佐賀都在市區內 必吃美食與私房景點 歷史文化深度介紹 也請納入日本在地Tabelog與小紅書評價 以中文回答')}`, '_blank')}
  className="w-full mt-3 py-3 bg-white/90 dark:bg-stone-800/90 backdrop-blur-md border border-stone-200 dark:border-stone-700 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-200 active:scale-95 shadow-sm group"
>
  <Sparkles size={16} className="text-teal-500 group-hover:rotate-12 transition-transform" /> Ask AI (Perplexity 深度探索)
</button>

{/* 穿搭選天 Modal */}
{showOutfitPicker && (
  <div
    className="fixed inset-0 z-[9999] flex items-end justify-center"
    onClick={() => setShowOutfitPicker(false)}
  >
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    <div
      className="relative bg-white dark:bg-stone-800 w-full max-w-md rounded-t-3xl p-6 pb-12 shadow-2xl animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-10 h-1 bg-stone-200 dark:bg-stone-600 rounded-full mx-auto mb-5" />
      <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base mb-1 flex items-center gap-2">
        <Shirt size={18} className="text-amber-500" /> 選擇要查詢的天數
      </h3>
      <p className="text-xs text-stone-400 mb-5">Perplexity 會自動查當天天氣預報並結合行程給建議</p>
      <div className="space-y-2 overflow-y-auto max-h-[60vh]">
        {INITIAL_ITINERARY_DATA.map((day) => {
          const today = new Date().toISOString().split('T')[0];
          const isToday = day.date === today;
          return (
            <button
              key={day.day}
              onClick={() => {
                const locationNames = day.locations.map(l => l.name).join('、');
                const query = `${day.date} 日本長崎佐賀天氣預報，當天行程包含：${locationNames}，請根據天氣預報建議今天穿什麼衣服、需要帶什麼裝備，以繁體中文回答`;
                window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`, '_blank');
                setShowOutfitPicker(false);
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-95 ${
                isToday
                  ? 'bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-600'
                  : 'bg-stone-50 border-stone-100 dark:bg-stone-700/50 dark:border-stone-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-100 text-sm">
                    Day {day.day}・{day.displayDate}
                  </span>
                  {isToday && (
                    <span className="ml-2 text-[10px] font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">今天</span>
                  )}
                  <p className="text-xs text-stone-400 mt-0.5 truncate pr-4">{day.title}</p>
                </div>
                <ArrowRight size={16} className="text-stone-300 flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
)}

{showSecret && secretLinks.length > 0 && (
  <div className="mt-3 overflow-hidden rounded-2xl border-2 border-ink" style={{border: '2px solid #1A1510'}}>
    <div className="px-4 py-2 flex items-center justify-between" style={{background:'#F7E84E', borderBottom:'2px solid #1A1510'}}>
      <span style={{fontFamily:"'Space Mono',monospace", fontSize:'9px', fontWeight:'bold', letterSpacing:'2px', textTransform:'uppercase', color:'#1A1510'}}>
        🔗 SECRET LINKS
      </span>
    </div>
    {secretLinks.map((link, idx) => (
      <a key={idx} href={link.url} target="_blank" rel="noreferrer"
        className="flex items-center justify-between px-4 py-3"
        style={{background:'#fff', borderBottom:'1px solid #D6C8A8', display:'flex'}}
      >
        <span style={{fontFamily:"'DM Serif Display',serif", fontSize:'14px', color:'#1A1510'}}>{link.name}</span>
        <ArrowRight size={14} style={{color:'#888', flexShrink:0}} />
      </a>
    ))}
    {isAdmin && (
      <div className="p-3 flex gap-2" style={{borderTop:'1px solid #D6C8A8', background:'#F7E84E'}}>
        <input value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)}
          placeholder="名稱" className="flex-1 text-xs p-2 border rounded-lg" style={{border:'1.5px solid #1A1510'}} />
        <input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)}
          placeholder="網址" className="flex-1 text-xs p-2 border rounded-lg" style={{border:'1.5px solid #1A1510'}} />
        <button onClick={handleAddLink}
          className="text-xs px-3 rounded-lg font-bold"
          style={{background:'#1A1510', color:'#F7E84E'}}>+</button>
      </div>
    )}
  </div>
)}



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
          let stopTimeStr = `${dateStr}T23:59:00+09:00`; // 🎯 修正為日本時區 (+09:00)

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

      if (futureStops.length > 0) {
        setNextStop(futureStops[0]);
      } else {
        setNextStop({ name: '旅程圓滿結束 🎉', time: 'See you next time!', nav: '', finished: true });
      }
    };

    findNextStop();
    const timer = setInterval(findNextStop, 60000);
    return () => clearInterval(timer);
  }, [itinerary]);

  if (!nextStop) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30">
      <div className="bg-stone-900/95 backdrop-blur-md text-stone-50 p-4 rounded-2xl shadow-2xl border border-stone-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-stone-900 flex-shrink-0 ${nextStop.finished ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}>
            {nextStop.finished ? <CheckCircle size={20} /> : <Navigation size={20} strokeWidth={2.5} />}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-0.5 flex items-center gap-1">
              {nextStop.finished ? 'COMPLETED' : 'COMING UP'} <Clock size={10} />
            </div>
            <div className="font-bold text-sm truncate text-white">{nextStop.name}</div>
            <div className="text-xs text-stone-400 truncate">{nextStop.time}</div>
          </div>
        </div>
        {nextStop.nav && (
          <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextStop.nav)}`, '_blank')} className="bg-stone-800 p-2 rounded-full text-stone-400 hover:text-white ml-2 flex-shrink-0">
            <ArrowRight size={20} />
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
      <button onClick={() => setIsOpen(true)} className="mx-6 mt-6 bg-white dark:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-stone-600 dark:text-stone-300 w-[calc(100%-3rem)] active:scale-95 transition-transform"
      >
        <Info size={14} className="text-amber-500" /> 查看初夏穿搭 & 爛腳等級說明
      </button>
    );

  return (
    <div className="mx-6 mt-6 bg-[#FFFBF0] dark:bg-stone-800 p-5 rounded-2xl border border-amber-100/50 shadow-sm relative animate-fadeIn">
      <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-amber-300 hover:text-amber-500"><ChevronUp size={18} /></button>
      <h3 className="flex items-center gap-2 font-serif font-bold text-amber-900 dark:text-amber-500 text-base mb-3">
        <Shirt size={18} className="text-amber-500" /> 6月日本九州穿搭指南
      </h3>
      <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-1.5 rounded-full text-amber-600 flex-shrink-0"><Sun size={12} /></div>
          <div><strong>白天 (23-28°C)</strong><br />短袖舒適、梅雨季可能遇陣雨，隨身帶把摺疊傘。</div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 flex-shrink-0"><Wind size={12} /></div>
          <div><strong>海風與稻佐山夜景 (18-20°C)</strong><br />海邊與山頂展望台風大，體感稍冷，務必攜帶薄外套防風。</div>
        </div>
      </div>
      <div className="pt-4 border-t border-amber-200/50">
        <h3 className="flex items-center gap-2 font-serif font-bold text-amber-900 dark:text-amber-500 text-base mb-3">🦵 爛腳指數說明</h3>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex items-center gap-3 bg-white dark:bg-stone-700 p-2 rounded-lg border border-emerald-100">
            <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold whitespace-nowrap">低 / 零</span>
            <span className="text-stone-600 dark:text-stone-300">全程坐車、特急列車、環境舒適。</span>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-stone-700 p-2 rounded-lg border border-amber-100">
            <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold whitespace-nowrap">中</span>
            <span className="text-stone-600 dark:text-stone-300">一般步道景點參拜、有微斜坡、出島石板路。</span>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-stone-700 p-2 rounded-lg border border-rose-100">
            <span className="bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded font-bold whitespace-nowrap">高 / 極高</span>
            <span className="text-stone-600 dark:text-stone-300">軍艦島廢墟爬坡、5.5小時連續血拼大戰。</span>
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
      case 'food': return <Utensils size={16} className="text-orange-600" />;
      case 'transport': return <Car size={16} className="text-blue-500" />;
      default: return <MapPin size={16} className="text-emerald-500" />;
    }
  };

  const getDifficultyColor = (diff) => {
    if (!diff) return 'bg-gray-100 text-gray-500';
    if (diff.includes('低') || diff.includes('零')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (diff.includes('中')) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-rose-50 text-rose-700 border-rose-100';
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
    <div onClick={() => setIsExpanded(!isExpanded)} className={`bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 mb-4 overflow-hidden transition-all duration-300 cursor-pointer ${isExpanded ? 'ring-2 ring-amber-100 shadow-md' : ''}`}>
      <div className="p-4 flex items-start gap-4">
        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100 dark:border-stone-700">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {isAdmin ? (
              <input type="time" value={item.time ? item.time.substring(0, 5) : ''} onClick={(e) => e.stopPropagation()} onChange={(e) => updateTime(day, index - 1, e.target.value)} className="bg-amber-50 text-[14px] font-bold text-stone-800 focus:outline-none px-1 h-7 font-mono rounded" />
            ) : (
              <span className="text-[10px] font-bold text-stone-400 font-mono uppercase tracking-wide">{item.time}</span>
            )}

            {isAdmin ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input type="text" value={item.difficulty || ''} onChange={(e) => updateContent('difficulty', e.target.value)} className="text-[10px] bg-stone-100 border-none rounded px-2 py-0.5 w-24" placeholder="自訂難度" />
                <select onChange={(e) => { if (e.target.value) updateContent('difficulty', e.target.value); }} className="w-4 h-6 bg-transparent text-stone-400 outline-none cursor-pointer">
                  <option value="">☰</option>
                  <option value="低 (環境舒適)">🟢 低</option>
                  <option value="中 (石板路/斜坡)">🟡 中</option>
                  <option value="高 (軍艦島攀爬)">🟠 高</option>
                </select>
              </div>
            ) : (
              item.difficulty && <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-bold ${getDifficultyColor(item.difficulty)}`}>{item.difficulty}</span>
            )}
            {item.highlight && <span className="text-[9px] px-1.5 py-0.5 rounded-md border border-amber-100 bg-amber-50 text-amber-700 font-bold">★ {item.highlight}</span>}
          </div>

          {isAdmin ? (
            <input type="text" value={item.name} onClick={(e) => e.stopPropagation()} onChange={(e) => updateContent('name', e.target.value)} className="w-full font-bold text-lg text-stone-800 bg-transparent border-b border-stone-300 focus:outline-none p-0 mb-1" placeholder="輸入地點名稱..." />
          ) : (
            <h3 className="font-bold text-stone-800 dark:text-stone-200 text-lg leading-tight mb-1 pr-2">{item.name}</h3>
          )}

          {isAdmin ? (
            <input type="text" value={item.note} onClick={(e) => e.stopPropagation()} onChange={(e) => updateContent('note', e.target.value)} className="w-full text-xs text-stone-600 bg-transparent border-b border-stone-300 focus:outline-none py-1" placeholder="輸入簡短備註..." />
          ) : (
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-relaxed">{item.note}</p>
          )}
        </div>
        <div className="mt-8 text-stone-300 flex-shrink-0">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
      </div>

      {isExpanded && (
        <div className="animate-fadeIn">
          <div className="w-full h-48 overflow-hidden relative bg-stone-100">
            <img src={hasError ? BACKUP_IMAGE : getLocationImage(item.imageId)} alt={item.name} decoding="async" onLoad={() => setIsImageLoaded(true)} onError={() => setHasError(true)} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white/90 text-[10px] flex flex-col gap-2 font-mono">
              <div className="flex items-center gap-1"><Camera size={10} /> {isAdmin ? '編輯圖片來源' : 'Image for reference'}</div>
              {isAdmin && (
                <div className="flex flex-col gap-1 bg-black/40 p-2 rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <input className="bg-white/90 text-stone-800 text-[10px] w-full px-2 py-1 rounded" value={item.imageId || ''} onChange={(e) => updateContent('imageId', e.target.value)} placeholder="貼上網址..." />
                  <label className="bg-amber-500 text-white text-[9px] px-2 py-1 rounded cursor-pointer w-max"><Upload size={10} className="inline mr-1" />上傳照片<input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} /></label>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 bg-stone-50/50">
            <div className="mb-5">
              <h4 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5 uppercase tracking-wider"><Info size={12} /> 導遊說故事</h4>
              {isAdmin ? (
                <div onClick={(e) => e.stopPropagation()} className="space-y-3">
                  <textarea value={item.desc} onChange={(e) => updateContent('desc', e.target.value)} className="w-full text-sm text-stone-600 bg-white border rounded-lg p-3 min-h-[100px]" placeholder="輸入詳細介紹..." />
                  <div className="flex items-center gap-2 bg-white p-2 border rounded-lg"><span className="text-xs font-bold text-stone-400">導航搜尋:</span><input type="text" value={item.nav || ''} onChange={(e) => updateContent('nav', e.target.value)} className="flex-1 text-xs focus:outline-none" placeholder="Google Maps 關鍵字" /></div>
                </div>
              ) : (
                <p className="text-sm text-stone-600 leading-relaxed text-justify whitespace-pre-line font-medium">{item.desc || '暫無詳細介紹，但這裡絕對值得一去！'}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.nav)}`, '_blank'); }} className="flex items-center justify-center gap-2 py-3 bg-stone-800 text-amber-50 rounded-xl active:scale-95 text-sm font-bold shadow-lg">
                <Navigation size={16} /> 導航
              </button>
              <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent('日本長崎景點介紹 與旅行隱藏玩法 ' + item.name)}`, '_blank'); }} className="flex items-center justify-center gap-2 py-3 bg-white border text-stone-600 rounded-xl active:scale-95 text-sm font-bold">
                <Sparkles size={16} className="text-teal-500" /> 問問 AI
              </button>
            </div>
            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center">
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-2 bg-white border rounded-lg shadow-sm">⬆️</button>
                  <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-2 bg-white border rounded-lg shadow-sm">⬇️</button>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 font-bold text-xs">🗑️ 刪除</button>
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
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    const ease = (t, b, c, d) => { t /= d; t--; return -c * (t * t * t * t - 1) + b; };
    requestAnimationFrame(animation);
  };

  useEffect(() => {
    if (isOpen && cardRef.current) {
      setTimeout(() => { smoothScrollTo(cardRef.current, 10); }, 50);
    }
  }, [isOpen]);

  return (
    <div ref={cardRef} className="mb-3 px-2">
      <div onClick={toggle} className={`relative flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 ${isOpen ? 'bg-stone-800 text-stone-50 shadow-xl scale-[1.02]' : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-sm border border-stone-100 dark:border-stone-700'}`}>
        <div className="flex items-center gap-4">
          <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${isOpen ? 'bg-stone-700 border-stone-600' : 'bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-600'}`}>
            <span className="text-[10px] font-bold uppercase" style={{color:'#1A1510'}}>Day</span>

            <span className={`text-xl font-serif font-bold ${isOpen ? 'text-amber-400' : 'text-stone-800 dark:text-amber-400'}`}>{dayData.day}</span>
          </div>
          <div>
            <div className="text-xs font-bold mb-0.5" style={{color:'#1A1510'}}>{dayData.displayDate}</div>
            <div className="font-bold text-lg leading-tight">{dayData.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            {dayData.weather.realData && (
              <>
                {dayData.weather.icon === 'sunny' && <Sun size={14} className="text-amber-500" />}
                {dayData.weather.icon === 'cloudy' && <Cloud size={14} className="text-stone-400" />}
                {dayData.weather.icon === 'rainy' && <CloudRain size={14} className="text-blue-400" />}
              </>
            )}
            <span className="text-sm font-medium">{dayData.weather.temp}</span>
          </div>
          {isOpen ? <ChevronUp size={20} className="text-stone-500 ml-auto" /> : <ChevronDown size={20} className="text-stone-300 ml-auto" />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pl-4 border-l-2 border-stone-200/50 space-y-4 pb-4 animate-fadeIn">
          {dayData.locations.map((loc, idx) => (
            <LocationCard
              key={idx}
              item={loc}
              day={dayData.day}
              index={idx + 1}
              isAdmin={isAdmin}
              updateTime={(d, l, t) => updateTime(d, idx, t)}
              updateContent={(field, val) => updateContent(dayData.day, idx, field, val)}
              onDelete={() => onDelete(idx)}
              onMoveUp={() => onMove(idx, -1)}
              onMoveDown={() => onMove(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === dayData.locations.length - 1}
            />
          ))}
          {isAdmin && (
            <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-400 font-bold flex items-center justify-center gap-2 hover:text-amber-500 transition-all">+ 新增行程</button>
          )}
        </div>
      )}
    </div>
  );
};

const FlightCard = ({ type, date, flightNo, time, airline, from, to, fromCode, toCode, fromTerminal, toTerminal }) => {
  const searchUrl = `https://www.google.com/search?q=${flightNo}+flight+status`;

  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 border border-stone-100 dark:border-stone-700 shadow-sm mb-3 relative overflow-hidden transition-colors">
      {/* 右上角裝飾圓圈 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 dark:bg-stone-700/50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${type === '去程' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>{type}</span>
          <span className="text-xs font-bold text-stone-400">{date}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-center min-w-[3rem]">
            <div className="text-2xl font-bold text-stone-800 dark:text-stone-100 leading-none mb-1">{from}</div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-stone-400 font-bold tracking-widest">{fromCode}</span>
              {fromTerminal && <span className="mt-1 text-[10px] font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded shadow-sm">{fromTerminal}</span>}
            </div>
          </div>

          <div className="flex-1 px-3 flex flex-col items-center">
            <div className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">{flightNo}</div>
            <div className="w-full h-[2px] bg-stone-200 dark:bg-stone-600 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-stone-800 p-1">
                <Plane size={14} className="text-stone-300 dark:text-stone-500 rotate-90" />
              </div>
            </div>
            <div className="text-xs font-bold text-stone-400 mt-2 whitespace-nowrap">{time}</div>
          </div>

          <div className="text-center min-w-[3rem]">
            <div className="text-2xl font-bold text-stone-800 dark:text-stone-100 leading-none mb-1">{to}</div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-stone-400 font-bold tracking-widest">{toCode}</span>
              {toTerminal && <span className="mt-1 text-[10px] font-bold text-white bg-stone-400 px-1.5 py-0.5 rounded shadow-sm">{toTerminal}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">{airline}</span>
          </div>
          <a href={searchUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full transition-colors">
            即時動態 <ArrowRight size={12} />
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
  const [exchanges, setExchanges] = useState([]);
  const [newExName, setNewExName] = useState('');
  const [newExNote, setNewExNote] = useState('');
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

  useEffect(() => {
    const exRef = ref(db, 'exchanges');
    const unsubscribe = onValue(exRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) {
        setExchanges(val);
        localStorage.setItem('cm_exchanges_list', JSON.stringify(val)); // ← 燒錄本地備份
      } else {
        // B. 雲端是 null，先查本地有沒有存過
        const cachedEx = localStorage.getItem('cm_exchanges_list');
        if (cachedEx) {
          // 本地有 → 用本地的，不重新初始化（防復活）
          setExchanges(JSON.parse(cachedEx));
        } else {
          // 本地也沒有 → 才真正初始化
          const defaultExchanges = [
            { name: '佐賀港/長崎站 大黑屋', note: '🔥 在地連鎖老字號換匯所連線', map: '長崎 大黒屋' },
            { name: '7-11 ATM 提領', note: '👍 外國回饋卡海外提款最無腦便利', map: '長崎駅 セブン-イレブン' }
          ];
          set(exRef, defaultExchanges);
          setExchanges(defaultExchanges);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddEx = () => {
    if (!newExName.trim()) return;
    const newList = [...(exchanges || []), { name: newExName, note: newExNote, map: newExName }];
    set(ref(db, 'exchanges'), newList).then(() => { setNewExName(''); setNewExNote(''); });
  };

  return (
    <section className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 mb-6">
      <h3 className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100 mb-4 border-b pb-3"><Wallet size={18} className="text-green-600" /> 匯率換算與動態換匯系統</h3>
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-6">
        <div className="text-[10px] text-green-600 font-bold mb-2 flex justify-between"><span>即時基準：1 TWD ≈ {rate} JPY</span><span>{lastUpdate}</span></div>
        <div className="flex items-center gap-2">
          <input type="number" value={twd} onChange={(e) => { setTwd(e.target.value); setJpy(e.target.value ? (parseFloat(e.target.value) * rate).toFixed(0) : ''); }} placeholder="台幣" className="w-full p-2 rounded-lg border border-green-200 dark:border-green-800 dark:bg-stone-700 dark:text-white outline-none focus:border-green-500 font-bold text-stone-700" />
          <span className="text-stone-400 font-bold">=</span>
          <input type="number" value={jpy} onChange={(e) => { setJpy(e.target.value); setTwd(e.target.value ? (parseFloat(e.target.value) / rate).toFixed(1) : ''); }} placeholder="日幣" className="w-full p-2 rounded-lg border border-green-200 dark:border-green-800 dark:bg-stone-700 dark:text-white outline-none focus:border-green-500 font-bold text-stone-700" />
        </div>
      </div>
      
    </section>
  );
};

const ReservationAdminSection = () => {
  const [reservations, setReservations] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'reservations'), (snap) => {
      if (snap.val()) setReservations(snap.val());
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newList = [...reservations, { name: newName, date: newDate, time: newTime, note: newNote }];
    set(ref(db, 'reservations'), newList).then(() => {
      setNewName(''); setNewDate(''); setNewTime(''); setNewNote('');
    });
  };

  return (
    <div className="p-4 border-t border-stone-100 dark:border-stone-700 bg-blue-50 dark:bg-blue-950/20 space-y-2">
      <div className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">管理員新增預約</div>
      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="店名" className="w-full p-2 border rounded-lg text-xs bg-white dark:bg-stone-700 dark:text-white" />
      <div className="grid grid-cols-2 gap-2">
        <input value={newDate} onChange={e => setNewDate(e.target.value)} placeholder="日期 (6/18)" className="p-2 border rounded-lg text-xs bg-white dark:bg-stone-700 dark:text-white" />
        <input value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="時間 (21:00)" className="p-2 border rounded-lg text-xs bg-white dark:bg-stone-700 dark:text-white" />
      </div>
      <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="備註 (預約號碼等)" className="w-full p-2 border rounded-lg text-xs bg-white dark:bg-stone-700 dark:text-white" />
      <button onClick={handleAdd} className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs">+ 新增</button>
      {reservations.map((r, i) => (
        <div key={i} className="flex justify-between items-center text-xs bg-white dark:bg-stone-700 p-2 rounded-lg">
          <span className="dark:text-white">{r.name} · {r.date} {r.time}</span>
          <button onClick={() => set(ref(db, 'reservations'), reservations.filter((_, idx) => idx !== i))} className="text-red-400 ml-2">×</button>
        </div>
      ))}
    </div>
  );
};

// ============================================
// 共享塗鴉白板 v2 — 即時多人同步版
// 放在 GuidePage function 定義的上方
// ============================================

const SharedWhiteboard = ({ isAdmin, isMember }) => {
  const canvasRef = useRef(null);
  const [tool, setToolState] = useState('pen');
  const [color, setColor] = useState('#1A1510');
  const [size, setSize] = useState(4);
  const [textInput, setTextInput] = useState('');
  const painting = useRef(false);
  const lastPos = useRef(null);
  const isInit = useRef(false);
  const strokeHistory = useRef([]);
  const redoHistory = useRef([]); // 下一步暫存

  const COLORS = ['#1A1510','#FFFFFF','#E8334A','#F4831F','#F7E84E','#4BACD6','#5BB56A','#9B59B6','#EC4899','#92400E'];

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);

    get(ref(db, 'wb/snapshot')).then(snap => {
      if (snap.val()) {
        const img = new Image();
        img.onload = () => { ctx.drawImage(img, 0, 0, c.width, c.height); isInit.current = true; };
        img.src = snap.val();
      } else {
        isInit.current = true;
      }
    });
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    const strokesRef = ref(db, 'wb/strokes');

    const unsub = onValue(strokesRef, (snap) => {
      const data = snap.val();
      if (!isInit.current) return;
      const ctx = c.getContext('2d');

      get(ref(db, 'wb/snapshot')).then(snapShot => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, c.width, c.height);

        const applyStrokes = () => {
          if (data) Object.values(data).forEach(stroke => drawStroke(ctx, stroke));
        };

        if (snapShot.val()) {
          const img = new Image();
          img.onload = () => { ctx.drawImage(img, 0, 0, c.width, c.height); applyStrokes(); };
          img.src = snapShot.val();
        } else {
          applyStrokes();
        }
      });
    });

    return () => unsub();
  }, []);

  const drawStroke = (ctx, stroke) => {
    if (stroke.type === 'text') {
      ctx.font = `${stroke.fontSize}px 'Space Mono', monospace`;
      ctx.fillStyle = stroke.color;
      ctx.fillText(stroke.text, stroke.x, stroke.y);
      return;
    }
    if (!stroke.points || stroke.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.strokeStyle = stroke.type === 'eraser' ? '#FFFFFF' : stroke.color;
    ctx.lineWidth = stroke.type === 'eraser' ? stroke.size * 5 : stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const currentStroke = useRef([]);
  const currentStrokeKey = useRef(null);

  const getPos = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const sx = c.width / rect.width;
    const sy = c.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: Math.round((src.clientX - rect.left) * sx),
      y: Math.round((src.clientY - rect.top) * sy),
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    if (tool === 'text') {
      if (!textInput.trim()) return;
      const pos = getPos(e);
      const stroke = {
        type: 'text',
        text: textInput,
        x: pos.x, y: pos.y,
        color,
        fontSize: Math.max(16, size * 3),
        ts: Date.now(),
      };
      const key = Date.now().toString();
      strokeHistory.current.push({ key, stroke });
      redoHistory.current = [];
      set(ref(db, `wb/strokes/${key}`), stroke);
      return;
    }
    painting.current = true;
    currentStroke.current = [getPos(e)];
    currentStrokeKey.current = Date.now().toString();
  };

  const draw = (e) => {
    e.preventDefault();
    if (!painting.current) return;
    const pos = getPos(e);
    currentStroke.current.push(pos);

    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const pts = currentStroke.current;
    if (pts.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = tool === 'eraser' ? size * 5 : size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const stopDraw = () => {
    if (!painting.current) return;
    painting.current = false;
    if (currentStroke.current.length < 2) return;

    const stroke = {
      type: tool,
      color,
      size,
      points: currentStroke.current,
      ts: Date.now(),
    };
    const key = currentStrokeKey.current;
    strokeHistory.current.push({ key, stroke });
    redoHistory.current = [];
    set(ref(db, `wb/strokes/${key}`), stroke);
    currentStroke.current = [];

    get(ref(db, 'wb/strokes')).then(snap => {
      const count = snap.val() ? Object.keys(snap.val()).length : 0;
      if (count > 80) mergeSnapshot();
    });
  };

  // 🆕 上一步：刪掉自己這個 session 最後一筆
  const undoLast = () => {
    if (strokeHistory.current.length === 0) return;
    const last = strokeHistory.current.pop();
    redoHistory.current.push(last.stroke);
    set(ref(db, `wb/strokes/${last.key}`), null);
  };

  const redoLast = () => {
    if (redoHistory.current.length === 0) return;
    const stroke = redoHistory.current.pop();
    const key = Date.now().toString();
    strokeHistory.current.push({ key, stroke });
    set(ref(db, `wb/strokes/${key}`), stroke);
  };

  const mergeSnapshot = () => {
    const c = canvasRef.current;
    const off = document.createElement('canvas');
    off.width = 480; off.height = 320;
    off.getContext('2d').drawImage(c, 0, 0);
    const data = off.toDataURL('image/jpeg', 0.65);
    set(ref(db, 'wb/snapshot'), data);
    set(ref(db, 'wb/strokes'), null);
    strokeHistory.current = [];
    redoHistory.current = [];
  };

  const clearBoard = () => {
    if (!window.confirm('確定清空？所有人的塗鴉都會消失！')) return;
    set(ref(db, 'wb/snapshot'), '');
    set(ref(db, 'wb/strokes'), null);
    strokeHistory.current = [];
    redoHistory.current = [];
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.width, c.height);
  };

  const setTool = (t) => {
    setToolState(t);
    if (canvasRef.current) {
      canvasRef.current.style.cursor =
        t === 'eraser' ? 'cell' : t === 'text' ? 'text' : 'crosshair';
    }
  };

  const tbtn = (t) =>
    `text-[9px] font-bold px-3 py-1.5 rounded-full border transition-all ${
      tool === t
        ? 'bg-stone-900 text-amber-400 border-stone-900'
        : 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-300'
    }`;

  return (
    <section className="mt-4 rounded-[2rem] overflow-hidden border-2 border-stone-900 dark:border-stone-500"
      style={{ boxShadow: '4px 4px 0 #1A1510' }}>

      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 border-b-2 border-stone-900">
        <span className="text-[10px] font-bold tracking-widest uppercase text-stone-900">✏️ 共享塗鴉白板</span>
        <span className="text-[9px] text-stone-600 ml-1">大家都在同一張畫布上！</span>
      </div>

      <canvas
        ref={canvasRef}
        width={480} height={320}
        className="block w-full bg-white"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
        onMouseDown={isAdmin || isMember ? startDraw : undefined}
      onMouseMove={isAdmin || isMember ? draw : undefined}
      onMouseUp={stopDraw} onMouseLeave={stopDraw}
      onTouchStart={isAdmin || isMember ? startDraw : undefined}
      onTouchMove={isAdmin || isMember ? draw : undefined}
      onTouchEnd={stopDraw}
      style={{ touchAction: 'none', cursor: isAdmin || isMember ? 'crosshair' : 'not-allowed' }}
      />

      <div className="px-3 py-2.5 border-t-2 border-stone-900 bg-amber-50 dark:bg-stone-800 flex flex-wrap items-center gap-2">
        <button onClick={() => setTool('pen')} className={tbtn('pen')}>✏️ 畫筆</button>
        <button onClick={() => setTool('eraser')} className={tbtn('eraser')}>⬜ 橡皮</button>
        <button onClick={() => setTool('text')} className={tbtn('text')}>🔤 文字</button>
        <div className="w-px h-5 bg-stone-300 dark:bg-stone-600 mx-1" />
        {COLORS.map(c => (
          <button key={c} onClick={() => { setColor(c); if (tool === 'eraser') setTool('pen'); }}
            className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-transform"
            style={{ background: c, borderColor: color === c ? '#1A1510' : 'transparent',
              transform: color === c ? 'scale(1.3)' : 'scale(1)' }} />
        ))}
        {/* 🆕 上一步按鈕 */}
        <button onClick={undoLast}
          className="text-[9px] font-bold px-3 py-1.5 rounded-full border border-stone-400 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-700">
          ↩ 上一步
        </button>
        <button onClick={redoLast}
          className="text-[9px] font-bold px-3 py-1.5 rounded-full border border-stone-400 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-700">
          ↪ 下一步
        </button>
        <button onClick={clearBoard}
          className="text-[9px] font-bold px-3 py-1.5 rounded-full border border-red-300 text-red-500 bg-white dark:bg-stone-700">
          🗑 清空
        </button>
      </div>

      <div className="px-4 py-2 bg-amber-50 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex items-center gap-3">
        <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider">SIZE</span>
        <input type="range" min="2" max="30" value={size}
          onChange={e => setSize(parseInt(e.target.value))} className="flex-1" />
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="rounded-full transition-all border border-stone-400"
            style={{ background: color }}
            style={{ width: Math.max(4, Math.min(size * 1.2, 24)), height: Math.max(4, Math.min(size * 1.2, 24)) }} />
        </div>
      </div>

      {tool === 'text' && (
        <div className="px-3 py-2.5 bg-blue-50 dark:bg-stone-700 border-t border-stone-200 dark:border-stone-600 flex gap-2 items-center animate-fadeIn">
          <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
            placeholder="輸入文字後點畫布放置..." maxLength={20}
            className="flex-1 text-xs px-3 py-2 rounded-full border border-stone-300 bg-white dark:bg-stone-800 text-stone-800 dark:text-white outline-none focus:border-amber-400" />
          <span className="text-[9px] text-stone-400 whitespace-nowrap">→ 點畫布</span>
        </div>
      )}
    </section>
  );
};






const GuidePage = ({ isAdmin, isMember, noticeText, updateNoticeText, darkMode }) => {
  const [showPickyEater, setShowPickyEater] = useState(false);
  const [sharedStores, setSharedStores] = useState([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreUrl, setNewStoreUrl] = useState('');
  const [newStoreNote, setNewStoreNote] = useState('');
  const [showTaxRefund, setShowTaxRefund] = useState(false);
  const [adderName, setAdderName] = useState('佑任');
  const [taxInfo, setTaxInfo] = useState({ threshold: "5,000", luxuryThreshold: "500,000", totalThreshold: "5,000", fee: "0" });
  const [showReservations, setShowReservations] = useState(false);
  
const [reservations, setReservations] = useState([
  { name: '松翁軒 Café Sevilla（大正浪漫茶會）', date: '6/20 (六)', time: '12:00', note: '預約號碼：A000913389・4名席' },
  { name: '軍艦島登島船票', date: '6/18 (四)', time: '09:00', note: '預約號碼：128734' },
  { name: '大阪屋 浜町店（A5和牛燒肉）', date: '6/18 (四)', time: '21:00', note: '晚鳥時段・需電話確認' },
]);

useEffect(() => {
  const unsubscribe = onValue(ref(db, 'reservations'), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setReservations(data);
    }
  });
  return () => unsubscribe();
}, []);



  useEffect(() => {
    const taxRef = ref(db, 'taxRefund');
    const unsubscribe = onValue(taxRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setTaxInfo(val);
    });
    return () => unsubscribe();
  }, []);

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
  { en: 'No Raw Fish / Sashimi', th: '生魚・刺身NG', zh: '不吃生魚片 / 生食' },
  { en: 'No Beef', th: '牛肉NG', zh: '不吃牛肉' },
  { en: 'No Coriander', th: 'パクチーNG', zh: '不加香菜' },
  { en: 'No Green Onion / Scallion', th: 'ネギNG', zh: '不加蔥' },
  { en: 'No Ginger', th: '生姜NG', zh: '不加薑' },
  { en: 'No Garlic', th: 'ニンニクNG', zh: '不加蒜' },
  { en: 'No Cinnamon', th: 'シナモンNG', zh: '不加肉桂' },
  { en: 'No Chinese Chive', th: 'ニラNG', zh: '不加韭菜' },
  { en: 'No Star Anise', th: '八角NG', zh: '不加八角' },
  { en: 'No Celery', th: 'セロリNG', zh: '不加芹菜' },
];

  const guideSections = [
  {
   title: '長崎的墓',
    icon: <Flower2 className="text-pink-400" />,
    desc: '94長崎的墓',
    color: 'bg-pink-50 border-pink-100 dark:bg-pink-900/20 dark:border-pink-800',
    mapUrl: 'https://maps.app.goo.gl/hZPumAwkoMSeDiK79?g_st=al',
    aiQuery: '長崎有哪些古墓或特殊的墓 會吸引墳墓愛好者2026 以中文回答'
  },
  {
    title: '喫茶店與甜點',
    icon: <Coffee className="text-amber-600" />,
    desc: '1946年創業珈琲冨士男、長崎老宅復古喫茶文化巡禮。金箔五三燒長崎蛋糕、各式和菓子老鋪與網美咖啡甜點。',
    color: 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800',
    mapUrl: 'https://maps.app.goo.gl/Wni4jG8EwWNjj8dG6',
    aiQuery: '長崎老宅喫茶店以及甜點推薦2026 以中文回答'
  },
  {
    title: '必吃清單',
    icon: <UtensilsCrossed className="text-red-600" />,
    desc: '長崎強棒麵、角煮饅頭、A5和牛燒肉，沒吃到不算來過長崎。',
    color: 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800',
    mapUrl: 'https://maps.app.goo.gl/Hw4hAp8gDf7ow7sT8',
    aiQuery: '長崎必吃美食推薦2026 以中文回答'
  },
  {
    title: '微醺音樂酒吧',
    icon: <Beer className="text-purple-600" />,
    desc: '思案橋不夜城、出島 Wharf 海景居酒屋，長崎夜晚的靈魂。',
    color: 'bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800',
    mapUrl: 'https://maps.app.goo.gl/1qSnTLpqYi3rsUHy8',
    aiQuery: '長崎居酒屋酒吧推薦2026 以中文回答'
  },
  {
    title: '購物商舖',
    icon: <ShoppingBag className="text-blue-600" />,
    desc: '濱町觀光通、3COINS plus、海鷗市場免稅血拼完全攻略。',
    color: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800',
    mapUrl: 'https://maps.app.goo.gl/yGTKPTbhzX5sJyq97',
    aiQuery: '長崎購物免稅推薦2026 以中文回答'
  },
  {
    title: '佐賀午餐推薦',
    icon: <Utensils className="text-emerald-600" />,
    desc: '三瀨雞、佐賀牛、當地定食與特色便當推薦。',
    color: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800',
    mapUrl: 'https://maps.app.goo.gl/tHMhDYYxdsnkAjjh6',
    aiQuery: '佐賀必吃午餐推薦 2026 以中文回答'
  },
  {
    title: '佐賀晚餐推薦',
    icon: <UtensilsCrossed className="text-orange-600" />,
    desc: '三瀨雞串燒、鍋島清酒、佐賀在地居酒屋與海鮮。',
    color: 'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800',
    mapUrl: 'https://maps.app.goo.gl/Bc1z9oeXC95R2V2c9',
    aiQuery: '佐賀晚上必吃美食推薦 2026 以中文回答'
  },
];

  return (
    <div className="p-6 space-y-6 pb-24 animate-fadeIn">
      <section>
        <div className="bg-white dark:bg-stone-800 border border-amber-200 dark:border-amber-900/50 rounded-[2rem] p-5 shadow-sm">

          <div className="flex items-center gap-2 mb-3 text-amber-600 font-bold text-xs uppercase tracking-widest"><Pin size={14} className="rotate-45" /> 團隊重要通知公佈欄</div>
          {isAdmin ? (
            <textarea value={noticeText} onChange={(e) => updateNoticeText(e.target.value)} className="w-full bg-amber-50/50 rounded-2xl p-3 text-sm min-h-[100px] outline-none" />
          ) : (
            <div className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line italic px-1">{noticeText}</div>
          )}
        </div>
      </section>

 <SharedWhiteboard isAdmin={isAdmin} isMember={isMember} />


      <section>
        <button onClick={() => setShowPickyEater(!showPickyEater)} className="w-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl text-rose-500"><Ban size={20} /></div>
            <div className="font-bold text-rose-800 dark:text-rose-300 text-sm">挑食避雷救援卡 (日本餐廳出示)</div>
          </div>
          {showPickyEater ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showPickyEater && (
          <div className="mt-3 bg-white dark:bg-stone-800 rounded-3xl border border-rose-100 overflow-hidden">
            <div className="divide-y">
              {pickyItems.map((item, i) => (
                <div key={i} className="px-5 py-4 flex justify-between items-center">
                  <div className="flex flex-col"><span className="text-[10px] text-stone-400 font-bold">{item.en}</span><span className="font-bold text-stone-800 dark:text-stone-100">{item.zh}</span></div>
                  <div className="text-right"><span className="text-base font-black text-rose-600 font-serif">{item.th}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <button onClick={() => setShowTaxRefund(!showTaxRefund)} className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl text-amber-600"><Banknote size={20} /></div>
            <div className="font-bold text-amber-800 dark:text-amber-300 text-sm">2026 日本一般免稅規定 (長崎適用)</div>
          </div>
          {showTaxRefund ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showTaxRefund && (
          <div className="mt-3 bg-white dark:bg-stone-800 rounded-3xl border border-amber-200 dark:border-amber-900/50 p-5 space-y-3 text-sm">

            <p>🛍️ <strong>一般物品/消耗品門檻</strong>：單日同店消費滿 5,000 日圓（未稅）以上即可當場辦理免稅退稅。</p>
            <p>🛑 <strong>注意項</strong>：消耗品會以特殊免稅袋密封，在離開日本前**嚴禁拆封使用**，否則過海關若被抽查會被要求補繳消費稅！</p>
          </div>
        )}
      </section>

<section>
  <button onClick={() => setShowReservations(!showReservations)} className="w-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-xl text-blue-600"><Calendar size={20} /></div>
      <div className="font-bold text-blue-800 dark:text-blue-300 text-sm">已預約商家清單</div>
    </div>
    {showReservations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>
  {showReservations && (
    <div className="mt-3 bg-white dark:bg-stone-800 rounded-3xl border border-blue-100 dark:border-blue-900/50 overflow-hidden">
      <div className="divide-y divide-stone-100 dark:divide-stone-700">
        {reservations.map((r, i) => (
  <div key={i} className="px-5 py-4">
    <div className="flex justify-between items-start mb-1">
      <span className="font-bold text-stone-800 dark:text-stone-100 text-sm">{r.name}</span>
      <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{r.date}</span>
    </div>
    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
      <Clock size={11} /> {r.time} ・ {r.note}
    </div>
  </div>
))}
      </div>
      {isAdmin && (
        <ReservationAdminSection />
      )}
    </div>
  )}
</section>




      <div className="grid grid-cols-1 gap-4">
        {guideSections.map((section, idx) => (
          <div key={idx} className={`p-5 rounded-[2rem] border ${section.color} shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-white rounded-2xl shadow-sm">{section.icon}</div>
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">{section.title}</h3>
            </div>
            <p className="text-[11px] text-stone-500 mb-5">{section.desc}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.open(section.mapUrl, '_blank')}
                className="flex items-center justify-center gap-2 py-2.5 bg-stone-800 text-amber-50 rounded-2xl text-xs font-bold shadow-md active:scale-95"
              >
                <MapPin size={14} /> 開啟清單
              </button>
              <button
  onClick={() => window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent('長崎 ' + section.aiQuery)}`, '_blank')}
  className="flex items-center justify-center gap-2 py-2.5 border rounded-2xl text-xs font-bold shadow-sm active:scale-95"
  style={{
    background: darkMode ? '#2A2010' : '#ffffff',
    borderColor: darkMode ? '#F7E84E' : '#e2e8f0',
    color: darkMode ? '#F7E84E' : '#374151',
  }}
>
  <Sparkles size={14} className="text-teal-500" /> 問問 AI
</button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-[#FEF3C7] dark:bg-stone-800 p-6 rounded-[2.5rem] border-2 border-amber-300">
        <div className="flex items-center gap-2 mb-5 text-amber-900 dark:text-amber-400 font-black text-sm tracking-wider"><Sparkles size={16} /> 團員私藏好店許願池</div>
        <div className="space-y-4 mb-6">
          {sharedStores.length === 0 && <div className="text-xs text-stone-400 text-center py-4">目前還沒有人新增願望喔！</div>}
          {sharedStores.map((store, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 p-4 rounded-2xl border flex justify-between">
              <div>
                <div className="font-bold text-base">{store.name}</div>
                {store.note && <div className="text-xs text-stone-500">💬 {store.note}</div>}
                <div className="text-[10px] text-amber-700 mt-1">Added by {store.adder}</div>
              </div>
              {isAdmin && <button onClick={() => set(ref(db, 'sharedStores'), sharedStores.filter((_, idx) => idx !== i))} className="text-stone-300 hover:text-red-400"><Trash2 size={16} /></button>}
            </div>
          ))}
        </div>
        {(isAdmin || isMember) && (
          <div className="space-y-2">
            <select value={adderName} onChange={(e) => setAdderName(e.target.value)} className="w-full p-2 rounded-xl text-xs font-bold border border-amber-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
              {USERS.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            <input value={newStoreName} onChange={(e) => setNewStoreName(e.target.value)} placeholder="店家名稱" className="w-full p-2 border rounded-xl text-sm bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-400" />
            <input value={newStoreNote} onChange={(e) => setNewStoreNote(e.target.value)} placeholder="理由備註" className="w-full p-2 border rounded-xl text-sm bg-white dark:bg-stone-700 text-stone-800 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-400" />
            <button onClick={handleAddStore} className="w-full bg-amber-500 text-white font-bold py-2 rounded-xl text-sm">+</button>
          </div>
        )}
      </section>
    </div>
  );
};

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
    <div className="p-6 space-y-6 pb-24 bg-[#FDFBF7] dark:bg-stone-900 transition-colors">
      <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100">實用工具及資訊</h2>
      {isAdmin && (
        <section className="bg-stone-800 p-6 rounded-2xl text-white">
          <h3 className="flex items-center gap-2 font-bold text-amber-400 mb-4 border-b border-stone-700 pb-3"><Settings size={18} /> 管理端設定</h3>
          <input type="text" value={systemInfo || ''} onChange={(e) => updateSystemInfo(e.target.value)} className="w-full bg-stone-900 border rounded-xl px-3 py-2 text-sm text-emerald-200" />
        </section>
      )}
{isMember && (
  <section className="bg-[#06C755] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
    <h3 className="flex items-center gap-2 font-bold text-white mb-2 relative z-10">
      <Wallet size={18} /> 公款記帳與分帳
    </h3>
    <p className="text-green-50 text-sm mb-6 relative z-10 font-medium">
      所有公費支出請統一記錄在此，系統會自動結算每個人該付多少錢。
    </p>
    <a href="https://liff.line.me/1655320992-Y8GowEpw/g/t6Tf4q8GCMHz2D3YgoWyMX"
      target="_blank" rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full bg-white text-[#06C755] py-3.5 rounded-xl font-bold active:scale-95 transition-all relative z-10"
    >
      開啟 Lightsplit 分帳群組 <ArrowRight size={16} />
    </a>
  </section>
)}




      
      <section className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700">
        <h3 className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100 mb-4 border-b pb-3"><Plane size={18} className="text-blue-500" /> 航班詳細資訊</h3>
        {UTILS_DATA.flights.map((f, i) => <FlightCard key={i} {...f} />)}
        {isMember && (
          <a href={UTILS_DATA.driveUrl} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold active:scale-95 transition-all"
          >
            <Info size={16} /> 開啟電子機票 / 各種憑證
          </a>
        )}


      </section>
      <section className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700">
        <h3 className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100 mb-4 border-b pb-3"><Home size={18} className="text-orange-500" /> 住宿飯店導航</h3>
        <div className="space-y-4">
          {UTILS_DATA.accommodations.map((acc, idx) => (
            <div key={idx} className="bg-stone-50 dark:bg-stone-700/50 rounded-xl p-4 border border-stone-100 dark:border-stone-600 relative">

              <div className="flex justify-between items-start mb-2">
                <div><span className="text-[10px] text-stone-400 font-bold">{acc.type}</span><h4 className="font-bold text-base">{acc.name}</h4></div>
                <span className="text-xs font-bold bg-white dark:bg-stone-600 px-2 py-1 rounded border border-stone-200 dark:border-stone-500 whitespace-nowrap">
{acc.date}</span>
              </div>
              <p className="text-xs text-stone-500 mb-4"><MapPin size={10} className="inline mr-1" />{acc.address}</p>
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(acc.mapQuery)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 py-2 bg-stone-800 text-amber-50 rounded-lg text-xs font-bold"><Navigation size={12} />導航</a>
                <a href={`tel:${acc.phone}`} className="flex items-center justify-center gap-1.5 py-2 bg-white dark:bg-stone-600 border border-stone-200 dark:border-stone-500 text-stone-600 dark:text-stone-200 rounded-lg text-xs font-bold">
<Phone size={12} />聯絡</a>
              </div>
            </div>
          ))}
        </div>
        {(isAdmin || isMember) && (
    <a href={UTILS_DATA.driveUrl} target="_blank" rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold active:scale-95 transition-all"
    >
      <Info size={16} /> 查看住宿憑證
    </a>
  )}
      </section>




      <section className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 mb-6">

  <h3 className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100 mb-4 border-b dark:border-stone-700 pb-3">
    <Smartphone size={18} className="text-purple-500" /> 旅行必備 App
  </h3>
  <div className="space-y-3">
    <a href="https://studio--studio-9206745680-de144.us-central1.hosted.app"
      target="_blank" rel="noreferrer"
      className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-100 dark:border-stone-600 active:scale-95 transition-all"
    >
      <div>
        <div className="font-bold text-stone-800 dark:text-stone-100 text-sm">DIGEST 菜單翻譯</div>
        <div className="text-[10px] text-stone-500">拍照即時翻譯日文菜單</div>
      </div>
      <ArrowRight size={16} className="text-stone-400" />
    </a>

<div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-100 dark:border-stone-600">
  <div>
    <div className="font-bold text-stone-800 dark:text-stone-100 text-sm">豪斯登堡官方 App</div>
    <div className="text-[10px] text-stone-500">等待時間・餐廳叫號・表演日程・園區地圖</div>
  </div>
  <div className="flex gap-2">
    <a href="https://apps.apple.com/jp/app/id6450489514" target="_blank" rel="noreferrer"
      className="text-[10px] font-bold bg-stone-800 text-white px-2 py-1 rounded-lg">iOS</a>
    <a href="https://play.google.com/store/apps/details?id=jp.co.huistenbosch.ThemapaNavi.huistenbosch" target="_blank" rel="noreferrer"
      className="text-[10px] font-bold bg-stone-800 text-white px-2 py-1 rounded-lg">Android</a>
  </div>
</div>

<a href="https://static.japan.travel.navitime.com/web/walk/contents/html/boot/market.html?utm_source=safetytips&utm_medium=web&utm_campaign=safetytips"
  target="_blank" rel="noreferrer"
  className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-100 dark:border-stone-600 active:scale-95 transition-all"
>
  <div>
    <div className="font-bold text-stone-800 dark:text-stone-100 text-sm">Japan Travel by Navitime</div>
    <div className="text-[10px] text-stone-500">離線地圖・交通路線・景點導覽</div>
  </div>
  <ArrowRight size={16} className="text-stone-400" />
</a>


    <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl border border-stone-100 dark:border-stone-600">
      <div>
        <div className="font-bold text-stone-800 dark:text-stone-100 text-sm">ecbo cloak 行李寄放</div>
        <div className="text-[10px] text-stone-500">找附近寄放行李的店家</div>
      </div>
      <div className="flex gap-2">
        <a href="https://apps.apple.com/tw/app/ecbo-cloak-%E6%97%A5%E6%9C%AC%E5%AF%84%E7%89%A9%E6%9C%8D%E5%8B%99/id1443707795" target="_blank" rel="noreferrer"
          className="text-[10px] font-bold bg-stone-800 text-white px-2 py-1 rounded-lg">iOS</a>
        <a href="https://play.google.com/store/apps/details?id=io.ecbo.cloak&pcampaignid=web_share" target="_blank" rel="noreferrer"
          className="text-[10px] font-bold bg-stone-800 text-white px-2 py-1 rounded-lg">Android</a>
      </div>
    </div>
  </div>
</section>
<section className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 mb-6">
  <h3 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-4 border-b border-stone-100 dark:border-stone-700 pb-3">
    <AlertCircle size={18} className="text-red-600" /> 緊急救援中心
  </h3>
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-3">
      <a href="tel:110" className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl flex flex-col items-center border border-red-100 dark:border-red-900/50">
        <span className="text-2xl font-black text-red-600 dark:text-red-400">110</span>
        <span className="text-xs font-bold text-red-800 dark:text-red-300">警察報案</span>
      </a>
      <a href="tel:119" className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl flex flex-col items-center border border-red-100 dark:border-red-900/50">
        <span className="text-2xl font-black text-red-600 dark:text-red-400">119</span>
        <span className="text-xs font-bold text-red-800 dark:text-red-300">救護車／火災</span>
      </a>
    </div>

    <div className="bg-stone-800 dark:bg-stone-950 rounded-xl p-4 text-stone-300 text-sm space-y-4">
      <div onClick={handleAppDownload} className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3 cursor-pointer active:scale-95 transition-all hover:bg-amber-500/20 group">
        <div className="p-2 bg-amber-500 rounded-full text-stone-900 flex-shrink-0">
          <Smartphone size={16} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">必備救命工具</div>
            <div className="text-[9px] text-amber-500/60 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">點擊跳轉商店</div>
          </div>
          <div className="text-xs font-bold text-stone-100">下載 Japan Safety Tips</div>
          <div className="text-[9px] text-stone-400 mt-0.5">地震海嘯警報・多國語言緊急通知</div>
        </div>
        <ArrowRight size={14} className="text-stone-600 group-hover:text-amber-500" />
      </div>

      

      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-stone-700 pb-2">
          <span>🇹🇼 駐日辦事處 (福岡・一般)</span>
          <a href="tel:+81927342810" className="text-stone-300 font-bold">+81-92-734-2810</a>
        </div>
        <div className="flex justify-between items-center border-b border-stone-700 pb-2">
          <span>🇹🇼 駐日辦事處 (急難)</span>
          <a href="tel:+81927342810" className="text-amber-400 font-bold">+81-92-734-2810</a>
        </div>
        <div className="flex justify-between items-center border-b border-stone-700 pb-2">
          <span>👮 當地報案 (Police)</span>
          <a href="tel:110" className="text-white font-bold">110</a>
        </div>
        <div className="flex justify-between items-center border-b border-stone-700 pb-2">
          <span>🚑 救護車／火災</span>
          <a href="tel:119" className="text-white font-bold">119</a>
        </div>
        <div className="flex justify-between items-center border-b border-stone-700 pb-2">
          <span>💳 Visa 全球掛失</span>
          <a href="tel:00531110001" className="text-stone-400 text-xs">0053-111-0001</a>
        </div>
        <div className="flex justify-between items-center border-b border-stone-700 pb-2">
          <span>💳 JCB 掛失</span>
          <a href="tel:00531110011" className="text-stone-400 text-xs">0053-111-0011</a>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span>💳 Mastercard 掛失</span>
          <a href="tel:00531110086" className="text-stone-400 text-xs">0053-111-0086</a>
        </div>
      </div>
    </div>
  </div>
</section>




      <CurrencySection isAdmin={isAdmin} isMember={isMember} />


{isMember && (
<section className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700">
  <h3 className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100 mb-4 border-b pb-3">
    <ShoppingBag size={18} className="text-rose-500" /> 日本集運寄回台灣
  </h3>

  {/* 站點地址卡 */}
  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/50 mb-4">
    <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3">📦 集運站點地址（千葉站）</div>
    <div className="space-y-3">
      {[
        { label: '郵遞區號', value: '290-0166' },
        { label: '地址', value: '千葉縣市原市犬成1069-1 運匠倉 63220' },
        { label: '收件人', value: '張佑任 63220' },
        { label: '電話', value: '070-9003-7588' },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between py-2 border-b border-rose-100 dark:border-rose-900/30 last:border-0">
          <div>
            <div className="text-[9px] text-stone-400 font-bold uppercase tracking-wide">{item.label}</div>
            <div className="font-bold text-stone-800 dark:text-stone-100 text-sm mt-0.5">{item.value}</div>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(item.value); }}
            className="flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
          >
            複製
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* 日本地址填寫教學 */}
  <div className="bg-stone-50 dark:bg-stone-700/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-600">
    <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
      <Info size={11} /> 日本地址填寫說明（購物網站用）
    </div>
    <div className="space-y-2 text-xs">
      {[
        { label: '氏名【姓名】', value: '輸入姓名 + 會員編號' },
        { label: '郵便番号【郵遞區號】', value: '290-0166' },
        { label: '都道府県【城市】', value: '千葉縣' },
        { label: '市區町村【區域】', value: '市原市' },
        { label: '町名番地【地名】', value: '犬成1069-1' },
        { label: '建物名・部屋番号【門牌號】', value: '運匠倉 + 會員編號' },
        { label: '電話番号【電話】', value: '070-9003-7588' },
      ].map((row) => (
        <div key={row.label} className="grid grid-cols-2 gap-2 py-1.5 border-b border-stone-100 dark:border-stone-600 last:border-0">
          <span className="text-stone-500 dark:text-stone-400 text-[10px] leading-relaxed">{row.label}</span>
          <span className="font-bold text-stone-700 dark:text-stone-200 text-[11px]">{row.value}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl text-[10px] text-amber-800 dark:text-amber-300 font-bold">
      ⚠️ 會員編號請向佑任確認，填錯將導致包裹遺失！
    </div>
  </div>
</section>

)}





    </div>
  );
};

/*const TippingGuide = () => (
  <section className="bg-white dark:bg-stone-800 p-6 rounded-2xl border mb-6">
    <h3 className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100 mb-4 border-b pb-3"><Coins size={18} className="text-amber-500" /> 日本支付與分帳提示</h3>
    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">日本環境不需要支付任何小費。公帳請大家集中統一記錄，回台或每天結束後再行結算。退稅門檻為當天同店未稅滿 5,000 日圓，記得隨身攜帶護照正本以供海關蓋章查驗。</p>
  </section>
);*/

const KyushuTips = ({ onTrigger }) => {
  const [isOpen, setIsOpen] = useState(true); // ← 加回 state

  return (
    <div className="mx-6 mt-6 mb-6">
      <div className="bg-amber-50 dark:bg-stone-800 rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)} // ← 加回 onClick
          className="w-full flex items-center justify-between p-4 bg-amber-100/50 dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-bold hover:bg-amber-100 dark:hover:bg-stone-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600" />
            <span>2026 九州天候防範禁忌</span>
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />} {/* ← 加回箭頭 */}
        </button>

        {isOpen && ( // ← 加回條件渲染
          <div className="p-4 space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-amber-50 dark:bg-stone-800 transition-colors">
            {/* 內容完全不動 */}

            <div className="flex gap-3">
  <div className="min-w-[24px] text-amber-600 font-bold mt-1"><Zap size={18} /></div>
  <div>
    <strong className="text-stone-900 dark:text-stone-100 block mb-1">行動電源攜帶鐵律</strong>
    <ul className="list-disc pl-4 text-xs text-stone-500 dark:text-stone-400 space-y-1">
      <li>手提行動電源<span className="text-red-600 font-bold">絕對嚴禁託運</span>，必須隨身攜帶。</li>
      <li>依虎航最新規範，嚴禁放置於頭頂置物櫃，必須放在前方座位下方。</li>
    </ul>
  </div>
</div>
<div className="flex gap-3 mt-3" onClick={onTrigger}>
  <div className="min-w-[24px] text-green-600 font-bold cursor-pointer select-none active:scale-95"><AlertTriangle size={18} /></div>
  <div className="cursor-pointer select-none">
    <strong className="text-stone-900 dark:text-stone-100 block">軍艦島風浪備對策</strong>
    <p className="text-xs text-stone-500 dark:text-stone-400">若 Day 3 上午因外海浪大導致船隻無法登島，立刻啟動備案改往出島深度慢遊，並彈性調整稻佐山夜景期。當天全團嚴禁吃早餐防劇烈嘔吐！</p>
  </div>
</div>




          </div>
        )}
      </div>
    </div>
  );
};

const PackingPage = ({ isKonamiActive, isAdmin, isMember, onSecretTrigger }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [packingData, setPackingData] = useState({});
  const [newItem, setNewItem] = useState('');
  const [showToast, setShowToast] = useState(false);

  const CHARACTER_MAP = {
    佑任: process.env.PUBLIC_URL + '/sanrio/3.png',
    軒寶: process.env.PUBLIC_URL + '/sanrio/1.png',
    阿歪: process.env.PUBLIC_URL + '/sanrio/2.png',
    黃蔓: process.env.PUBLIC_URL + '/sanrio/4.png',
  };
  const STYLE_MAP = { 
    佑任: 'w-16 h-16 translate-y-2', 
    軒寶: 'w-16 h-16 translate-y-2', 
    阿歪: 'w-16 h-16 translate-y-2', 
    黃蔓: 'w-16 h-16 translate-y-2 scale-110' 
  };

  const HEADER_ICON_STYLE = { 
    佑任: 'w-9 h-9', 
    軒寶: 'w-9 h-9', 
    阿歪: 'w-9 h-9', 
    黃蔓: 'w-9 h-9 scale-110' 
  };

  useEffect(() => {
    const saved = localStorage.getItem('cm_packing_list_v2');
    if (saved) { setPackingData(JSON.parse(saved)); }
    else {
      const initialData = {};
      USERS.forEach((user) => { initialData[user] = DEFAULT_ITEMS.map((item) => ({ name: item, checked: false })); });
      setPackingData(initialData);
      localStorage.setItem('cm_packing_list_v2', JSON.stringify(initialData));
    }
  }, []);

  const saveToStorage = (newData) => { localStorage.setItem('cm_packing_list_v2', JSON.stringify(newData)); setPackingData(newData); };

  const toggleItem = (user, index) => {
    if (!isAdmin && !isMember) { setShowToast(true); setTimeout(() => setShowToast(false), 3000); return; }
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
    <div className="pb-24 min-h-screen bg-[#FDFBF7] dark:bg-stone-900 relative">
      <KyushuTips onTrigger={onSecretTrigger} />
      
      
      
      <div className="mx-6 mt-6">
  <a href="https://vjw-lp.digital.go.jp/zh-hant/" target="_blank" rel="noreferrer"
    className="bg-white dark:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700 py-4 px-4 rounded-2xl flex items-center justify-between gap-2 text-stone-600 dark:text-stone-300 w-full active:scale-95 transition-transform"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
        <FileText size={20} className="text-blue-500" />
      </div>
      <div>
        <div className="font-bold text-sm text-stone-800 dark:text-stone-100">Visit Japan Web</div>
        <div className="text-[10px] text-stone-400 mt-0.5">入境申報 / 免稅 / 簽證</div>
      </div>
    </div>
    <ArrowRight size={16} className="text-stone-400" />
  </a>
</div>


      {showToast && (
        <div className="fixed bottom-24 left-6 right-6 z-50 animate-bounce">
          <div className="bg-stone-800 text-white p-4 rounded-2xl border border-stone-700 flex items-center gap-3">
            <Lock size={20} className="text-amber-400" />
            <div><div className="font-bold text-sm">訪客唯讀模式 Read Only</div><div className="text-[10px] text-stone-300">請輸入密碼解鎖後編輯項目</div></div>
          </div>
        </div>
      )}
      <div className="px-6 mt-2 mb-4"><h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2"><span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>行李防呆準備清單</h2></div>
      <div className="px-6 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {USERS.map((user) => (
            <button key={user} onClick={() => setCurrentUser(user)} className={`relative flex flex-col items-center justify-end rounded-2xl border py-2 ${currentUser === user ? 'bg-stone-800 text-stone-50' : 'bg-stone-900/50 text-stone-400'}`}>
              {isKonamiActive ? (
                <div className="animate-bounce flex flex-col items-center">
                  <div className="h-[60px] flex items-end"><img src={CHARACTER_MAP[user]} alt={user} className={STYLE_MAP[user]} /></div>
                  <span className="text-[10px] mt-1">{user}</span>
                </div>
              ) : (
                <div className="h-[60px] flex flex-col justify-end pb-1 text-center"><span>{user}</span><span className="text-[9px]">{getProgress(user)}%</span></div>
              )}
            </button>
          ))}
        </div>
      </div>
      {currentUser ? (
        <div className="px-6 animate-fadeIn">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-2">{currentUser} 的打包清單 {isKonamiActive && <img src={CHARACTER_MAP[currentUser]} className={HEADER_ICON_STYLE[currentUser]} alt="icon" />}</h2>
            <span className="text-xs text-stone-400 font-bold">{packingData[currentUser]?.filter(i => i.checked).length} / {packingData[currentUser]?.length} 完成</span>
          </div>
          <div className="h-1.5 w-full bg-stone-200 rounded-full mb-6 overflow-hidden"><div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${getProgress(currentUser)}%` }} /></div>
          {(isAdmin || isMember) && (
            <div className="mb-6 flex gap-2">
              <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="自訂行李項目..." className="flex-1 p-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:border-amber-500 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-sm placeholder:text-stone-400" onKeyPress={(e) => e.key === 'Enter' && addItem()} />
              <button onClick={addItem} className="bg-stone-800 text-amber-50 px-5 rounded-xl font-bold">+</button>
            </div>
          )}
          <div className="space-y-3">
            {packingData[currentUser]?.map((item, idx) => (
              <div key={idx} onClick={() => toggleItem(currentUser, idx)} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer
  ${item.checked
                  ? 'bg-stone-100 dark:bg-stone-800/50 border-transparent opacity-60'
                  : 'bg-white dark:bg-stone-800 border-stone-100 dark:border-stone-700 shadow-sm hover:shadow-md'
                }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0
  ${item.checked
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700'
                  }`}>{item.checked && <CheckCircle size={14} />}</div>
                <span className={`flex-1 font-medium ${item.checked
                  ? 'text-stone-400 dark:text-stone-600 line-through decoration-stone-400'
                  : 'text-stone-700 dark:text-stone-200'
                  }`}>{item.name}</span>
                {(isAdmin || isMember) && <button onClick={(e) => { e.stopPropagation(); deleteItem(idx); }} className="text-stone-300 hover:text-red-400">×</button>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-10 py-20 text-center text-stone-400 dark:text-stone-600">
          <p className="text-sm">👆 請先點選上方按鈕<br />開啟專屬清單<br />(此處有彩蛋喔~提示:上下左右)</p>
        </div>
      )}
    </div>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => { if (window.scrollY > 300) setIsVisible(true); else setIsVisible(false); };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return isVisible ? (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-24 right-4 z-40 p-3 bg-stone-800/80 backdrop-blur text-amber-400 rounded-full border border-stone-600"><ArrowRight size={20} className="-rotate-90" strokeWidth={3} /></button>
  ) : null;
};

// ============================================
// 🔥 完整保留原汁原味：TravelApp 主核心引擎
// ============================================
export default function TravelApp() {
  const [isLocked, setIsLocked] = useState(() => { return localStorage.getItem('isUnlocked') !== 'true'; });
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
  const [systemInfo, setSystemInfo] = useState('System Ver. 1.0 米飛六月荷蘭物語 🚀');
  const [noticeText, setNoticeText] = useState('載入中...');
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleSecretTrigger = () => {
  setSecretClickCount(prev => {
    const newCount = prev + 1;
    console.log('secret count:', newCount);
    if (newCount >= 5) {
      setShowSecret(true);
      alert("九州隱藏卡片開啟！");
      return 0;
    }
    return newCount;
  });
};

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'ODY4Njc3MDg=') { setIsAdmin(true); setIsMember(true); }
    else if (savedRole === 'NTU2Ng==') { setIsAdmin(false); setIsMember(true); }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) { setDarkMode(true); }
  }, []);

  // 🎯 Firebase 長效同步與自動重連核心電路
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
      isConnectedRef.current = (connected === true);
    });

    unsubscribeItinerary = onValue(itineraryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) { setItinerary(data); localStorage.setItem('cm_itinerary_backup', JSON.stringify(data)); setIsLoadingData(false); }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(() => { if (!isConnectedRef.current) { goOffline(db); setTimeout(() => goOnline(db), 300); } }, 500);
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
    onValue(ref(db, 'noticeBoard'), (snap) => { if (snap.val() !== null) setNoticeText(snap.val()); else setNoticeText('📌 點擊編輯公佈欄，記錄重要資訊'); });
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
    if (dayData && dayData.locations[locIndex]) { dayData.locations[locIndex][field] = value; updateFirebase(newItinerary); }
  };

  const handleTimeUpdate = (dayNum, locIndex, newTime) => {
    const newItinerary = [...itinerary];
    const dayData = newItinerary.find((d) => d.day === dayNum);
    if (dayData && dayData.locations[locIndex]) { dayData.locations[locIndex].time = newTime; updateFirebase(newItinerary); }
  };

  const handleAddLocation = (dayNum) => {
    const newItinerary = [...itinerary];
    const dayData = newItinerary.find((d) => d.day === dayNum);
    if (dayData) { dayData.locations.push({ imageId: '', type: 'sight', time: '00:00', name: '新行程', note: '請編輯內容', desc: '', nav: '', difficulty: '中' }); updateFirebase(newItinerary); }
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
        const temp = dayData.locations[locIndex]; dayData.locations[locIndex] = dayData.locations[newIndex]; dayData.locations[newIndex] = temp; updateFirebase(newItinerary);
      }
    }
  };

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

  useEffect(() => {
    const handleStart = (clientX, clientY) => { touchStartRef.current = { x: clientX, y: clientY }; };
    const handleEnd = (clientX, clientY) => {
      const diffX = clientX - touchStartRef.current.x; const diffY = clientY - touchStartRef.current.y;
      if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;
      let direction = Math.abs(diffX) > Math.abs(diffY) ? (diffX > 0 ? 'right' : 'left') : (diffY > 0 ? 'down' : 'up');
      setKonamiSequence((prev) => [...prev, direction].slice(-4));
    };
    const onTouchStart = (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = (e) => handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    window.addEventListener('touchstart', onTouchStart); window.addEventListener('touchend', onTouchEnd);
    return () => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); };
  }, []);

  useEffect(() => {
    if (konamiSequence.join(' ') === 'up down left right') {
      setIsKonamiActive((prev) => { alert(!prev ? '🌟 巨星模式啟動！' : '關閉隱藏模式 👋'); return !prev; }); setKonamiSequence([]);
    }
  }, [konamiSequence]);

  const handleUnlock = () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') { DeviceMotionEvent.requestPermission().catch(console.error); }
    const encodedInput = btoa(inputPwd);
    const validCodes = ['ODY4Njc3MDg=', 'NTU2Ng==', 'ODg4OA=='];
    if (validCodes.includes(encodedInput)) { localStorage.setItem('isUnlocked', 'true'); localStorage.setItem('userRole', encodedInput); }
    if (encodedInput === 'ODY4Njc3MDg=') { setIsAdmin(true); setIsMember(true); setIsUnlocking(true); setTimeout(() => setIsLocked(false), 1000); }
    else if (encodedInput === 'NTU2Ng==') { setIsAdmin(false); setIsMember(true); setIsUnlocking(true); setTimeout(() => setIsLocked(false), 1000); }
    else if (encodedInput === 'ODg4OA==') { setIsAdmin(false); setIsMember(false); setIsUnlocking(true); setTimeout(() => setIsLocked(false), 1000); }
    else { alert('密碼錯誤！🔒'); setInputPwd(''); }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <style>
  {`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
    svg, img { user-select: none; pointer-events: none; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    @media print {
      #main-app-container { display: none !important; }
      #print-zone { display: block !important; background: white !important; }
    }

/* ============================================================
   KYUSHU 2026 — Dick Bruna Miffy  Huis Ten Bosch  Nagasaki
   v2 — Bug fixes
   ============================================================ */



/* ── Dick Bruna 原版色票 ── */
:root {
  --miffy-yellow:  #F7E84E;
  --miffy-orange:  #F4831F;
  --miffy-blue:    #4BACD6;
  --miffy-green:   #5BB56A;
  --tulip-red:     #E8334A;
  --ink:           #1A1510;
  --card-white:    #FFFFFF;
  --faded:         #666660;
  --ear-pink:      #F4C5C5;

  --bg-page:    var(--miffy-yellow);
  --bg-card:    var(--card-white);
  --border:     var(--ink);
  --text-main:  var(--ink);
  --text-muted: var(--faded);

  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body:    'Libre Baskerville', Georgia, serif;
  --font-mono:    'Space Mono', 'Courier New', monospace;

  --r-sm: 10px;
  --r-md: 16px;
  --r-lg: 20px;
  --r-xl: 28px;
  --bw:    2px;
  --bw-lg: 2.5px;
}

/* ── Dark Mode ── */
.dark {
  --bg-page:   #2A2010;
  --bg-card:   #33291A;
  --text-main: #F5EDD5;
  --text-muted:#A09070;
  --border:    #F7E84E;
}

/* ============================================================
   BASE
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; }

body, #root {
  font-family: var(--font-body);
  background-color: var(--bg-page);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
svg, img { user-select: none; pointer-events: none; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease forwards; }

@media print {
  #main-app-container { display: none !important; }
  #print-zone { display: block !important; background: white !important; }
}

/* ============================================================
   PAGE BACKGROUND
   ============================================================ */
.bg-\[#FDFBF7\],
.min-h-screen.bg-\[#FDFBF7\],
.bg-\[#FDFBF7\].dark\:bg-stone-900 {
  background-color: var(--miffy-yellow) !important;
}
.dark .bg-\[#FDFBF7\],
.dark.bg-stone-900,
.dark .min-h-screen,
.dark .bg-\[#FDFBF7\].dark\:bg-stone-900 {
  background-color: var(--bg-page) !important;
}

/* ============================================================
   COUNTDOWN BANNER
   ============================================================ */
.absolute.top-0.left-0.right-0.py-1\.5 {
  background-color: var(--tulip-red) !important;
  color: #fff !important;
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
  letter-spacing: 2px !important;
  text-transform: uppercase !important;
  border-bottom: var(--bw) solid var(--ink) !important;
}

/* ============================================================
   WEATHER HERO
   ============================================================ */
.relative.bg-\[#FDFBF7\].dark\:bg-stone-900.pt-0.pb-8.px-6 {
  background-color: var(--miffy-yellow) !important;
  border-bottom: var(--bw-lg) solid var(--ink) !important;
  border-radius: 0 !important;
}
.dark .relative.bg-\[#FDFBF7\].dark\:bg-stone-900.pt-0.pb-8.px-6 {
  background-color: var(--bg-page) !important;
  border-bottom-color: var(--miffy-yellow) !important;
}

.absolute.top-\[-20px\].right-\[-20px\] {
  color: rgba(26, 21, 16, 0.06) !important;
  font-family: var(--font-display) !important;
}

.px-2\.5.py-1.bg-amber-100 {
  background-color: var(--card-white) !important;
  color: var(--ink) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: 20px !important;
  font-family: var(--font-mono) !important;
  font-size: 8px !important;
  letter-spacing: 1px !important;
}
.dark .px-2\.5.py-1.dark\:bg-stone-800 {
  background-color: rgba(255,255,255,0.1) !important;
  color: var(--miffy-yellow) !important;
  border-color: var(--miffy-yellow) !important;
}

.text-2xl.font-bold.text-transparent {
  font-family: var(--font-display) !important;
  background: linear-gradient(135deg, var(--miffy-orange) 0%, #C9600A 100%) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}

h1.text-4xl.font-serif {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
  letter-spacing: -1px !important;
}
.dark h1.text-4xl.font-serif {
  color: var(--miffy-yellow) !important;
}

h1.text-4xl span.text-amber-600,
h1.text-4xl span.text-amber-500 {
  color: var(--miffy-orange) !important;
  font-style: italic !important;
}

.text-5xl.font-serif.font-medium {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
}
.dark .text-5xl.font-serif.font-medium {
  color: var(--miffy-yellow) !important;
}

.text-\[10px\].font-bold.text-stone-400.uppercase.tracking-widest {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
  letter-spacing: 3px !important;
}
.dark .text-\[10px\].font-bold.text-stone-400 {
  color: var(--text-muted) !important;
}

/* AQI pill */
.text-\[10px\].font-bold.px-2.py-0\.5.rounded-full {
  font-family: var(--font-mono) !important;
  border-radius: 20px !important;
  border: var(--bw) solid var(--ink) !important;
}
.bg-emerald-100.text-emerald-700 {
  background-color: var(--miffy-green) !important;
  color: #fff !important;
}
.dark .bg-emerald-900.text-emerald-300 {
  background-color: var(--miffy-green) !important;
  color: #fff !important;
}

/* 濕度 */
.bg-white\/50.dark\:bg-stone-800\/50.px-2.py-0\.5.rounded-full {
  background-color: var(--miffy-blue) !important;
  color: #fff !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: 20px !important;
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
}

/* 24h forecast */
.bg-white\/80 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
}
.dark .bg-white\/80,
.dark .bg-stone-800\/80 {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
}

.text-\[10px\].text-stone-400.font-bold.whitespace-nowrap {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
}
.dark .text-\[10px\].text-stone-400.font-bold.whitespace-nowrap {
  color: var(--text-muted) !important;
}

.text-sm.font-bold.text-stone-700 {
  font-family: var(--font-mono) !important;
  color: var(--ink) !important;
}

/* FUTURE 24H 氣溫顏色修正 */
.text-sm.font-bold.text-stone-700 {
  color: #adada8 !important;           /* 淺色模式：深灰 */
}
.dark .text-sm.font-bold.text-stone-700,
.dark .text-sm.font-bold.text-stone-300 {
  color: #adada8 !important;           /* 深色模式：純白色（最清楚） */
}

.text-\[9px\].text-blue-400.font-bold {
  color: var(--miffy-blue) !important;
  font-family: var(--font-mono) !important;
}

.text-\[10px\].font-bold.text-stone-400.writing-vertical-rl {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
  letter-spacing: 3px !important;
}

/* 雨量警告 */
.p-3.rounded-xl.border.bg-blue-50.text-blue-800 {
  background-color: var(--miffy-blue) !important;
  color: #fff !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
  font-family: var(--font-mono) !important;
}

/* AI 按鈕 */
.w-full.mt-3.py-3.bg-white\/90 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
  font-family: var(--font-mono) !important;
  font-size: 10px !important;
  letter-spacing: 1px !important;
  color: var(--ink) !important;
  text-transform: uppercase !important;
}
.dark .w-full.mt-3.py-3 {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  color: var(--miffy-yellow) !important;
}

/* ============================================================
   OUTFIT GUIDE
   ============================================================ */
.bg-\[#FFFBF0\] {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-lg) !important;
}
.dark .bg-stone-800 {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
}

h3.flex.items-center.gap-2.font-serif.font-bold {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
}
.dark h3.flex.items-center.gap-2.font-serif.font-bold {
  color: var(--miffy-yellow) !important;
}

/* 難度 badge */
.text-\[9px\].px-1\.5.py-0\.5.rounded-md.border {
  font-family: var(--font-mono) !important;
  border-radius: 20px !important;
  border-width: var(--bw) !important;
}
.bg-emerald-50.text-emerald-700.border-emerald-100 {
  background-color: var(--miffy-green) !important;
  color: #fff !important;
  border-color: var(--ink) !important;
}
.bg-amber-50.text-amber-700.border-amber-100 {
  background-color: var(--miffy-orange) !important;
  color: #fff !important;
  border-color: var(--ink) !important;
}
.bg-rose-50.text-rose-700.border-rose-100 {
  background-color: var(--tulip-red) !important;
  color: #fff !important;
  border-color: var(--ink) !important;
}

/* highlight badge */
.text-\[9px\].px-1\.5.py-0\.5.rounded-md.border.border-amber-100.bg-amber-50.text-amber-700 {
  background-color: var(--miffy-yellow) !important;
  color: var(--ink) !important;
  border-color: var(--ink) !important;
  border-radius: 20px !important;
  font-family: var(--font-mono) !important;
}

/* ============================================================
   DAY CARDS — FIX: 統一方塊大小、展開橘底文字可見
   ============================================================ */

/* 未展開 */
.relative.flex.items-center.justify-between.p-5.rounded-2xl.cursor-pointer.bg-white,
.relative.flex.items-center.justify-between.p-5.rounded-2xl.cursor-pointer.dark\:bg-stone-800 {
  background-color: var(--card-white) !important;
  border: var(--bw-lg) solid var(--ink) !important;
  border-radius: var(--r-lg) !important;
  box-shadow: 3px 3px 0 var(--ink) !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease !important;
}
.dark .relative.flex.items-center.justify-between.p-5.rounded-2xl.cursor-pointer {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  box-shadow: 3px 3px 0 var(--miffy-yellow) !important;
}

/* 展開 — 橘色 */
.relative.flex.items-center.justify-between.p-5.rounded-2xl.cursor-pointer.bg-stone-800 {
  background-color: var(--miffy-orange) !important;
  border: var(--bw-lg) solid var(--ink) !important;
  border-radius: var(--r-lg) !important;
  box-shadow: 3px 3px 0 var(--ink) !important;
}

/* FIX: Day 數字方塊 — 統一 width/height，防止大小不一 */
.flex.flex-col.items-center.justify-center.w-12.h-12.rounded-xl.border {
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  min-height: 48px !important;
  border-radius: var(--r-sm) !important;
  border-width: var(--bw) !important;
  flex-shrink: 0 !important;
}

/* 未展開方塊 — 黃底 */
.flex.flex-col.items-center.justify-center.w-12.h-12.rounded-xl.border.bg-stone-50,
.dark .flex.flex-col.items-center.justify-center.w-12.h-12.rounded-xl.border.dark\:bg-stone-700 {
  background-color: var(--miffy-yellow) !important;
  border-color: var(--ink) !important;
}
.dark .flex.flex-col.items-center.justify-center.w-12.h-12.rounded-xl.border {
  background-color: rgba(247,232,78,0.15) !important;
  border-color: var(--miffy-yellow) !important;
}

/* 展開方塊 — 白半透明 */
.flex.flex-col.items-center.justify-center.w-12.h-12.rounded-xl.border.bg-stone-700 {
  background-color: rgba(255,255,255,0.25) !important;
  border-color: rgba(255,255,255,0.6) !important;
}

/* FIX: "Day" 小字 — 在橘底要白色 */
.text-\[10px\].font-bold.text-stone-400.uppercase {
  font-family: var(--font-mono) !important;
  font-size: 7px !important;
  letter-spacing: 1px !important;
  color: #1A1510 !important;
}
/* 展開時 DAY 標籤白色 */
.bg-stone-800 .text-\[10px\].font-bold.text-stone-400.uppercase,
.bg-stone-700 .text-\[10px\].font-bold.text-stone-400.uppercase {
  color: rgba(255,255,255,0.7) !important;
}

/* FIX: Day 數字 */
.text-xl.font-serif.font-bold.text-stone-800 {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
  font-size: 22px !important;
  line-height: 1 !important;
}
.dark .text-xl.font-serif.font-bold {
  color: var(--miffy-yellow) !important;
}
/* 展開時 Day 數字 — 鮮黃 */
.text-xl.font-serif.font-bold.text-amber-400 {
  font-family: var(--font-display) !important;
  color: var(--miffy-yellow) !important;
  font-size: 22px !important;
  line-height: 1 !important;
}

/* FIX: 日期小字 — 橘底要白色 */
.text-xs.font-bold.mb-0\.5.text-stone-400 {
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
  letter-spacing: 0.5px !important;
  color: #1A1510 !important;
}
.bg-stone-800 .text-xs.font-bold.mb-0\.5 {
  color: rgba(255,255,255,0.75) !important;
}

/* FIX: Day 標題 — 橘底要白色 */
.font-bold.text-lg.leading-tight {
  font-family: var(--font-display) !important;
  font-size: 15px !important;
  line-height: 1.3 !important;
  color: var(--ink) !important;
}
.dark .font-bold.text-lg.leading-tight {
  color: var(--miffy-yellow) !important;
}
.bg-stone-800 .font-bold.text-lg.leading-tight {
  color: #fff !important;
}

/* 天氣 icon 旁的溫度數字 */
.text-sm.font-medium {
  font-family: var(--font-mono) !important;
  color: var(--ink) !important;
}
.bg-stone-800 .text-sm.font-medium {
  color: rgba(255,255,255,0.9) !important;
}
.dark .text-sm.font-medium {
  color: var(--text-main) !important;
}

/* 左側時間軸虛線 */
.mt-4.pl-4.border-l-2.border-stone-200\/50 {
  border-left-color: var(--ink) !important;
  border-left-width: var(--bw) !important;
  border-left-style: dashed !important;
}
.dark .mt-4.pl-4.border-l-2 {
  border-left-color: var(--miffy-yellow) !important;
}

/* ============================================================
   LOCATION CARDS
   ============================================================ */
.bg-white.dark\:bg-stone-800.rounded-2xl.border.border-stone-100.mb-4 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
.dark .bg-white.dark\:bg-stone-800.rounded-2xl {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  box-shadow: 2px 2px 0 var(--miffy-yellow) !important;
}

.ring-2.ring-amber-100 {
  box-shadow: 3px 3px 0 var(--miffy-orange) !important;
  border-color: var(--miffy-orange) !important;
}

/* Icon 圓圈 */
.mt-1.flex-shrink-0.w-8.h-8.rounded-full.bg-stone-50 {
  width: 32px !important;
  height: 32px !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: 50% !important;
  background-color: var(--miffy-yellow) !important;
}

/* icon 顏色改白色讓彩色底可見 */
.text-orange-600 { color: var(--miffy-orange) !important; }
.text-blue-500   { color: var(--miffy-blue) !important; }
.text-emerald-500 { color: var(--miffy-green) !important; }

/* 時間標籤 */
.text-\[10px\].font-bold.text-stone-400.font-mono.uppercase.tracking-wide {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
  letter-spacing: 2px !important;
}
.dark .text-\[10px\].font-bold.font-mono {
  color: var(--text-muted) !important;
}

/* 卡片標題 */
h3.font-bold.text-stone-800.text-lg,
h3.font-bold.text-stone-200.text-lg {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
  font-size: 16px !important;
}
.dark h3.font-bold.text-stone-800.text-lg,
.dark h3.font-bold.text-stone-200.text-lg,
.dark h3.font-bold {
  color: var(--miffy-yellow) !important;
}

/* 卡片備註 */
p.text-xs.text-stone-500.font-medium.leading-relaxed {
  font-family: var(--font-mono) !important;
  font-style: italic !important;
  color: var(--faded) !important;
  font-size: 10px !important;
}
.dark p.text-xs.text-stone-500,
.dark p.text-xs.text-stone-400 {
  color: var(--text-muted) !important;
}

/* 展開內容區 — 黃底 */
.p-5.bg-stone-50\/50 {
  background-color: rgba(247,232,78,0.3) !important;
}
.dark .p-5.bg-stone-50\/50 {
  background-color: rgba(247,232,78,0.06) !important;
}

/* 小標題 */
h4.text-xs.font-bold.text-amber-700 {
  font-family: var(--font-mono) !important;
  color: var(--miffy-orange) !important;
  letter-spacing: 2px !important;
  font-size: 8.5px !important;
  text-transform: uppercase !important;
}
.dark h4.text-xs.font-bold.text-amber-700 {
  color: var(--miffy-yellow) !important;
}

/* 內文 */
p.text-sm.text-stone-600.leading-relaxed {
  font-family: var(--font-body) !important;
  font-size: 13px !important;
  line-height: 1.8 !important;
  color: var(--ink) !important;
}
.dark p.text-sm.text-stone-600 {
  color: var(--text-main) !important;
}

/* 導航按鈕 */
button.flex.items-center.justify-center.gap-2.py-3.bg-stone-800.text-amber-50.rounded-xl {
  background-color: var(--ink) !important;
  color: var(--miffy-yellow) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
  font-family: var(--font-mono) !important;
  font-size: 10px !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
  box-shadow: 2px 2px 0 var(--miffy-orange) !important;
}

/* AI 按鈕 */
button.flex.items-center.justify-center.gap-2.py-3.bg-white.border.text-stone-600.rounded-xl {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  color: var(--ink) !important;
  border-radius: var(--r-sm) !important;
  font-family: var(--font-mono) !important;
  font-size: 10px !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
}
.dark button.flex.items-center.justify-center.gap-2.py-3.bg-white {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  color: var(--miffy-yellow) !important;
}

/* ============================================================
   FIX: FLOATING NEXT STOP — 不再跟按鈕重疊
   把 bottom 從 bottom-20 往下推，z-index 也確保在 nav 之下
   ============================================================ */
.fixed.bottom-20.left-4.right-4.z-30 {
  bottom: 76px !important;
  z-index: 30 !important;
}
.fixed.bottom-20.left-4.right-4.z-30 > div {
  background-color: var(--ink) !important;
  border: var(--bw) solid var(--miffy-yellow) !important;
  border-radius: var(--r-md) !important;
}

.w-10.h-10.rounded-full.bg-amber-500.animate-pulse {
  background-color: var(--tulip-red) !important;
}
.w-10.h-10.rounded-full.bg-green-500 {
  background-color: var(--miffy-green) !important;
}
.font-bold.text-sm.truncate.text-white {
  font-family: var(--font-display) !important;
  color: var(--miffy-yellow) !important;
}
.bg-stone-800.p-2.rounded-full.text-stone-400 {
  background-color: rgba(247,232,78,0.1) !important;
  border-radius: 50% !important;
  border: 1px solid rgba(247,232,78,0.3) !important;
}

/* ============================================================
   FIX: BOTTOM NAV — 移除跑位的 ::before 黃圈，改用正確方式
   ============================================================ */
nav.fixed.bottom-0 {
  background-color: var(--card-white) !important;
  border-top: var(--bw-lg) solid var(--ink) !important;
  backdrop-filter: none !important;
}
.dark nav.fixed.bottom-0 {
  background-color: var(--bg-card) !important;
  border-top-color: var(--miffy-yellow) !important;
}

nav button {
  font-family: var(--font-mono) !important;
  font-size: 8px !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  position: relative !important;
}

/* FIX: 完全移除舊的 ::before 黃圈偽元素 */
nav button::before {
  display: none !important;
  content: none !important;
}

/* active tab — 底部橘線指示器，乾淨不干擾 */
nav button.text-stone-800,
nav button.dark\:text-stone-100 {
  color: var(--ink) !important;
  border-top: 3px solid var(--miffy-orange) !important;
  margin-top: -3px !important;
}
.dark nav button.dark\:text-stone-100 {
  color: var(--miffy-yellow) !important;
  border-top-color: var(--miffy-yellow) !important;
}

/* inactive tab */
nav button.text-stone-400 {
  color: var(--faded) !important;
  border-top: 3px solid transparent !important;
  margin-top: -3px !important;
}
.dark nav button.text-stone-400 {
  color: var(--text-muted) !important;
}

/* nav icon 大小固定 */
nav button svg {
  pointer-events: none !important;
}

/* ============================================================
   PACKING PAGE
   ============================================================ */
h2.text-2xl.font-serif.font-bold {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
}
.dark h2.text-2xl.font-serif.font-bold {
  color: var(--miffy-yellow) !important;
}

.w-1\.5.h-6.bg-amber-500.rounded-full {
  background-color: var(--tulip-red) !important;
}

/* 使用者選擇按鈕 */
button.relative.flex.flex-col.items-center.justify-end.rounded-2xl.border.bg-stone-900\/50 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
  color: var(--faded) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
button.relative.flex.flex-col.items-center.justify-end.rounded-2xl.border.bg-stone-800 {
  background-color: var(--miffy-orange) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
  color: #fff !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}

/* 進度條 */
.h-1\.5.w-full.bg-stone-200.rounded-full {
  background-color: rgba(26,21,16,0.12) !important;
}
.dark .h-1\.5.w-full.bg-stone-200.rounded-full {
  background-color: rgba(247,232,78,0.15) !important;
}
.h-full.bg-amber-500.transition-all {
  background: linear-gradient(90deg, var(--miffy-blue) 0%, var(--miffy-green) 100%) !important;
}

/* 打包項目 — 未勾 */
.flex.items-center.gap-3.p-4.rounded-xl.border.bg-white.border-stone-100.shadow-sm {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
.dark .flex.items-center.gap-3.p-4.rounded-xl.border.bg-white {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  box-shadow: 2px 2px 0 rgba(247,232,78,0.3) !important;
}

/* 打包項目 — 已勾 */
.flex.items-center.gap-3.p-4.rounded-xl.border.bg-stone-100 {
  background-color: rgba(91,181,106,0.15) !important;
  border-color: var(--miffy-green) !important;
  border-radius: var(--r-sm) !important;
  box-shadow: none !important;
}

/* 勾勾圓圈 */
.w-6.h-6.rounded-full.border-2.border-stone-300 {
  border-color: var(--ink) !important;
  background-color: var(--miffy-yellow) !important;
}
.dark .w-6.h-6.rounded-full.border-2.border-stone-300 {
  border-color: var(--miffy-yellow) !important;
  background-color: rgba(247,232,78,0.1) !important;
}
.w-6.h-6.rounded-full.bg-green-500.border-green-500 {
  background-color: var(--miffy-green) !important;
  border-color: var(--ink) !important;
}

/* 項目文字 */
span.flex-1.font-medium.text-stone-700 {
  font-family: var(--font-body) !important;
  color: var(--ink) !important;
}
.dark span.flex-1.font-medium.text-stone-200 {
  color: var(--text-main) !important;
}
span.flex-1.font-medium.text-stone-400.line-through {
  color: var(--faded) !important;
}

/* 新增輸入框 */
.flex-1.p-3.rounded-xl.border.border-stone-200 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
  font-family: var(--font-body) !important;
  color: var(--ink) !important;
}
.dark .flex-1.p-3.rounded-xl.border {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  color: var(--text-main) !important;
}

/* + 按鈕 */
.bg-stone-800.text-amber-50.px-5.rounded-xl.font-bold {
  background-color: var(--ink) !important;
  color: var(--miffy-yellow) !important;
  border-radius: var(--r-sm) !important;
  font-family: var(--font-mono) !important;
  border: var(--bw) solid var(--ink) !important;
  box-shadow: 2px 2px 0 var(--miffy-orange) !important;
}

/* KyushuTips */
.bg-amber-50.dark\:bg-stone-800.rounded-2xl.border.border-amber-100.overflow-hidden {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
.dark .bg-amber-50.dark\:bg-stone-800.rounded-2xl {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
}

button.w-full.flex.items-center.justify-between.p-4.bg-amber-100\/50 {
  background-color: var(--miffy-yellow) !important;
  border-bottom: var(--bw) solid var(--ink) !important;
  color: var(--ink) !important;
  font-family: var(--font-mono) !important;
  font-size: 10px !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
}
.dark button.w-full.flex.items-center.justify-between.p-4 {
  background-color: rgba(247,232,78,0.1) !important;
  color: var(--miffy-yellow) !important;
  border-bottom-color: var(--miffy-yellow) !important;
}

/* ============================================================
   GUIDE PAGE
   ============================================================ */

/* 公佈欄 */
.bg-white.dark\:bg-stone-800.border.border-amber-200.dark\:border-amber-900\/50.rounded-\[2rem\].p-5 {
  background-color: var(--card-white) !important;
  border: var(--bw-lg) solid var(--miffy-orange) !important;
  border-radius: var(--r-lg) !important;
  box-shadow: 3px 3px 0 var(--miffy-orange) !important;
}
.dark .bg-white.dark\:bg-stone-800.border.border-amber-200 {
  background-color: var(--bg-card) !important;
  color: var(--text-main) !important;
}

.flex.items-center.gap-2.mb-3.text-amber-600.font-bold.text-xs.uppercase.tracking-widest {
  font-family: var(--font-mono) !important;
  color: var(--miffy-orange) !important;
  letter-spacing: 3px !important;
}
.dark .flex.items-center.gap-2.mb-3.text-amber-600,
.dark .flex.items-center.gap-2.mb-3.dark\:text-amber-300 {
  color: var(--miffy-yellow) !important;
}

/* 公佈欄內文 */
.text-sm.text-stone-600.dark\:text-stone-300.leading-relaxed {
  color: var(--ink) !important;
  font-family: var(--font-body) !important;
}
.dark .text-sm.text-stone-600.dark\:text-stone-300 {
  color: var(--text-main) !important;
}

/* 挑食卡片 */
.bg-rose-50.dark\:bg-rose-950\/30.border.border-rose-200.rounded-2xl.p-4 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--tulip-red) !important;
  border-radius: var(--r-md) !important;
  box-shadow: 2px 2px 0 var(--tulip-red) !important;
}
.dark .bg-rose-50.dark\:bg-rose-950\/30 {
  background-color: var(--bg-card) !important;
}
.font-bold.text-rose-800,
.dark .font-bold.text-rose-300 {
  font-family: var(--font-mono) !important;
  color: var(--tulip-red) !important;
  font-size: 11px !important;
}

.text-base.font-black.text-rose-600.font-serif {
  font-family: var(--font-display) !important;
  color: var(--tulip-red) !important;
}

/* 挑食項目文字 */
.text-\[10px\].text-stone-400.font-bold {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
}
.dark .text-\[10px\].text-stone-400 {
  color: var(--text-muted) !important;
}
.font-bold.text-stone-800.dark\:text-stone-100 {
  color: var(--ink) !important;
  font-family: var(--font-body) !important;
}
.dark .font-bold.text-stone-800.dark\:text-stone-100 {
  color: var(--text-main) !important;
}

/* 免稅卡片 */
.bg-amber-50.dark\:bg-amber-950\/30.border.border-amber-200.rounded-2xl.p-4 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--miffy-orange) !important;
  border-radius: var(--r-md) !important;
  box-shadow: 2px 2px 0 var(--miffy-orange) !important;
}
.dark .bg-amber-50.dark\:bg-amber-950\/30 {
  background-color: var(--bg-card) !important;
}
.font-bold.text-amber-800.dark\:text-amber-300 {
  color: var(--miffy-orange) !important;
  font-family: var(--font-mono) !important;
}
.dark .font-bold.text-amber-800.dark\:text-amber-300 {
  color: var(--miffy-yellow) !important;
}

/* 指南分類卡片 */
.p-5.rounded-\[2rem\].border.shadow-sm {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-lg) !important;
  box-shadow: 3px 3px 0 var(--ink) !important;
}
.dark .p-5.rounded-\[2rem\].border {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  box-shadow: 3px 3px 0 var(--miffy-yellow) !important;
}

h3.text-lg.font-bold.text-stone-800,
.dark h3.text-lg.font-bold.text-stone-100 {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
}
.dark h3.text-lg.font-bold.text-stone-100 {
  color: var(--miffy-yellow) !important;
}

/* 指南 icon wrapper */
.p-2\.5.bg-white.rounded-2xl.shadow-sm {
  background-color: var(--miffy-yellow) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
}
.dark .p-2\.5.bg-white {
  background-color: rgba(247,232,78,0.15) !important;
  border-color: var(--miffy-yellow) !important;
}

/* 指南說明小字 */
.text-\[11px\].text-stone-500 {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
}
.dark .text-\[11px\].text-stone-500 {
  color: var(--text-muted) !important;
}

/* 指南開啟按鈕 */
button.flex.items-center.justify-center.gap-2.py-2\.5.bg-stone-800.text-amber-50.rounded-2xl {
  background-color: var(--ink) !important;
  color: var(--miffy-yellow) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  box-shadow: 2px 2px 0 var(--miffy-orange) !important;
}

/* 許願池 */
.bg-\[#FEF3C7\].p-6.rounded-\[2\.5rem\].border-2.border-amber-300 {
  background-color: var(--miffy-yellow) !important;
  border: var(--bw-lg) solid var(--ink) !important;
  border-radius: var(--r-xl) !important;
  box-shadow: 4px 4px 0 var(--ink) !important;
}
.dark .bg-\[#FEF3C7\] {
  background-color: rgba(247,232,78,0.1) !important;
}

.flex.items-center.gap-2.mb-5.text-amber-900.font-black.text-sm.tracking-wider {
  font-family: var(--font-mono) !important;
  color: var(--ink) !important;
  letter-spacing: 2px !important;
  text-transform: uppercase !important;
}
.dark .flex.items-center.gap-2.mb-5 {
  color: var(--miffy-yellow) !important;
}

.bg-white.dark\:bg-stone-900.p-4.rounded-2xl.border.flex.justify-between {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
}
.dark .bg-white.dark\:bg-stone-900.p-4 {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
}

/* ============================================================
   UTILS PAGE
   ============================================================ */

h2.text-2xl.font-serif.font-bold.text-stone-800 {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
}
.dark h2.text-2xl.font-serif.font-bold.text-stone-800,
.dark h2.text-2xl.font-serif.font-bold.text-stone-100 {
  color: var(--miffy-yellow) !important;
}

/* 深色模式切換 */
.bg-white.border.border-stone-100.dark\:border-stone-700.rounded-2xl.p-4.flex.items-center.justify-between {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
.dark .bg-white.border.border-stone-100.dark\:border-stone-700 {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  box-shadow: 2px 2px 0 var(--miffy-yellow) !important;
}

.w-12.h-6.rounded-full.p-1.bg-amber-500 {
  background-color: var(--miffy-orange) !important;
  border: 1.5px solid var(--ink) !important;
}
.w-12.h-6.rounded-full.p-1.bg-stone-300 {
  background-color: rgba(26,21,16,0.15) !important;
  border: 1.5px solid var(--ink) !important;
}
.dark .w-12.h-6.rounded-full.p-1.bg-stone-300 {
  background-color: rgba(247,232,78,0.15) !important;
  border-color: var(--miffy-yellow) !important;
}

/* LightSplit */
.bg-\[#06C755\].p-6.rounded-2xl {
  background-color: var(--miffy-green) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-lg) !important;
  box-shadow: 3px 3px 0 var(--ink) !important;
}

/* FIX: 工具頁各 section 白色卡片 — 加粗邊框 */
.bg-white.dark\:bg-stone-800.p-6.rounded-2xl.border.border-stone-100.dark\:border-stone-700 {
  background-color: var(--card-white) !important;
  border: var(--bw-lg) solid var(--ink) !important;
  border-radius: var(--r-lg) !important;
  box-shadow: 3px 3px 0 var(--ink) !important;
}
.dark .bg-white.dark\:bg-stone-800.p-6.rounded-2xl {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  box-shadow: 3px 3px 0 rgba(247,232,78,0.4) !important;
}

/* section 標題 */
h3.flex.items-center.gap-2.font-bold.text-stone-800.mb-4.border-b.pb-3 {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
  border-bottom: var(--bw) solid rgba(26,21,16,0.15) !important;
  font-size: 15px !important;
}
.dark h3.flex.items-center.gap-2.font-bold.text-stone-100 {
  color: var(--miffy-yellow) !important;
  border-bottom-color: rgba(247,232,78,0.2) !important;
}

/* FIX: 航班 Plane icon — 不能被 svg 規則蓋掉顏色 */
nav svg, .text-blue-500 svg, h3 svg {
  pointer-events: none !important;
}
.text-blue-500 {
  color: var(--miffy-blue) !important;
}
.text-orange-500 {
  color: var(--miffy-orange) !important;
}
.text-red-600 {
  color: var(--tulip-red) !important;
}
.text-green-600 {
  color: var(--miffy-green) !important;
}
.text-purple-500, .text-purple-600 {
  color: #8B5CF6 !important;
}

/* 航班卡片 */
.bg-white.dark\:bg-stone-800.rounded-2xl.p-4.border.border-stone-100.shadow-sm.mb-3 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-md) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
.dark .bg-white.dark\:bg-stone-800.rounded-2xl.p-4.border {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  box-shadow: 2px 2px 0 rgba(247,232,78,0.3) !important;
}

/* 航班裝飾圓角 */
.absolute.top-0.right-0.w-24.h-24.bg-stone-50.rounded-bl-full {
  background-color: var(--miffy-yellow) !important;
}

/* 去程 badge */
.px-2.py-1.rounded.bg-amber-100.text-amber-800 {
  background-color: var(--miffy-orange) !important;
  color: #fff !important;
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
  letter-spacing: 1px !important;
  border-radius: 6px !important;
  border: 1px solid var(--ink) !important;
}
/* 回程 badge */
.px-2.py-1.rounded.bg-stone-100.text-stone-600 {
  background-color: var(--miffy-blue) !important;
  color: #fff !important;
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
  letter-spacing: 1px !important;
  border-radius: 6px !important;
  border: 1px solid var(--ink) !important;
}

/* 機場代碼 */
.text-2xl.font-bold.text-stone-800 {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
}
.dark .text-2xl.font-bold.text-stone-100 {
  color: var(--miffy-yellow) !important;
}

/* 航班號 */
.text-xs.font-bold.text-stone-500 {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
  letter-spacing: 2px !important;
}
.dark .text-xs.font-bold.text-stone-500 {
  color: var(--text-muted) !important;
}

/* live 狀態 */
.w-2.h-2.rounded-full.bg-green-500.animate-pulse {
  background-color: var(--miffy-green) !important;
}
.text-xs.text-stone-500.font-medium {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
}
.dark .text-xs.text-stone-500 {
  color: var(--text-muted) !important;
}

/* 即時動態 */
a.flex.items-center.gap-1.text-xs.font-bold.text-blue-500.bg-blue-50 {
  background-color: var(--miffy-blue) !important;
  color: #fff !important;
  border: 1px solid var(--ink) !important;
  border-radius: 20px !important;
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
}

/* 住宿小卡 */
.bg-stone-50.dark\:bg-stone-700\/50.rounded-xl.p-4.border {
  background-color: rgba(247,232,78,0.4) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
}
.dark .bg-stone-50.dark\:bg-stone-700\/50 {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
}

/* 飯店類型小字 */
.text-\[10px\].text-stone-400.font-bold {
  font-family: var(--font-mono) !important;
  color: var(--faded) !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
}
.dark .text-\[10px\].text-stone-400.font-bold {
  color: var(--text-muted) !important;
}

/* 飯店名 */
h4.font-bold.text-base {
  font-family: var(--font-display) !important;
  color: var(--ink) !important;
}
.dark h4.font-bold.text-base {
  color: var(--miffy-yellow) !important;
}

/* 日期 badge */
.text-xs.font-bold.bg-white.px-2.py-1.rounded.border.border-stone-200.whitespace-nowrap {
  background-color: var(--miffy-yellow) !important;
  color: var(--ink) !important;
  border: 1px solid var(--ink) !important;
  font-family: var(--font-mono) !important;
  border-radius: 6px !important;
}

/* 飯店按鈕 */
a.flex.items-center.justify-center.gap-1\.5.py-2.bg-stone-800.text-amber-50.rounded-lg {
  background-color: var(--ink) !important;
  color: var(--miffy-yellow) !important;
  font-family: var(--font-mono) !important;
  font-size: 9.5px !important;
  letter-spacing: 1px !important;
  border-radius: var(--r-sm) !important;
  text-transform: uppercase !important;
  border: var(--bw) solid var(--ink) !important;
}
a.flex.items-center.justify-center.gap-1\.5.py-2.bg-white.border.border-stone-200 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  color: var(--ink) !important;
  font-family: var(--font-mono) !important;
  border-radius: var(--r-sm) !important;
}
.dark a.flex.items-center.justify-center.gap-1\.5.py-2.bg-white {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  color: var(--miffy-yellow) !important;
}

/* 緊急電話 */
.bg-red-50.rounded-xl.flex.flex-col.items-center.border.border-red-100 {
  background-color: var(--tulip-red) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
.text-2xl.font-black.text-red-600 {
  font-family: var(--font-display) !important;
  color: #fff !important;
}
.text-xs.font-bold.text-red-800 {
  font-family: var(--font-mono) !important;
  color: rgba(255,255,255,0.9) !important;
  font-size: 9px !important;
}

/* 緊急聯絡深色區塊 */
.bg-stone-800.dark\:bg-stone-950.rounded-xl.p-4 {
  background-color: var(--ink) !important;
  border-radius: var(--r-sm) !important;
}
/* 深色區塊文字強制白色 */
.bg-stone-800.dark\:bg-stone-950.rounded-xl.p-4 * {
  color: rgba(255,255,255,0.85) !important;
}
.bg-stone-800.dark\:bg-stone-950.rounded-xl.p-4 a {
  color: var(--miffy-yellow) !important;
}
.bg-stone-800.dark\:bg-stone-950.rounded-xl.p-4 strong {
  color: #fff !important;
}

/* Safety Tips */
.bg-amber-500\/10.border.border-amber-500\/30.rounded-lg.p-3 {
  background-color: rgba(244,131,31,0.15) !important;
  border: var(--bw) solid var(--miffy-orange) !important;
  border-radius: var(--r-sm) !important;
}
.text-\[10px\].font-black.text-amber-500 {
  color: var(--miffy-orange) !important;
  font-family: var(--font-mono) !important;
}

/* App 列表 */
.flex.items-center.justify-between.p-3.bg-stone-50.rounded-xl.border.border-stone-100 {
  background-color: rgba(247,232,78,0.4) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
}
.dark .flex.items-center.justify-between.p-3.dark\:bg-stone-700\/50 {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
}

/* 匯率計算 */
.bg-green-50.dark\:bg-green-900\/20.p-4.rounded-xl.mb-6 {
  background-color: rgba(91,181,106,0.15) !important;
  border: var(--bw) solid var(--miffy-green) !important;
  border-radius: var(--r-sm) !important;
}
.text-\[10px\].text-green-600.font-bold.mb-2 {
  font-family: var(--font-mono) !important;
  color: var(--miffy-green) !important;
  letter-spacing: 1px !important;
}
.w-full.p-2.rounded-lg.border.border-green-200 {
  background-color: var(--card-white) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: var(--r-sm) !important;
  font-family: var(--font-mono) !important;
  color: var(--ink) !important;
}
.dark .w-full.p-2.rounded-lg.border {
  background-color: var(--bg-card) !important;
  border-color: var(--miffy-yellow) !important;
  color: var(--text-main) !important;
}

/* 查看憑證按鈕 */
a.flex.items-center.justify-center.gap-2.w-full.py-3.mt-4.rounded-xl {
  background-color: var(--miffy-yellow) !important;
  border: var(--bw) solid var(--ink) !important;
  color: var(--ink) !important;
  font-family: var(--font-mono) !important;
  font-size: 10px !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  border-radius: var(--r-sm) !important;
  box-shadow: 2px 2px 0 var(--ink) !important;
}
.dark a.flex.items-center.justify-center.gap-2.w-full.py-3.mt-4 {
  background-color: rgba(247,232,78,0.1) !important;
  border-color: var(--miffy-yellow) !important;
  color: var(--miffy-yellow) !important;
}

/* iOS/Android 小按鈕 */
.text-\[10px\].font-bold.bg-stone-800.text-white.px-2.py-1.rounded-lg {
  background-color: var(--ink) !important;
  color: var(--miffy-yellow) !important;
  font-family: var(--font-mono) !important;
  border-radius: 6px !important;
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
.fixed.inset-0.z-50.flex.flex-col.items-center.justify-center {
  background-color: var(--miffy-yellow) !important;
}
.text-stone-500.text-sm.font-bold.tracking-widest.animate-pulse {
  font-family: var(--font-mono) !important;
  color: var(--ink) !important;
  letter-spacing: 3px !important;
  font-size: 10px !important;
  text-transform: uppercase !important;
}
.text-amber-500.animate-spin {
  color: var(--miffy-orange) !important;
}

/* ============================================================
   MISC
   ============================================================ */

.text-center.text-xs.text-stone-400.mt-12.mb-4.font-serif.italic {
  font-family: var(--font-display) !important;
  color: var(--faded) !important;
  font-style: italic !important;
}
.dark .text-center.text-xs.text-stone-400 {
  color: var(--text-muted) !important;
}

button.flex.items-center.gap-1\.5.px-3.py-1\.5.rounded-full.border.border-stone-200 {
  font-family: var(--font-mono) !important;
  font-size: 9px !important;
  color: var(--ink) !important;
  border: var(--bw) solid var(--ink) !important;
  border-radius: 20px !important;
  letter-spacing: 1px !important;
  background-color: var(--card-white) !important;
}
.dark button.flex.items-center.gap-1\.5 {
  border-color: var(--miffy-yellow) !important;
  color: var(--miffy-yellow) !important;
  background-color: transparent !important;
}

button.fixed.bottom-24.right-4.z-40 {
  background-color: var(--ink) !important;
  border: var(--bw) solid var(--miffy-yellow) !important;
  border-radius: 50% !important;
  color: var(--miffy-yellow) !important;
}

.border-b.pb-3 { border-bottom-color: rgba(26,21,16,0.15) !important; }
.dark .border-b.pb-3 { border-bottom-color: rgba(247,232,78,0.15) !important; }
.border-t.pt-3 { border-top-color: rgba(26,21,16,0.15) !important; }
.dark .border-t.pt-3 { border-top-color: rgba(247,232,78,0.15) !important; }

/* 密碼輸入框 */
input[type="password"] {
  font-family: var(--font-mono) !important;
  letter-spacing: 4px !important;
}

/* 解鎖按鈕 */
button[type="submit"] {
  font-family: var(--font-mono) !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
  background-color: var(--miffy-orange) !important;
  border: var(--bw) solid rgba(255,255,255,0.4) !important;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.2) !important;
  color: #fff !important;
}

/* 管理端 input */
input[type="text"], input[type="time"], textarea, select {
  color: var(--ink) !important;
}
.dark input[type="text"],
.dark input[type="time"],
.dark textarea,
.dark select {
  color: var(--text-main) !important;
  background-color: var(--bg-card) !important;
}
/* ============================================================
   v2.1 PATCH — 深色模式文字 + 按鈕位置修正
   ============================================================ */
 
/* ── FIX 1: 深色模式天氣區塊溫度數字 ── */
.dark .text-5xl.font-serif.font-medium,
.dark .text-5xl {
  color: var(--miffy-yellow) !important;
}
 
/* 深色模式天氣區整體文字 */
.dark .relative.bg-\[#FDFBF7\].dark\:bg-stone-900.pt-0.pb-8.px-6 * {
  color: var(--text-main);
}
/* 但 icon 顏色不要亂改 */
.dark .relative.bg-\[#FDFBF7\].dark\:bg-stone-900 .text-amber-500,
.dark .relative.bg-\[#FDFBF7\].dark\:bg-stone-900 .text-blue-400,
.dark .relative.bg-\[#FDFBF7\].dark\:bg-stone-900 .text-stone-400 {
  color: inherit;
}
 
/* ── FIX 2: 深色模式工具頁 — 所有白底卡片內的黑字 ── */
 
/* 通用：深色模式下所有 section 標題 */
.dark h3,
.dark h4 {
  color: var(--miffy-yellow) !important;
}
 
/* 通用：深色模式下所有卡片內一般文字 */
.dark .bg-white.dark\:bg-stone-800 p,
.dark .bg-white.dark\:bg-stone-800 span,
.dark .bg-white.dark\:bg-stone-800 div,
.dark .bg-white.dark\:bg-stone-800 a {
  color: var(--text-main) !important;
}
 
/* 航班詳細資訊 — 機場城市名、代碼 */
.dark .text-2xl.font-bold {
  color: var(--miffy-yellow) !important;
}
.dark .text-\[10px\].text-stone-400,
.dark .text-xs.text-stone-400,
.dark .text-xs.text-stone-500,
.dark .text-sm.text-stone-500 {
  color: var(--text-muted) !important;
}
 
/* 航班時間、航班號 */
.dark .text-xs.font-bold.text-stone-400,
.dark .text-xs.font-bold.text-stone-500 {
  color: var(--text-muted) !important;
}
 
/* 飯店名稱 */
.dark h4.font-bold,
.dark .font-bold.text-base,
.dark .font-bold.text-lg,
.dark .font-bold.text-sm {
  color: var(--miffy-yellow) !important;
}
 
/* 飯店地址、備註小字 */
.dark .text-xs.text-stone-500,
.dark p.text-xs,
.dark span.text-xs {
  color: var(--text-muted) !important;
}
 
/* App 列表文字 */
.dark .font-bold.text-stone-800.text-sm,
.dark .font-bold.text-stone-100.text-sm {
  color: var(--miffy-yellow) !important;
}
.dark .text-\[10px\].text-stone-500 {
  color: var(--text-muted) !important;
}
 
/* 匯率換算標題文字 */
.dark .text-stone-800,
.dark .text-stone-700,
.dark .text-stone-600 {
  color: var(--text-main) !important;
}
 
/* 匯率輸入欄位 placeholder */
.dark input::placeholder {
  color: var(--text-muted) !important;
}
 
/* 深色模式住宿卡片內部 */
.dark .bg-stone-50.dark\:bg-stone-700\/50 p,
.dark .bg-stone-50.dark\:bg-stone-700\/50 span,
.dark .bg-stone-50.dark\:bg-stone-700\/50 h4 {
  color: var(--text-main) !important;
}
 
/* 深色模式 App 行 */
.dark .flex.items-center.justify-between.p-3 .font-bold,
.dark .flex.items-center.justify-between.p-3 .text-\[10px\] {
  color: var(--text-main) !important;
}
 
/* 深色模式 toggle 文字 */
.dark .flex.items-center.gap-2.font-bold span {
  color: var(--text-main) !important;
}
 
/* ── FIX 3: 回到頂部箭頭 + Floating bar 不重疊 ──
   原本 back-to-top 是 bottom-24 right-4
   floating bar 是 bottom-20 (已改 76px)
   兩個會卡在一起 → 把 back-to-top 往上推到 bottom-32
   floating bar 向右縮，right 留出空間給箭頭
   最乾淨的解法：floating bar 右邊留 56px padding 給箭頭 */
 
/* floating bar 右邊留空間 */
.fixed.bottom-20.left-4.right-4.z-30 {
  bottom: 76px !important;
  right: 60px !important;  /* 讓右邊箭頭有空間 */
  z-index: 30 !important;
}
 
/* back-to-top 箭頭往上推，不擋 floating bar */
button.fixed.bottom-24.right-4.z-40 {
  bottom: 80px !important;
  right: 12px !important;
  background-color: var(--ink) !important;
  border: var(--bw) solid var(--miffy-yellow) !important;
  border-radius: 50% !important;
  color: var(--miffy-yellow) !important;
  z-index: 40 !important;
  box-shadow: 2px 2px 0 var(--miffy-orange) !important;
}
 
 
/* ============================================================
   v2.2 PATCH — back-to-top 移到 floating bar 右上角
   ============================================================ */
 
/* floating bar 恢復原本寬度 */
.fixed.bottom-20.left-4.right-4.z-30 {
  bottom: 76px !important;
  right: 16px !important;
  z-index: 30 !important;
}
 
/* back-to-top 貼在 floating bar 右上角 */
button.fixed.bottom-24.right-4.z-40 {
  bottom: 128px !important;
  right: 12px !important;
  z-index: 40 !important;
  background-color: var(--ink) !important;
  border: var(--bw) solid var(--miffy-yellow) !important;
  border-radius: 50% !important;
  color: var(--miffy-yellow) !important;
  box-shadow: 2px 2px 0 var(--miffy-orange) !important;
  width: 36px !important;
  height: 36px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
 
 
/* ============================================================
   v2.3 PATCH — back-to-top 再往上 + 深色模式標題修正
   ============================================================ */
 
/* back-to-top 完全脫離 floating bar */
button.fixed.bottom-24.right-4.z-40 {
  bottom: 168px !important;
  right: 12px !important;
  z-index: 40 !important;
  background-color: var(--ink) !important;
  border: var(--bw) solid var(--miffy-yellow) !important;
  border-radius: 50% !important;
  color: var(--miffy-yellow) !important;
  box-shadow: 2px 2px 0 var(--miffy-orange) !important;
  width: 36px !important;
  height: 36px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
 
/* 深色模式 — 工具頁/指南頁所有 section 標題強制亮色 */
.dark h3.flex.items-center.gap-2.font-bold,
.dark h3.flex.items-center.gap-2.font-bold.text-stone-800,
.dark h3.flex.items-center.gap-2.font-bold.text-stone-100,
.dark h3.flex.items-center.gap-2.font-bold.mb-4,
.dark h3.flex.items-center.gap-2.font-bold.text-red-700 {
  color: var(--miffy-yellow) !important;
}
 
/* 深色模式 — 許願池標題 */
.dark .flex.items-center.gap-2.mb-5.text-amber-900,
.dark .flex.items-center.gap-2.mb-5 {
  color: var(--miffy-yellow) !important;
}
 
/* 深色模式 — section 標題旁的 icon */
.dark h3.flex.items-center.gap-2.font-bold svg {
  color: var(--miffy-yellow) !important;
  pointer-events: none !important;
}
 
/* 深色模式 — 許願池標題旁的 icon */
.dark .flex.items-center.gap-2.mb-5 svg {
  color: var(--miffy-yellow) !important;
}

/* ============================================================
   v2.8 終極無視權重強殺版 — 徹底解決工具頁與指南頁黑字問題
   ============================================================ */

/* 1. 用最暴力的屬性選取器，只要在 dark 模式下，卡片裡含有 text-stone-800 或 text-amber-900 的標題全部強制變極亮白 */
.dark [class*="text-stone-800"],
.dark [class*="text-amber-900"],
.dark h3[class*="text-stone-800"],
.dark h3[class*="text-red-700"] {
  color: #FFFFFF !important;
}

/* 2. 雙重保險：指定工具頁與指南頁所有大區塊下的 h3 標題與其內所有文字、Span 節點 */
.dark section h3,
.dark section h3 *,
.dark main h3,
.dark main h3 * {
  color: #FFFFFF !important;
}

/* 3. 強制讓標題旁邊的 Lucide SVG 網格圖標（飛機、時鐘、房子、皮夾、Logo）在深色模式下全部變全白 */
.dark h3 svg,
.dark h3 svg *,
.dark [class*="text-amber-900"] svg,
.dark [class*="text-amber-900"] svg * {
  color: #FFFFFF !important;
  stroke: #FFFFFF !important;
}

/* 4. 針對「團員私藏好店許願池」這個特定標題文字做最高級別強殺 */
.dark section h2,
.dark section h2 *,
.dark .text-amber-900,
.dark .text-amber-900 * {
  color: #FFFFFF !important;
}

/* 5. 確保卡片內部小標題（例如：豪斯登堡阿姆斯特丹酒店、DIGEST菜單翻譯）維持顯眼的亮黃色 */
.dark h4,
.dark h4 *,
.dark [class*="font-bold text-sm"] {
  color: #F7E84E !important;
}

/* 6. 排除緊急救援中心區塊（原本就是紅字/白字），保持原樣不被以上規則破壞 */
.dark .bg-stone-800 [class*="text-red-600"],
.dark .bg-stone-800 [class*="text-red-400"] {
  color: #E8334A !important;
}


/* ============================================================
   🔥 最終加掛補強 — 不動原有功能，只針對黑字進行最高權重覆蓋
   ============================================================ */

/* 1. 工具頁大標題 (航班詳細資訊、住宿飯店導航、旅行必備App、匯率換算) */
.dark h3.flex.items-center.gap-2.font-bold.text-stone-800.mb-4.border-b.pb-3 {
    color: #FFFBF0 !important;
}

/* 1-1. 工具頁大標題旁邊的 Lucide Icon 同步轉白 */
.dark h3.flex.items-center.gap-2.font-bold.text-stone-800.mb-4.border-b.pb-3 svg {
    color: #FFFBF0 !important;
    stroke: #FFFBF0 !important;
}

/* 2. 指南頁：團員私藏好店許願池大標題 */
.dark .flex.items-center.gap-2.mb-5.text-amber-900.font-black.text-sm.tracking-wider {
    color: #FFFBF0 !important;
}

/* 2-1. 指南頁：許願池大標題旁邊的 Icon 同步轉白 */
.dark .flex.items-center.gap-2.mb-5.text-amber-900.font-black.text-sm.tracking-wider svg {
    color: #FFFBF0 !important;
    stroke: #FFFBF0 !important;
}

/* 3. 指南頁：各個分類卡片大標題 (喫茶店地圖、必吃清單等) */
.dark h3.text-lg.font-bold.text-stone-800 {
    color: #FFFBF0 !important;
}

/* 4. 行李準備頁：大標題文字 */
.dark h2.text-2xl.font-serif.font-bold {
    color: #FFFBF0 !important;
}

/* 5. 特例排除：緊急救援中心維持紅字，不被上面的全白規則破壞 */
.dark h3.flex.items-center.gap-2.font-bold.text-red-700.mb-4.border-b.pb-3 {
    color: #E8334A !important;
}

/* ============================================================
   🔥 v3.0 App 列表描述文字對比度補強 — 讓小字完全看清
   ============================================================ */

/* 精準狙擊 App 卡片內部的 text-[10px] text-stone-500 小字描述，強制轉為明亮米白 */
.dark .text-\[10px\].text-stone-500,
.dark [class*="text-[10px] text-stone-500"],
.dark .bg-stone-50\.dark\:bg-stone-700\/50 .text-stone-500 {
    color: #F5EDD5 !important; 
}

/* ============================================================
   🔥 v3.1 結構層級強殺 — 徹底解決 text-[10px] 轉義隱形問題
   ============================================================ */

/* 直接繞過帶有中括號的 Class 名稱，用純 HTML 結構把 App 卡片內部的第二層描述小字抓出來轉白 */
.dark section .flex.items-center.justify-between.p-3 div div,
.dark section .flex.items-center.justify-between.p-3 div div *,
.dark section .flex.items-center.justify-between.p-3 div span {
    color: #FFFBF0 !important; /* 強制轉為高對比的極亮米白色 */
}


/* ============================================================
   🔥 v3.4 航班卡片城市名稱全白修正 — 解決與黃圈融合問題
   ============================================================ */

/* 1. 當開啟暗黑模式 (.dark) 時，將航班卡片內所有城市名稱（台北、佐賀）強制轉為純白色 */
/* 這樣沒開暗黑模式時，就會完全走你原本的設定（維持黑色不變） */
.dark .bg-white .text-2xl.font-bold,
.dark .bg-white .text-2xl.font-bold * {
    color: #FFFFFF !important;
}

/* 2. 同步把底下的機場代碼（TPE、HSG）在暗黑模式下也轉為白色，確保整體高對比度 */
.dark .bg-white .text-\[10px\].text-stone-400 {
    color: #FFFFFF !important;
}

/* 3. 唯獨右上角的日期（如 6/16 二）因為疊在亮黃色圈圈上，在暗黑模式下必須維持深黑色，否則白字在黃底上會看不見 */
.dark .bg-white .relative.z-10 > div:first-child span:last-child,
.dark .bg-white .relative.z-10 > div:first-child span:last-child * {
    color: #1A1510 !important;
}


/* ============================================================
   🔥 v3.5 行程卡片展開（橘色狀態）文字與日期對比度終極優化
   ============================================================ */

/* 1. 當行程點開變成橘色底時，將「日期小字」(如 6/16 二) 強制轉為純白色 */
/* 沒開暗黑模式時完全不影響，一開暗黑就會變高對比的純白 */
.dark .bg-stone-800 .text-xs.font-bold {
    color: #FFFFFF !important;
}

/* 2. 點開變橘色時，左側 DAY 方塊底色稍微拉亮，並將裡面的 "DAY" 與 "數字" 全部強制轉為深墨色 (#1A1510) */
/* 這樣在亮橘色背景下，方塊內的字體才會像繪本一樣絕對清晰，徹底解決看不清的問題！ */
.dark .bg-stone-800 .w-12.h-12 {
    background-color: rgba(255, 255, 255, 0.5) !important; /* 提高方塊透明 度讓它更白亮 */
    border-color: #1A1510 !important;
}
.dark .bg-stone-800 .w-12.h-12 span {
    color: #1A1510 !important;
}

/* ============================================================
   🔥 v3.6 修正深色模式背景 Japan 水印過亮問題
   ============================================================ */

/* 讓深色模式下的 Japan 大字體變暗並降低不透明度，使其融入背景，不再干擾右上角文字閱讀 */
.dark .absolute.top-\[-20px\].right-\[-20px\] {
    color: rgba(0, 0, 0, 0.4) !important; /* 轉為深色暗影 */
    opacity: 0.25 !important;            /* 大幅降低透明度 */
}

/* ============================================================
   🔥 v3.7 背景 Japan 水印文字絕對壓暗（終極避開轉義地雷版）
   ============================================================ */

/* 徹底放棄中括號選擇器，改用它獨有的 font-serif 結合防選取結構，開頭加上 body 衝高權重 */
body .dark div.font-serif.select-none.leading-none.pointer-events-none {
    color: rgba(0, 0, 0, 0.7) !important; /* 強制切換成極暗的黑影 */
    opacity: 0.12 !important;            /* 降低透明度，讓它乖乖退到背景深處 */
}

/* ============================================================
   FINAL FIX 1 — 淺色模式 橘色展開DAY卡片內 DAY文字和日期加深
   ============================================================ */

/* DAY 小字 */
.bg-stone-800 .text-\[10px\].font-bold.text-stone-400.uppercase {
  color: rgba(255, 255, 255, 0.95) !important;
}

/* 日期小字 (6/16 二) */
.bg-stone-800 .text-xs.font-bold.mb-0\.5 {
  color: rgba(255, 255, 255, 0.95) !important;
}




/* ============================================================
   FINAL FIX 2 — 深色模式 指南頁「問問AI」按鈕文字加深可見
   ============================================================ */

/* 問問AI按鈕在深色模式下 白底變深底 */
.dark button.flex.items-center.justify-center.gap-2.py-2\.5.bg-white.border.border-stone-200 {
  background-color: #2A2010 !important;
  border-color: var(--miffy-yellow) !important;
  color: var(--miffy-yellow) !important;
}

/* 問問AI按鈕裡的 teal icon 也要亮一點 */
.dark button.flex.items-center.justify-center.gap-2.py-2\.5.bg-white .text-teal-500 {
  color: #2DD4BF !important;
}


/* ============================================================
   FINAL FIX 3 — 淺色模式 DAY文字和日期強制深色
   ============================================================ */
:not(.dark) .text-\[10px\].font-bold.text-stone-400.uppercase {
  color: #1A1510 !important;
}
:not(.dark) .text-xs.font-bold.mb-0\.5.text-stone-400 {
  color: #1A1510 !important;
}

/* ============================================================
   FINAL FIX 4 — 指南頁問問AI按鈕深色模式強制可見
   ============================================================ */
.dark .p-5.rounded-\[2rem\].border button.bg-white,
.dark .p-5.rounded-\[2rem\].border button[class*="bg-white"] {
  background-color: #2A2010 !important;
  border-color: #F7E84E !important;
  color: #F7E84E !important;
}
.dark .p-5.rounded-\[2rem\].border button[class*="bg-white"] svg {
  color: #2DD4BF !important;
}



        `}
      </style>
      <div className={`min-h-screen font-sans text-stone-800 dark:text-stone-100 max-w-md mx-auto relative overflow-hidden ${isLocked ? 'bg-stone-900' : 'bg-[#FDFBF7] dark:bg-stone-900'}`}>
        <div className="fixed inset-0 z-[9999] bg-stone-900 text-white flex-col items-center justify-center hidden landscape:flex"><Phone size={48} className="animate-pulse mb-4" /><p className="text-lg font-bold">請將手機轉為直向</p></div>

        {/* 門鎖畫面 */}
        {isLocked && (
          <div className="fixed inset-0 z-[100] flex justify-center bg-stone-900 h-screen w-full">
            <div className="relative w-full max-w-md h-full flex flex-col items-center">
              <div
  className="absolute top-0 left-0 w-full h-full"
  style={{
    backgroundImage: `url(${JUNGLE_BG})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center 70%',

  }}
>
  <div className="absolute inset-0 bg-black/20"></div>
</div>


              <div className="relative z-10 flex flex-col items-center w-full px-8 h-full pt-40">
               
               
               <div
  onMouseDown={() => pressTimerRef.current = setTimeout(() => setShowHelloKitty(true), 2000)}
  onMouseUp={() => clearTimeout(pressTimerRef.current)}
  className="relative cursor-pointer"
  style={{
    transition: isUnlocking
      ? 'transform 1.0s cubic-bezier(0.4, 0, 1, 1), opacity 1.0s ease'
      : 'none',
    transform: isUnlocking ? 'translateX(130vw) translateY(-30px) rotate(8deg)' : 'translateX(0) translateY(0) rotate(0deg)',
    opacity: isUnlocking ? 0 : 1,
    marginBottom: '12px',
    marginTop: '-80px',
  }}
>
  <img
    src={process.env.PUBLIC_URL + '/images/airplane.png'}
    alt="Miffy Airplane"
    style={{ width: '200px', objectFit: 'contain', display: 'block' }}
  />
</div>
                
                <h2 className="text-3xl font-serif font-bold mb-1 text-white">Kyushu 2026</h2>
                <p className="text-emerald-100 text-sm mb-2 text-center tracking-widest font-bold">佑任・軒寶・阿歪・黃蔓</p>
                <p className="text-emerald-200/60 text-[10px] uppercase font-bold text-center mb-6">{systemInfo}</p>
                <button onClick={() => window.location.reload()} className="absolute top-12 right-6 p-2 rounded-full bg-white/10 text-white/50"><RefreshCw size={20} /></button>
                <form
  className="w-full relative"
  style={{ marginTop: 'auto', marginBottom: 'calc(320px + env(safe-area-inset-bottom))' }}
  onSubmit={(e) => { e.preventDefault(); handleUnlock(); }}
>
  <div className="relative">
    <KeyRound size={18} className="absolute left-4 top-4 text-white/70" />
    <input
      type="password"
      value={inputPwd}
      onChange={(e) => setInputPwd(e.target.value)}
      placeholder="Passcode"
      className="w-full rounded-2xl pl-12 pr-12 py-3.5 text-lg text-white text-center font-bold outline-none"
      style={{
  background: 'transparent',
backdropFilter: 'none',
WebkitBackdropFilter: 'none',
border: '1.5px solid rgba(255,255,255,0.6)',
letterSpacing: '0.2em',
}}
    />
  </div>
  <button
    type="submit"
    className="w-full mt-4 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
    style={{
  background: 'transparent',
backdropFilter: 'none',
WebkitBackdropFilter: 'none',
border: '1.5px solid rgba(255,255,255,0.6)',
boxShadow: 'none',
color: '#fff',
fontFamily: "'Space Mono', monospace",
letterSpacing: '2px',
textTransform: 'uppercase',
fontSize: '13px',
}}
  >
    Start Journey <ArrowRight size={18} />
  </button>
</form>
              </div>
              {showHelloKitty && <div onClick={() => setShowHelloKitty(false)} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn p-8"><div className="bg-[#FFF0F5] p-6 rounded-3xl text-center"><p className="text-pink-400 font-bold">Surprise! 🎉 系統檢測正常！</p></div></div>}
            </div>
          </div>
        )}

        {/* 解鎖主畫面 */}
        {!isLocked && (
          <>
            {isLoadingData ? (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFBF7] dark:bg-stone-900"><Loader2 size={48} className="text-amber-500 animate-spin mb-4" /><p className="text-stone-500 text-sm font-bold tracking-widest animate-pulse">正在同步獨立雲端行程...</p></div>
            ) : (
              <div id="main-app-container" className="bg-[#FDFBF7] dark:bg-stone-900 min-h-screen">
                <WeatherHero
                  isAdmin={isAdmin}
                  itinerary={itinerary}
                  setItinerary={setItinerary}
                  versionText={appVersion}
                  updateVersion={handleUpdateVersion}
                  showSecret={showSecret}
                  onLock={() => { setIsLocked(true); setIsUnlocking(false); setInputPwd(''); setIsAdmin(false); setIsMember(false); localStorage.removeItem('isUnlocked'); localStorage.removeItem('userRole'); }}
                  onHardRefresh={() => window.location.reload()}
                />
                <main className="pb-28">
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
                        <div className="text-center text-xs text-stone-400 mt-12 mb-4 font-serif italic">— Journey to Kyushu —</div>
                        <div className="flex justify-center mb-8"><button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-400 shadow-sm"><FileText size={10} /> 匯出 PDF 精裝行程</button></div>
                      </div>
                      <FloatingStatus itinerary={itinerary} />
                    </div>
                  )}

                  {activeTab === 'packing' && (
                    <PackingPage isKonamiActive={isKonamiActive} isAdmin={isAdmin} isMember={isMember} onSecretTrigger={handleSecretTrigger} />
                  )}

                  {activeTab === 'guide' && (
                    <GuidePage isAdmin={isAdmin} isMember={isMember} noticeText={noticeText} updateNoticeText={handleUpdateNotice} darkMode={darkMode} />
                  )}

                  {activeTab === 'utils' && (
                    <div>
                      <div className="px-6 pt-6">
                        <div className="flex items-center justify-between bg-white dark:bg-stone-800 p-4 rounded-2xl border">
                          <div className="flex items-center gap-2 font-bold">{darkMode ? <Sun size={18} className="text-amber-400" /> : <CloudRain size={18} className="text-stone-400" />}<span>{darkMode ? '深色模式 (On)' : '淺色模式 (Off)'}</span></div>
                          <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full p-1 ${darkMode ? 'bg-amber-500' : 'bg-stone-300'}`}><div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} /></button>
                        </div>
                      </div>
                      <UtilsPage isAdmin={isAdmin} isMember={isMember} systemInfo={systemInfo} updateSystemInfo={updateSystemInfo} />
                    </div>
                  )}
                </main>
                <BackToTop />
                {showShakeEgg && (
  <div 
    onClick={() => setShowShakeEgg(false)} 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8 backdrop-blur-sm animate-fadeIn"
  >
    <div className="bg-[#FFF0F5] p-6 rounded-3xl text-center">
      <img 
        //src="https://i.pinimg.com/originals/24/63/40/24634090aa96299f569a8bb60c9dda14.gif" 
        src="https://c.tenor.com/ddLE-WNX6gkAAAAd/tenor.gif" 


        
        alt="Egg" 
        className="w-full rounded-xl mb-4" 
      />
      <p className="text-pink-500 font-bold">🍀 搖出驚喜！Miffy生日快樂！</p>
    </div>
  </div>
)}

                {/* 底部功能列 */}
                <nav className="fixed bottom-0 w-full max-w-md bg-white/90 dark:bg-stone-900/90 backdrop-blur-lg border-t flex justify-around py-3 pb-4 z-40 select-none">
                  <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'itinerary' ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'}`}><MapPin size={20} /><span className="text-[10px] font-bold">行程</span></button>
                  <button onClick={() => setActiveTab('packing')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'packing' ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'}`}><CheckCircle size={20} /><span className="text-[10px] font-bold">準備</span></button>
                  <button onClick={() => setActiveTab('guide')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'guide' ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'}`}><Compass size={20} /><span className="text-[10px] font-bold">指南</span></button>
                  <button onClick={() => setActiveTab('utils')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'utils' ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'}`}><Wallet size={20} /><span className="text-[10px] font-bold">工具</span></button>
                </nav>
              </div>
            )}

            {/* 精裝列印專區 */}
            <div id="print-zone" className="hidden print:block bg-white text-stone-900 p-10">
              <h1 className="text-3xl font-serif font-bold border-b-2 border-amber-500 pb-4 mb-8 text-center">KYUSHU SURVIVAL 2026<br /><span className="text-sm text-stone-400 font-sans tracking-widest uppercase">Nagasaki & Saga Itinerary</span></h1>
              {itinerary.map((day) => (
                <div key={day.day} className="mb-12 page-break-inside-avoid">
                  <div className="flex items-baseline gap-3 mb-4 border-b pb-1"><span className="text-4xl font-serif font-bold text-amber-600">D{day.day}</span><span className="text-lg font-bold text-stone-800">{day.displayDate} - {day.title}</span></div>
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {day.locations.map((loc, idx) => (
                        <tr key={idx} className="align-top border-b border-stone-50">
                          <td className="py-4 pr-4 font-mono font-bold text-xs text-stone-500 w-16">{loc.time}</td>
                          <td className="py-4">
                            <div className="font-bold text-stone-800 text-sm mb-0.5">{loc.name}</div>
                            <div className="text-[11px] text-amber-700 font-bold mb-1">{loc.note}</div>
                            <div className="text-[10px] text-stone-500 leading-relaxed">{loc.desc}</div>
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