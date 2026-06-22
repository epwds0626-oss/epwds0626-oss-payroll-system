// ============================================================
// salary.js  ―  給与計算・給与明細
// ============================================================

function renderSalary(year, month) {
  subscribeAdj(year, month);
  const results = activeEmployees().map(emp => ({ emp, sal: calcSalaryWithAdj(emp, year, month) }));
  const totals  = results.reduce((acc, { sal }) => {
    acc.gross    += sal.grossTotal;
    acc.base     += sal.basePay;
    acc.otPay    += sal.otPay;
    acc.midnight += sal.midnightPay;
    acc.holiday  += sal.holidayPay;
    acc.commute  += sal.commute;
    acc.kenpo    += sal.kenpo;
    acc.kosei    += sal.kosei;
    acc.koyo     += sal.koyoHoken;
    acc.income   += sal.incomeTax;
    acc.jumin    += sal.juminzei;
    acc.deduct   += sal.totalDeduction;
    acc.net      += sal.netPay;
    return acc;
  }, { gross:0,base:0,otPay:0,midnight:0,holiday:0,commute:0,kenpo:0,kosei:0,shienkin:0,koyo:0,income:0,jumin:0,deduct:0,net:0 });

  return `
  <div class="section-header">
    <div class="section-title">💴 給与計算書 ― ${year}年${month}月</div>
    <div style="display:flex;gap:8px">
      <button class="btn-outline" onclick="exportSalaryCSV(${year},${month})">CSV出力</button>
      <button class="btn-accent" onclick="window.print()">🖨 印刷</button>
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
    <div class="table-wrap"><table>
      <thead>
        <tr>
          <th rowspan="2" class="tl">氏名</th>
          <th colspan="7" style="background:#1a3a5c">支　給</th>
          <th colspan="6" style="background:#2c3e50">控　除</th>
          <th rowspan="2">差引<br>振込額</th>
        </tr>
        <tr>
          <th>基本給<br>/時給計</th><th>残業<br>(〜60h)</th><th>残業<br>(60h超)</th>
          <th>深夜</th><th>法定休日<br>35%</th><th>法定外休日<br>(週OT分)</th><th>交通費</th>
          <th>健保</th><th>厚年</th><th>雇保</th>
          <th>子育支援金</th><th>所得税</th><th>住民税</th>
        </tr>
      </thead>
      <tbody>
      ${results.map(({ emp, sal }) => {
        const ot60Pay  = sal.ot60under>0 ? Math.round(sal.ot60under * sal.hourlyBase * 0.25) : 0;
        const ot60oPay = sal.ot60over>0  ? Math.round(sal.ot60over  * sal.hourlyBase * 0.25) : 0;
        return `<tr>
        <td class="tl">${emp.name}</td>
        ${adjCell(emp.id,year,month,'basePay',sal.basePay)}
        ${adjCell(emp.id,year,month,'otPay',sal.otPay)}
        <td>—</td>
        ${adjCell(emp.id,year,month,'midnightPay',sal.midnightPay)}
        ${adjCell(emp.id,year,month,'holidayLegalPay',sal.holidayLegalPay)}
        <td>—</td>
        ${adjCell(emp.id,year,month,'commute',sal.commute)}
        ${adjCell(emp.id,year,month,'kenpo',sal.kenpo)}
        ${adjCell(emp.id,year,month,'kosei',sal.kosei)}
        ${adjCell(emp.id,year,month,'shienkin',sal.shienkin)}
        ${adjCell(emp.id,year,month,'koyoHoken',sal.koyoHoken)}
        ${adjCell(emp.id,year,month,'incomeTax',sal.incomeTax)}
        ${adjCell(emp.id,year,month,'juminzei',sal.juminzei)}
        <td><strong>¥${sal.netPay.toLocaleString()}</strong></td>
      </tr>`;}).join('')}
      </tbody>
      <tfoot><tr class="total-row">
        <td class="tl">合　計</td>
        <td>¥${totals.base.toLocaleString()}</td>
        <td colspan="2">¥${totals.otPay.toLocaleString()}</td>
        <td>¥${totals.midnight.toLocaleString()}</td>
        <td>¥${totals.holiday.toLocaleString()}</td>
        <td>—</td>
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
  </div>`;
}

function exportSalaryCSV(year, month) {
  const header = ['氏名','雇用区分','基本給/時給計','残業手当','深夜手当','休日手当','交通費','支給合計','健保','厚年','子育支援金','雇保','所得税','住民税','控除合計','振込額'];
  const rows = activeEmployees().map(emp => {
    const s = calcSalaryWithAdj(emp, year, month);
    return [emp.name, emp.type, s.basePay, s.otPay, s.midnightPay, s.holidayPay, s.commute, s.grossTotal, s.kenpo, s.kosei, s.shienkin||0, s.koyoHoken, s.incomeTax, s.juminzei, s.totalDeduction, s.netPay];
  });
  const csv = [header,...rows].map(r=>r.join(',')).join('\n');
  dlFile(`給与計算_${year}年${month}月.csv`, csv, 'text/csv');
}

// -------- 給与明細 --------
function renderPayslip(year, month) {
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
  </div>
  <div id="payslipWrap"></div>`;
}

function renderPayslipDetail(year, month) {
  const sel = document.getElementById('payslipEmpSel');
  if (!sel) return;
  const empId = parseInt(sel.value);
  const emp   = employees.find(e=>e.id===empId);
  if (!emp) return;
  const sal = calcSalaryWithAdj(emp, year, month);
  document.getElementById('payslipWrap').innerHTML = payslipHTML(emp, sal, year, month);
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
        ${sal.skillPay>0?adjRow(emp.id,year,month,'skillPay','職能給',sal.skillPay):''}
        ${sal.positionAllowancePay>0?adjRow(emp.id,year,month,'positionAllowancePay','役職手当',sal.positionAllowancePay):''}
        ${adjRow(emp.id,year,month,'otPay','残業手当（〜60h 25%）',sal.monthOT>0?Math.round(sal.ot60under*sal.hourlyBase*0.25):0)}
        ${payRow('残業手当（60h超 追加25%）', sal.ot60over>0?Math.round(sal.ot60over*sal.hourlyBase*0.25):0)}
        ${adjRow(emp.id,year,month,'midnightPay','深夜手当（22時〜 25%）',sal.midnightOnlyPay)}
        ${sal.midnightOTPay>0?payRow('深夜残業 追加割増（+25%）', sal.midnightOTPay):''}
        ${adjRow(emp.id,year,month,'holidayLegalPay','法定休日手当（木曜 35%）',sal.holidayLegalPay)}
        ${sal.monthHolidayNonLegal>0?`<div style="display:flex;justify-content:space-between;padding:3px 0;color:#999"><span>法定外休日（水曜）出勤 ${hm(sal.monthHolidayNonLegal)}</span><span>週OT分に含む</span></div>`:''}
        ${adjRow(emp.id,year,month,'commute',`交通費${sal.commuteNote?' ('+sal.commuteNote+')':''}`,sal.commute)}
        <div style="background:#eef2f8;padding:6px 8px;border-radius:6px;display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>支給合計</span><span>¥${sal.grossTotal.toLocaleString()}</span>
        </div>
      </div>
      <div>
        <div style="font-weight:700;color:var(--primary);border-bottom:2px solid var(--primary);padding-bottom:4px;margin-bottom:8px">控除項目</div>
        ${adjRow(emp.id,year,month,'kenpo',`健康保険料（${sal.kaigo?'介護込11.14%':'9.52%'}・茨城支部R8）`,sal.kenpo)}
        ${adjRow(emp.id,year,month,'kosei','厚生年金保険料（18.30%）',sal.kosei)}
        ${sal.shienkin>0?adjRow(emp.id,year,month,'shienkin','子ども・子育て支援金（0.23%）',sal.shienkin):''}
        ${adjRow(emp.id,year,month,'koyoHoken','雇用保険料（5‰）',sal.koyoHoken)}
        ${adjRow(emp.id,year,month,'incomeTax','所得税',sal.incomeTax)}
        ${adjRow(emp.id,year,month,'juminzei','住民税',sal.juminzei)}
        ${sal.chutaikyoAmount>0?adjRow(emp.id,year,month,'chutaikyoAmount','中退共掛金',sal.chutaikyoAmount):''}
        <div style="background:#eef2f8;padding:6px 8px;border-radius:6px;display:flex;justify-content:space-between;font-weight:700;margin-top:6px">
          <span>控除合計</span><span>¥${sal.totalDeduction.toLocaleString()}</span>
        </div>
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
        <div>深夜：${hm(sal.monthMidnight)}</div>
        <div>休日出勤：${hm(sal.monthHoliday)}</div>
        <div>有給：${sal.paidDays}日</div>
        <div>欠勤：${sal.absentDays}日</div>
      </div>
    </div>
  </div>`;
}

function payRow(label, amount) {
  if (!amount) return `<div style="display:flex;justify-content:space-between;padding:3px 0;color:#999"><span>${label}</span><span>—</span></div>`;
  return `<div style="display:flex;justify-content:space-between;padding:3px 0"><span>${label}</span><span>¥${amount.toLocaleString()}</span></div>`;
}

// 編集可能セル（給与計算一覧用）
function adjCell(empId, year, month, field, value) {
  const adj = getAdj(year, month, empId);
  const isAdj = adj[field] !== undefined;
  const disp = value > 0 ? `¥${value.toLocaleString()}` : '—';
  const style = isAdj ? 'color:#d97706;font-weight:700;cursor:pointer' : 'cursor:pointer';
  return `<td style="${style}" title="クリックして編集"
    onclick="openAdjInput(${empId},${year},${month},'${field}',${value})">${disp}</td>`;
}

// 編集可能行（給与明細用）
function adjRow(empId, year, month, field, label, value) {
  const adj = getAdj(year, month, empId);
  const isAdj = adj[field] !== undefined;
  const disp = value > 0 ? `¥${value.toLocaleString()}` : '—';
  const adjBadge = isAdj ? ' <span style="font-size:10px;background:#fef3c7;color:#d97706;border-radius:3px;padding:0 3px">調整</span>' : '';
  const style = isAdj ? 'color:#d97706;font-weight:700' : '';
  return `<div style="display:flex;justify-content:space-between;padding:3px 0;cursor:pointer" title="クリックして編集"
    onclick="openAdjInput(${empId},${year},${month},'${field}',${value})">
    <span>${label}${adjBadge}</span><span style="${style}">${disp}</span></div>`;
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
        <button onclick="saveAdjModal(${empId},${year},${month},'${field}')"
          style="flex:1;background:#1a3a5c;color:#fff;border:none;border-radius:8px;padding:10px;font-size:14px;cursor:pointer;font-weight:700">保存</button>
        <button onclick="resetAdjModal(${empId},${year},${month},'${field}')"
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
}

function resetAdjModal(empId, year, month, field) {
  const ym = `${year}-${String(month).padStart(2,'0')}`;
  if (salaryAdj[ym] && salaryAdj[ym][empId]) {
    delete salaryAdj[ym][empId][field];
    FB.salaryAdj(ym).child(String(empId)).child(field).remove();
  }
  document.getElementById('adjModal').remove();
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
    const sal = calcSalary(emp, year, month);
    w.document.write(`<div class="slip">${payslipHTML(emp, sal, year, month).replace(/class="card[^"]*"/g,'')}</div>`);
  }
  w.document.write('</body></html>');
  w.document.close();
  w.print();
}

// payslip page event
// attachPageEvents は app.js で一元管理
