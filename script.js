const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const state = [];

const ERR_MAP = {
  firstName: '#err-first',
  lastName: '#err-last',
  email: '#err-email',
  programme: '#err-programme',
  year: '#err-year'
};

function getFormData() {
  const interests = $$('input[name="interests"]:checked').map(i => i.value);
  const yearEl = $('input[name="year"]:checked');
  return {
    id: String(Date.now()),
    firstName: $('#firstName').value.trim(),
    lastName: $('#lastName').value.trim(),
    email: $('#email').value.trim(),
    programme: $('#programme').value,
    year: yearEl ? yearEl.value : '',
    interests
  };
}

function validateAll(d) {
  const errors = {};
  if (!d.firstName) errors.firstName = 'First Name is required.';
  if (!d.lastName) errors.lastName = 'Last Name is required.';
  if (!emailRx.test(d.email)) errors.email = 'Enter a valid Email.';
  if (!d.programme) errors.programme = 'Select a programme.';
  if (!d.year) errors.year = 'Choose a Year.';
  return { ok: Object.keys(errors).length === 0, errors };
}

function showErrors(errors) {
  Object.entries(ERR_MAP).forEach(([field, sel]) => {
    const el = $(sel);
    if (el) el.textContent = errors[field] || '';
  });
}

function focusFirstInvalid(errors) {
  for (const field of Object.keys(ERR_MAP)) {
    if (errors[field]) {
      const input =
        document.getElementById(field) ||
        document.querySelector(`[name="${field}"]`);
      if (input) input.focus();
      break;
    }
  }
}

function renderCard(s) {
  const card = document.createElement('div');
  card.className = 'card-person';
  card.dataset.id = s.id;
  card.innerHTML = `
    <div>
      <h3>${s.firstName} ${s.lastName}</h3>
      <p><span class="badge">${s.programme}</span> <span class="badge">Year ${s.year}</span></p>
      <p class="muted">${(s.interests || []).join(', ')}</p>
    </div>
    <button class="btn-remove" aria-label="Remove profile for ${s.firstName} ${s.lastName}">Remove</button>
  `;
  $('#cards').prepend(card);
}

function renderRow(s) {
  const tr = document.createElement('tr');
  tr.dataset.id = s.id;
  tr.innerHTML = `
    <td>${s.firstName} ${s.lastName}</td>
    <td>${s.programme}</td>
    <td>${s.year}</td>
    <td>${(s.interests || []).join(', ')}</td>
    <td><button class="btn-remove" aria-label="Remove row for ${s.firstName} ${s.lastName}">Remove</button></td>
  `;
  $('#summary tbody').prepend(tr);
}

function removeById(id) {
  document.querySelector(`#cards [data-id="${id}"]`)?.remove();
  document.querySelector(`#summary tbody tr[data-id="${id}"]`)?.remove();
}

function save() { localStorage.setItem('students', JSON.stringify(state)); }
function load() { return JSON.parse(localStorage.getItem('students') || '[]'); }

function normalizeLegacy(s) {
  if ('first' in s && !('firstName' in s)) {
    return {
      id: s.id,
      firstName: s.first,
      lastName: s.last,
      email: s.email,
      programme: s.prog,
      year: s.year,
      interests: s.interests
    };
  }
  return s;
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = load().map(normalizeLegacy);
  saved.forEach(s => { state.push(s); renderCard(s); renderRow(s); });

  $('#regForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getFormData();
    const res = validateAll(data);
    if (!res.ok) {
      showErrors(res.errors);
      $('#live').textContent = 'Fix errors before submitting.';
      focusFirstInvalid(res.errors);
      return;
    }
    showErrors({});
    state.push(data);
    renderCard(data);
    renderRow(data);
    save();
    e.target.reset();
    $('#live').textContent = 'Profile added.';
  });

  document.body.addEventListener('click', (e) => {
    if (!e.target.matches('.btn-remove')) return;
    const host = e.target.closest('[data-id]');
    const id = host?.dataset.id;
    if (!id) return;
    const idx = state.findIndex(s => s.id === id);
    if (idx > -1) state.splice(idx, 1);
    removeById(id);
    save();
    $('#live').textContent = 'Profile removed.';
  });

  $('#q')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const match = (s) =>
      (`${s.firstName} ${s.lastName} ${s.programme} ${(s.interests || []).join(' ')}`)
        .toLowerCase()
        .includes(term);

    $$('#cards .card-person').forEach(card => {
      const s = state.find(x => x.id === card.dataset.id);
      card.style.display = s && match(s) ? '' : 'none';
    });
    $$('#summary tbody tr').forEach(row => {
      const s = state.find(x => x.id === row.dataset.id);
      row.style.display = s && match(s) ? '' : 'none';
    });
  });
});