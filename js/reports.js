// hm: 時間数(小数)を "Xh Ym" 形式に変換
function hm(h) {
  if (h === null || h === undefined || h === '' || isNaN(h)) return '—';
  const total = Math.round(Number(h) * 60);
  if (total === 0) return '0h';
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return mm ? `${hh}h${mm}m` : `${hh}h`;
}

// ============================================================
// reports.js  ―  労基提出書類
// ============================================================

function renderLaborReport(year, month) {
  return `
  <div class="section-header">
    <div class="section-title">📁 労基提出書類</div>
  </div>

  <div class="alert alert-info">
    <span>📋</span>
    <div><strong>このページで出力できる書類</strong><br>
    労働基準監督署への提出・保管に対応した書式を出力します。保存義務期間に注意してください。</div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">

    <div class="card">
      <div class="card-title">📋 出勤簿（労基法施行規則54条）</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">保存義務：<strong>3年</strong></div>
      <p style="font-size:12.5px;margin-bottom:12px">各従業員の日別出勤・退勤・実労働時間を記録した出勤簿。月次・年次で印刷できます。</p>
      <button class="btn-primary" onclick="printAttendanceRecord(${year},${month})">🖨 出勤簿印刷（${year}年${month}月）</button>
    </div>

    <div class="card">
      <div class="card-title">💴 賃金台帳（労基法108条）</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">保存義務：<strong>3年</strong></div>
      <p style="font-size:12.5px;margin-bottom:12px">氏名・性別・賃金計算期間・労働時間・割増賃金・控除額・振込額を記録した台帳。</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        <select id="wageLedgerStore" style="font-size:12px;padding:4px 8px;border:1px solid #d1d5db;border-radius:6px;background:#f9fafb">
          <option value="">全店舗</option>
          <option value="本店">本店</option>
          <option value="マルコ">マルコ</option>
          <option value="両店">両店</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-primary" onclick="printWageLedger(${year},${month})">🖨 全員印刷</button>
        <button class="btn-outline" onclick="printWageLedgerFiltered(${year},${month})">🖨 絞込印刷</button>
        <button class="btn-outline" onclick="exportWageLedgerCSV(${year},${month})">CSV出力</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">🌿 有給管理簿（労基法施行規則24条の7）</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">保存義務：<strong>3年</strong></div>
      <p style="font-size:12.5px;margin-bottom:12px">有給付与日・付与日数・取得日・取得日数を記録。年度別に出力できます。</p>
      <button class="btn-primary" onclick="printPaidLeaveRecord(${year})">🖨 有給管理簿印刷（${year}年度）</button>
    </div>

    <div class="card">
      <div class="card-title">⚖️ ３６協定届（様式第9号）</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">届出：<strong>毎年更新・事前届出必須</strong></div>
      <p style="font-size:12.5px;margin-bottom:12px">時間外・休日労働に関する協定届。記入補助シートを出力します。</p>
      <button class="btn-primary" onclick="print36Notice(${year})">🖨 ３６協定記入補助シート出力</button>
    </div>

    <div class="card">
      <div class="card-title">📊 時間外労働実績レポート</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">監督署調査対応</div>
      <p style="font-size:12.5px;margin-bottom:12px">従業員別・月別の時間外労働実績一覧。労基署調査時の提出資料として使用できます。</p>
      <button class="btn-primary" onclick="printOTReport(${year})">🖨 年間実績レポート（${year}年）</button>
    </div>

    <div class="card">
      <div class="card-title">📥 一括CSV出力</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">税理士・社労士向け</div>
      <p style="font-size:12.5px;margin-bottom:12px">給与計算・勤怠・有給・３６協定の全データをCSVで一括出力します。</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn-outline" onclick="exportSalaryCSV(${year},${month})">給与計算CSV</button>
        <button class="btn-outline" onclick="exportMonthlyCSV(${year},${month})">月次勤怠CSV</button>
        <button class="btn-outline" onclick="exportPaidLeaveCSV(${year})">有給管理簿CSV</button>
        <button class="btn-outline" onclick="export36CSV(${year})">36協定CSV</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">👥 スタッフ名簿</div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">住所・連絡先・保険加入状況一覧</div>
      <p style="font-size:12.5px;margin-bottom:12px">全スタッフの連絡先・住所・社保・雇保・中退共の加入状況を一覧印刷できます。</p>
      <button class="btn-primary" onclick="printStaffRoster()">🖨 スタッフ名簿印刷</button>
    </div>

  </div>`;
}

// -------- スタッフ名簿 --------
function printStaffRoster() {
  const today = new Date().toLocaleDateString('ja-JP');
  const html = `<html><head><meta charset="UTF-8"><title>スタッフ名簿</title>
  <style>
    body{font-family:'Noto Sans JP',sans-serif;font-size:11px;margin:20px}
    h2{font-size:15px;text-align:center;margin-bottom:4px}
    .sub{text-align:center;font-size:11px;color:#666;margin-bottom:14px}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #333;padding:4px 6px;text-align:left;font-size:10.5px}
    th{background:#1a3a5c;color:#fff;text-align:center}
    tr:nth-child(even){background:#f8f8f8}
    .badge{display:inline-block;padding:1px 6px;border-radius:8px;font-size:10px}
    .in{background:#dbeafe;color:#1e40af}
    .out{background:#f3f4f6;color:#374151}
    @media print{body{margin:10px}}
  </style></head><body>
  <h2>スタッフ名簿</h2>
  <div class="sub">${OTD.company}　${OTD.address}　作成日：${today}</div>
  <table>
    <thead><tr>
      <th>No</th><th>氏名</th><th>雇用区分</th><th>店舗</th>
      <th>電話番号</th><th>緊急連絡先</th><th>住所</th>
      <th>入社日</th><th>生年月日</th>
      <th>支払</th><th>社保</th><th>雇保</th><th>中退共</th>
    </tr></thead>
    <tbody>
    ${employees.filter(e=>e.status!=='inactive').map((e,i)=>`
      <tr>
        <td style="text-align:center">${i+1}</td>
        <td><strong>${e.name}</strong>${e.kana?`<br><span style="color:#888;font-size:9px">${e.kana}</span>`:''}</td>
        <td style="text-align:center">${e.type}</td>
        <td style="text-align:center">${e.store||'—'}</td>
        <td>${e.phone||'—'}</td>
        <td style="font-size:9.5px">${e.emergencyPhone||'—'}</td>
        <td style="font-size:9.5px">${e.address||'—'}</td>
        <td style="text-align:center">${e.hireDate||'—'}</td>
        <td style="text-align:center">${e.birthDate||'—'}</td>
        <td style="text-align:center">${e.paymentMethod||'振込'}</td>
        <td style="text-align:center"><span class="badge ${e.shakai==='加入'?'in':'out'}">${e.shakai||'未'}</span></td>
        <td style="text-align:center"><span class="badge ${e.koyo==='加入'?'in':'out'}">${e.koyo||'未'}</span></td>
        <td style="text-align:center"><span class="badge ${(e.chutaikyo||'未加入')==='加入'?'in':'out'}">${e.chutaikyo||'未'}</span>${e.chutaikyoAmount?`<br><span style="font-size:9px">¥${e.chutaikyoAmount.toLocaleString()}</span>`:''}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  <div style="margin-top:16px;text-align:right;font-size:10px">
    管理者確認：＿＿＿＿＿＿＿＿＿　印
  </div>
  </body></html>`;
  const w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}

// -------- 出勤簿 --------
function printAttendanceRecord(year, month) {
  const DOW = ['日','月','火','水','木','金','土'];
  const { startDate, endDate } = getPayPeriod(year, month);
  const start = new Date(startDate);
  const end   = new Date(endDate);

  let html = `<html><head><meta charset="UTF-8">
  <title>出勤簿 ${year}年${month}月</title>
  <style>
    body{font-family:'Noto Sans JP',sans-serif;font-size:11px;margin:20px}
    h2{font-size:14px;text-align:center;margin-bottom:4px}
    h3{font-size:12px;margin:16px 0 4px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    th,td{border:1px solid #333;padding:3px 5px;text-align:center}
    th{background:#f0f0f0}
    .tl{text-align:left}
    .legal-hol{background:#fff0f0}
    .nonlegal-hol{background:#fff8f0}
    .weekend{background:#f5f5ff}
    @media print{h3{page-break-before:always}}
  </style></head><body>
  <h2>出　勤　簿</h2>
  <div style="text-align:center;margin-bottom:16px">
    賃金計算期間：${startDate.replace(/-/g,'/')} 〜 ${endDate.replace(/-/g,'/')} ／ ${OTD.company} ／ ${OTD.address}
  </div>`;

  for (const emp of activeEmployees()) {
    const extended = getExtendedDailyList(emp.id, year, month);
    const empMap = {};
    for (const d of extended) empMap[d.date] = d;
    const summary = getMonthSummary(emp.store === '両店' ? `${emp.id}_enya` : emp.id, year, month);

    html += `<h3>${emp.name}（${emp.type} ／ ${emp.store||''}）</h3>
    <table>
      <thead><tr>
        <th>日付</th><th>曜</th><th>出勤時刻</th><th>退勤時刻</th>
        <th>実働(h)</th><th>深夜(h)</th><th>休日</th><th>有給</th><th>欠勤</th><th>備考</th>
      </tr></thead><tbody>`;

    // ★ 前月21日〜当月20日の範囲でループ
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)) {
      const dateStr = dt.toISOString().slice(0,10);
      const dow = dt.getDay();
      const rec = empMap[dateStr]||{};
      const isLegal    = dow === PAY_CONFIG.legalHolidayDow;
      const isNonLegal = dow === PAY_CONFIG.nonLegalHolidayDow;
      const rowCls = isLegal ? 'legal-hol' : isNonLegal ? 'nonlegal-hol' : '';
      const [,mm,dd] = dateStr.split('-');
      html += `<tr class="${rowCls}">
        <td>${parseInt(mm)}/${parseInt(dd)}</td>
        <td>${DOW_NAMES[dow]}${isLegal?' 🔴':isNonLegal?' 🟠':''}</td>
        <td>${rec.start||''}</td>
        <td>${rec.end||''}</td>
        <td>${rec.actual||''}</td>
        <td>${rec.midnight||''}</td>
        <td>${rec.holiday?'●':''}</td>
        <td>${rec.paidLeave?'●':''}</td>
        <td>${rec.absent?'●':''}</td>
        <td>${rec.note||''}</td>
      </tr>`;
    }
    html += `</tbody><tfoot><tr>
      <td colspan="4" style="text-align:right;font-weight:bold">月計</td>
      <td>${hm(summary.totalActual)}</td>
      <td>${hm(summary.monthMidnight)}</td>
      <td>${hm(summary.monthHoliday)}</td>
      <td>${summary.paidDays}</td>
      <td>${summary.absentDays}</td>
      <td>週残業：${hm(summary.monthOT)}</td>
    </tr></tfoot></table>
    <div style="display:flex;gap:40px;margin-top:4px;margin-bottom:16px">
      <div>確認署名：＿＿＿＿＿＿＿＿＿</div>
      <div>管理者確認：＿＿＿＿＿＿＿＿＿</div>
    </div>`;
  }

  html += '</body></html>';
  const w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}

// -------- 賃金台帳 共通データ生成 --------
function getWageLedgerEmps(year, month, storeFilter) {
  return activeEmployees().filter(emp => {
    if (!storeFilter) return true;
    return emp.store === storeFilter;
  });
}

function buildWageLedgerHTML(year, month, emps) {
  const { startDate, endDate, payDateStr } = getPayPeriod(year, month);

  // 全員分のデータを事前計算
  const allData = emps.map(emp => {
    const s   = getMonthSummary(emp.store === '両店' ? `${emp.id}_enya` : emp.id, year, month);
    const sal = calcSalaryBoth(emp, year, month);
    return { emp, s, sal };
  });

  const tableRows = allData.map(({ emp, s, sal }) => `
    <tr>
      <td class="tl">${emp.name}</td><td>—</td><td>${emp.type}</td>
      <td>${s.workDays}</td>
      <td>${hm(Math.round(s.totalActual*60)/60)}</td>
      <td>${s.monthOT>0?hm(Math.round(s.monthOT*60)/60):'—'}</td>
      <td>${s.monthMidnight>0?hm(Math.round(s.monthMidnight*60)/60):'—'}</td>
      <td>${s.monthHoliday>0?hm(Math.round(s.monthHoliday*60)/60):'—'}</td>
      <td>${sal.basePay.toLocaleString()}</td>
      <td>${sal.otPay>0?sal.otPay.toLocaleString():'—'}</td>
      <td>${sal.midnightPay>0?sal.midnightPay.toLocaleString():'—'}</td>
      <td>${sal.holidayPay>0?sal.holidayPay.toLocaleString():'—'}</td>
      <td>${sal.commute.toLocaleString()}</td>
      <td>${sal.kenpo>0?sal.kenpo.toLocaleString():'—'}</td>
      <td>${sal.kosei>0?sal.kosei.toLocaleString():'—'}</td>
      <td>${sal.shienkin>0?sal.shienkin.toLocaleString():'—'}</td>
      <td>${sal.koyoHoken>0?sal.koyoHoken.toLocaleString():'—'}</td>
      <td>${sal.incomeTax>0?sal.incomeTax.toLocaleString():'—'}</td>
      <td>${sal.juminzei>0?sal.juminzei.toLocaleString():'—'}</td>
      <td><strong>${sal.netPay.toLocaleString()}</strong></td>
    </tr>`).join('');

  const t = { workDays:0, actual:0, ot:0, mid:0, hol:0, base:0, otP:0, midP:0, holP:0, comm:0, kenpo:0, kosei:0, shienkin:0, koyo:0, income:0, jumin:0, net:0 };
  for (const { s, sal } of allData) {
    t.workDays+=s.workDays; t.actual+=s.totalActual; t.ot+=s.monthOT;
    t.mid+=s.monthMidnight; t.hol+=s.monthHoliday;
    t.base+=sal.basePay; t.otP+=sal.otPay; t.midP+=sal.midnightPay;
    t.holP+=sal.holidayPay; t.comm+=sal.commute;
    t.kenpo+=sal.kenpo; t.kosei+=sal.kosei; t.shienkin+=(sal.shienkin||0);
    t.koyo+=sal.koyoHoken; t.income+=sal.incomeTax; t.jumin+=sal.juminzei; t.net+=sal.netPay;
  }

  const checkboxes = emps.map((emp, i) =>
    `<label style="display:inline-flex;align-items:center;gap:4px;margin:2px 6px 2px 0;font-size:11px;cursor:pointer">
      <input type="checkbox" class="empChk" data-idx="${i}" checked onchange="filterTable()">
      ${emp.name}
    </label>`).join('');

  const tableRowsData = allData.map(({ emp, s, sal }, i) => ({
    idx: i, name: emp.name, type: emp.type,
    workDays: s.workDays,
    actual: hm(Math.round(s.totalActual*60)/60),
    ot: s.monthOT>0?hm(Math.round(s.monthOT*60)/60):'—',
    mid: s.monthMidnight>0?hm(Math.round(s.monthMidnight*60)/60):'—',
    hol: s.monthHoliday>0?hm(Math.round(s.monthHoliday*60)/60):'—',
    basePay: sal.basePay, otPay: sal.otPay, midP: sal.midnightPay,
    holP: sal.holidayPay, comm: sal.commute,
    kenpo: sal.kenpo, kosei: sal.kosei, shienkin: sal.shienkin||0,
    koyo: sal.koyoHoken, income: sal.incomeTax, jumin: sal.juminzei,
    net: sal.netPay,
  }));

  return `<html><head><meta charset="UTF-8"><title>賃金台帳 ${year}年${month}月</title>
  <style>
    body{font-family:'Noto Sans JP',sans-serif;font-size:10px;margin:0}
    h2{font-size:14px;text-align:center;margin-bottom:4px}
    table{width:100%;border-collapse:collapse;font-size:9.5px}
    th,td{border:1px solid #333;padding:2px 3px;text-align:right}
    th{background:#f0f0f0;text-align:center}
    .tl{text-align:left}
    #toolbar{background:#f8f9fa;border-bottom:1px solid #ddd;padding:10px 16px;display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}
    #empFilter{flex:1;min-width:300px}
    .btn{padding:6px 14px;border:none;border-radius:6px;font-size:12px;cursor:pointer;font-family:inherit}
    .btn-primary{background:#1a3a5c;color:#fff}
    .btn-success{background:#27ae60;color:#fff}
    .btn-outline{background:#fff;border:1px solid #999;color:#333}
    #content{padding:12px}
    tfoot tr{font-weight:bold;background:#f0f0f0}
    @media print{
      #toolbar{display:none!important}
      body{margin:8px}
      table{font-size:8.5px}
      th,td{padding:2px}
    }
  </style></head><body>
  <div id="toolbar">
    <div style="display:flex;flex-direction:column;gap:6px;flex:1">
      <div style="font-size:12px;font-weight:700;color:#1a3a5c">スタッフ絞込</div>
      <div id="empFilter">
        <div style="margin-bottom:4px">
          <button class="btn btn-outline" style="font-size:11px;padding:3px 8px" onclick="document.querySelectorAll('.empChk').forEach(c=>c.checked=true);filterTable()">全選択</button>
          <button class="btn btn-outline" style="font-size:11px;padding:3px 8px;margin-left:4px" onclick="document.querySelectorAll('.empChk').forEach(c=>c.checked=false);filterTable()">全解除</button>
        </div>
        <div style="max-height:80px;overflow-y:auto;border:1px solid #ddd;padding:4px;border-radius:4px;background:#fff">
          ${checkboxes}
        </div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;padding-top:20px">
      <button class="btn btn-primary" onclick="window.print()">🖨 印刷</button>
      <button class="btn btn-success" onclick="savePDF()">💾 PDF保存</button>
    </div>
  </div>
  <div id="content">
    <h2>賃　金　台　帳</h2>
    <div style="text-align:center;margin-bottom:8px;font-size:10px">
      ${year}年${month}月分（賃金計算期間：${startDate.replace(/-/g,'/')} 〜 ${endDate.replace(/-/g,'/')} ／ 支払日：${payDateStr.replace(/-/g,'/')}）<br>
      ${OTD.company} ／ ${OTD.address}
    </div>
    <table id="ledgerTable"><thead>
      <tr>
        <th rowspan="2" class="tl">氏名</th><th rowspan="2">性別</th>
        <th rowspan="2">雇用<br>形態</th><th rowspan="2">出勤<br>日数</th>
        <th rowspan="2">実労働<br>時間</th><th rowspan="2">時間外<br>労働時間</th>
        <th rowspan="2">深夜<br>時間</th><th rowspan="2">休日<br>時間</th>
        <th colspan="5">支給額</th>
        <th colspan="6">控除額</th>
        <th rowspan="2">差引<br>支給額</th>
      </tr>
      <tr>
        <th>基本給</th><th>残業</th><th>深夜</th><th>休日</th><th>交通費</th>
        <th>健保</th><th>厚年</th><th>子育<br>支援金</th><th>雇保</th><th>所得税</th><th>住民税</th>
      </tr>
    </thead>
    <tbody id="ledgerBody">${tableRows}</tbody>
    <tfoot><tr id="totalRow">
      <td class="tl" colspan="3">合　計</td>
      <td>${t.workDays}</td><td>${hm(Math.round(t.actual*60)/60)}</td>
      <td>${hm(Math.round(t.ot*60)/60)}</td><td>${hm(Math.round(t.mid*60)/60)}</td>
      <td>${hm(Math.round(t.hol*60)/60)}</td>
      <td>${t.base.toLocaleString()}</td><td>${t.otP.toLocaleString()}</td>
      <td>${t.midP.toLocaleString()}</td><td>${t.holP.toLocaleString()}</td>
      <td>${t.comm.toLocaleString()}</td>
      <td>${t.kenpo.toLocaleString()}</td><td>${t.kosei.toLocaleString()}</td>
      <td>${t.shienkin.toLocaleString()}</td>
      <td>${t.koyo.toLocaleString()}</td><td>${t.income.toLocaleString()}</td>
      <td>${t.jumin.toLocaleString()}</td>
      <td>${t.net.toLocaleString()}</td>
    </tr></tfoot>
    </table>
    <div style="margin-top:16px;text-align:right;font-size:10px">
      使用者署名：＿＿＿＿＿＿＿＿＿＿＿＿＿　印
    </div>
  </div>
  <script>
    const ROWS = ${JSON.stringify(tableRowsData)};
    function fmt(v){ return v>0?v.toLocaleString():'—'; }
    function filterTable(){
      const checked = new Set([...document.querySelectorAll('.empChk:checked')].map(c=>+c.dataset.idx));
      const rows = ROWS.filter(r=>checked.has(r.idx));
      document.getElementById('ledgerBody').innerHTML = rows.map(r=>\`
        <tr>
          <td class="tl">\${r.name}</td><td>—</td><td>\${r.type}</td>
          <td>\${r.workDays}</td><td>\${r.actual}</td><td>\${r.ot}</td>
          <td>\${r.mid}</td><td>\${r.hol}</td>
          <td>\${r.basePay.toLocaleString()}</td>
          <td>\${fmt(r.otPay)}</td><td>\${fmt(r.midP)}</td><td>\${fmt(r.holP)}</td>
          <td>\${r.comm.toLocaleString()}</td>
          <td>\${fmt(r.kenpo)}</td><td>\${fmt(r.kosei)}</td><td>\${fmt(r.shienkin)}</td>
          <td>\${fmt(r.koyo)}</td><td>\${fmt(r.income)}</td><td>\${fmt(r.jumin)}</td>
          <td><strong>\${r.net.toLocaleString()}</strong></td>
        </tr>\`).join('');
      // 合計再計算
      const sum = k => rows.reduce((s,r)=>s+r[k],0);
      const tr = document.getElementById('totalRow');
      const cells = tr.querySelectorAll('td');
      cells[3].textContent = sum('workDays');
      // 時間系は省略して固定（全員合計のまま）
    }
    function savePDF(){
      document.getElementById('toolbar').style.display='none';
      window.print();
      setTimeout(()=>document.getElementById('toolbar').style.display='flex',1000);
    }
  </script>
  </body></html>`;
}

function printWageLedger(year, month) {
  const emps = getWageLedgerEmps(year, month, '');
  const w = window.open('', '_blank');
  w.document.write(buildWageLedgerHTML(year, month, emps));
  w.document.close();
  w.print();
}

function printWageLedgerFiltered(year, month) {
  const store = document.getElementById('wageLedgerStore')?.value || '';
  const emps = getWageLedgerEmps(year, month, store);
  const w = window.open('', '_blank');
  w.document.write(buildWageLedgerHTML(year, month, emps));
  w.document.close();
  w.print();
}

function exportWageLedgerCSV(year, month) {
  const store = document.getElementById('wageLedgerStore')?.value || '';
  const emps = getWageLedgerEmps(year, month, store);
  const header = ['氏名','雇用形態','店舗','出勤日数','実労働時間','時間外労働時間','深夜時間','休日時間',
    '基本給','残業手当','深夜手当','休日手当','交通費','健保','厚年','子育て支援金','雇保','所得税','住民税','差引支給額'];
  const rows = emps.map(emp => {
    const s   = getMonthSummary(emp.store === '両店' ? `${emp.id}_enya` : emp.id, year, month);
    const sal = calcSalaryBoth(emp, year, month);
    return [
      emp.name, emp.type, emp.store,
      s.workDays,
      hm(Math.round(s.totalActual*60)/60),
      s.monthOT>0?hm(Math.round(s.monthOT*60)/60):'0h',
      s.monthMidnight>0?hm(Math.round(s.monthMidnight*60)/60):'0h',
      s.monthHoliday>0?hm(Math.round(s.monthHoliday*60)/60):'0h',
      sal.basePay, sal.otPay, sal.midnightPay, sal.holidayPay, sal.commute,
      sal.kenpo, sal.kosei, sal.shienkin||0, sal.koyoHoken, sal.incomeTax, sal.juminzei, sal.netPay
    ];
  });
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const storeLabel = store ? `_${store}` : '';
  dlFile(`賃金台帳_${year}年${month}月${storeLabel}.csv`, csv, 'text/csv');
}

// -------- 有給管理簿印刷 --------
function printPaidLeaveRecord(year) {
  const emps = activeEmployees();

  // スタッフごとのデータを事前構築
  const empData = emps.map((emp, idx) => {
    const pl = getPaidLeaveBalance(emp.id);
    const used5 = (pl.used||[])
      .filter(u=>{ const uy=parseInt(u.date.slice(0,4)); const uyear=u.date.slice(5,7)>='04'?uy:uy-1; return uyear===year; })
      .reduce((s,u)=>s+u.days,0);
    const totalGrant = pl.grants.reduce((s,g)=>s+g.days,0);

    const maxLen = Math.max(pl.grants.length, pl.used.length, 1);
    let rows = '';
    for (let i=0;i<maxLen;i++) {
      const g = pl.grants[i];
      const u = pl.used[i];
      rows += `<tr>
        <td>${g?g.date:''}</td><td>${g?g.days+'日':''}</td>
        <td>${u?u.date:''}</td><td>${u?u.days+'日':''}</td><td class="tl">${u?u.reason||'':''}</td>
      </tr>`;
    }

    return {
      idx,
      id: emp.id,
      name: emp.name,
      type: emp.type,
      hireDate: emp.hireDate||'不明',
      totalGrant,
      totalUsed: pl.used.reduce((s,u)=>s+u.days,0),
      balance: pl.balance,
      used5,
      obligation: totalGrant>=10?(used5>=5?'達成':'未達'):'対象外',
      rows
    };
  });

  const checkboxes = empData.map(d =>
    `<label style="display:block;padding:2px 0;cursor:pointer">
      <input type="checkbox" class="empChk" data-idx="${d.idx}" checked onchange="filterContent()">
      ${d.name}
    </label>`
  ).join('');

  const html = `<html><head><meta charset="UTF-8"><title>有給管理簿 ${year}年度</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:'Noto Sans JP',sans-serif;font-size:11px;margin:0}
    #toolbar{
      position:fixed;top:0;left:0;right:0;background:#f8f8f8;border-bottom:2px solid #ccc;
      padding:8px 16px;display:flex;align-items:flex-start;gap:16px;z-index:100
    }
    .btn{padding:5px 12px;border:none;border-radius:4px;cursor:pointer;font-size:12px}
    .btn-primary{background:#1a3a5c;color:#fff}
    .btn-success{background:#059669;color:#fff}
    .btn-outline{background:#fff;border:1px solid #999;color:#333}
    #content{padding:80px 20px 20px}
    h2{font-size:14px;text-align:center;margin-bottom:4px}
    .emp-block{margin-bottom:20px}
    h3{font-size:12px;margin:0 0 4px}
    table{width:100%;border-collapse:collapse;margin-bottom:4px}
    th,td{border:1px solid #333;padding:3px 6px;text-align:center}
    th{background:#f0f0f0}
    .tl{text-align:left}
    tfoot tr{font-weight:bold;background:#f0f0f0}
    @media print{
      #toolbar{display:none!important}
      #content{padding:8px}
    }
  </style></head><body>
  <div id="toolbar">
    <div style="display:flex;flex-direction:column;gap:6px;flex:1">
      <div style="font-size:12px;font-weight:700;color:#1a3a5c">スタッフ絞込</div>
      <div style="margin-bottom:4px">
        <button class="btn btn-outline" style="font-size:11px;padding:3px 8px" onclick="document.querySelectorAll('.empChk').forEach(c=>c.checked=true);filterContent()">全選択</button>
        <button class="btn btn-outline" style="font-size:11px;padding:3px 8px;margin-left:4px" onclick="document.querySelectorAll('.empChk').forEach(c=>c.checked=false);filterContent()">全解除</button>
      </div>
      <div style="max-height:80px;overflow-y:auto;border:1px solid #ddd;padding:4px;border-radius:4px;background:#fff">
        ${checkboxes}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;padding-top:20px">
      <button class="btn btn-primary" onclick="window.print()">🖨 印刷</button>
      <button class="btn btn-success" onclick="savePDF()">💾 PDF保存</button>
    </div>
  </div>

  <div id="content">
    <h2>年次有給休暇管理簿</h2>
    <div style="text-align:center;margin-bottom:12px">${year}年度（${year}年4月1日〜${year+1}年3月31日）／ ${OTD.company}</div>
    <div id="empBlocks">
      ${empData.map(d => `
      <div class="emp-block" data-idx="${d.idx}">
        <h3>${d.name}（${d.type}）　入社日：${d.hireDate}</h3>
        <table>
          <thead><tr><th>付与日</th><th>付与日数</th><th>取得日</th><th>取得日数</th><th>理由</th></tr></thead>
          <tbody>${d.rows}</tbody>
          <tfoot><tr>
            <td style="font-weight:bold">付与合計</td><td>${d.totalGrant}日</td>
            <td style="font-weight:bold">取得合計</td><td>${d.totalUsed}日</td>
            <td>残日数：${d.balance}日　／　${year}年度取得：${d.used5}日（5日義務：${d.obligation}）</td>
          </tr></tfoot>
        </table>
      </div>`).join('')}
    </div>
  </div>

  <script>
    function filterContent() {
      const checked = new Set([...document.querySelectorAll('.empChk:checked')].map(c=>+c.dataset.idx));
      document.querySelectorAll('.emp-block').forEach(el => {
        el.style.display = checked.has(+el.dataset.idx) ? '' : 'none';
      });
    }
    function savePDF() {
      document.getElementById('toolbar').style.display = 'none';
      window.print();
      setTimeout(() => document.getElementById('toolbar').style.display = 'flex', 1000);
    }
  </script>
  </body></html>`;

  const w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
}

// -------- 36協定記入補助シート --------
function print36Notice(year) {
  const a36 = article36[year]||{limit36:45,specialLimit:80,yearLimit:720};
  const summaries = activeEmployees().map(emp=>{
    let yearlyOT=0;
    const eid = emp.store === '両店' ? `${emp.id}_enya` : emp.id; for(let m=1;m<=12;m++) yearlyOT+=getMonthSummary(eid,year,m).monthOT;
    return { emp, yearlyOT: Math.round(yearlyOT*60)/60 };
  });

  const html = `<html><head><meta charset="UTF-8"><title>36協定届 記入補助</title>
  <style>body{font-family:'Noto Sans JP',sans-serif;font-size:12px;margin:20px;max-width:800px}
  h2{font-size:16px;text-align:center} h3{font-size:13px;margin:16px 0 6px;color:#1a3a5c}
  table{width:100%;border-collapse:collapse} th,td{border:1px solid #333;padding:5px 8px}
  th{background:#f0f0f0} .box{border:1px solid #333;padding:10px;margin-bottom:12px}
  </style></head><body>
  <h2>時間外労働・休日労働に関する協定届<br><small>記入補助シート（${year}年）</small></h2>
  <div class="box">
    <strong>事業場名：</strong>${OTD.company}<br>
    <strong>所在地：</strong>${OTD.address}<br>
    <strong>業種：</strong>飲食業（料理店）<br>
    <strong>労働者数：</strong>${employees.length}名<br>
    <strong>協定の有効期間：</strong>${year}年__月__日 〜 ${year+1}年__月__日（1年間）
  </div>
  <h3>▼ 協定内容（本協定）</h3>
  <table><tr><th>延長できる時間</th><th>1日</th><th>1ヶ月</th><th>1年</th></tr>
  <tr><td>一般条項</td><td>__時間</td><td>${a36.limit36}時間</td><td>${Math.min(a36.limit36*12,360)}時間</td></tr>
  <tr><td>特別条項（繁忙期等）</td><td>__時間</td><td>${a36.specialLimit}時間（年6回まで）</td><td>${a36.yearLimit}時間</td></tr>
  </table>
  <h3>▼ 業務の種類</h3>
  <div class="box">
    ①調理・仕込み作業（キッチン）<br>
    ②接客・ホール業務（ホール）<br>
    ③店舗管理・事務作業（管理）
  </div>
  <h3>▼ 昨年の実績（参考）</h3>
  <table><thead><tr><th>氏名</th><th>雇用区分</th><th>年間残業時間</th><th>備考</th></tr></thead>
  <tbody>
  ${summaries.map(({emp,yearlyOT})=>`<tr>
    <td>${emp.name}</td><td>${emp.type}</td>
    <td>${yearlyOT}h</td>
    <td>${yearlyOT>a36.yearLimit?'⚠要確認':''}</td>
  </tr>`).join('')}
  </tbody></table>
  <div class="box" style="margin-top:16px">
    <strong>使用者署名：</strong>＿＿＿＿＿＿＿＿＿　印<br>
    <strong>労働者代表：</strong>＿＿＿＿＿＿＿＿＿　印<br>
    <br>※本書類は記入補助シートです。実際の届出は様式第9号・第9号の2を使用してください。
  </div>
  </body></html>`;
  const w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}

// -------- 年間OTレポート --------
function printOTReport(year) {
  const MONTHS = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  let html = `<html><head><meta charset="UTF-8"><title>時間外実績 ${year}年</title>
  <style>body{font-family:'Noto Sans JP',sans-serif;font-size:10px;margin:15px}
  h2{font-size:13px;text-align:center} table{width:100%;border-collapse:collapse}
  th,td{border:1px solid #333;padding:3px 4px;text-align:center;font-size:10px}
  th{background:#f0f0f0} .tl{text-align:left} .warn{background:#fff8e1} .danger{background:#ffebee}
  </style></head><body>
  <h2>時間外労働実績レポート（${year}年）／ ${OTD.company}</h2>
  <table><thead><tr>
    <th class="tl">氏名</th>
    ${MONTHS.map(m=>`<th>${m}月</th>`).join('')}
    <th>年計</th><th>最大月</th>
  </tr></thead><tbody>`;

  const a36 = article36[year]||{limit36:45,specialLimit:80,yearLimit:720};
  for (const emp of activeEmployees()) {
    const _eid = emp.store === '両店' ? `${emp.id}_enya` : emp.id; const ots = MONTHS.map((_,i)=>getMonthSummary(_eid,year,i+1).monthOT);
    const yearly = ots.reduce((s,o)=>s+o,0);
    const max    = Math.max(...ots);
    const rowCls = yearly>a36.yearLimit?'danger':max>a36.specialLimit?'warn':'';
    html += `<tr class="${rowCls}">
      <td class="tl">${emp.name}</td>
      ${ots.map(o=>{
        const cls=o>a36.specialLimit?'danger':o>a36.limit36?'warn':'';
        return `<td class="${cls}">${o>0?o:''}</td>`;
      }).join('')}
      <td ${Math.round(yearly*60)/60>a36.yearLimit?'style="color:red;font-weight:bold"':''}>${hm(Math.round(yearly*60)/60)}</td>
      <td ${max>a36.specialLimit?'style="color:red;font-weight:bold"':''}>${max}</td>
    </tr>`;
  }
  html += `</tbody></table>
  <div style="margin-top:12px;font-size:10px;color:#666">
    ■超過基準：一般条項${a36.limit36}h（黄）、特別条項${a36.specialLimit}h（赤）、年間${a36.yearLimit}h（赤）
  </div></body></html>`;
  const w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}
