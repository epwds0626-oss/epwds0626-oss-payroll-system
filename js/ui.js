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
  const fixedGroup = document.getElementById('ef_commuteFixedGroup');
  const dailyGroup = document.getElementById('ef_commuteDailyGroup');
  if (!fixedGroup || !dailyGroup) return;
  if (type === 'daily') {
    fixedGroup.style.display = 'none';
    dailyGroup.style.display = 'block';
  } else {
    fixedGroup.style.display = 'block';
    dailyGroup.style.display = 'none';
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
