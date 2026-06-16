// ============================================================
// app.js  ―  ルーティング・ページ管理・共通UI
// ============================================================

let currentPage = 'dashboard';
let currentYear  = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

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

  switch(page) {
    case 'dashboard':   container.innerHTML = renderDashboard(y,m);   break;
    case 'employees':   container.innerHTML = renderEmployees();       break;
    case 'attendance':  container.innerHTML = renderAttendance(y,m);  break;
    case 'weekly':      container.innerHTML = renderWeekly(y,m);      break;
    case 'monthly':     container.innerHTML = renderMonthly(y,m);     break;
    case 'salary':      container.innerHTML = renderSalary(y,m);      break;
    case 'payslip':     container.innerHTML = renderPayslip(y,m);     break;
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
          ${activeEmployees().map(emp => {
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
              <td>${s.totalActual}</td>
              <td>${s.monthOT}</td>
              <td>${s.monthMidnight}</td>
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
function attachPageEvents(page) {
  // CSV貼付イベント等はattendance.jsで定義
}

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
      <table>
        <thead>
          <tr>
            <th>No</th><th class="tl">氏名</th><th>雇用区分</th><th>店舗</th><th>部門</th>
            <th>給与形態</th><th>基本給/時給</th><th>交通費</th>
            <th>社保</th><th>税区分</th><th>入社日</th>
            ${activeTab==='inactive'?'<th>退職日</th>':''}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${showList.length===0 ? `<tr><td colspan="13" style="text-align:center;color:#999;padding:20px">データなし</td></tr>` : ''}
          ${showList.map(emp=>`
          <tr style="${emp.status==='inactive'?'opacity:0.7':''}">
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
            <td>¥${emp.commute.toLocaleString()}</td>
            <td><span class="badge ${emp.shakai==='加入'?'badge-blue':'badge-gray'}">${emp.shakai}</span></td>
            <td>${emp.tax}欄</td>
            <td>${emp.hireDate||'—'}</td>
            ${activeTab==='inactive'?`<td>${emp.leaveDate||'—'}</td>`:''}
            <td style="white-space:nowrap">
              <button class="btn-primary btn-sm" onclick="editEmployee(${emp.id})">編集</button>
              ${emp.status==='inactive'
                ? `<button class="btn-success btn-sm" onclick="reactivateEmployee(${emp.id})">復職</button>`
                : `<button class="btn-outline btn-sm" onclick="openLeaveModal(${emp.id})">退職/休業</button>`
              }
              <button class="btn-danger btn-sm" onclick="deleteEmployee(${emp.id})">完全削除</button>
            </td>
          </tr>`).join('')}
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
  const idx = employees.findIndex(e=>e.id===id);
  if (idx<0) return;
  employees[idx].status    = status;
  employees[idx].leaveDate = leaveDate;
  employees[idx].leaveNote = leaveNote;
  saveLS('employees', employees);
  closeModal();
  window._empTab = 'inactive';
  renderPage('employees');
  showToast(status==='inactive' ? '退職処理しました' : '休業処理しました');
}

function reactivateEmployee(id) {
  if (!confirm('在籍中に戻しますか？')) return;
  const idx = employees.findIndex(e=>e.id===id);
  if (idx<0) return;
  employees[idx].status    = 'active';
  employees[idx].leaveDate = '';
  employees[idx].leaveNote = '';
  saveLS('employees', employees);
  window._empTab = 'active';
  renderPage('employees');
  showToast('在籍中に戻しました');
}

function openAddEmployee() {
  const nextId = Math.max(...employees.map(e=>e.id),0) + 1;
  openModal(employeeForm({ id:nextId, name:'', kana:'', type:'パート', dept:'ホール', payType:'時給', baseSalary:0, hourlyWage:1200, commute:5000, dependents:0, shakai:'未加入', koyo:'未加入', tax:'甲', juminzei:0, store:'本店', hireDate:'', birthDate:'', status:'active' }, true));
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
        ${['正社員','パート','アルバイト','契約社員'].map(t=>`<option ${emp.type===t?'selected':''}>${t}</option>`).join('')}
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
    <div class="form-group"><label>所得税区分</label>
      <select id="ef_tax">
        ${['甲','乙'].map(t=>`<option ${emp.tax===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>住民税（月額）</label><input type="number" id="ef_juminzei" value="${emp.juminzei||0}"></div>
  </div>
  <div class="form-row">
    <div class="form-group"><label>入社日</label><input type="date" id="ef_hireDate" value="${emp.hireDate||''}"></div>
    <div class="form-group"><label>生年月日</label><input type="date" id="ef_birthDate" value="${emp.birthDate||''}"></div>
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
    id, name: get('ef_name').value, kana: get('ef_kana').value,
    type: get('ef_type').value, store: get('ef_store').value, dept: get('ef_dept').value,
    payType: get('ef_payType').value,
    baseSalary: parseInt(get('ef_baseSalary').value)||0,
    hourlyWage: parseInt(get('ef_hourlyWage').value)||0,
    commute: parseInt(get('ef_commute').value)||0,
    commuteType: document.querySelector('input[name="commuteType"]:checked')?.value || 'fixed',
    commutePerDay: parseInt(get('ef_commutePerDay').value)||0,
    positionAllowance: parseInt(get('ef_positionAllowance').value)||0,
    targetGross: parseInt(get('ef_targetGross').value)||0,
    dependents: parseInt(get('ef_dep').value)||0,
    shakai: get('ef_shakai').value, koyo: get('ef_koyo').value,
    tax: get('ef_tax').value, juminzei: parseInt(get('ef_juminzei').value)||0,
    hireDate: get('ef_hireDate').value, birthDate: get('ef_birthDate').value,
    // ステータス・退職情報を引き継ぐ
    status:    existing.status    || 'active',
    leaveDate: existing.leaveDate || '',
    leaveNote: existing.leaveNote || '',
  };
  if (!emp.name) { showToast('氏名を入力してください','error'); return; }
  if (isNew) {
    employees.push(emp);
    if (emp.hireDate) paidLeave[id] = { grants: [], used: [] };
  } else {
    const idx = employees.findIndex(e=>e.id===id);
    if (idx>=0) employees[idx] = emp;
  }
  saveLS('employees', employees);
  closeModal();
  renderPage('employees');
  showToast(isNew?'追加しました':'更新しました');
}

function deleteEmployee(id) {
  const emp = employees.find(e=>e.id===id);
  if (!confirm(`【完全削除】${emp?.name} のデータをすべて削除します。\n勤怠・給与・有給データも失われます。\nよろしいですか？`)) return;
  employees = employees.filter(e=>e.id!==id);
  saveLS('employees', employees);
  renderPage('employees');
  showToast('完全削除しました');
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
    '社保','雇保','税区分','扶養人数','住民税',
    '入社日','生年月日','状態'
  ];
  const rows = employees.map(e => [
    e.id, e.name, e.kana||'', e.type, e.store||'', e.dept||'',
    e.payType, e.baseSalary, e.hourlyWage,
    e.commuteType||'fixed', e.commute||0, e.commutePerDay||0,
    e.positionAllowance||0, e.targetGross||0,
    e.shakai, e.koyo, e.tax, e.dependents||0, e.juminzei||0,
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

  for (const line of lines) {
    // ヘッダスキップ
    if (line.startsWith('No') || line.startsWith('"No"')) continue;

    // カンマ区切り（ダブルクォート対応）
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < 6) { skipped++; continue; }

    const [
      idRaw, name, kana, type, store, dept,
      payType, baseSalaryRaw, hourlyWageRaw,
      commuteType, commuteRaw, commutePerDayRaw,
      positionAllowanceRaw, targetGrossRaw,
      shakai, koyo, tax, dependentsRaw, juminzeiRaw,
      hireDate, birthDate, status
    ] = cols;

    const id = parseInt(idRaw);
    if (!id || !name) { skipped++; continue; }

    const empData = {
      id, name, kana: kana||'', type: type||'パート',
      store: store||'本店', dept: dept||'ホール',
      payType: payType||'時給',
      baseSalary: parseInt(baseSalaryRaw)||0,
      hourlyWage: parseInt(hourlyWageRaw)||0,
      commuteType: commuteType||'fixed',
      commute: parseInt(commuteRaw)||0,
      commutePerDay: parseInt(commutePerDayRaw)||0,
      positionAllowance: parseInt(positionAllowanceRaw)||0,
      targetGross: parseInt(targetGrossRaw)||0,
      shakai: shakai||'未加入', koyo: koyo||'未加入',
      tax: tax||'甲', dependents: parseInt(dependentsRaw)||0,
      juminzei: parseInt(juminzeiRaw)||0,
      hireDate: hireDate||'', birthDate: birthDate||'',
      status: status||'active',
    };

    const idx = employees.findIndex(e => e.id === id);
    if (idx >= 0) {
      // 既存データを上書き（ステータス・退職情報は引き継ぐ）
      empData.leaveDate = employees[idx].leaveDate || '';
      empData.leaveNote = employees[idx].leaveNote || '';
      employees[idx] = empData;
      imported++;
    } else {
      // 新規追加
      empData.leaveDate = ''; empData.leaveNote = '';
      employees.push(empData);
      added++;
    }
  }

  if (imported + added === 0) {
    showToast('取込できるデータがありませんでした','error');
    return;
  }

  saveLS('employees', employees);
  hideEmpCSVImport();
  renderPage('employees');
  showToast(`更新${imported}件・追加${added}件・スキップ${skipped}件`);
}

function dlFile(name, content, type='text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\uFEFF'+content], {type}));
  a.download = name;
  a.click();
}
