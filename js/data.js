// ============================================================
// data.js  ―  マスタデータ・税額表・定数
// ============================================================

const OTD = {
  company: '株式会社 One Table Design',
  address: '茨城県東茨城郡大洗町港中央9-4',
  tel: '',
  stores: ['本店（えんやどっと丸）', 'パスタのマルコ'],
};

// -------- 従業員マスタ (LocalStorage から復元) --------
const DEFAULT_EMPLOYEES = [
  // 正社員（職能給あり）
  { id:1,  name:'青木 優介',      kana:'アオキ ユウスケ',   type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:375250, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:2,  name:'原 孝志',        kana:'ハラ タカシ',       type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:404800, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:3,  name:'小沼 太一',      kana:'オヌマ タイチ',     type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:250000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'本店',  hireDate:'', birthDate:'' },
  { id:4,  name:'石井 眞弓',      kana:'イシイ マユミ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:5,  name:'半谷 和津江',    kana:'ハンヤ カツエ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:6,  name:'武田 あさ子',    kana:'タケダ アサコ',     type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:7,  name:'仲田 友子',      kana:'ナカタ トモコ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:8,  name:'石田 良子',      kana:'イシダ ヨシコ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:9,  name:'梅原 みゆき',    kana:'ウメハラ ミユキ',   type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:10, name:'勘田 尚人',      kana:'カンダ ナオト',     type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  { id:11, name:'TRAN THI THAO', kana:'',                 type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'本店',  hireDate:'', birthDate:'' },
  { id:12, name:'箕輪 栞',        kana:'ミノワ シオリ',     type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'本店',  hireDate:'', birthDate:'' },
  { id:13, name:'寺山 由紀子',    kana:'テラヤマ ユキコ',   type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:14, name:'ダラガン ジャスミン エデュラン', kana:'', type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'マルコ', hireDate:'', birthDate:'' },
  { id:15, name:'エデュラン アイコ', kana:'',              type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'マルコ', hireDate:'', birthDate:'' },
  { id:16, name:'SAPKOTA SUSHMA',kana:'',                 type:'アルバイト',dept:'ホール', payType:'時給',  baseSalary:0,      hourlyWage:1100, commute:2000, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入',koyo:'未加入',tax:'甲',juminzei:0,  store:'マルコ', hireDate:'', birthDate:'' },
  { id:17, name:'小島 まゆこ',    kana:'コジマ マユコ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:18, name:'大原 瑠奈',      kana:'オオハラ ルナ',     type:'パート',  dept:'ホール',   payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'マルコ', hireDate:'', birthDate:'' },
  { id:19, name:'檜山 明子',      kana:'ヒヤマ アキコ',     type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  { id:20, name:'直井',           kana:'ナオイ',            type:'正社員',  dept:'キッチン', payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  { id:21, name:'黒羽',           kana:'クロハ',            type:'パート',  dept:'キッチン', payType:'時給',  baseSalary:0,      hourlyWage:1200, commute:5000, positionAllowance:0, targetGross:0, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:0,    store:'本店',  hireDate:'', birthDate:'' },
  // 追加
  { id:22, name:'圷 竜司',        kana:'アクツ リュウジ',   type:'正社員',  dept:'ホール',   payType:'月給',  baseSalary:220000, hourlyWage:0, commute:15000, positionAllowance:0, targetGross:280000, dependents:0, shakai:'加入', koyo:'加入', tax:'甲', juminzei:8000, store:'マルコ', hireDate:'', birthDate:'' },
  // 役員（給与計算対象外・総支給固定）
  { id:23, name:'清水 佳澄',      kana:'シミズ カスミ',     type:'役員',    dept:'管理',     payType:'役員報酬', baseSalary:0,   hourlyWage:0, commute:0,     positionAllowance:0, targetGross:360000, dependents:0, shakai:'加入', koyo:'未加入', tax:'甲', juminzei:0,   store:'本店',  hireDate:'', birthDate:'' },
  { id:24, name:'清水 裕久',      kana:'シミズ ヒロヒサ',   type:'役員',    dept:'管理',     payType:'役員報酬', baseSalary:0,   hourlyWage:0, commute:0,     positionAllowance:0, targetGross:100000, dependents:0, shakai:'加入', koyo:'未加入', tax:'甲', juminzei:0,   store:'本店',  hireDate:'', birthDate:'' },
];

// -------- 源泉徴収税額表（甲欄 2024年度） --------
const TAX_TABLE = [
  [0,88000,0],[88000,89000,130],[89000,92000,180],[92000,95000,210],
  [95000,98000,260],[98000,101000,310],[101000,105000,360],[105000,109000,420],
  [109000,113000,490],[113000,117000,560],[117000,121000,640],[121000,125000,720],
  [125000,129000,810],[129000,133000,890],[133000,137000,980],[137000,141000,1070],
  [141000,145000,1170],[145000,149000,1260],[149000,153000,1350],[153000,157000,1440],
  [157000,161000,1540],[161000,165000,1630],[165000,169000,1720],[169000,173000,1820],
  [173000,177000,1910],[177000,181000,2010],[181000,185000,2100],[185000,189000,2210],
  [189000,193000,2300],[193000,197000,2400],[197000,201000,2490],[201000,210000,2780],
  [210000,220000,3180],[220000,230000,3680],[230000,240000,4180],[240000,250000,4680],
  [250000,260000,5180],[260000,270000,5680],[270000,280000,6200],[280000,290000,6700],
  [290000,300000,7200],[300000,320000,8200],[320000,340000,9300],[340000,360000,10400],
  [360000,380000,11600],[380000,400000,12800],[400000,420000,14000],[420000,440000,15200],
  [440000,460000,16500],[460000,480000,17700],[480000,500000,19000],[500000,520000,20300],
  [520000,540000,21600],[540000,560000,22900],[560000,580000,24200],[580000,600000,25500],
  [600000,640000,27600],[640000,680000,30500],[680000,720000,33500],[720000,760000,36400],
  [760000,800000,39400],[800000,840000,42400],[840000,880000,45400],[880000,920000,49200],
  [920000,960000,54400],[960000,1000000,59700],[1000000,Infinity,65000],
];

// 乙欄（扶養対象外・副業等）
const TAX_TABLE_OTU_RATE = 0.05; // 簡易（実際は別表）

// -------- 健康保険・厚生年金（全国健康保険協会 茨城支部 2025年度） --------
// 健康保険（介護保険第2号被保険者以外）: 10.06% → 本人5.03%
// 健康保険（介護保険第2号被保険者・40歳〜64歳）: 11.86% → 本人5.93%
// 厚生年金: 18.30% → 本人9.15%
const KENPO_RATE       = 0.0503; // 健保（介護なし）
const KENPO_KAIGO_RATE = 0.0593; // 健保（介護あり・40〜64歳）
const KOSEI_RATE       = 0.0915; // 厚生年金

// 年齢から介護保険対象かどうかを判定（40歳以上65歳未満）
function isKaigoTarget(birthDateStr) {
  if (!birthDateStr) return false;
  const birth = new Date(birthDateStr);
  const today = new Date();
  const age   = today.getFullYear() - birth.getFullYear()
    - (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
  return age >= 40 && age < 65;
}

// 社会保険料計算（標準報酬月額ベース）
function calcShakai(grossForShakai, birthDateStr = '') {
  // 標準報酬月額（1000円単位に丸め）
  const hyojun = Math.round(grossForShakai / 1000) * 1000;
  const kaigo  = isKaigoTarget(birthDateStr);
  const kenpo  = Math.round(hyojun * (kaigo ? KENPO_KAIGO_RATE : KENPO_RATE));
  const kosei  = Math.round(hyojun * KOSEI_RATE);
  return { kenpo, kosei, kaigo };
}

// 雇用保険料率（2024年度）: 一般事業 本人負担 6/1000
const KOYO_RATE = 0.006;

// -------- 所得税計算 --------
function calcIncomeTax(taxableGross, dependents = 0, taxType = '甲') {
  // 扶養人数による調整（簡易）: 扶養1人につき38,000円 / 12月 = 3,167円控除
  const deduction = dependents * 3167;
  const adj = taxableGross - deduction;
  if (adj < 88000) return 0;
  for (const [lo, hi, tax] of TAX_TABLE) {
    if (adj >= lo && adj < hi) return tax;
  }
  return 0;
}

// -------- 給与締め・支払・休日設定 --------
const PAY_CONFIG = {
  cutoffDay: 20,       // 締め日（20日）
  payDay: 'lastDay',   // 支払日: 'lastDay'=末日, または数値(例: 25)
  legalHolidayDow: 4,  // 法定休日の曜日: 0=日,1=月,2=火,3=水,4=木,5=金,6=土 → 4=木曜
  nonLegalHolidayDow: 3, // 法定外休日の曜日 → 3=水曜
};

const DOW_NAMES = ['日','月','火','水','木','金','土'];

// 給与計算期間の開始・終了日を返す
// 例: year=2026, month=6 → 2026/5/21 〜 2026/6/20
function getPayPeriod(year, month) {
  const cutoff = PAY_CONFIG.cutoffDay;
  // 開始: 前月(month-1)の締め日翌日
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear  = month === 1 ? year - 1 : year;
  const startDate = `${prevYear}-${String(prevMonth).padStart(2,'0')}-${String(cutoff + 1).padStart(2,'0')}`;
  // 終了: 当月締め日
  const endDate   = `${year}-${String(month).padStart(2,'0')}-${String(cutoff).padStart(2,'0')}`;
  // 支払日
  let payDateStr;
  if (PAY_CONFIG.payDay === 'lastDay') {
    const lastDay = new Date(year, month, 0).getDate();
    payDateStr = `${year}-${String(month).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
  } else {
    payDateStr = `${year}-${String(month).padStart(2,'0')}-${String(PAY_CONFIG.payDay).padStart(2,'0')}`;
  }
  return { startDate, endDate, payDateStr };
}

// 日付が給与計算期間内かどうかを判定
function isInPayPeriod(dateStr, year, month) {
  const { startDate, endDate } = getPayPeriod(year, month);
  return dateStr >= startDate && dateStr <= endDate;
}

// -------- Firebase 初期化 --------
const firebaseConfig = {
  apiKey: "AIzaSyA3YVQwyAudMEZJs_rfEW8IHfxh4Grvlbw",
  authDomain: "wcsa-shift.firebaseapp.com",
  databaseURL: "https://wcsa-shift-default-rtdb.firebaseio.com",
  projectId: "wcsa-shift",
  storageBucket: "wcsa-shift.firebasestorage.app",
  messagingSenderId: "521554404721",
  appId: "1:521554404721:web:f59a570dd7e10f3aed82d0"
};

// Firebase が未初期化の場合のみ初期化
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// -------- Firebase パス --------
const FB = {
  employees:  () => db.ref('payroll/employees'),
  attendance: () => db.ref('payroll/attendance'),
  paidLeave:  () => db.ref('payroll/paidLeave'),
  article36:  () => db.ref('payroll/article36'),
};

// -------- State --------
let employees  = [];
let attendance = {};
let paidLeave  = {};
let article36  = {};
let _fbLoaded  = false; // 初回ロード完了フラグ

// 在籍中スタッフのみ
function activeEmployees() {
  return employees.filter(e => e.status !== 'inactive' && e.status !== 'leave');
}

// -------- Firebase 読み込み・リアルタイム購読 --------
function initFirebaseData() {
  showLoadingOverlay(true);

  // 4つのノードを並行購読
  let loaded = 0;
  const onLoad = () => { if (++loaded >= 4) { showLoadingOverlay(false); _fbLoaded = true; renderPage(currentPage); } };

  FB.employees().on('value', snap => {
    const val = snap.val();
    if (val) {
      employees = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
      // order フィールドがなければ id で補完してから order でソート
      employees.forEach((e, i) => { if (e.order === undefined) e.order = e.id * 10; });
      employees.sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id));
    } else {
      const empObj = {};
      DEFAULT_EMPLOYEES.forEach((e, i) => { empObj[e.id] = { ...e, order: i * 10 }; });
      FB.employees().set(empObj);
      employees = DEFAULT_EMPLOYEES.map((e, i) => ({ ...e, order: i * 10 }));
    }
    if (!_fbLoaded) {
      onLoad();
    } else {
      renderPage(currentPage);
      showToast('データが更新されました ✓');
    }
  });

  FB.attendance().on('value', snap => {
    attendance = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'attendance' || currentPage === 'weekly' || currentPage === 'monthly') renderPage(currentPage);
  });

  FB.paidLeave().on('value', snap => {
    paidLeave = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'paid_leave') renderPage(currentPage);
  });

  FB.article36().on('value', snap => {
    article36 = snap.val() || {};
    if (!_fbLoaded) onLoad(); else if (currentPage === 'article36') renderPage(currentPage);
  });
}

// -------- 保存関数（Firebase書き込み） --------
function saveData() {
  const empObj = {};
  employees.forEach(e => { empObj[e.id] = e; });
  FB.employees().set(empObj);
  FB.attendance().set(attendance);
  FB.paidLeave().set(paidLeave);
  FB.article36().set(article36);
  showToast('保存しました ✓');
}

// 個別保存ヘルパー
function saveLS(key, val) {
  // Firebase に保存（後方互換のため関数名は保持）
  if (key === 'employees') {
    const empObj = {};
    val.forEach(e => { empObj[e.id] = e; });
    FB.employees().set(empObj);
  } else if (key === 'attendance') {
    FB.attendance().set(val);
  } else if (key === 'paidLeave') {
    FB.paidLeave().set(val);
  } else if (key === 'article36') {
    FB.article36().set(val);
  }
}

// ローディングオーバーレイ
function showLoadingOverlay(show) {
  let el = document.getElementById('fbLoadingOverlay');
  if (!el && show) {
    el = document.createElement('div');
    el.id = 'fbLoadingOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(15,25,35,0.85);z-index:9998;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:inherit';
    el.innerHTML = '<div style="font-size:28px;margin-bottom:12px">⏳</div><div style="font-size:15px;font-weight:600">データを読み込み中...</div><div style="font-size:12px;color:#888;margin-top:6px">Firebase に接続しています</div>';
    document.body.appendChild(el);
  }
  if (el) el.style.display = show ? 'flex' : 'none';
}

// -------- Util --------
function getYM(year, month) {
  return `${year}-${String(month).padStart(2,'0')}`;
}

// 指定年月の打刻データを取得
function getMonthAttendance(year, month, empId) {
  const ym = getYM(year, month);
  return (attendance[ym] && attendance[ym][empId]) || {};
}

// 週マタギ残業計算（日8h超・週40h超・月60h超・深夜・休日 完全対応）
//
// 【割増率一覧】
//   日8h超残業（dailyOT）      → +25%
//   週40h超残業（weekOT）      → +25%（日8h超と重複しない）
//   月60h超残業               → さらに+25%（合計+50%）
//   深夜のみ（midnight）       → +25%
//   深夜かつ残業（midnightOT） → +25%+25%=+50%（残業割増と深夜割増が合算）
//   深夜かつ月60h超残業        → +50%+25%=+75%
//   法定休日（holidayLegal）   → +35%（深夜なら+60%）週40h計算から除外
//   法定外休日（holidayNonLegal）→ 通常賃金。週40h超分は残業として計算
//
// 入力フィールド:
//   actual        : その日の実労働時間合計（h）
//   dailyOT       : 日8h超の残業時間（h）
//   midnight      : 22時〜5時の労働時間合計（h）
//   midnightOT    : 22時〜5時 かつ 残業（日8h超 or 週40h超）の時間（h）
//   holidayLegal  : 法定休日（木曜）実働時間（h）
//   holidayNonLegal:法定外休日（水曜）実働時間（h）
function calcWeeklyOT(dailyList, year, month) {
  if (!dailyList.length) return {
    weeks:[], monthOT:0, monthDailyOT:0, monthWeekOT:0,
    monthMidnight:0, monthMidnightOT:0,
    monthHolidayLegal:0, monthHolidayNonLegal:0,
    monthHoliday:0, totalActual:0
  };

  const byWeek = {};
  for (const d of dailyList) {
    const dt  = new Date(d.date);
    const day = dt.getDay() || 7;
    const monday = new Date(dt);
    monday.setDate(dt.getDate() - day + 1);
    const wk = monday.toISOString().slice(0,10);
    if (!byWeek[wk]) byWeek[wk] = { start: wk, days: [] };
    byWeek[wk].days.push(d);
  }

  let monthOT=0, monthDailyOT=0, monthWeekOT=0;
  let monthMidnight=0, monthMidnightOT=0;
  let monthHolidayLegal=0, monthHolidayNonLegal=0, totalActual=0;
  const weeks = [];

  for (const [wkStart, wkData] of Object.entries(byWeek).sort()) {
    const endDt = new Date(wkStart);
    endDt.setDate(endDt.getDate() + 6);
    const wkEnd = endDt.toISOString().slice(0,10);

    let wkActual=0, wkDailyOT=0, wkMidnight=0, wkMidnightOT=0;
    let wkHolidayLegal=0, wkHolidayNonLegal=0;

    for (const d of wkData.days) {
      wkActual          += d.actual          || 0;
      wkDailyOT         += d.dailyOT         || 0;
      wkMidnight        += d.midnight        || 0;
      wkMidnightOT      += d.midnightOT      || 0;
      wkHolidayLegal    += d.holidayLegal    || 0;
      wkHolidayNonLegal += d.holidayNonLegal || 0;
      if (d.holiday && !d.holidayLegal && !d.holidayNonLegal) wkHolidayNonLegal += d.holiday;
    }

    // 週40h超残業：日8h超分を除いた純週残業
    const wkWeekOT = Math.max(0, wkActual - 40 - wkDailyOT);
    const wkOT = wkDailyOT + wkWeekOT;

    const daysInPeriod = wkData.days.filter(d => isInPayPeriod(d.date, year, month)).length;
    const ratio = wkData.days.length > 0 ? daysInPeriod / wkData.days.length : 1;

    monthOT           += wkOT         * ratio;
    monthDailyOT      += wkDailyOT    * ratio;
    monthWeekOT       += wkWeekOT     * ratio;
    monthMidnight     += wkMidnight   * ratio;
    monthMidnightOT   += wkMidnightOT * ratio;
    monthHolidayLegal    += wkHolidayLegal    * ratio;
    monthHolidayNonLegal += wkHolidayNonLegal * ratio;

    const actualInPeriod = wkData.days
      .filter(d => isInPayPeriod(d.date, year, month))
      .reduce((s,d) => s + (d.actual||0), 0);
    totalActual += actualInPeriod;

    weeks.push({ start:wkStart, end:wkEnd, actual:wkActual,
      dailyOT:wkDailyOT, weekOT:wkWeekOT, overtime:wkOT,
      midnight:wkMidnight, midnightOT:wkMidnightOT,
      holidayLegal:wkHolidayLegal, holidayNonLegal:wkHolidayNonLegal, daysInPeriod });
  }

  const r = v => Math.round(v*10)/10;
  return {
    weeks,
    monthOT:              r(monthOT),
    monthDailyOT:         r(monthDailyOT),
    monthWeekOT:          r(monthWeekOT),
    monthMidnight:        r(monthMidnight),
    monthMidnightOT:      r(monthMidnightOT),
    monthHolidayLegal:    r(monthHolidayLegal),
    monthHolidayNonLegal: r(monthHolidayNonLegal),
    monthHoliday:         r(monthHolidayLegal + monthHolidayNonLegal),
    totalActual:          r(totalActual),
  };
}

// 給与計算期間（前月21日〜当月20日）＋週マタギのため前後1週間を含む打刻を取得
function getExtendedDailyList(empId, year, month) {
  const list = [];
  const { startDate, endDate } = getPayPeriod(year, month);

  // 週マタギのため、計算期間の前後1週間もスキャン（前々月末〜翌月初）
  const prevPrev = month <= 2 ? [year-1, month+10] : [year, month-2];
  const next     = month === 12 ? [year+1, 1] : [year, month+1];
  const monthsToScan = [
    prevPrev,
    [month===1?year-1:year, month===1?12:month-1],
    [year, month],
    next,
  ];

  for (const [y,m] of monthsToScan) {
    const ym = getYM(y,m);
    const empData = (attendance[ym] && attendance[ym][empId]) || {};
    for (const [date, rec] of Object.entries(empData)) {
      if (!list.find(d=>d.date===date)) {
        list.push({ date, ...rec });
      }
    }
  }
  return list.sort((a,b)=>a.date.localeCompare(b.date));
}

// 月次サマリ取得（週マタギ計算込み・給与計算期間基準）
function getMonthSummary(empId, year, month) {
  const extended = getExtendedDailyList(empId, year, month);
  const result = calcWeeklyOT(extended, year, month);

  // ★ 出勤日数・有給・欠勤も「給与計算期間（前月21日〜当月20日）」で集計
  let workDays = 0, paidDays = 0, absentDays = 0, lateDays = 0;
  for (const d of extended) {
    if (!isInPayPeriod(d.date, year, month)) continue;
    if (d.actual > 0) workDays++;
    if (d.paidLeave) paidDays++;
    if (d.absent) absentDays++;
    if (d.late > 0) lateDays++;
  }

  return { ...result, workDays, paidDays, absentDays, lateDays };
}

// 給与計算本体
function calcSalary(emp, year, month) {

  // ── 役員：固定総支給のみ ──────────────────────────
  if (emp.payType === '役員報酬') {
    const grossTotal = emp.targetGross || 0;
    let kenpo = 0, kosei = 0;
    if (emp.shakai === '加入') {
      const s = calcShakai(grossTotal, emp.birthDate);
      kenpo = s.kenpo; kosei = s.kosei;
    }
    const incomeTax      = calcIncomeTax(grossTotal - kenpo - kosei, emp.dependents, emp.tax);
    const juminzei       = emp.juminzei || 0;
    const totalDeduction = kenpo + kosei + incomeTax + juminzei;
    const netPay         = Math.round(grossTotal - totalDeduction);
    return {
      basePay: grossTotal, skillPay: 0, skillPayNote: '役員報酬（固定）',
      positionAllowancePay: 0, otPay: 0, midnightPay: 0,
      midnightOnlyPay: 0, midnightOTPay: 0,
      holidayLegalPay: 0, holidayNonLegalPay: 0, holidayPay: 0,
      commute: 0, commuteNote: '', grossTotal, kenpo, kosei, koyoHoken: 0,
      incomeTax, juminzei, totalDeduction, netPay,
      kaigo: isKaigoTarget(emp.birthDate),
      monthOT:0, monthDailyOT:0, monthWeekOT:0,
      monthMidnight:0, monthMidnightOT:0,
      monthHolidayLegal:0, monthHolidayNonLegal:0, monthHoliday:0,
      totalActual:0, workDays:0, paidDays:0, absentDays:0,
      hourlyBase:0, ot60under:0, ot60over:0,
    };
  }

  const summary = getMonthSummary(emp.id, year, month);
  const {
    monthOT, monthDailyOT, monthWeekOT,
    monthMidnight, monthMidnightOT,
    monthHolidayLegal, monthHolidayNonLegal,
    totalActual, workDays, paidDays, absentDays
  } = summary;

  let basePay = 0, hourlyBase = 0;

  if (emp.payType === '月給') {
    const workingDays = getMonthWorkingDays(year, month);
    const totalHours  = workingDays * 8;
    hourlyBase = totalHours > 0 ? emp.baseSalary / totalHours : 0;
    basePay = emp.baseSalary - absentDays * 8 * hourlyBase;
  } else {
    hourlyBase = emp.hourlyWage;
    basePay = totalActual * hourlyBase;
  }

  const h = hourlyBase;

  // 役職手当
  const positionAllowancePay = emp.positionAllowance || 0;

  // ── 通勤手当（日額×出勤日数 or 月額固定）──────────
  const actualCommute = emp.commuteType === 'daily'
    ? (emp.commutePerDay || 0) * workDays
    : (emp.commute || 0);

  // 残業手当（月60h以内25%、60h超50%）
  const ot60under = Math.min(monthOT, 60);
  const ot60over  = Math.max(0, monthOT - 60);
  const otPay     = ot60under * h * 0.25 + ot60over * h * 0.50;

  // 深夜手当
  const midnightOnly    = monthMidnight - monthMidnightOT;
  const midnightOnlyPay = midnightOnly * h * 0.25;
  const midnightOT60u   = Math.min(monthMidnightOT, 60);
  const midnightOT60o   = Math.max(0, monthMidnightOT - 60);
  const midnightOTPay   = midnightOT60u * h * 0.25 + midnightOT60o * h * 0.25;
  const midnightPay     = midnightOnlyPay + midnightOTPay;

  // 法定休日手当
  const holidayLegalPay = monthHolidayLegal * h * 0.35;

  // ── 職能給の計算 ──────────────────────────────────
  // 職能給 = 目標総支給 - 基本給 - 通勤手当 - 役職手当 - 残業代合計
  let skillPay = 0, skillPayNote = '';
  if (emp.payType === '月給' && emp.targetGross > 0) {
    const otTotal = Math.round(otPay + midnightPay + holidayLegalPay);
    skillPay = emp.targetGross - emp.baseSalary - actualCommute - positionAllowancePay - otTotal;
    skillPay = Math.max(0, Math.round(skillPay));
    skillPayNote = `目標¥${emp.targetGross.toLocaleString()} - 基本給 - 通勤 - 役職 - 残業`;
  }

  const grossTotal = Math.round(basePay + skillPay + positionAllowancePay + otPay + midnightPay + holidayLegalPay + actualCommute);

  // 社会保険
  let kenpo = 0, kosei = 0;
  if (emp.shakai === '加入') {
    const s = calcShakai(grossTotal - actualCommute, emp.birthDate);
    kenpo = s.kenpo; kosei = s.kosei;
  }

  // 雇用保険
  let koyoHoken = 0;
  if (emp.koyo === '加入') koyoHoken = Math.round(grossTotal * KOYO_RATE);

  // 所得税
  const taxable   = grossTotal - actualCommute - kenpo - kosei - koyoHoken;
  const incomeTax = calcIncomeTax(taxable, emp.dependents, emp.tax);

  const juminzei       = emp.juminzei || 0;
  const chutaikyoAmount = (emp.chutaikyo === '加入') ? (emp.chutaikyoAmount || 0) : 0;
  const totalDeduction = kenpo + kosei + koyoHoken + incomeTax + juminzei + chutaikyoAmount;
  const netPay         = Math.round(grossTotal - totalDeduction);

  return {
    basePay:             Math.round(basePay),
    skillPay, skillPayNote,
    positionAllowancePay,
    otPay:               Math.round(otPay),
    midnightPay:         Math.round(midnightPay),
    midnightOnlyPay:     Math.round(midnightOnlyPay),
    midnightOTPay:       Math.round(midnightOTPay),
    holidayLegalPay:     Math.round(holidayLegalPay),
    holidayNonLegalPay:  0,
    holidayPay:          Math.round(holidayLegalPay),
    commute:    actualCommute,
    commuteNote: emp.commuteType === 'daily' ? `${(emp.commutePerDay||0).toLocaleString()}円×${workDays}日` : '月額固定',
    kaigo: isKaigoTarget(emp.birthDate),
    grossTotal, kenpo, kosei, koyoHoken, incomeTax, juminzei, chutaikyoAmount,
    totalDeduction:      Math.round(totalDeduction),
    netPay,
    monthOT, monthDailyOT, monthWeekOT,
    monthMidnight, monthMidnightOT,
    monthHolidayLegal, monthHolidayNonLegal,
    monthHoliday: monthHolidayLegal + monthHolidayNonLegal,
    totalActual, workDays, paidDays, absentDays,
    hourlyBase:  Math.round(h),
    ot60under, ot60over,
  };
}

// 給与計算期間内の所定労働日数（前月21日〜当月20日、土日除く簡易版）
function getMonthWorkingDays(year, month) {
  const { startDate, endDate } = getPayPeriod(year, month);
  const start = new Date(startDate);
  const end   = new Date(endDate);
  let count = 0;
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)) {
    const dow = dt.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

// 有給付与計算（労基法 39条準拠）
function calcPaidLeaveGrant(hireDateStr) {
  if (!hireDateStr) return [];
  const hire = new Date(hireDateStr);
  const grants = [];
  // 継続勤務年数別付与日数
  const grantTable = [
    { months:6, days:10 }, { months:18, days:11 }, { months:30, days:12 },
    { months:42, days:14 }, { months:54, days:16 }, { months:66, days:18 },
    { months:78, days:20 },
  ];
  const today = new Date();
  for (const g of grantTable) {
    const grantDate = new Date(hire);
    grantDate.setMonth(grantDate.getMonth() + g.months);
    if (grantDate <= today) {
      grants.push({ date: grantDate.toISOString().slice(0,10), days: g.days, months: g.months });
    }
  }
  return grants;
}

// 有給残日数取得
function getPaidLeaveBalance(empId) {
  const pl = paidLeave[empId];
  if (!pl) return { balance: 0, grants: [], used: [] };
  const totalGrant = (pl.grants || []).reduce((s,g)=>s+g.days,0);
  const totalUsed  = (pl.used  || []).reduce((s,u)=>s+u.days,0);
  return { balance: totalGrant - totalUsed, grants: pl.grants||[], used: pl.used||[] };
}

// ３６協定チェック（月80h / 年720h）
function check36(empId, year, month) {
  const ym = getYM(year, month);
  // 当月残業
  const summary = getMonthSummary(empId, year, month);
  const monthlyOT = summary.monthOT;

  // 年間集計
  let yearlyOT = 0;
  for (let m = 1; m <= 12; m++) {
    const s = getMonthSummary(empId, year, m);
    yearlyOT += s.monthOT;
  }

  const a36 = article36[year] || { limit36: 45, specialLimit: 80, yearLimit: 720 };

  const alerts = [];
  if (monthlyOT > a36.specialLimit) alerts.push({ level:'danger', msg:`月残業${monthlyOT.toFixed(1)}h → 特別条項上限${a36.specialLimit}h 超過` });
  else if (monthlyOT > a36.limit36) alerts.push({ level:'warn', msg:`月残業${monthlyOT.toFixed(1)}h → 一般条項上限${a36.limit36}h 超 ／ 特別条項を適用` });
  if (yearlyOT > a36.yearLimit) alerts.push({ level:'danger', msg:`年間残業${yearlyOT.toFixed(1)}h → 年間上限${a36.yearLimit}h 超過` });

  return { monthlyOT, yearlyOT, alerts };
}
