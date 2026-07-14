// ============================================================
// ui.js  ―  最終的な attachPageEvents の統合（上書き）
// ============================================================

// 各モジュールが個別に attachPageEvents を定義しているため
// 最後に読み込まれるこのファイルで一元管理する

function attachPageEvents(page) {
  const y = parseInt(document.getElementById('targetYear').value);
  const m = parseInt(document.getElementById('targetMonth').value);

  switch (page) {
    case 'attendance':
      setTimeout(() => renderAttendanceTable(y, m), 50);
      break;
    case 'weekly':
      setTimeout(() => {
        const s = document.getElementById('weekEmpSel');
        if (s) renderWeekDetail(y, m);
      }, 50);
      break;
    case 'payslip':
      setTimeout(() => renderPayslipDetail(y, m), 50);
      break;
    case 'paid_leave':
      // nothing extra; the page renders fully from renderPaidLeave()
      break;
  }
}

// -------- 従業員並び替え --------
let _dragId   = null;
let _dragOver = null;

function moveEmp(id, dir) {
  const isActive = (window._empTab || 'active') === 'active';
  const list = (isActive
    ? employees.filter(e => e.status !== 'inactive' && e.status !== 'leave')
    : employees.filter(e => e.status === 'inactive' || e.status === 'leave')
  ).slice(); // コピー

  const idx = list.findIndex(e => e.id === id);
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= list.length) return;

  // order フィールドを付与して並び順を管理
  // まず現在の order を整理
  list.forEach((e, i) => { e.order = i; });

  // 入れ替え
  const tmp = list[idx].order;
  list[idx].order = list[swapIdx].order;
  list[swapIdx].order = tmp;

  // Firebaseに order フィールドだけ更新
  db.ref(`payroll/employees/${list[idx].id}/order`).set(list[idx].order);
  db.ref(`payroll/employees/${list[swapIdx].id}/order`).set(list[swapIdx].order);
}

function empDragStart(e, id) {
  _dragId = id;
  setTimeout(() => { e.currentTarget.style.opacity = '0.4'; }, 0);
  e.dataTransfer.effectAllowed = 'move';
}

function empDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const tr = e.currentTarget;
  if (_dragOver && _dragOver !== tr) {
    _dragOver.style.borderTop = '';
  }
  _dragOver = tr;
  tr.style.borderTop = '3px solid var(--accent)';
}

function empDragLeave(e) {
  e.currentTarget.style.borderTop = '';
}

function empDragEnd(e) {
  e.currentTarget.style.opacity = '';
  if (_dragOver) { _dragOver.style.borderTop = ''; _dragOver = null; }
}

function empDrop(e, targetId) {
  e.preventDefault();
  if (_dragOver) { _dragOver.style.borderTop = ''; _dragOver = null; }
  if (!_dragId || _dragId === targetId) { _dragId = null; return; }

  const fromEmp  = employees.find(emp => emp.id === _dragId);
  const toEmp    = employees.find(emp => emp.id === targetId);
  if (!fromEmp || !toEmp) { _dragId = null; return; }

  // order を入れ替え
  const tmpOrder = fromEmp.order ?? fromEmp.id * 10;
  const toOrder  = toEmp.order ?? toEmp.id * 10;
  db.ref(`payroll/employees/${fromEmp.id}/order`).set(toOrder);
  db.ref(`payroll/employees/${toEmp.id}/order`).set(tmpOrder);
  _dragId = null;
}
function toggleCommuteType() {
  const type = document.querySelector('input[name="commuteType"]:checked')?.value;
  const groups = {
    fixed:    document.getElementById('ef_commuteFixedGroup'),
    daily:    document.getElementById('ef_commuteDailyGroup'),
    distance: document.getElementById('ef_commuteDistanceGroup'),
  };
  for (const [k, el] of Object.entries(groups)) {
    if (el) el.style.display = (k === (type || 'fixed')) ? 'block' : 'none';
  }
  if (type === 'distance') updateCommuteDistanceUI();
}

// 【R8.7.14】会社（大洗町港中央9-4）から自宅までの経路をGoogleマップで開く
// 表示された距離（km）を「通勤距離」に入力する運用
function openCommuteMap() {
  const addr = document.getElementById('ef_address')?.value?.trim();
  if (!addr) { alert('先に「住所」を入力してください'); return; }
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(COMPANY_ADDRESS)}&destination=${encodeURIComponent(addr)}&travelmode=driving`;
  window.open(url, '_blank');
}

// 距離方式の試算・大洗町判定の注意書きを更新
function updateCommuteDistanceUI() {
  const note = document.getElementById('ef_commuteDistanceNote');
  if (!note) return;
  const addr = document.getElementById('ef_address')?.value || '';
  const km = parseFloat(document.getElementById('ef_commuteKm')?.value) || 0;
  if (addr.includes('大洗町')) {
    note.innerHTML = '<span style="color:#b91c1c;font-weight:700">大洗町在住のため原則不支給（¥0で計算されます）</span>';
  } else if (km > 0) {
    const perDay = Math.round(km * 2 * COMMUTE_YEN_PER_KM);
    note.textContent = `試算：${km}km×往復×${COMMUTE_YEN_PER_KM}円 = 1日 ¥${perDay.toLocaleString()} × 出勤日数（例：25日で ¥${(perDay*25).toLocaleString()}）`;
  } else {
    note.textContent = '「🗺 距離を測る」でGoogleマップの経路距離を確認し、片道kmを入力してください';
  }
}

// フォームを開いた直後に初期表示を合わせる
function initCommuteTypeDisplay() {
  const type = document.querySelector('input[name="commuteType"]:checked')?.value;
  if (type === 'daily') {
    const fixedGroup = document.getElementById('ef_commuteFixedGroup');
    const dailyGroup = document.getElementById('ef_commuteDailyGroup');
    if (fixedGroup) fixedGroup.style.display = 'none';
    if (dailyGroup) dailyGroup.style.display = 'block';
  }
}
function togglePayFields() {
  const type = document.getElementById('ef_payType')?.value;
  const baseG  = document.getElementById('ef_baseSalaryGroup');
  const hourG  = document.getElementById('ef_hourlyGroup');
  if (!baseG || !hourG) return;
  if (type === '月給') {
    baseG.style.opacity = '1';
    hourG.style.opacity = '0.4';
  } else {
    baseG.style.opacity = '0.4';
    hourG.style.opacity = '1';
  }
}

// モーダル閉じる（外側クリック）
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
