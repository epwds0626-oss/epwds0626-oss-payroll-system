// ============================================================
// salary.js  ―  給与計算・給与明細
// ============================================================

// 選択合計の状態を保持（Firebaseコールバックによる再描画後も復元）
let _subtotalState = null;

function renderSalary(year, month) {
  subscribeAdj(year, month);
  const results = activeEmployees().map(emp => ({ emp, sal: calcSalaryWithAdjBoth(emp, year, month) }));
  const totals  = results.reduce((acc, { sal }) => {
    acc.gross    += sal.grossTotal;
    acc.base     += sal.basePay;
    acc.otPay    += sal.otPay;
    acc.midnight += sal.midnightPay;
    acc.holiday  += sal.holidayPay;
    acc.commute  += sal.commute;
    acc.kenpo    += sal.kenpo;
    acc.kosei    += sal.kosei;
    acc.shienkin += sal.shienkin || 0;
    acc.koyo     += sal.koyoHoken;
    acc.income   += sal.incomeTax;
    acc.jumin    += sal.juminzei;
    acc.deduct   += sal.totalDeduction;
    acc.net      += sal.netPay;
    return acc;
  }, { gross:0,base:0,otPay:0,midnight:0,holiday:0,commute:0,kenpo:0,kosei:0,shienkin:0,koyo:0,income:0,jumin:0,deduct:0,net:0 });

  // 残業手当の60h超（150%）部分の合計（フッター表示用）
  // 手動調整済みスタッフは分割せず〜60h列に合計表示するため加算しない
  const totalOtOver = results.reduce((s, { emp, sal }) => {
    const adj = getAdj(year, month, emp.id);
    if (adj.otPay !== undefined) return s;
    return s + ((sal.ot60over > 0 && sal.hourlyBase > 0) ? Math.round(sal.ot60over * sal.hourlyBase * 1.50) : 0);
  }, 0);

  return `
  <div class="section-header">
    <div class="section-title">💴 給与計算書 ― ${year}年${month}月</div>
    <div style="display:flex;gap:8px">
      <button class="btn-outline" onclick="openSubtotalSelector(${year},${month})">👥 合計選択</button>
      <button class="btn-outline" onclick="exportSalaryCSV(${year},${month})">CSV出力</button>
      <button class="btn-outline" onclick="openPrintSelector(${year},${month})">🖨 選択印刷</button>
      <button class="btn-accent" onclick="window.print()">全体印刷</button>
    </div>
  </div>
  <div class="alert alert-info" style="margin-bottom:12px">
    <span>📅</span>
    <div>
      <strong>賃金計算期間：</strong>${getPayPeriod(year,month).startDate.replace(/-/g,'/')} 〜 ${getPayPeriod(year,month).endDate.replace(/-/g,'/')}　
      <strong>支払日：</strong>${getPayPeriod(year,month).payDateStr.replace(/-/g,'/')}（当月末）
    </div>
  </div>

  <div class="stat-grid">
    <div class="stat-box"><div class="stat-val">¥${totals.gross.toLocaleString()}</div><div class="stat-label">支給総額</div></div>
    <div class="stat-box"><div class="stat-val">¥${totals.deduct.toLocaleString()}</div><div class="stat-label">控除総額</div></div>
    <div class="stat-box success"><div class="stat-val">¥${totals.net.toLocaleString()}</div><div class="stat-label">振込総額</div></div>
    <div class="stat-box"><div class="stat-val">¥${totals.otPay.toLocaleString()}</div><div class="stat-label">残業手当総額</div></div>
  </div>

  <div class="card">
    <style>
      #salaryTable { width:100%; border-collapse:collapse; }
      #salaryTable th { padding:2px 1px; white-space:nowrap; font-size:8px; }
      #salaryTable td { padding:2px 1px; white-space:nowrap; font-size:8px; }
      #salaryTable td.tl { max-width:44px; overflow:hidden; text-overflow:ellipsis; font-size:8px; }
      .col-hide { display:none; }
      @media (min-width:1200px) {
        #salaryTable { font-size:12.5px; }
        #salaryTable th { padding:8px 10px; font-size:12.5px; }
        #salaryTable td { padding:7px 10px; font-size:12.5px; }
        #salaryTable td.tl { max-width:none; }
        .col-hide { display:table-cell; }
      }
    </style>
    <div class="table-wrap" style="width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch"><table id="salaryTable">
      <thead>
        <tr>
          <th class="tl">氏名</th>
          <th>基本給<br>/時給計</th><th>残業<br>(〜60h)</th><th class="col-hide">残業<br>(60h超)</th>
          <th>深夜</th><th class="col-hide">法定休日<br>35%</th><th class="col-hide">法定外休日<br>(週OT分)</th><th>交通費</th>
          <th>健保</th><th>厚年</th><th>子育<br>支援金</th>
          <th>雇保</th><th>所得税</th><th>住民税</th>
          <th>差引<br>振込額</th>
        </tr>
      </thead>
      <tbody>
      ${results.map(({ emp, sal }) => {
        const adjId = emp.store === '両店' ? `${emp.id}_enya` : emp.id;
        return `<tr>
        <td class="tl" style="cursor:pointer;color:#1a3a5c;font-weight:700;text-decoration:underline dotted" title="クリックして全項目編集" onclick="openEmpAdjDialog('${adjId}',${year},${month})">${emp.name}</td>
        ${adjCell(adjId,year,month,'basePay',sal.basePay)}
        ${otSplitCells(adjId,year,month,sal)}
        ${adjCell(adjId,year,month,'midnightPay',sal.midnightPay)}
        ${adjCellHide(adjId,year,month,'holidayLegalPay',sal.holidayLegalPay)}
        <td class="col-hide">—</td>
        ${adjCell(adjId,year,month,'commute',sal.commute)}
        ${adjCell(adjId,year,month,'kenpo',sal.kenpo)}
        ${adjCell(adjId,year,month,'kosei',sal.kosei)}
        ${adjCell(adjId,year,month,'shienkin',sal.shienkin)}
        ${adjCell(adjId,year,month,'koyoHoken',sal.koyoHoken)}
        ${adjCell(adjId,year,month,'incomeTax',sal.incomeTax)}
        ${adjCell(adjId,year,month,'juminzei',sal.juminzei)}
        <td><strong>¥${sal.netPay.toLocaleString()}</strong></td>
      </tr>`;}).join('')}
      </tbody>
      <tfoot><tr class="total-row">
        <td class="tl">合　計</td>
        <td>¥${totals.base.toLocaleString()}</td>
        <td>¥${(totals.otPay - totalOtOver).toLocaleString()}</td>
        <td class="col-hide">${totalOtOver > 0 ? `¥${totalOtOver.toLocaleString()}` : '—'}</td>
        <td>¥${totals.midnight.toLocaleString()}</td>
        <td class="col-hide">¥${totals.holiday.toLocaleString()}</td>
        <td class="col-hide">—</td>
        <td>¥${totals.commute.toLocaleString()}</td>
        <td>¥${totals.kenpo.toLocaleString()}</td>
        <td>¥${totals.kosei.toLocaleString()}</td>
        <td>¥${(totals.shienkin||0).toLocaleString()}</td>
        <td>¥${totals.koyo.toLocaleString()}</td>
        <td>¥${totals.income.toLocaleString()}</td>
        <td>¥${totals.jumin.toLocaleString()}</td>
        <td><strong>¥${totals.net.toLocaleString()}</strong></td>
      </tr></tfoot>
    </table></div>
  </div>
  <div id="subtotalBar" style="display:none"></div>`;
}

function exportSalaryCSV(year, month) {
  const header = ['氏名','雇用区分','基本給/時給計','残業手当','深夜手当','休日手当','交通費','支給合計','健保','厚年','子育支援金','雇保','所得税','住民税','控除合計','振込額'];
  const rows = activeEmployees().map(emp => {
    const s = calcSalaryWithAdjBoth(emp, year, month);
    return [emp.name, emp.type, s.basePay, s.otPay, s.midnightPay, s.holidayPay, s.commute, s.grossTotal, s.kenpo, s.kosei, s.shienkin||0, s.koyoHoken, s.incomeTax, s.juminzei, s.totalDeduction, s.netPay];
  });
  const csv = [header,...rows].map(r=>r.join(',')).join('\n');
  dlFile(`給与計算_${year}年${month}月.csv`, csv, 'text/csv');
}

// -------- 給与明細 --------
function renderPayslip(year, month) {
  // 給与計算ページを経由しなくても調整値（salaryAdj）が反映されるよう、ここでも購読する
  subscribeAdj(year, month);
  // 給与明細のセレクトは展開前（両店スタッフも1行）
  const empOptions = activeEmployees().map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  return `
  <div class="section-header">
    <div class="section-title">🧾 給与明細書 ― ${year}年${month}月</div>
    <button class="btn-accent" onclick="window.print()">🖨 印刷</button>
  </div>
  <div style="margin-bottom:14px">
    <select id="payslipEmpSel" onchange="renderPayslipDetail(${year},${month})" style="border:1px solid #dce3ec;border-radius:6px;padding:6px 12px;font-family:inherit;font-size:13px">
      ${empOptions}
    </select>
    <button class="btn-outline" style="margin-left:8px" onclick="printAllPayslips(${year},${month})">全員分 一括印刷</button>
    <button class="btn-outline" style="margin-left:8px;background:#fef3c7;border-color:#f59e0b;color:#92400e" onclick="openTargetGrossModal(${year},${month})">💰 月別目標支給設定</button>
  </div>
  <div id="payslipWrap"></div>`;
  // 描画後に選択中スタッフの明細を即時表示
  setTimeout(() => renderPayslipDetail(year, month), 0);
}

function renderPayslipDetail(year, month) {
  const sel = document.getElementById('payslipEmpSel');
  if (!sel) return;
  const empId = parseInt(sel.value);
  // セレクトのvalueが空や0の場合は最初のオプションを使用
  const resolvedId = empId || parseInt(sel.options[0]?.value);
  const emp = employees.find(e => e.id === resolvedId);
  if (!emp) return;
  // 選択状態を正しく反映
  sel.value = String(resolvedId);

  if (emp.store === '両店') {
    // 両店スタッフ：_enya（残業込み合算）と_marco（基本給のみ）を合算して1枚
    const empEnya  = { ...emp, id: `${emp.id}_enya`,  name: `${emp.name}【本店】` };
    const empMarco = { ...emp, id: `${emp.id}_marco`, name: `${emp.name}【マルコ】` };
    const salEnya  = calcSalaryWithAdj(empEnya,  year, month);
    const salMarco = calcSalaryWithAdj(empMarco, year, month);
    document.getElementById('payslipWrap').innerHTML = payslipHTMLBoth(emp, salEnya, salMarco, year, month);
  } else {
    const sal = calcSalaryWithAdj(emp, year, month);
    document.getElementById('payslipWrap').innerHTML = payslipHTML(emp, sal, year, month);
  }
}

function payslipHTML(emp, sal, year, month) {
  return `
  <div class="card" style="max-width:680px;font-size:13px" id="payslip_${emp.id}">
    <div style="text-align:center;font-size:16px;font-weight:700;margin-bottom:4px">給　与　明　細　書</div>
    <div style="text-align:center;color:var(--text-muted);margin-bottom:16px">${year}年${month}月分　計算期間：${getPayPeriod(year,month).startDate.replace(/-/g,'/')}〜${getPayPeriod(year,month).endDate.replace(/-/g,'/')}　支払日：${getPayPeriod(year,month).payDateStr.replace(/-/g,'/')}　｜　${OTD.company}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:12.5px">
      <div><strong>氏　名：</strong>${emp.name}</div>
      <div><strong>雇用区分：</strong>${emp.type}</div>
      <div><strong>部　門：</strong>${emp.dept||'—'}</div>
      <div><strong>給与形態：</strong>${emp.payType}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-weight:700;color:var(--primary);border-bottom:2px solid var(--primary);padding-bottom:4px;margin-bottom:8px">支給項目</div>
        ${adjRow(emp.id,year,month,'basePay','基本給',sal.basePay)}
        ${emp.payType==='時給' && sal.baseHours>0?`<div style="padding:1px 0 3px 12px;font-size:11px;color:#888">${hm(sal.baseHours)}×¥${sal.hourlyBase.toLocaleString()}（実働${hm(sal.totalActual)}−残業${hm(sal.monthOT)}）</div>`:''}
        ${sal.positionAllowancePay>0?adjRow(emp.id,year,month,'positionAllowancePay','役職手当',sal.positionAllowancePay):''}
        ${fixedOTRows(emp, sal, emp.id, year, month)}
        ${adjRow(emp.id,year,month,'midnightPay','深夜手当（22時〜 25%）',sal.midnightOnlyPay)}
        ${sal.midnightOTPay>0?payRow('深夜残業 追加割増（+25%）', sal.midnightOTPay):''}
        ${sal.holidayLegalPay>0?adjRow(emp.id,year,month,'holidayLegalPay','法定休日手当（木曜 35%）',sal.holidayLegalPay):''}
        ${sal.monthHolidayNonLegal>0?`<div style="display:flex;justify-content:space-between;padding:3px 0;color:#999"><span>法定外休日（水曜）出勤 ${hm(sal.monthHolidayNonLegal)}</span><span>週OT分に含む</span></div>`:''}
        ${adjRow(emp.id,year,month,'commute','交通費',sal.commute)}
        ${sal.commute>0 && sal.commuteNote?`<div style="padding:1px 0 3px 12px;font-size:11px;color:#888">${sal.commuteNote}</div>`:''}
        <div style="background:#eef2f8;padding:6px 8px;border-radius:6px;display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>支給合計</span><span>¥${sal.grossTotal.toLocaleString()}</span>
        </div>
      </div>
      <div>
        <div style="font-weight:700;color:var(--primary);border-bottom:2px solid var(--primary);padding-bottom:4px;margin-bottom:8px">控除項目</div>
        ${adjRow(emp.id,year,month,'kenpo',`健康保険料（${sal.kaigo?'介護込11.14%':'9.52%'}・茨城支部R8）`,sal.kenpo)}
        ${adjRow(emp.id,year,month,'kosei','厚生年金保険料（18.30%）',sal.kosei)}
        ${sal.shienkin>0?adjRow(emp.id,year,month,'shienkin','子ども・子育て支援金（0.23%）',sal.shienkin):''}
        ${adjRow(emp.id,year,month,'koyoHoken','雇用保険料（0.5%）',sal.koyoHoken)}
        ${adjRow(emp.id,year,month,'incomeTax','所得税',sal.incomeTax)}
        ${adjRow(emp.id,year,month,'juminzei','住民税',sal.juminzei)}
        <div style="background:#eef2f8;padding:6px 8px;border-radius:6px;display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>控除合計</span><span>¥${sal.totalDeduction.toLocaleString()}</span>
        </div>
        ${sal.chutaikyoAmount>0?`<div style="margin-top:8px;padding:6px 8px;background:#f0fdf4;border-radius:6px;font-size:11.5px;color:#166534;display:flex;justify-content:space-between"><span>（参考）中退共掛金 全額会社負担</span><span>¥${sal.chutaikyoAmount.toLocaleString()}</span></div>`:''}
      </div>
    </div>
    <div style="background:var(--primary);color:#fff;padding:10px 16px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-size:15px;font-weight:700">
      <span>差引振込額</span><span>¥${sal.netPay.toLocaleString()}</span>
    </div>
    <div style="margin-top:8px;padding:8px 12px;background:#f8faff;border-radius:8px;font-size:12px;display:flex;gap:16px">
      <span>支払方法：<strong>${emp.paymentMethod||'振込'}</strong></span>
      ${emp.bankInfo?`<span>振込先：${emp.bankInfo}</span>`:''}
    </div>
    <div style="margin-top:14px;background:#f8faff;padding:10px 14px;border-radius:8px;font-size:12px">
      <strong>勤怠情報</strong>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:6px">
        <div>出勤：${sal.workDays}日</div>
        <div>実働：${hm(sal.totalActual)}</div>
        <div>残業：${hm(sal.monthOT)}</div>
        <div style="color:#888;font-size:11px">└日8h超：${hm(sal.monthDailyOT)}</div>
        <div style="color:#888;font-size:11px">└週40h超：${hm(sal.monthWeekOT)}</div>
        <div>深夜：${hm(sal.monthMidnight)}</div>
        <div>休日出勤：${hm(sal.monthHoliday)}</div>
        <div>有給：${sal.paidDays}日</div>
        <div>欠勤：${sal.absentDays}日</div>
      </div>
    </div>
  </div>`;
}

// 固定残業手当の明細行を生成（パターンA：固定残業行＋超過残業行）
// emp: 従業員マスタ、sal: calcSalary結果、empIdStr: adjRow用ID文字列
function fixedOTRows(emp, sal, empIdStr, year, month) {
  // 【追加 R8.7.24】残業手当合計（otPay）に手動調整が入っている場合の警告行。
  // 内訳行は時間ベースの計算値を表示する一方、支給合計は調整後のotPayで
  // 計算されるため、調整が見えないと内訳と合計が食い違って見える。
  // ここで明示的に表示し、クリックで編集・解除できるようにする。
  const _adj = getAdj(year, month, empIdStr);
  const otAdjWarn = _adj.otPay !== undefined ? `
    <div style="display:flex;justify-content:space-between;padding:4px 6px;margin:2px 0;background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;cursor:pointer;font-size:12px"
      title="クリックして編集・解除" onclick="openAdjInput('${empIdStr}',${year},${month},'otPay',${sal.otPay})">
      <span style="color:#92400e;font-weight:700">⚠ 残業手当合計に手動調整あり（合計は下記内訳でなくこの額で計算）</span>
      <span style="color:#d97706;font-weight:700">¥${(sal.otPay||0).toLocaleString()}</span>
    </div>` : '';
  const fixedH = emp.fixedOTHours || 0;
  if (!fixedH || emp.payType !== '月給') {
    // 固定残業なし：従来表示（端数差異を出さないため〜60h側は合計との差分で確定）
    const ot60oPay = sal.ot60over  > 0 ? Math.round(sal.ot60over * sal.hourlyBase * 1.50) : 0;
    const ot60Pay  = sal.ot60under > 0 ? Math.max(0, (sal.otPay || 0) - ot60oPay) : 0;
    return `
      ${otAdjWarn}
      ${ot60Pay > 0 ? `
        <div style="display:flex;justify-content:space-between;padding:3px 0">
          <span>残業手当（〜60h 125%）</span><span>¥${ot60Pay.toLocaleString()}</span>
        </div>
        <div style="padding:1px 0 3px 12px;font-size:11px;color:#888">${hm(sal.ot60under)}×¥${sal.hourlyBase.toLocaleString()}×125%</div>` : ''}
      ${ot60oPay > 0 ? `
        <div style="display:flex;justify-content:space-between;padding:3px 0">
          <span>残業手当（60h超 150%）</span><span>¥${ot60oPay.toLocaleString()}</span>
        </div>
        <div style="padding:1px 0 3px 12px;font-size:11px;color:#888">${hm(sal.ot60over)}×¥${sal.hourlyBase.toLocaleString()}×150%</div>` : ''}
      ${sal.monthOT === 0 ? payRow('残業手当', '') : ''}
      ${sal.monthOT > 0 ? `<div style="padding:1px 0 4px 12px;font-size:11px;color:#aaa">└ 内訳：日8h超 ${hm(sal.monthDailyOT)} ／ 週40h超 ${hm(sal.monthWeekOT)}</div>` : ''}`;
  }

  const h = sal.hourlyBase;
  const fixedOTPay = Math.round(fixedH * h * 1.25);

  // ---- 社員向け内訳（固定 → 週残業125% → 日8h超分125% → 60h超150%）【R8.7.14変更】----
  // 月60h超150%のしきい値は「固定分も含めた実残業合計」で判定（労基法）。
  // 〜60hの125%帯はまず週40h超に割り当て、残りを日8h超分として表示する
  // （どの時間を帯に入れるかは表示上の整理であり、支給総額は変わらない）。
  // 0時間の行は表示しない。
  const totalOT = sal.monthOT; // 日8h超＋週40h超の合計（60h判定はこの合計で行う）
  const over60H = Math.max(0, totalOT - 60);                          // 150%対象
  const band125H = Math.max(0, Math.min(totalOT, 60) - fixedH);       // 固定超過〜60hの125%帯
  const weekH   = Math.min(sal.monthWeekOT || 0, band125H);           // 週残業（独立行・125%）
  const dailyH  = Math.max(0, band125H - weekH);                      // 日8h超由来の125%分

  // 端数差異を出さないため、合計は計算済み残業手当から確定し内訳行に配分する
  const excessPayTotal = totalOT > fixedH ? Math.max(0, (sal.otPay || 0) - fixedOTPay) : 0;
  const over60Pay = over60H > 0 ? Math.round(over60H * h * 1.50) : 0;
  const weekPay   = weekH   > 0 ? Math.round(weekH   * h * 1.25) : 0;
  const dailyPay  = Math.max(0, excessPayTotal - over60Pay - weekPay); // 残余で丸め吸収

  const line = (label, sub, pay) => pay > 0
    ? `<div style="display:flex;justify-content:space-between;padding:3px 0">
         <span>${label}</span><span>¥${pay.toLocaleString()}</span>
       </div>
       <div style="padding:1px 0 3px 12px;font-size:11px;color:#888">${sub}</div>`
    : '';

  return `
    ${otAdjWarn}
    <div style="display:flex;justify-content:space-between;padding:3px 0">
      <span>固定残業（${fixedH}h×¥${h.toLocaleString()}×125%）</span><span>¥${fixedOTPay.toLocaleString()}</span>
    </div>
    <div style="padding:1px 0 3px 12px;font-size:11px;color:#888">実績：${hm(totalOT)}（日8h超 ${hm(sal.monthDailyOT)}／週40h超 ${hm(sal.monthWeekOT)}）</div>
    ${line(`週残業（〜60h 125%）`, `${hm(weekH)}×¥${h.toLocaleString()}×125%`, weekPay)}
    ${line(`残業（日8h超分 〜60h 125%）`, `${hm(dailyH)}×¥${h.toLocaleString()}×125%`, dailyPay)}
    ${line(`残業（60h超 150%）`, `${hm(over60H)}×¥${h.toLocaleString()}×150%`, over60Pay)}`;
}

function payRow(label, amount) {
  if (!amount) return `<div style="display:flex;justify-content:space-between;padding:3px 0;color:#999"><span>${label}</span><span>—</span></div>`;
  return `<div style="display:flex;justify-content:space-between;padding:3px 0"><span>${label}</span><span>¥${amount.toLocaleString()}</span></div>`;
}

// 両店スタッフ用：1枚の明細に合算して表示
function payslipHTMLBoth(emp, salE, salM, year, month) {
  const empEnya = { ...emp, id: `${emp.id}_enya` }; // fixedOTRows用
  // 【修正 R8.7.12】_enya側は両店マージ済み勤怠で全額計算済み。
  // 従来の salM.basePay / salM.grossTotal / salM.workDays 加算はマルコ分の二重計上。
  const basePay            = salE.basePay;
  const otPay              = salE.otPay;   // 残業代は_enya側のみ
  const midnightPay        = salE.midnightPay;
  const holidayLegalPay    = salE.holidayLegalPay;
  const commute            = salE.commute; // 通勤手当は_enya側のみ
  const grossTotal         = salE.grossTotal;
  // 控除合算（社保・雇保・税は合算総支給から再計算済みのものを使う）
  // _enya側に全控除が乗っているのでそのまま使用
  const kenpo              = salE.kenpo;
  const kosei              = salE.kosei;
  const shienkin           = salE.shienkin;
  const koyoHoken          = salE.koyoHoken;
  const incomeTax          = salE.incomeTax;
  const juminzei           = salE.juminzei;
  const chutaikyoAmount    = salE.chutaikyoAmount || 0;
  const totalDeduction     = salE.totalDeduction;
  const netPay             = grossTotal - totalDeduction;

  // 勤怠：_enya側が両店合算済み（日数もマージ済みリストでカウント済み）
  const totalActual        = salE.totalActual;   // 両店合算
  const marcoActual        = salM.totalActual;   // マルコのみ
  const enyaActual         = totalActual - marcoActual;
  const workDays           = salE.workDays;

  const { startDate, endDate, payDateStr } = getPayPeriod(year, month);

  return `
  <div class="card" style="max-width:680px;font-size:13px" id="payslip_${emp.id}">
    <div style="text-align:center;font-size:16px;font-weight:700;margin-bottom:4px">給　与　明　細　書</div>
    <div style="text-align:center;color:var(--text-muted);margin-bottom:16px">${year}年${month}月分　計算期間：${startDate.replace(/-/g,'/')}〜${endDate.replace(/-/g,'/')}　支払日：${payDateStr.replace(/-/g,'/')}　｜　${OTD.company}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:12.5px">
      <div><strong>氏　名：</strong>${emp.name}</div>
      <div><strong>雇用区分：</strong>${emp.type}</div>
      <div><strong>部　門：</strong>${emp.dept||'—'}</div>
      <div><strong>給与形態：</strong>${emp.payType}（本店・マルコ兼務）</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-weight:700;color:var(--primary);border-bottom:2px solid var(--primary);padding-bottom:4px;margin-bottom:8px">支給項目</div>
        ${adjRow(`${emp.id}_enya`,year,month,'basePay','基本給',basePay)}
        ${emp.payType==='時給' && salE.baseHours>0?`<div style="padding:1px 0 3px 12px;font-size:11px;color:#888">${hm(salE.baseHours)}×¥${salE.hourlyBase.toLocaleString()}（両店実働${hm(salE.totalActual)}−残業${hm(salE.monthOT)}）</div>`:''}
        ${fixedOTRows(empEnya, salE, `${emp.id}_enya`, year, month)}
        ${midnightPay>0?adjRow(`${emp.id}_enya`,year,month,'midnightPay','深夜手当（22時〜 25%）',midnightPay):''}
        ${holidayLegalPay>0?adjRow(`${emp.id}_enya`,year,month,'holidayLegalPay','法定休日手当（木曜 35%）',holidayLegalPay):''}
        ${commute>0?adjRow(`${emp.id}_enya`,year,month,'commute','交通費',commute):''}
        ${commute>0 && salE.commuteNote?`<div style="padding:1px 0 3px 12px;font-size:11px;color:#888">${salE.commuteNote}</div>`:''}
        <div style="background:#eef2f8;padding:6px 8px;border-radius:6px;display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>支給合計</span><span>¥${grossTotal.toLocaleString()}</span>
        </div>
      </div>
      <div>
        <div style="font-weight:700;color:var(--primary);border-bottom:2px solid var(--primary);padding-bottom:4px;margin-bottom:8px">控除項目</div>
        ${adjRow(`${emp.id}_enya`,year,month,'kenpo',`健康保険料（${salE.kaigo?'介護込11.14%':'9.52%'}・茨城支部R8）`,kenpo)}
        ${adjRow(`${emp.id}_enya`,year,month,'kosei','厚生年金保険料（18.30%）',kosei)}
        ${shienkin>0?adjRow(`${emp.id}_enya`,year,month,'shienkin','子ども・子育て支援金（0.23%）',shienkin):''}
        ${adjRow(`${emp.id}_enya`,year,month,'koyoHoken','雇用保険料（0.5%）',koyoHoken)}
        ${adjRow(`${emp.id}_enya`,year,month,'incomeTax','所得税',incomeTax)}
        ${adjRow(`${emp.id}_enya`,year,month,'juminzei','住民税',juminzei)}
        <div style="background:#eef2f8;padding:6px 8px;border-radius:6px;display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>控除合計</span><span>¥${totalDeduction.toLocaleString()}</span>
        </div>
        ${chutaikyoAmount>0?`<div style="margin-top:8px;padding:6px 8px;background:#f0fdf4;border-radius:6px;font-size:11.5px;color:#166534;display:flex;justify-content:space-between"><span>（参考）中退共掛金 全額会社負担</span><span>¥${chutaikyoAmount.toLocaleString()}</span></div>`:''}
      </div>
    </div>
    <div style="background:var(--primary);color:#fff;padding:10px 16px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-size:15px;font-weight:700">
      <span>差引振込額</span><span>¥${netPay.toLocaleString()}</span>
    </div>
    <div style="margin-top:14px;background:#f8faff;padding:10px 14px;border-radius:8px;font-size:12px">
      <strong>勤怠情報</strong>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:6px">
        <div>出勤：${workDays}日</div>
        <div>実働：${hm(totalActual)}</div>
        <div>残業：${hm(salE.monthOT)}</div>
        <div style="color:#888;font-size:11px">└日8h超：${hm(salE.monthDailyOT)}</div>
        <div style="color:#888;font-size:11px">└週40h超：${hm(salE.monthWeekOT)}</div>
        <div>深夜：${hm(salE.monthMidnight)}</div>
        <div>有給：${salE.paidDays}日</div>
        <div>欠勤：${salE.absentDays}日</div>
      </div>
      <div style="margin-top:8px;padding:6px 10px;background:#e8f0fe;border-radius:6px;font-size:11.5px;color:#3a5a9a">
        内訳：本店勤務 ${hm(enyaActual)}　／　内マルコ勤務 ${hm(marcoActual)}
      </div>
    </div>
  </div>`;
}

// 編集可能セル（給与計算一覧用）
function adjCellHide(empId, year, month, field, value) {
  const adj = getAdj(year, month, empId);
  const isAdj = adj[field] !== undefined;
  const disp = value > 0 ? `¥${value.toLocaleString()}` : '—';
  const style = isAdj ? 'color:#d97706;font-weight:700;cursor:pointer' : 'cursor:pointer';
  return `<td class="col-hide" style="${style}" title="クリックして編集"
    onclick="openAdjInput('${empId}',${year},${month},'${field}',${value})">${disp}</td>`;
}
// 残業手当セル：〜60h（125%）／60h超（150%）に分割表示
// 端数差異を出さないため、〜60h側＝残業手当合計−60h超部分 で確定
// クリック時の手動調整は残業手当「合計」（otPay）に対して行う
// 手動調整済みの場合は分割せず、調整後の合計を〜60h列に表示
function otSplitCells(empId, year, month, sal) {
  const adj   = getAdj(year, month, empId);
  const isAdj = adj.otPay !== undefined;
  const over  = (!isAdj && sal.ot60over > 0 && sal.hourlyBase > 0)
    ? Math.round(sal.ot60over * sal.hourlyBase * 1.50) : 0;
  const under = Math.max(0, (sal.otPay || 0) - over);
  const style = isAdj ? 'color:#d97706;font-weight:700;cursor:pointer' : 'cursor:pointer';
  const click = `title="クリックして残業手当合計を編集" onclick="openAdjInput('${empId}',${year},${month},'otPay',${sal.otPay})"`;
  return `<td style="${style}" ${click}>${under > 0 ? `¥${under.toLocaleString()}` : '—'}</td>
        <td class="col-hide" style="${style}" ${click}>${over > 0 ? `¥${over.toLocaleString()}` : '—'}</td>`;
}

function adjCell(empId, year, month, field, value) {
  const adj = getAdj(year, month, empId);
  const isAdj = adj[field] !== undefined;
  const disp = value > 0 ? `¥${value.toLocaleString()}` : '—';
  const style = isAdj ? 'color:#d97706;font-weight:700;cursor:pointer' : 'cursor:pointer';
  return `<td style="${style}" title="クリックして編集"
    onclick="openAdjInput('${empId}',${year},${month},'${field}',${value})">${disp}</td>`;
}

// 編集可能行（給与明細用）
function adjRow(empId, year, month, field, label, value) {
  const adj = getAdj(year, month, empId);
  const isAdj = adj[field] !== undefined;
  const disp = value > 0 ? `¥${value.toLocaleString()}` : '—';
  const adjBadge = isAdj ? ' <span style="font-size:10px;background:#fef3c7;color:#d97706;border-radius:3px;padding:0 3px">調整</span>' : '';
  const style = isAdj ? 'color:#d97706;font-weight:700' : '';
  return `<div style="display:flex;justify-content:space-between;padding:3px 0;cursor:pointer" title="クリックして編集"
    onclick="openAdjInput('${empId}',${year},${month},'${field}',${value})">
    <span>${label}${adjBadge}</span><span style="${style}">${disp}</span></div>`;
}

// ===== 全項目まとめて編集ダイアログ =====
function openEmpAdjDialog(empId, year, month) {
  const existing = document.getElementById('adjModal');
  if (existing) existing.remove();

  // 両店スタッフは '10_enya' 形式のIDで渡る → activeEmployeesExpandedから取得
  const emp = activeEmployeesExpanded().find(e => String(e.id) === String(empId));
  if (!emp) return;
  const sal = calcSalaryWithAdj(emp, year, month);
  const adj = getAdj(year, month, empId);

  // 編集対象フィールド定義
  const fields = [
    { section: '支給', items: [
      { key: 'basePay',          label: emp.payType === '時給' ? '時給計' : '基本給',  val: sal.basePay },
      { key: 'otPay',            label: '残業手当（合計）',    val: sal.otPay },
      { key: 'midnightPay',      label: '深夜手当',            val: sal.midnightPay },
      { key: 'holidayLegalPay',  label: '法定休日手当',        val: sal.holidayLegalPay },
      { key: 'commute',          label: '交通費',              val: sal.commute },
    ]},
    { section: '控除', items: [
      { key: 'kenpo',            label: '健康保険料',          val: sal.kenpo },
      { key: 'kosei',            label: '厚生年金保険料',      val: sal.kosei },
      { key: 'shienkin',         label: '子育支援金',          val: sal.shienkin || 0 },
      { key: 'koyoHoken',        label: '雇用保険料',          val: sal.koyoHoken },
      { key: 'incomeTax',        label: '所得税',              val: sal.incomeTax },
      { key: 'juminzei',         label: '住民税',              val: sal.juminzei },
    ]},
  ];

  const sectionsHTML = fields.map(sec => `
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:#fff;background:${sec.section==='支給'?'#1a3a5c':'#2c3e50'};padding:4px 10px;border-radius:4px;margin-bottom:8px;letter-spacing:.05em">${sec.section}</div>
      ${sec.items.map(item => {
        const isAdj = adj[item.key] !== undefined;
        return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <label style="flex:1;font-size:12.5px;color:${isAdj?'#d97706':'#374151'};font-weight:${isAdj?700:400}">${item.label}${isAdj?' ✎':''}</label>
          <input type="number" id="adjDlg_${item.key}" value="${item.val}"
            style="width:110px;border:1.5px solid ${isAdj?'#f59e0b':'#d1d5db'};border-radius:6px;padding:5px 8px;font-size:13px;text-align:right;box-sizing:border-box"
            onfocus="this.select()">
          <button onclick="resetSingleField('${empId}',${year},${month},'${item.key}')"
            title="自動計算に戻す"
            style="background:${isAdj?'#fee2e2':'#f3f4f6'};color:${isAdj?'#dc2626':'#9ca3af'};border:none;border-radius:5px;padding:4px 8px;font-size:11px;cursor:pointer;white-space:nowrap">元に戻す</button>
        </div>`;
      }).join('')}
    </div>`).join('');

  const modal = document.createElement('div');
  modal.id = 'adjModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:14px;padding:24px;width:420px;max-width:94vw;max-height:88vh;overflow-y:auto;box-shadow:0 12px 40px rgba(0,0,0,0.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div>
          <div style="font-weight:800;font-size:16px;color:#1a3a5c">${emp.name}</div>
          <div style="font-size:11.5px;color:#6b7280;margin-top:2px">${year}年${month}月 給与調整</div>
        </div>
        <button onclick="document.getElementById('adjModal').remove()"
          style="background:#f3f4f6;border:none;border-radius:8px;width:32px;height:32px;font-size:18px;cursor:pointer;color:#6b7280;line-height:1">×</button>
      </div>
      ${sectionsHTML}
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:10px 12px;margin-bottom:16px;font-size:12px;color:#0369a1">
        ※ 空欄または0は「自動計算値を使用」ではなく0円として保存されます。自動計算に戻すには「元に戻す」を押してください。
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="saveAllEmpAdj('${empId}',${year},${month})"
          style="flex:1;background:#1a3a5c;color:#fff;border:none;border-radius:8px;padding:11px;font-size:14px;cursor:pointer;font-weight:700">💾 保存</button>
        <button onclick="document.getElementById('adjModal').remove()"
          style="background:#e5e7eb;color:#374151;border:none;border-radius:8px;padding:11px 16px;font-size:14px;cursor:pointer">キャンセル</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escHandler); }
  });
}

function saveAllEmpAdj(empId, year, month) {
  const fields = ['basePay','otPay','midnightPay','holidayLegalPay','commute',
                  'kenpo','kosei','shienkin','koyoHoken','incomeTax','juminzei'];
  fields.forEach(key => {
    const el = document.getElementById(`adjDlg_${key}`);
    if (!el) return;
    const val = parseInt(el.value) || 0;
    setAdj(year, month, empId, key, val);
  });
  document.getElementById('adjModal').remove();
}

function resetSingleField(empId, year, month, field) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  if (salaryAdj[ym] && salaryAdj[ym][empId]) {
    delete salaryAdj[ym][empId][field];
    FB.salaryAdj(ym).child(String(empId)).child(field).remove();
  }
  // ダイアログを再描画
  document.getElementById('adjModal').remove();
  openEmpAdjDialog(empId, year, month);
}

// モーダルで編集
function openAdjInput(empId, year, month, field, currentVal) {
  // 既存モーダルを削除
  const existing = document.getElementById('adjModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'adjModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;min-width:280px;box-shadow:0 8px 32px rgba(0,0,0,0.2)">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;color:#1a3a5c">金額を編集</div>
      <input id="adjModalInput" type="number" value="${currentVal||0}"
        style="width:100%;border:2px solid #f59e0b;border-radius:8px;padding:8px 12px;font-size:16px;box-sizing:border-box;margin-bottom:16px">
      <div style="display:flex;gap:8px">
        <button onclick="saveAdjModal('${empId}',${year},${month},'${field}')"
          style="flex:1;background:#1a3a5c;color:#fff;border:none;border-radius:8px;padding:10px;font-size:14px;cursor:pointer;font-weight:700">保存</button>
        <button onclick="resetAdjModal('${empId}',${year},${month},'${field}')"
          style="flex:1;background:#fee2e2;color:#dc2626;border:none;border-radius:8px;padding:10px;font-size:14px;cursor:pointer">元に戻す</button>
        <button onclick="document.getElementById('adjModal').remove()"
          style="background:#eee;color:#666;border:none;border-radius:8px;padding:10px 14px;font-size:14px;cursor:pointer">✕</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  const input = document.getElementById('adjModalInput');
  input.focus();
  input.select();
  // Enterキーで保存
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveAdjModal(empId, year, month, field);
    if (e.key === 'Escape') modal.remove();
  });
  // 背景クリックで閉じる
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function saveAdjModal(empId, year, month, field) {
  const val = parseInt(document.getElementById('adjModalInput').value) || 0;
  setAdj(year, month, empId, field, val);
  document.getElementById('adjModal').remove();
  // 開いているページに応じて再描画（給与計算ページはrefreshSalaryTableが存在せず
  // 従来は保存後もテーブルが更新されなかったため、ページごと再描画する）
  if (currentPage === 'salary') renderPage('salary');
  else setTimeout(() => renderPayslipDetail(year, month), 100);
}

function resetAdjModal(empId, year, month, field) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  if (salaryAdj[ym] && salaryAdj[ym][empId]) {
    delete salaryAdj[ym][empId][field];
    FB.salaryAdj(ym).child(String(empId)).child(field).remove();
  }
  document.getElementById('adjModal').remove();
  if (currentPage === 'salary') renderPage('salary');
  else setTimeout(() => renderPayslipDetail(year, month), 100);
}

function printAllPayslips(year, month) {
  const w = window.open('', '_blank');
  w.document.write(`<html><head><meta charset="UTF-8"><title>給与明細 ${year}年${month}月</title>
  <style>
    body{font-family:'Noto Sans JP',sans-serif;font-size:12px}
    .slip{max-width:680px;margin:0 auto 40px;padding:20px;border:1px solid #ccc;page-break-after:always}
    @media print{.slip{break-after:page}}
  </style></head><body>`);
  for (const emp of activeEmployees()) {
    if (emp.store === '両店') {
      const empE = { ...emp, id: `${emp.id}_enya`,  name: `${emp.name}【本店】` };
      const empM = { ...emp, id: `${emp.id}_marco`, name: `${emp.name}【マルコ】` };
      const salE = calcSalary(empE, year, month);
      const salM = calcSalary(empM, year, month);
      w.document.write(`<div class="slip">${payslipHTMLBoth(emp, salE, salM, year, month).replace(/class="card[^"]*"/g,'')}</div>`);
    } else {
      const sal = calcSalary(emp, year, month);
      w.document.write(`<div class="slip">${payslipHTML(emp, sal, year, month).replace(/class="card[^"]*"/g,'')}</div>`);
    }
  }
  w.document.write('</body></html>');
  w.document.close();
  w.print();
}

// payslip page event
// attachPageEvents は app.js で一元管理

// ===== スタッフ選択合計 =====
function openSubtotalSelector(year, month) {
  const existing = document.getElementById('subtotalSelectorModal');
  if (existing) existing.remove();

  const emps = activeEmployeesExpanded();
  const checkboxes = emps.map(emp => `
    <label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px;cursor:pointer;transition:background .15s"
      onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='transparent'">
      <input type="checkbox" value="${emp.id}" class="subtotalChk"
        style="width:16px;height:16px;accent-color:#1a3a5c;cursor:pointer">
      <span style="font-size:13.5px;color:#1a3a5c;font-weight:500">${emp.name}</span>
      <span style="font-size:11px;color:#9ca3af;margin-left:auto">${emp.store||''} / ${emp.type}</span>
    </label>`).join('');

  const modal = document.createElement('div');
  modal.id = 'subtotalSelectorModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:14px;padding:24px;width:400px;max-width:94vw;max-height:86vh;display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(0,0,0,0.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div>
          <div style="font-weight:800;font-size:15px;color:#1a3a5c">👥 合計するスタッフを選択</div>
          <div style="font-size:11.5px;color:#6b7280;margin-top:2px">${year}年${month}月</div>
        </div>
        <button onclick="document.getElementById('subtotalSelectorModal').remove()"
          style="background:#f3f4f6;border:none;border-radius:8px;width:32px;height:32px;font-size:18px;cursor:pointer;color:#6b7280">×</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <button onclick="document.querySelectorAll('.subtotalChk').forEach(c=>c.checked=true)"
          style="font-size:11.5px;padding:4px 10px;border:1px solid #d1d5db;border-radius:5px;background:#f9fafb;cursor:pointer;color:#374151">全選択</button>
        <button onclick="document.querySelectorAll('.subtotalChk').forEach(c=>c.checked=false)"
          style="font-size:11.5px;padding:4px 10px;border:1px solid #d1d5db;border-radius:5px;background:#f9fafb;cursor:pointer;color:#374151">全解除</button>
        <button onclick="document.querySelectorAll('.subtotalChk').forEach(c=>c.checked=(document.getElementById('storeFilter').value===''||employees.find(e=>e.id==c.value)?.store===document.getElementById('storeFilter').value))"
          id="storeFilterBtn" style="display:none"></button>
        <select id="storeFilter" onchange="filterSubtotalByStore()"
          style="font-size:11.5px;padding:4px 10px;border:1px solid #d1d5db;border-radius:5px;background:#f9fafb;cursor:pointer;color:#374151;margin-left:auto">
          <option value="">店舗絞込</option>
          <option value="本店">本店</option>
          <option value="マルコ">マルコ</option>
        </select>
      </div>
      <div style="overflow-y:auto;flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:4px 0">
        ${checkboxes}
      </div>
      <div style="margin-top:14px;display:flex;gap:8px">
        <button onclick="applySubtotal(${year},${month})"
          style="flex:1;background:#1a3a5c;color:#fff;border:none;border-radius:8px;padding:11px;font-size:14px;cursor:pointer;font-weight:700">✅ 決定</button>
        <button onclick="clearSubtotal()"
          style="background:#fee2e2;color:#dc2626;border:none;border-radius:8px;padding:11px 14px;font-size:14px;cursor:pointer">クリア</button>
        <button onclick="document.getElementById('subtotalSelectorModal').remove()"
          style="background:#e5e7eb;color:#374151;border:none;border-radius:8px;padding:11px 14px;font-size:14px;cursor:pointer">キャンセル</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.addEventListener('keydown', function escH(e) {
    if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escH); }
  });
}

function filterSubtotalByStore() {
  const store = document.getElementById('storeFilter').value;
  document.querySelectorAll('.subtotalChk').forEach(c => {
    const v = c.value;
    // 両店スタッフは value が '10_enya' / '10_marco' 形式
    const isBothEnya  = v.includes('_enya');
    const isBothMarco = v.includes('_marco');
    if (!store) {
      c.checked = true;
    } else if (store === '本店') {
      // 本店スタッフ or 両店の本店側
      const emp = employees.find(e => String(e.id) === v);
      c.checked = isBothEnya || (emp && emp.store === '本店');
    } else if (store === 'マルコ') {
      const emp = employees.find(e => String(e.id) === v);
      c.checked = isBothMarco || (emp && emp.store === 'マルコ');
    } else {
      const emp = employees.find(e => String(e.id) === v);
      c.checked = emp && emp.store === store;
    }
  });
}

function applySubtotal(year, month) {
  // value は '10_enya' 形式の文字列 or 数値文字列 → そのまま文字列で保持
  const selected = [...document.querySelectorAll('.subtotalChk:checked')].map(c => {
    const v = c.value;
    return v.includes('_') ? v : parseInt(v);
  });
  document.getElementById('subtotalSelectorModal').remove();
  if (!selected.length) { clearSubtotal(); return; }
  _subtotalState = { year, month, empIds: selected };
  _renderSubtotalBar(year, month, selected);
}

function _renderSubtotalBar(year, month, empIds) {
  // 既存のフローティングパネルを削除
  const existing = document.getElementById('subtotalFloat');
  if (existing) existing.remove();

  const sel = empIds.map(id => {
    const emp = activeEmployeesExpanded().find(e => String(e.id) === String(id));
    return emp ? { emp, sal: calcSalaryWithAdj(emp, year, month) } : null;
  }).filter(Boolean);
  if (!sel.length) return;

  const t = sel.reduce((acc, { sal }) => {
    acc.gross   += sal.grossTotal;
    acc.otPay   += sal.otPay;
    acc.midnight+= sal.midnightPay;
    acc.deduct  += sal.totalDeduction;
    acc.net     += sal.netPay;
    acc.kenpo   += sal.kenpo;
    acc.kosei   += sal.kosei;
    acc.koyo    += sal.koyoHoken;
    acc.income  += sal.incomeTax;
    acc.jumin   += sal.juminzei;
    return acc;
  }, {gross:0,otPay:0,midnight:0,deduct:0,net:0,kenpo:0,kosei:0,koyo:0,income:0,jumin:0});

  const names = sel.map(({emp}) => emp.name).join('・');
  const count = sel.length;

  const panel = document.createElement('div');
  panel.id = 'subtotalFloat';
  panel.style.cssText = [
    'position:fixed',
    'top:50%','left:50%',
    'transform:translate(-50%,-50%)',
    'z-index:8000',
    'background:#fff',
    'border-radius:16px',
    'box-shadow:0 8px 40px rgba(0,0,0,0.22)',
    'border:2px solid #f59e0b',
    'padding:24px 28px',
    'min-width:360px',
    'max-width:92vw',
  ].join(';');

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
      <div>
        <div style="font-size:11px;font-weight:700;color:#d97706;background:#fef3c7;padding:2px 10px;border-radius:10px;display:inline-block;margin-bottom:6px">▶ 選択合計　${count}名</div>
        <div style="font-size:13px;color:#92400e;font-weight:700;line-height:1.6">${names}</div>
      </div>
      <button onclick="clearSubtotal()" title="閉じる"
        style="background:#f3f4f6;border:none;border-radius:8px;width:30px;height:30px;font-size:16px;cursor:pointer;color:#6b7280;flex-shrink:0;margin-left:12px">×</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div style="background:#f0f4ff;border-radius:10px;padding:12px 16px">
        <div style="font-size:11px;color:#6b7280;margin-bottom:3px">支給合計</div>
        <div style="font-size:20px;font-weight:800;color:#1a3a5c">¥${t.gross.toLocaleString()}</div>
      </div>
      <div style="background:#f0fdf4;border-radius:10px;padding:12px 16px">
        <div style="font-size:11px;color:#6b7280;margin-bottom:3px">振込合計</div>
        <div style="font-size:20px;font-weight:800;color:#059669">¥${t.net.toLocaleString()}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">
      <div style="background:#fffbeb;border-radius:8px;padding:8px 10px;text-align:center">
        <div style="font-size:10.5px;color:#6b7280;margin-bottom:2px">残業手当</div>
        <div style="font-size:14px;font-weight:700;color:#d97706">¥${t.otPay.toLocaleString()}</div>
      </div>
      <div style="background:#fffbeb;border-radius:8px;padding:8px 10px;text-align:center">
        <div style="font-size:10.5px;color:#6b7280;margin-bottom:2px">深夜手当</div>
        <div style="font-size:14px;font-weight:700;color:#d97706">¥${t.midnight.toLocaleString()}</div>
      </div>
      <div style="background:#fef2f2;border-radius:8px;padding:8px 10px;text-align:center">
        <div style="font-size:10.5px;color:#6b7280;margin-bottom:2px">控除合計</div>
        <div style="font-size:14px;font-weight:700;color:#dc2626">¥${t.deduct.toLocaleString()}</div>
      </div>
    </div>
    <div style="border-top:1px solid #f3f4f6;padding-top:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
      <div style="text-align:center">
        <div style="font-size:10px;color:#9ca3af">健保</div>
        <div style="font-size:12px;font-weight:600;color:#374151">¥${t.kenpo.toLocaleString()}</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:10px;color:#9ca3af">厚年</div>
        <div style="font-size:12px;font-weight:600;color:#374151">¥${t.kosei.toLocaleString()}</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:10px;color:#9ca3af">所得税</div>
        <div style="font-size:12px;font-weight:600;color:#374151">¥${t.income.toLocaleString()}</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:10px;color:#9ca3af">住民税</div>
        <div style="font-size:12px;font-weight:600;color:#374151">¥${t.jumin.toLocaleString()}</div>
      </div>
    </div>`;

  document.body.appendChild(panel);

  // ドラッグ移動
  let ox=0, oy=0, dragging=false;
  panel.querySelector('div').addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON') return;
    dragging=true; ox=e.clientX-panel.offsetLeft; oy=e.clientY-panel.offsetTop;
    panel.style.cursor='grabbing';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    panel.style.left = (e.clientX-ox)+'px';
    panel.style.top  = (e.clientY-oy)+'px';
    panel.style.transform = 'none';
  });
  document.addEventListener('mouseup', () => { dragging=false; panel.style.cursor=''; });
}

function clearSubtotal() {
  _subtotalState = null;
  const bar = document.getElementById('subtotalBar');
  if (bar) { bar.style.display = 'none'; bar.innerHTML = ''; }
  const fl = document.getElementById('subtotalFloat');
  if (fl) fl.remove();
  const modal = document.getElementById('subtotalSelectorModal');
  if (modal) modal.remove();
}

// 再描画後に選択合計行を復元
function _restoreSubtotal() {
  if (!_subtotalState) return;
  const { year, month, empIds } = _subtotalState;
  _renderSubtotalBar(year, month, empIds);
}

// ===== 選択印刷 =====
function openPrintSelector(year, month) {
  const existing = document.getElementById('printSelectorModal');
  if (existing) existing.remove();

  const emps = activeEmployeesExpanded();
  const checkboxes = emps.map(emp => `
    <label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px;cursor:pointer;transition:background .15s"
      onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='transparent'">
      <input type="checkbox" value="${emp.id}" class="printChk" checked
        style="width:16px;height:16px;accent-color:#1a3a5c;cursor:pointer">
      <span style="font-size:13.5px;color:#1a3a5c;font-weight:500">${emp.name}</span>
      <span style="font-size:11px;color:#9ca3af;margin-left:auto">${emp.store||''} / ${emp.type}</span>
    </label>`).join('');

  const modal = document.createElement('div');
  modal.id = 'printSelectorModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:14px;padding:24px;width:400px;max-width:94vw;max-height:86vh;display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(0,0,0,0.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div>
          <div style="font-weight:800;font-size:15px;color:#1a3a5c">🖨 印刷するスタッフを選択</div>
          <div style="font-size:11.5px;color:#6b7280;margin-top:2px">${year}年${month}月</div>
        </div>
        <button onclick="document.getElementById('printSelectorModal').remove()"
          style="background:#f3f4f6;border:none;border-radius:8px;width:32px;height:32px;font-size:18px;cursor:pointer;color:#6b7280">×</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <button onclick="document.querySelectorAll('.printChk').forEach(c=>c.checked=true)"
          style="font-size:11.5px;padding:4px 10px;border:1px solid #d1d5db;border-radius:5px;background:#f9fafb;cursor:pointer;color:#374151">全選択</button>
        <button onclick="document.querySelectorAll('.printChk').forEach(c=>c.checked=false)"
          style="font-size:11.5px;padding:4px 10px;border:1px solid #d1d5db;border-radius:5px;background:#f9fafb;cursor:pointer;color:#374151">全解除</button>
        <select onchange="filterPrintByStore(this.value)"
          style="font-size:11.5px;padding:4px 10px;border:1px solid #d1d5db;border-radius:5px;background:#f9fafb;cursor:pointer;color:#374151;margin-left:auto">
          <option value="">店舗絞込</option>
          <option value="本店">本店</option>
          <option value="マルコ">マルコ</option>
        </select>
      </div>
      <div style="overflow-y:auto;flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:4px 0">
        ${checkboxes}
      </div>
      <div style="margin-top:14px;display:flex;gap:8px">
        <button onclick="printSelectedSalary(${year},${month})"
          style="flex:1;background:#1a3a5c;color:#fff;border:none;border-radius:8px;padding:11px;font-size:14px;cursor:pointer;font-weight:700">🖨 印刷</button>
        <button onclick="document.getElementById('printSelectorModal').remove()"
          style="background:#e5e7eb;color:#374151;border:none;border-radius:8px;padding:11px 14px;font-size:14px;cursor:pointer">キャンセル</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.addEventListener('keydown', function escH(e) {
    if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escH); }
  });
}

function filterPrintByStore(store) {
  document.querySelectorAll('.printChk').forEach(c => {
    const v = c.value;
    const isBothEnya  = v.includes('_enya');
    const isBothMarco = v.includes('_marco');
    if (!store) {
      c.checked = true;
    } else if (store === '本店') {
      const emp = employees.find(e => String(e.id) === v);
      c.checked = isBothEnya || (emp && emp.store === '本店');
    } else if (store === 'マルコ') {
      const emp = employees.find(e => String(e.id) === v);
      c.checked = isBothMarco || (emp && emp.store === 'マルコ');
    } else {
      const emp = employees.find(e => String(e.id) === v);
      c.checked = emp && emp.store === store;
    }
  });
}

function printSelectedSalary(year, month) {
  // value は '10_enya' 形式の文字列 or 数値文字列 → そのまま保持
  const selected = [...document.querySelectorAll('.printChk:checked')].map(c => {
    const v = c.value;
    return v.includes('_') ? v : parseInt(v);
  });
  document.getElementById('printSelectorModal').remove();
  if (!selected.length) return;

  const rows = selected.map(id => {
    const emp = activeEmployeesExpanded().find(e => String(e.id) === String(id));
    if (!emp) return '';
    const s = calcSalaryWithAdj(emp, year, month);
    const fmt = v => v ? `¥${v.toLocaleString()}` : '—';
    return `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;white-space:nowrap;font-weight:600">${emp.name}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.basePay)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.otPay)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.midnightPay)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.holidayLegalPay)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.commute)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700">${fmt(s.grossTotal)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.kenpo)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.kosei)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.shienkin)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.koyoHoken)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.incomeTax)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${fmt(s.juminzei)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right;color:#059669;font-weight:700">${fmt(s.netPay)}</td>
    </tr>`;
  }).join('');

  // 選択スタッフの合計
  const totals = selected.reduce((acc, id) => {
    const emp = activeEmployeesExpanded().find(e => String(e.id) === String(id));
    if (!emp) return acc;
    const s = calcSalaryWithAdj(emp, year, month);
    acc.base   += s.basePay;
    acc.ot     += s.otPay;
    acc.mid    += s.midnightPay;
    acc.hol    += s.holidayLegalPay || 0;
    acc.com    += s.commute;
    acc.gross  += s.grossTotal;
    acc.kenpo  += s.kenpo;
    acc.kosei  += s.kosei;
    acc.shien  += s.shienkin || 0;
    acc.koyo   += s.koyoHoken;
    acc.income += s.incomeTax;
    acc.jumin  += s.juminzei;
    acc.deduct += s.totalDeduction;
    acc.net    += s.netPay;
    return acc;
  }, {base:0,ot:0,mid:0,hol:0,com:0,gross:0,kenpo:0,kosei:0,shien:0,koyo:0,income:0,jumin:0,deduct:0,net:0});

  const fmt2 = v => v ? `¥${v.toLocaleString()}` : '—';
  const prevYear  = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;

  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>給与計算書 ${year}年${month}月</title>
  <style>
    body{font-family:'Hiragino Sans','Yu Gothic',sans-serif;font-size:12px;margin:20px}
    h2{color:#1a3a5c;margin-bottom:4px}
    .sub{color:#6b7280;font-size:11px;margin-bottom:16px}
    .summary{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .sbox{border:1px solid #e5e7eb;border-radius:6px;padding:8px 14px;min-width:120px}
    .sbox .lbl{font-size:10px;color:#6b7280}
    .sbox .val{font-size:15px;font-weight:700;color:#1a3a5c}
    .sbox.green .val{color:#059669}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#1a3a5c;color:#fff;padding:6px 8px;text-align:center;white-space:nowrap}
    td{padding:5px 8px;text-align:right;border-bottom:1px solid #e5e7eb}
    td:first-child{text-align:left;font-weight:600}
    tr:nth-child(even){background:#f9fafb}
    .total-row td{background:#f0f4ff;font-weight:700;border-top:2px solid #1a3a5c}
    .noprint{margin-top:16px}
    @media print{.noprint{display:none}body{margin:10px}}
  </style></head><body>
  <h2>💴 給与計算書 — ${year}年${month}月</h2>
  <div class="sub">賃金計算期間：${prevYear}年${prevMonth}月21日〜${year}年${month}月20日　対象：${selected.length}名</div>
  <div class="summary">
    <div class="sbox"><div class="lbl">支給合計</div><div class="val">¥${totals.gross.toLocaleString()}</div></div>
    <div class="sbox"><div class="lbl">控除合計</div><div class="val">¥${totals.deduct.toLocaleString()}</div></div>
    <div class="sbox green"><div class="lbl">振込合計</div><div class="val">¥${totals.net.toLocaleString()}</div></div>
    <div class="sbox"><div class="lbl">残業手当</div><div class="val">¥${totals.ot.toLocaleString()}</div></div>
  </div>
  <table>
    <thead><tr>
      <th>氏名</th><th>基本給/時給計</th><th>残業(〜60h)</th><th>深夜</th><th>法定休日</th><th>交通費</th>
      <th>支給合計</th><th>健保</th><th>厚年</th><th>子育支援</th><th>雇保</th><th>所得税</th><th>住民税</th><th>振込額</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr class="total-row">
      <td>合　計</td>
      <td>${fmt2(totals.base)}</td>
      <td>${fmt2(totals.ot)}</td>
      <td>${fmt2(totals.mid)}</td>
      <td>${fmt2(totals.hol)}</td>
      <td>${fmt2(totals.com)}</td>
      <td>¥${totals.gross.toLocaleString()}</td>
      <td>${fmt2(totals.kenpo)}</td>
      <td>${fmt2(totals.kosei)}</td>
      <td>${fmt2(totals.shien)}</td>
      <td>${fmt2(totals.koyo)}</td>
      <td>${fmt2(totals.income)}</td>
      <td>${fmt2(totals.jumin)}</td>
      <td style="color:#059669">¥${totals.net.toLocaleString()}</td>
    </tr></tfoot>
  </table>
  <div class="noprint" style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <button onclick="window.print()" style="background:#1a3a5c;color:#fff;border:none;border-radius:7px;padding:8px 20px;font-size:13px;cursor:pointer">🖨 印刷</button>
    <button onclick="savePDF()" style="background:#dc2626;color:#fff;border:none;border-radius:7px;padding:8px 20px;font-size:13px;cursor:pointer">📄 PDF保存</button>
    <button onclick="window.close()" style="background:#e5e7eb;color:#374151;border:none;border-radius:7px;padding:8px 20px;font-size:13px;cursor:pointer">✕ 閉じる</button>
  </div>
  <script>
  function savePDF() {
    const msg = document.getElementById('pdfMsg');
    msg.style.display = 'block';
    setTimeout(() => window.print(), 300);
  }
  </script>
  <div id="pdfMsg" style="display:none;margin-top:10px;padding:10px 14px;background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;font-size:12px;color:#92400e">
    📌 印刷ダイアログが開きます。<br>
    　iPhone/iPad: 「オプション」→「プリンタ」→ 左下の共有ボタン →「ファイルに保存」<br>
    　PC（Chrome）: 送信先を「PDFに保存」に変更して保存
  </div>
  </body></html>`);
  w.document.close();
}

// ============================================================
// 月別目標総支給 設定モーダル
// ============================================================
function openTargetGrossModal(year, month) {
  const monthlyEmps = activeEmployees().filter(e => e.payType === '月給');
  if (!monthlyEmps.length) { showToast('月給スタッフがいません', 'error'); return; }

  const rows = monthlyEmps.map(emp => {
    const current = getMonthlyTargetGross(emp.id, year, month);
    const master  = emp.targetGross || 0;
    return `
    <tr>
      <td style="padding:6px 8px;font-weight:600">${emp.name}</td>
      <td style="padding:6px 8px;font-size:12px;color:#6b7280">マスタ: ${master > 0 ? '¥'+master.toLocaleString() : '未設定'}</td>
      <td style="padding:6px 8px">
        <input type="number" id="tg_${emp.id}" value="${current !== undefined ? current : ''}"
          placeholder="${master > 0 ? master : '例: 400000'}"
          min="0" step="1000"
          style="width:130px;border:1px solid #d1d5db;border-radius:6px;padding:4px 8px;font-size:13px;text-align:right">
      </td>
      <td style="padding:6px 8px">
        ${current !== undefined ? `<span style="font-size:11px;color:#059669">✅ ¥${current.toLocaleString()}</span>` : '<span style="font-size:11px;color:#9ca3af">未設定</span>'}
      </td>
    </tr>`;
  }).join('');

  openModal(`
  <div class="modal-title">💰 ${year}年${month}月 月別目標総支給設定</div>
  <p style="font-size:12px;color:#6b7280;margin-bottom:12px">
    この月だけの目標総支給を設定します。設定するとマスタの値より優先されます。<br>
    空欄にするとマスタの値に戻ります。
  </p>
  <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#f3f4f6">
        <th style="padding:6px 8px;text-align:left">氏名</th>
        <th style="padding:6px 8px;text-align:left">マスタ値</th>
        <th style="padding:6px 8px;text-align:left">${year}年${month}月 目標総支給</th>
        <th style="padding:6px 8px;text-align:left">現在の設定</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <div class="modal-footer" style="margin-top:16px">
    <button class="btn-outline" onclick="closeModal()">キャンセル</button>
    <button class="btn-primary" onclick="saveTargetGrossModal(${year},${month})">保存して再計算</button>
  </div>`);
}

function saveTargetGrossModal(year, month) {
  const monthlyEmps = activeEmployees().filter(e => e.payType === '月給');
  monthlyEmps.forEach(emp => {
    const input = document.getElementById(`tg_${emp.id}`);
    if (!input) return;
    const val = input.value === '' ? null : parseInt(input.value) || 0;
    setMonthlyTargetGross(emp.id, year, month, val);
  });
  showToast('保存しました。給与明細を再描画します...');
  closeModal();
  setTimeout(() => renderPayslipDetail(year, month), 300);
}
