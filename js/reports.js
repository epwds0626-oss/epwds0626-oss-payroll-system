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
      <button class="btn-primary" onclick="printWageLedger(${year},${month})">🖨 賃金台帳印刷（${year}年${month}月）</button>
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
    const summary = getMonthSummary(emp.id, year, month);

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
      <td>${summary.totalActual}</td>
      <td>${summary.monthMidnight}</td>
      <td>${summary.monthHoliday}</td>
      <td>${summary.paidDays}</td>
      <td>${summary.absentDays}</td>
      <td>週残業：${summary.monthOT}h</td>
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

// -------- 賃金台帳 --------
function printWageLedger(year, month) {
  let html = `<html><head><meta charset="UTF-8"><title>賃金台帳 ${year}年${month}月</title>
  <style>
    body{font-family:'Noto Sans JP',sans-serif;font-size:10px;margin:15px}
    h2{font-size:14px;text-align:center;margin-bottom:4px}
    table{width:100%;border-collapse:collapse;font-size:10px}
    th,td{border:1px solid #333;padding:3px 4px;text-align:right}
    th{background:#f0f0f0;text-align:center}
    .tl{text-align:left}
  </style></head><body>
  <h2>賃　金　台　帳</h2>
  <div style="text-align:center;margin-bottom:12px">
    ${year}年${month}月分（賃金計算期間：${getPayPeriod(year,month).startDate.replace(/-/g,'/')} 〜 ${getPayPeriod(year,month).endDate.replace(/-/g,'/')} ／ 支払日：${getPayPeriod(year,month).payDateStr.replace(/-/g,'/')}）<br>
    ${OTD.company} ／ ${OTD.address}
  </div>
  <table><thead>
    <tr>
      <th rowspan="2" class="tl">氏名</th><th rowspan="2">性別</th>
      <th rowspan="2">雇用<br>形態</th><th rowspan="2">出勤<br>日数</th>
      <th rowspan="2">実労働<br>時間</th><th rowspan="2">時間外<br>労働時間</th>
      <th rowspan="2">深夜<br>時間</th><th rowspan="2">休日<br>時間</th>
      <th colspan="5">支給額</th>
      <th colspan="5">控除額</th>
      <th rowspan="2">差引<br>支給額</th>
    </tr>
    <tr>
      <th>基本給</th><th>残業</th><th>深夜</th><th>休日</th><th>交通費</th>
      <th>健保</th><th>厚年</th><th>雇保</th><th>所得税</th><th>住民税</th>
    </tr>
  </thead><tbody>`;

  let totals = { workDays:0, actual:0, ot:0, mid:0, hol:0, base:0, otP:0, midP:0, holP:0, comm:0, kenpo:0, kosei:0, koyo:0, income:0, jumin:0, net:0 };

  for (const emp of activeEmployees()) {
    const s   = getMonthSummary(emp.id, year, month);
    const sal = calcSalary(emp, year, month);
    totals.workDays+=s.workDays; totals.actual+=s.totalActual; totals.ot+=s.monthOT;
    totals.mid+=s.monthMidnight; totals.hol+=s.monthHoliday;
    totals.base+=sal.basePay; totals.otP+=sal.otPay; totals.midP+=sal.midnightPay;
    totals.holP+=sal.holidayPay; totals.comm+=sal.commute;
    totals.kenpo+=sal.kenpo; totals.kosei+=sal.kosei; totals.koyo+=sal.koyoHoken;
    totals.income+=sal.incomeTax; totals.jumin+=sal.juminzei; totals.net+=sal.netPay;

    html += `<tr>
      <td class="tl">${emp.name}</td><td>—</td><td>${emp.type}</td>
      <td>${s.workDays}</td><td>${s.totalActual}</td><td>${s.monthOT}</td>
      <td>${s.monthMidnight}</td><td>${s.monthHoliday}</td>
      <td>${sal.basePay.toLocaleString()}</td>
      <td>${sal.otPay>0?sal.otPay.toLocaleString():'—'}</td>
      <td>${sal.midnightPay>0?sal.midnightPay.toLocaleString():'—'}</td>
      <td>${sal.holidayPay>0?sal.holidayPay.toLocaleString():'—'}</td>
      <td>${sal.commute.toLocaleString()}</td>
      <td>${sal.kenpo>0?sal.kenpo.toLocaleString():'—'}</td>
      <td>${sal.kosei>0?sal.kosei.toLocaleString():'—'}</td>
      <td>${sal.koyoHoken>0?sal.koyoHoken.toLocaleString():'—'}</td>
      <td>${sal.incomeTax>0?sal.incomeTax.toLocaleString():'—'}</td>
      <td>${sal.juminzei>0?sal.juminzei.toLocaleString():'—'}</td>
      <td><strong>${sal.netPay.toLocaleString()}</strong></td>
    </tr>`;
  }

  html += `</tbody><tfoot><tr style="font-weight:bold;background:#f0f0f0">
    <td class="tl" colspan="3">合　計</td>
    <td>${totals.workDays}</td><td>${Math.round(totals.actual*10)/10}</td>
    <td>${Math.round(totals.ot*10)/10}</td><td>${Math.round(totals.mid*10)/10}</td>
    <td>${Math.round(totals.hol*10)/10}</td>
    <td>${totals.base.toLocaleString()}</td><td>${totals.otP.toLocaleString()}</td>
    <td>${totals.midP.toLocaleString()}</td><td>${totals.holP.toLocaleString()}</td>
    <td>${totals.comm.toLocaleString()}</td>
    <td>${totals.kenpo.toLocaleString()}</td><td>${totals.kosei.toLocaleString()}</td>
    <td>${totals.koyo.toLocaleString()}</td><td>${totals.income.toLocaleString()}</td>
    <td>${totals.jumin.toLocaleString()}</td>
    <td>${totals.net.toLocaleString()}</td>
  </tr></tfoot></table>
  <div style="margin-top:20px;text-align:right">
    使用者署名：＿＿＿＿＿＿＿＿＿＿＿＿＿　印
  </div></body></html>`;

  const w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}

// -------- 有給管理簿印刷 --------
function printPaidLeaveRecord(year) {
  let html = `<html><head><meta charset="UTF-8"><title>有給管理簿 ${year}年度</title>
  <style>
    body{font-family:'Noto Sans JP',sans-serif;font-size:11px;margin:20px}
    h2{font-size:14px;text-align:center;margin-bottom:4px}
    h3{font-size:12px;margin:16px 0 4px}
    table{width:100%;border-collapse:collapse;margin-bottom:12px}
    th,td{border:1px solid #333;padding:3px 6px;text-align:center}
    th{background:#f0f0f0}
    .tl{text-align:left}
  </style></head><body>
  <h2>年次有給休暇管理簿</h2>
  <div style="text-align:center;margin-bottom:12px">${year}年度（${year}年4月1日〜${year+1}年3月31日）／ ${OTD.company}</div>`;

  for (const emp of activeEmployees()) {
    const pl    = getPaidLeaveBalance(emp.id);
    const used5 = (pl.used||[])
      .filter(u=>{ const uy=parseInt(u.date.slice(0,4)); const uyear=u.date.slice(5,7)>='04'?uy:uy-1; return uyear===year; })
      .reduce((s,u)=>s+u.days,0);
    const totalGrant = pl.grants.reduce((s,g)=>s+g.days,0);

    html += `<h3>${emp.name}（${emp.type}）　入社日：${emp.hireDate||'不明'}</h3>
    <table>
      <thead><tr><th>付与日</th><th>付与日数</th><th>取得日</th><th>取得日数</th><th>理由</th></tr></thead>
      <tbody>`;

    const maxLen = Math.max(pl.grants.length, pl.used.length, 1);
    for (let i=0;i<maxLen;i++) {
      const g = pl.grants[i];
      const u = pl.used[i];
      html += `<tr>
        <td>${g?g.date:''}</td><td>${g?g.days+'日':''}</td>
        <td>${u?u.date:''}</td><td>${u?u.days+'日':''}</td><td class="tl">${u?u.reason||'':''}</td>
      </tr>`;
    }
    html += `</tbody><tfoot><tr>
      <td colspan="1" style="font-weight:bold">付与合計</td><td>${totalGrant}日</td>
      <td style="font-weight:bold">取得合計</td><td>${pl.used.reduce((s,u)=>s+u.days,0)}日</td>
      <td>残日数：${pl.balance}日　／　${year}年度取得：${used5}日（5日義務：${totalGrant>=10?(used5>=5?'達成':'未達'):'対象外'}）</td>
    </tr></tfoot></table>`;
  }

  html += '</body></html>';
  const w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}

// -------- 36協定記入補助シート --------
function print36Notice(year) {
  const a36 = article36[year]||{limit36:45,specialLimit:80,yearLimit:720};
  const summaries = activeEmployees().map(emp=>{
    let yearlyOT=0;
    for(let m=1;m<=12;m++) yearlyOT+=getMonthSummary(emp.id,year,m).monthOT;
    return { emp, yearlyOT: Math.round(yearlyOT*10)/10 };
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
    const ots = MONTHS.map((_,i)=>getMonthSummary(emp.id,year,i+1).monthOT);
    const yearly = ots.reduce((s,o)=>s+o,0);
    const max    = Math.max(...ots);
    const rowCls = yearly>a36.yearLimit?'danger':max>a36.specialLimit?'warn':'';
    html += `<tr class="${rowCls}">
      <td class="tl">${emp.name}</td>
      ${ots.map(o=>{
        const cls=o>a36.specialLimit?'danger':o>a36.limit36?'warn':'';
        return `<td class="${cls}">${o>0?o:''}</td>`;
      }).join('')}
      <td ${Math.round(yearly*10)/10>a36.yearLimit?'style="color:red;font-weight:bold"':''}>${Math.round(yearly*10)/10}</td>
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
