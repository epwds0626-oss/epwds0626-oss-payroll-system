// ============================================================
// app.js  ―  ルーティング・ページ管理・共通UI
// ============================================================

let currentPage = 'dashboard';
// 20日締め：21日以降は翌月を給与月として扱う
const _today = new Date();
const _payMonth = _today.getDate() >= 21
  ? (_today.getMonth() + 2 > 12 ? 1 : _today.getMonth() + 2)
  : _today.getMonth() + 1;
const _payYear = _today.getDate() >= 21 && _today.getMonth() + 2 > 12
  ? _today.getFullYear() + 1
  : _today.getFullYear();
let currentYear  = _payYear;
let currentMonth = _payMonth;

// -------- 初期化 --------
document.addEventListener('DOMContentLoaded', () => {
  initYearMonth();
  setupNav();
  // Firebase からデータ読み込み後にページを描画
  initFirebaseData();
});

function initYearMonth() {
  const yearSel  = document.getElementById('targetYear');
  const monthSel = document.getElementById('targetMonth');
  for (let y = 2024; y <= 2028; y++) {
    const o = document.createElement('option');
    o.value = y; o.text = y + '年';
    if (y === currentYear) o.selected = true;
    yearSel.appendChild(o);
  }
  for (let m = 1; m <= 12; m++) {
    const o = document.createElement('option');
    o.value = m; o.text = m + '月';
    if (m === currentMonth) o.selected = true;
    monthSel.appendChild(o);
  }
}

function refreshCurrentPage() {
  currentYear  = parseInt(document.getElementById('targetYear').value);
  currentMonth = parseInt(document.getElementById('targetMonth').value);
  renderPage(currentPage);
}

function setupNav() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
      el.classList.add('active');
      const page = el.dataset.page;
      currentPage = page;
      document.getElementById('pageTitle').textContent = el.textContent.trim();
      renderPage(page);
    });
  });
}

function renderPage(page) {
  const container = document.getElementById('pageContent');
  const y = currentYear, m = currentMonth;

  // ページ切り替え前にコンテナをクリア（前ページのHTMLが残らないように）
  container.innerHTML = '';

  switch(page) {
    case 'dashboard':   container.innerHTML = renderDashboard(y,m);   break;
    case 'employees':   container.innerHTML = renderEmployees();       break;
    case 'attendance':  container.innerHTML = renderAttendance(y,m);  break;
    case 'weekly':      container.innerHTML = renderWeekly(y,m);      break;
    case 'monthly':     container.innerHTML = renderMonthly(y,m);     break;
    case 'salary':      container.innerHTML = renderSalary(y,m);      break;
    case 'payslip':     container.innerHTML = renderPayslip(y,m);     break;
    case 'freelance':   container.innerHTML = renderFreelance(y,m);   break;
    case 'paid_leave':  container.innerHTML = renderPaidLeave();       break;
    case 'article36':   container.innerHTML = renderArticle36(y,m);   break;
    case 'labor_report':container.innerHTML = renderLaborReport(y,m); break;
    default: container.innerHTML = '<p>準備中</p>';
  }
  attachPageEvents(page);
}

// -------- ダッシュボード --------
function renderDashboard(year, month) {
  const ymStr = `${year}年${month}月`;

  // 全員の３６協定チェック
  const alerts36 = [];
  for (const emp of employees) {
    const r = check36(emp.id, year, month);
    if (r.alerts.length) alerts36.push({ name: emp.name, alerts: r.alerts });
  }

  // 有給5日義務チェック（年10日以上付与者）
  const paidAlerts = [];
  for (const emp of employees) {
    if (!emp.hireDate) continue;
    const grants = calcPaidLeaveGrant(emp.hireDate);
    const totalGrant = grants.reduce((s,g)=>s+g.days,0);
    if (totalGrant >= 10) {
      const { balance, used } = getPaidLeaveBalance(emp.id);
      const usedThisYear = (paidLeave[emp.id]?.used||[]).filter(u=>u.date.startsWith(String(year))).reduce((s,u)=>s+u.days,0);
      if (usedThisYear < 5) paidAlerts.push({ name: emp.name, used: usedThisYear });
    }
  }

  // 月次給与合計
  let totalNet = 0, totalGross = 0;
  for (const emp of employees) {
    const r = calcSalary(emp, year, month);
    totalNet   += r.netPay;
    totalGross += r.grossTotal;
  }

  return `
  <div class="stat-grid">
    <div class="stat-box">
      <div class="stat-val">${employees.length}</div>
      <div class="stat-label">従業員数</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">${ymStr}</div>
      <div class="stat-label">対象月</div>
    </div>
    <div class="stat-box ${totalGross>0?'':''}">
      <div class="stat-val">¥${totalGross.toLocaleString()}</div>
      <div class="stat-label">支給総額（${ymStr}）</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">¥${totalNet.toLocaleString()}</div>
      <div class="stat-label">振込総額（${ymStr}）</div>
    </div>
    <div class="stat-box ${alerts36.length>0?'danger':'success'}">
      <div class="stat-val">${alerts36.length}</div>
      <div class="stat-label">３６協定アラート</div>
    </div>
    <div class="stat-box ${paidAlerts.length>0?'warn':'success'}">
      <div class="stat-val">${paidAlerts.length}</div>
      <div class="stat-label">有給5日義務 未達</div>
    </div>
  </div>

  ${alerts36.length ? `
  <div class="alert alert-danger">
    <span>⚠️</span>
    <div><strong>３６協定アラート（${ymStr}）</strong><br>
    ${alerts36.map(a=>`${a.name}：${a.alerts.map(x=>x.msg).join(' / ')}`).join('<br>')}</div>
  </div>` : ''}

  ${paidAlerts.length ? `
  <div class="alert alert-warn">
    <span>🌿</span>
    <div><strong>有給5日義務 未達成（${year}年度）</strong><br>
    ${paidAlerts.map(a=>`${a.name}：${a.used}日取得（あと${5-a.used}日必要）`).join('<br>')}</div>
  </div>` : ''}

  <div class="card">
    <div class="card-title">📌 クイックアクション</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-primary" onclick="navTo('attendance')">🕐 勤怠入力</button>
      <button class="btn-primary" onclick="navTo('salary')">💴 給与計算</button>
      <button class="btn-accent" onclick="navTo('payslip')">🧾 明細印刷</button>
      <button class="btn-outline" onclick="navTo('article36')">⚖️ ３６協定確認</button>
      <button class="btn-outline" onclick="navTo('labor_report')">📁 労基提出書類</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">📊 ${ymStr} 従業員別サマリ</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th class="tl">氏名</th><th>雇用区分</th><th>店舗</th>
            <th>実働(h)</th><th>週残業(h)</th><th>深夜(h)</th>
            <th>振込額</th><th>状態</th>
          </tr>
        </thead>
        <tbody>
          ${activeEmployeesExpanded().map(emp => {
            const s = getMonthSummary(emp.id, year, month);
            const sal = calcSalary(emp, year, month);
            const r36 = check36(emp.id, year, month);
            const badge = r36.alerts.some(a=>a.level==='danger') 
              ? '<span class="badge badge-red">超過</span>'
              : r36.alerts.some(a=>a.level==='warn')
              ? '<span class="badge badge-yellow">注意</span>'
              : '<span class="badge badge-green">正常</span>';
            return `<tr>
              <td class="tl">${emp.name}</td>
              <td>${emp.type}</td>
              <td>${emp.store||'—'}</td>
              <td>${hm(s.totalActual)}</td>
              <td>${hm(s.monthOT)}</td>
              <td>${hm(s.monthMidnight)}</td>
              <td>¥${sal.netPay.toLocaleString()}</td>
              <td>${badge}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function navTo(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.dataset.page === page) {
      el.classList.add('active');
      el.click();
    } else {
      el.classList.remove('active');
    }
  });
}

// -------- モーダル --------
function openModal(html) {
  document.getElementById('modalBox').innerHTML = html;
  document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// -------- トースト --------
function showToast(msg, type='success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;right:24px;background:${type==='success'?'#27ae60':'#c0392b'};color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 3000);
}

// -------- サイドバートグル --------
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// -------- ページイベント後付け --------
// attachPageEvents は ui.js で一元管理

// -------- 従業員ページ --------
function renderEmployees() {
  const activeTab   = window._empTab || 'active';
  const activeEmps  = employees.filter(e => e.status !== 'inactive');
  const inactiveEmps= employees.filter(e => e.status === 'inactive');
  const showList    = activeTab === 'active' ? activeEmps : inactiveEmps;

  return `
  <div class="section-header">
    <div class="section-title">👥 従業員マスタ</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-accent" onclick="openAddEmployee()">＋ 新規登録</button>
      <button class="btn-outline" onclick="exportEmployeeCSV()">📤 CSV出力</button>
      <button class="btn-primary" onclick="showEmpCSVImport()">📥 CSV取込</button>
    </div>
  </div>

  <div class="card" id="empCsvCard" style="display:none">
    <div class="card-title">📥 従業員マスタ CSV取込</div>
    <div class="alert alert-info"><span>📌</span>
    <div>CSV出力したファイルをExcelで編集後、そのまま貼り付けてください。<br>
    <strong>1行目はヘッダ行</strong>として自動スキップします。No（ID）で既存データを上書きします。</div></div>
    <textarea id="empCsvArea" style="width:100%;height:140px;font-family:monospace;font-size:12px;border:1px solid #dce3ec;border-radius:8px;padding:10px" placeholder="CSVデータをここに貼り付け..."></textarea>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="btn-primary" onclick="importEmployeeCSV()">取込実行</button>
      <button class="btn-outline" onclick="hideEmpCSVImport()">キャンセル</button>
    </div>
  </div>

  <div class="tab-bar">
    <button class="tab-btn ${activeTab==='active'?'active':''}" onclick="setEmpTab('active')">
      在籍中 <span class="badge badge-blue" style="margin-left:4px">${activeEmps.length}</span>
    </button>
    <button class="tab-btn ${activeTab==='inactive'?'active':''}" onclick="setEmpTab('inactive')">
      退職・休業 <span class="badge badge-gray" style="margin-left:4px">${inactiveEmps.length}</span>
    </button>
  </div>

  ${activeTab==='inactive'&&inactiveEmps.length===0 ? `
  <div class="alert alert-info"><span>ℹ️</span><div>退職・休業中のスタッフはいません。</div></div>` : ''}

  <div class="card">
    <div class="table-wrap">
      <table id="empTable">
        <thead>
          <tr>
            <th style="width:32px"></th>
            <th>No</th><th class="tl">氏名</th><th>雇用区分</th><th>店舗</th><th>部門</th>
            <th>給与形態</th><th>基本給/時給</th><th>交通費</th>
            <th>支払</th>
            <th>保険・税金<br><span style="font-size:10px;font-weight:400">（月額概算）</span></th>
            <th>入社日</th>
            ${activeTab==='inactive'?'<th>退職日</th>':''}
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="empTbody">
          ${showList.length===0 ? `<tr><td colspan="13" style="text-align:center;color:#999;padding:20px">データなし</td></tr>` : ''}
          ${showList.map((emp, idx)=>{
            // 月額の概算控除を計算（基本給ベース）
            // 標準報酬月額固定値 > 目標総支給 > 基本給 の優先順位で概算計算
            const baseForCalc = emp.hyojunHoshu > 0 ? emp.hyojunHoshu
              : (emp.payType==='月給' && emp.targetGross > 0 ? emp.targetGross : (emp.payType==='月給' ? emp.baseSalary : (emp.hourlyWage * 173)));
            const sh = calcShakai(baseForCalc, emp.birthDate||'', emp.hyojunHoshu||0);
            const kenpo  = emp.shakai==='加入' ? sh.kenpo : 0;
            const kosei  = emp.shakai==='加入' ? sh.kosei : 0;
            const shienkin = emp.shakai==='加入' ? sh.shienkin : 0;
            const koyo   = emp.koyo==='加入'   ? Math.round(baseForCalc * KOYO_RATE) : 0;
            const chutai = (emp.chutaikyo==='加入') ? (emp.chutaikyoAmount||0) : 0;
            const jumin  = emp.juminzei||0;
            const income = calcIncomeTax(baseForCalc - (emp.commute||0) - kenpo - kosei - shienkin - koyo, emp.dependents||0, emp.tax||'甲');
            const total  = kenpo + kosei + shienkin + koyo + chutai + jumin + income;
            const hyojunLabel = emp.hyojunHoshu > 0 ? `（標準報酬 ¥${emp.hyojunHoshu.toLocaleString()}）` : '';

            const insuranceHtml = `
              <div style="font-size:11px;line-height:1.8">
                ${emp.shakai==='加入'?`<span style="color:#1e40af">健保 ¥${kenpo.toLocaleString()}</span> / <span style="color:#1e40af">厚年 ¥${kosei.toLocaleString()}</span> / <span style="color:#0369a1">支援金 ¥${shienkin.toLocaleString()}</span>${hyojunLabel}<br>`:'<span style="color:#999">社保 未加入</span><br>'}
                ${emp.koyo==='加入'?`<span style="color:#166534">雇保 ¥${koyo.toLocaleString()}</span>`:'<span style="color:#999">雇保 未加入</span>'}
                ${chutai?` / <span style="color:#166534">中退共 ¥${chutai.toLocaleString()}</span>`:''}
                <br><span style="color:#7c3aed">所得税 ¥${income.toLocaleString()}</span>
                ${jumin?` / <span style="color:#7c3aed">住民税 ¥${jumin.toLocaleString()}</span>`:''}
                <br><strong>控除計 ¥${total.toLocaleString()}</strong>
                ${sh.kaigo?'<span class="badge badge-yellow" style="margin-left:4px;font-size:10px">介護保険</span>':''}
              </div>`;

            return `
          <tr draggable="true" data-id="${emp.id}" data-idx="${idx}"
            style="${emp.status==='inactive'?'opacity:0.7':''};cursor:grab"
            ondragstart="empDragStart(event,${emp.id})"
            ondragover="empDragOver(event)"
            ondragleave="empDragLeave(event)"
            ondrop="empDrop(event,${emp.id})"
            ondragend="empDragEnd(event)">
            <td style="cursor:grab;color:#888;font-size:16px;padding:4px 8px">⠿</td>
            <td>${emp.id}</td>
            <td class="tl">
              ${emp.name}
              ${emp.status==='inactive'?'<span class="badge badge-gray" style="margin-left:4px">退職</span>':''}
              ${emp.status==='leave'?'<span class="badge badge-yellow" style="margin-left:4px">休業</span>':''}
            </td>
            <td><span class="badge ${emp.type==='正社員'?'badge-blue':emp.type==='パート'?'badge-green':'badge-gray'}">${emp.type}</span></td>
            <td>${emp.store||'—'}</td>
            <td>${emp.dept||'—'}</td>
            <td>${emp.payType}</td>
            <td>¥${(emp.payType==='月給'?emp.baseSalary:emp.hourlyWage).toLocaleString()}</td>
            <td>¥${(emp.commute||0).toLocaleString()}</td>
            <td><span class="badge ${(emp.paymentMethod||'振込')==='振込'?'badge-blue':'badge-yellow'}">${emp.paymentMethod||'振込'}</span></td>
            <td style="min-width:200px">${insuranceHtml}</td>
            <td>${emp.hireDate||'—'}</td>
            ${activeTab==='inactive'?`<td>${emp.leaveDate||'—'}</td>`:''}
            <td style="white-space:nowrap">
              <button class="btn-outline btn-sm" onclick="moveEmp(${emp.id},-1)" ${idx===0?'disabled':''}>↑</button>
              <button class="btn-outline btn-sm" onclick="moveEmp(${emp.id},1)" ${idx===showList.length-1?'disabled':''}>↓</button>
              <button class="btn-primary btn-sm" onclick="editEmployee(${emp.id})">編集</button>
              ${emp.status==='inactive'
                ? `<button class="btn-success btn-sm" onclick="reactivateEmployee(${emp.id})">復職</button>`
                : `<button class="btn-outline btn-sm" onclick="openLeaveModal(${emp.id})">退職/休業</button>`
              }
              <button class="btn-danger btn-sm" onclick="deleteEmployee(${emp.id})">完全削除</button>
            </td>
          </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>

  ${activeTab==='inactive'&&inactiveEmps.length>0 ? `
  <div class="alert alert-warn"><span>⚠️</span>
  <div>退職・休業者は給与計算・勤怠入力の対象から除外されています。過去の勤怠・給与データは保持されています。</div></div>` : ''}`;
}

function setEmpTab(tab) {
  window._empTab = tab;
  renderPage('employees');
}

// 退職/休業モーダル
function openLeaveModal(id) {
  const emp = employees.find(e=>e.id===id);
  if (!emp) return;
  openModal(`
  <div class="modal-title">📤 退職・休業処理 ― ${emp.name}</div>
  <div class="alert alert-warn"><span>⚠️</span>
  <div>退職・休業にすると給与計算・勤怠入力の対象から除外されます。<br>過去のデータはすべて保持されます。</div></div>
  <div class="form-group">
    <label>区分</label>
    <select id="leave_status">
      <option value="inactive">退職</option>
      <option value="leave">休業（産休・育休・傷病等）</option>
    </select>
  </div>
  <div class="form-group">
    <label>退職日 / 休業開始日</label>
    <input type="date" id="leave_date" value="${new Date().toISOString().slice(0,10)}">
  </div>
  <div class="form-group">
    <label>備考</label>
    <input type="text" id="leave_note" placeholder="例：一身上の都合、産前産後休業 等">
  </div>
  <div class="modal-footer">
    <button class="btn-outline" onclick="closeModal()">キャンセル</button>
    <button class="btn-danger" onclick="setLeave(${id})">処理実行</button>
  </div>`);
}

function setLeave(id) {
  const status    = document.getElementById('leave_status').value;
  const leaveDate = document.getElementById('leave_date').value;
  const leaveNote = document.getElementById('leave_note').value;
  const emp = employees.find(e=>e.id===id);
  if (!emp) return;
  db.ref(`payroll/employees/${id}`).update({ status, leaveDate, leaveNote }, err => {
    if (err) { showToast('保存エラー','error'); return; }
    closeModal();
    window._empTab = 'inactive';
    showToast(status==='inactive' ? '退職処理しました' : '休業処理しました');
  });
}

function reactivateEmployee(id) {
  if (!confirm('在籍中に戻しますか？')) return;
  db.ref(`payroll/employees/${id}`).update({ status: 'active', leaveDate: '', leaveNote: '' }, err => {
    if (err) { showToast('保存エラー','error'); return; }
    window._empTab = 'active';
    showToast('在籍中に戻しました');
  });
}

function openAddEmployee() {
  const nextId = Math.max(...employees.map(e=>e.id),0) + 1;
  openModal(employeeForm({ id:nextId, name:'', kana:'', type:'パート', dept:'ホール', payType:'時給', baseSalary:0, hourlyWage:0, commute:0, commuteType:'fixed', commutePerDay:0, positionAllowance:0, targetGross:0, dependents:0, shakai:'未加入', koyo:'未加入', chutaikyo:'未加入', tax:'甲', juminzei:0, store:'本店', hireDate:'', birthDate:'', status:'active' }, true));
}

function editEmployee(id) {
  const emp = employees.find(e=>e.id===id);
  if (!emp) return;
  openModal(employeeForm(emp, false));
}

function employeeForm(emp, isNew) {
  return `
  <div class="modal-title">${isNew?'従業員追加':'従業員編集'}</div>
  <div class="form-row">
    <div class="form-group"><label>氏名</label><input type="text" id="ef_name" value="${emp.name}"></div>
    <div class="form-group"><label>フリガナ</label><input type="text" id="ef_kana" value="${emp.kana||''}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>雇用区分</label>
      <select id="ef_type">
        ${['正社員','パート','アルバイト','契約社員','業務委託'].map(t=>`<option ${emp.type===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>店舗</label>
      <select id="ef_store">
        ${['本店','マルコ','両店'].map(s=>`<option ${emp.store===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>部門</label>
      <select id="ef_dept">
        ${['ホール','キッチン','管理'].map(d=>`<option ${emp.dept===d?'selected':''}>${d}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>給与形態</label>
      <select id="ef_payType" onchange="togglePayFields()">
        ${['月給','時給'].map(p=>`<option ${emp.payType===p?'selected':''}>${p}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group" id="ef_baseSalaryGroup"><label>基本給（月給）</label><input type="number" id="ef_baseSalary" value="${emp.baseSalary}"></div>
    <div class="form-group" id="ef_hourlyGroup"><label>時給（円/h）</label><input type="number" id="ef_hourlyWage" value="${emp.hourlyWage}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>役職手当（月額）</label><input type="number" id="ef_positionAllowance" value="${emp.positionAllowance||0}"></div>
    <div class="form-group"><label>目標総支給額 <span style="font-size:11px;color:#e8a020">※月給制のみ　職能給を自動計算</span></label><input type="number" id="ef_targetGross" value="${emp.targetGross||0}"></div>
  </div>
  <div class="form-row">
    <div class="form-group">
    <label>交通費の計算方式</label>
    <div style="display:flex;gap:10px;align-items:center;margin-top:4px">
      <label style="display:flex;align-items:center;gap:4px;font-weight:400;color:var(--text)">
        <input type="radio" name="commuteType" id="ef_commuteFixed" value="fixed"
          ${(emp.commuteType||'fixed')==='fixed'?'checked':''}
          onchange="toggleCommuteType()"> 月額固定
      </label>
      <label style="display:flex;align-items:center;gap:4px;font-weight:400;color:var(--text)">
        <input type="radio" name="commuteType" id="ef_commuteDaily" value="daily"
          ${emp.commuteType==='daily'?'checked':''}
          onchange="toggleCommuteType()"> 日額×出勤日数
      </label>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group" id="ef_commuteFixedGroup">
      <label>交通費（月額固定・円）</label>
      <input type="number" id="ef_commute" value="${emp.commute||0}">
    </div>
    <div class="form-group" id="ef_commuteDailyGroup" style="display:none">
      <label>交通費（1日あたり・円）</label>
      <input type="number" id="ef_commutePerDay" value="${emp.commutePerDay||0}">
    </div>
  </div>
    <div class="form-group"><label>扶養人数</label><input type="number" id="ef_dep" value="${emp.dependents||0}" min="0"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>社会保険</label>
      <select id="ef_shakai">
        ${['加入','未加入'].map(s=>`<option ${emp.shakai===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>雇用保険</label>
      <select id="ef_koyo">
        ${['加入','未加入'].map(s=>`<option ${emp.koyo===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>中小企業退職金共済（中退共）</label>
      <select id="ef_chutaikyo">
        ${['加入','未加入'].map(s=>`<option ${(emp.chutaikyo||'未加入')===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>中退共 掛金（月額・円）</label>
      <input type="number" id="ef_chutaikyoAmount" value="${emp.chutaikyoAmount||0}" placeholder="例：5000">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>所得税区分</label>
      <select id="ef_tax">
        ${['甲','乙'].map(t=>`<option ${emp.tax===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>住民税（月額）</label><input type="number" id="ef_juminzei" value="${emp.juminzei||0}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>標準報酬月額（固定）</label><input type="number" id="ef_hyojunHoshu" value="${emp.hyojunHoshu||0}" placeholder="0=自動計算（等級表で自動判定）"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>入社日</label><input type="date" id="ef_hireDate" value="${emp.hireDate||''}"></div>
    <div class="form-group"><label>生年月日</label><input type="date" id="ef_birthDate" value="${emp.birthDate||''}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>支払方法</label>
      <select id="ef_paymentMethod">
        ${['振込','現金'].map(s=>`<option ${(emp.paymentMethod||'振込')===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="form-group" id="ef_bankGroup">
      <label>振込先銀行・口座（メモ）</label>
      <input type="text" id="ef_bankInfo" value="${emp.bankInfo||''}" placeholder="〇〇銀行 普通 1234567">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>電話番号</label><input type="text" id="ef_phone" value="${emp.phone||''}" placeholder="090-0000-0000"></div>
    <div class="form-group"><label>緊急連絡先</label><input type="text" id="ef_emergencyPhone" value="${emp.emergencyPhone||''}" placeholder="続柄・氏名・電話番号"></div>
  </div>
  <div class="modal-footer">
    <button class="btn-outline" onclick="closeModal()">キャンセル</button>
    <button class="btn-primary" onclick="saveEmployee(${emp.id},${isNew})">保存</button>
  </div>`;
}

function saveEmployee(id, isNew) {
  const get = sid => document.getElementById(sid);
  const existing = employees.find(e=>e.id===id) || {};
  const emp = {
    id, name: get('ef_name')?.value, kana: get('ef_kana')?.value,
    type: get('ef_type')?.value, store: get('ef_store')?.value, dept: get('ef_dept')?.value,
    payType: get('ef_payType')?.value,
    baseSalary: parseInt(get('ef_baseSalary')?.value)||0,
    hourlyWage: parseInt(get('ef_hourlyWage')?.value)||0,
    commute: parseInt(get('ef_commute')?.value)||0,
    commuteType: document.querySelector('input[name="commuteType"]:checked')?.value || 'fixed',
    commutePerDay: parseInt(get('ef_commutePerDay')?.value)||0,
    positionAllowance: parseInt(get('ef_positionAllowance')?.value)||0,
    targetGross: parseInt(get('ef_targetGross')?.value)||0,
    dependents: parseInt(get('ef_dep')?.value)||0,
    shakai: get('ef_shakai')?.value, koyo: get('ef_koyo')?.value,
    chutaikyo: get('ef_chutaikyo')?.value,
    chutaikyoAmount: parseInt(get('ef_chutaikyoAmount')?.value)||0,
    tax: get('ef_tax')?.value, juminzei: parseInt(get('ef_juminzei')?.value)||0,
    hyojunHoshu: parseInt(get('ef_hyojunHoshu')?.value)||0,
    hireDate: get('ef_hireDate')?.value, birthDate: get('ef_birthDate')?.value,
    address: get('ef_address')?.value||'',
    phone: get('ef_phone')?.value||'',
    emergencyPhone: get('ef_emergencyPhone')?.value||'',
    paymentMethod: get('ef_paymentMethod')?.value||'振込',
    bankInfo: get('ef_bankInfo')?.value||'',
    // ステータス・退職情報・並び順を引き継ぐ
    status:    existing.status    || 'active',
    leaveDate: existing.leaveDate || '',
    leaveNote: existing.leaveNote || '',
    order:     existing.order     !== undefined ? existing.order : (id * 10),
  };
  if (!emp.name) { showToast('氏名を入力してください','error'); return; }

  // Firebaseに直接書き込む（on('value')コールバックで画面自動更新）
  db.ref(`payroll/employees/${id}`).set(emp, err => {
    if (err) { showToast('保存エラー','error'); return; }
    if (isNew && emp.hireDate) {
      db.ref(`payroll/paidLeave/${id}`).set({ grants: [], used: [] });
    }
    closeModal();
    showToast(isNew ? '追加しました ✓' : '更新しました ✓');
  });
}

function deleteEmployee(id) {
  const emp = employees.find(e=>e.id===id);
  if (!confirm(`【完全削除】${emp?.name} のデータをすべて削除します。\n勤怠・給与・有給データも失われます。\nよろしいですか？`)) return;
  db.ref(`payroll/employees/${id}`).remove(() => {
    showToast('完全削除しました');
  });
}

function showEmpCSVImport() {
  document.getElementById('empCsvCard').style.display = 'block';
  document.getElementById('empCsvArea').focus();
}
function hideEmpCSVImport() {
  document.getElementById('empCsvCard').style.display = 'none';
}

function exportEmployeeCSV() {
  const header = [
    'No','氏名','フリガナ','雇用区分','店舗','部門',
    '給与形態','基本給','時給','交通費種別','交通費月額','交通費日額',
    '役職手当','目標総支給額',
    '社保','雇保','税区分','扶養人数','住民税','標準報酬月額',
    '入社日','生年月日','状態'
  ];
  const rows = employees.map(e => [
    e.id, e.name, e.kana||'', e.type, e.store||'', e.dept||'',
    e.payType, e.baseSalary, e.hourlyWage,
    e.commuteType||'fixed', e.commute||0, e.commutePerDay||0,
    e.positionAllowance||0, e.targetGross||0,
    e.shakai, e.koyo, e.tax, e.dependents||0, e.juminzei||0, e.hyojunHoshu||0,
    e.hireDate||'', e.birthDate||'', e.status||'active'
  ]);
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  dlFile('従業員マスタ.csv', csv, 'text/csv');
  showToast('CSV出力しました');
}

function importEmployeeCSV() {
  const raw = document.getElementById('empCsvArea').value.trim();
  if (!raw) { showToast('CSVを貼り付けてください','error'); return; }

  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  let imported = 0, added = 0, skipped = 0;

  // ヘッダ行を取得して列の並びを判定
  const headerLine = lines[0];
  const delim = headerLine.includes('\t') ? '\t' : ',';
  const headers = headerLine.split(delim).map(h => h.trim().replace(/^"|"$/g,''));

  // 列インデックスをヘッダ名で動的に取得
  const col = name => headers.indexOf(name);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cols = line.split(delim).map(c => c.trim().replace(/^"|"$/g,''));
    if (cols.length < 3) { skipped++; continue; }

    const id = parseInt(cols[col('No')] || cols[0]);
    const name = cols[col('氏名')] || cols[1] || '';
    if (!id || !name) { skipped++; continue; }

    // 各列を取得（存在しない列はデフォルト値）
    const get = (colName, def='') => {
      const idx = col(colName);
      return idx >= 0 && cols[idx] !== undefined ? cols[idx] : def;
    };

    const existing = employees.find(e => e.id === id) || {};

    const empData = {
      id,
      name,
      kana:              get('フリガナ', existing.kana||''),
      type:              get('雇用区分', existing.type||'パート'),
      store:             get('店舗', existing.store||'本店'),
      dept:              get('部門', existing.dept||'ホール'),
      payType:           get('給与形態', existing.payType||'時給'),
      baseSalary:        parseInt(get('基本給', existing.baseSalary||0))||0,
      hourlyWage:        parseInt(get('時給', existing.hourlyWage||0))||0,
      commuteType:       get('交通費種別', existing.commuteType||'fixed'),
      commute:           parseInt(get('交通費', existing.commute||0))||0,
      commutePerDay:     parseInt(get('交通費日額', existing.commutePerDay||0))||0,
      positionAllowance: parseInt(get('役職手当', existing.positionAllowance||0))||0,
      targetGross:       parseInt(get('目標総支給額', existing.targetGross||0))||0,
      shakai:            get('社保', existing.shakai||'未加入'),
      koyo:              get('雇保', existing.koyo||'未加入'),
      tax:               get('税区分', existing.tax||'甲'),
      dependents:        parseInt(get('扶養人数', existing.dependents||0))||0,
      juminzei:          parseInt(get('住民税', existing.juminzei||0))||0,
      hyojunHoshu:       parseInt(get('標準報酬月額', existing.hyojunHoshu||0))||0,
      hireDate:          get('入社日', existing.hireDate||''),
      birthDate:         get('生年月日', existing.birthDate||''),
      status:            get('状態', existing.status||'active'),
      leaveDate:         existing.leaveDate || '',
      leaveNote:         existing.leaveNote || '',
    };

    const idx = employees.findIndex(e => e.id === id);
    if (idx >= 0) {
      employees[idx] = empData;
      imported++;
    } else {
      employees.push(empData);
      added++;
    }
  }

  if (imported + added === 0) {
    showToast('取込できるデータがありませんでした','error');
    return;
  }

  // Firebaseに一括書き込み
  const empObj = {};
  employees.forEach(e => { empObj[e.id] = e; });
  FB.employees().set(empObj, err => {
    if (err) { showToast('保存エラー','error'); return; }
    hideEmpCSVImport();
    showToast(`更新${imported}件・追加${added}件・スキップ${skipped}件`);
  });
}

function dlFile(name, content, type='text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\uFEFF'+content], {type}));
  a.download = name;
  a.click();
}
