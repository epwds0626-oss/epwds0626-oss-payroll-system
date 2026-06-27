// ============================================================
// salary.js  ―  給与計算・給与明細
// ============================================================

// 選択合計の状態を保持（Firebaseコールバックによる再描画後も復元）
let _subtotalState = null;

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
    <div class="table-wrap" style="overflow-x:auto;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y;width:100%;max-width:100%"><table style="min-width:max-content">
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
          <th>健保</th><th>厚年</th><th>子育支援金</th>
          <th>雇保</th><th>所得税</th><th>住民税</th>
        </tr>
      </thead>
      <tbody>
      ${results.map(({ emp, sal }) => {
        const ot60Pay  = sal.ot60under>0 ? Math.round(sal.ot60under * sal.hourlyBase * 0.25) : 0;
        const ot60oPay = sal.ot60over>0  ? Math.round(sal.ot60over  * sal.hourlyBase * 0.50) : 0;
        return `<tr>
        <td class="tl" style="cursor:pointer;color:#1a3a5c;font-weight:700;text-decoration:underline dotted" title="クリックして全項目編集" onclick="openEmpAdjDialog(${emp.id},${year},${month})">${emp.name}</td>
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
  </div>
  <div id="subtotalBar" style="display:none"></div>`;
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
        ${adjRow(emp.id,year,month,'otPay','残業手当（〜60h 25%）',sal.monthOT>0?Math.round(Math.min(sal.monthOT,60)*sal.hourlyBase*0.25):0)}
        ${sal.ot60over>0?payRow('残業手当（60h超 追加25%）', sal.otPay - Math.round(Math.min(sal.monthOT,60)*sal.hourlyBase*0.25)):''}
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

// ===== 全項目まとめて編集ダイアログ =====
function openEmpAdjDialog(empId, year, month) {
  const existing = document.getElementById('adjModal');
  if (existing) existing.remove();

  const emp = employees.find(e => e.id === empId);
  if (!emp) return;
  const sal = calcSalaryWithAdj(emp, year, month);
  const adj = getAdj(year, month, empId);

  // 編集対象フィールド定義
  const fields = [
    { section: '支給', items: [
      { key: 'basePay',          label: emp.payType === '時給' ? '時給計' : '基本給',  val: sal.basePay },
      { key: 'otPay',            label: '残業手当（〜60h）',   val: sal.otPay },
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
          <button onclick="resetSingleField(${empId},${year},${month},'${item.key}')"
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
        <button onclick="saveAllEmpAdj(${empId},${year},${month})"
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

// ===== スタッフ選択合計 =====
function openSubtotalSelector(year, month) {
  const existing = document.getElementById('subtotalSelectorModal');
  if (existing) existing.remove();

  const emps = activeEmployees();
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
    const emp = employees.find(e => e.id == c.value);
    c.checked = !store || (emp && emp.store === store);
  });
}

function applySubtotal(year, month) {
  const selected = [...document.querySelectorAll('.subtotalChk:checked')].map(c => parseInt(c.value));
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
    const emp = employees.find(e => e.id === id);
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

  const emps = activeEmployees();
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
        <select onchange="document.querySelectorAll('.printChk').forEach(c=>c.checked=(this.value===''||employees.find(e=>e.id==c.value)?.store===this.value))"
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

function printSelectedSalary(year, month) {
  const selected = [...document.querySelectorAll('.printChk:checked')].map(c => parseInt(c.value));
  document.getElementById('printSelectorModal').remove();
  if (!selected.length) return;

  const rows = selected.map(id => {
    const emp = employees.find(e => e.id === id);
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

  // 選択スタッフの合計（全項目）
  const totals = selected.reduce((acc, id) => {
    const emp = employees.find(e => e.id === id);
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
  <div class="noprint" style="margin-top:20px">
    <button onclick="window.print()" style="background:#1a3a5c;color:#fff;border:none;border-radius:7px;padding:8px 20px;font-size:13px;cursor:pointer;margin-right:8px">🖨 印刷</button>
    <button onclick="window.close()" style="background:#e5e7eb;color:#374151;border:none;border-radius:7px;padding:8px 20px;font-size:13px;cursor:pointer">✕ 閉じる</button>
  </div>
  </body></html>`);
  w.document.close();
}
