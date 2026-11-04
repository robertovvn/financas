'use strict';
/* ===================== Dados ===================== */
const KEY = 'financas.v1';
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);

const COLORS = ['#a5d8dd','#f8b894','#d9b8f0','#fbd96a','#f7a8a8','#7a3e0b','#b9e4a8','#9cd0f0','#d4d4d8','#1d4ed8','#047857','#b91c1c','#6366f1','#ec4899','#64748b'];
const DEFAULT_AREAS = [
  ['Moradia', ['Financiamento','Conta de luz','Conta de água','Internet','Faxina']],
  ['Alimentação', ['Compras do mês','Bebidas','Café da manhã','Almoço','Lanche','Jantar']],
  ['Lazer', ['Cinema','Show','Barzinho','Jogos','Games']],
  ['Serviços', ['YouTube','Crunchyroll','Celular','iCloud']],
  ['Saúde', ['Farmácia','Dentista','Plano de saúde']],
  ['Pet', ['Petiscos','Ração','Brinquedos','Veterinário','Pet shop']],
  ['Esportes', ['Academia','Pelada']],
  ['Transporte', ['Táxi','Uber','99 táxi','Ônibus','Gasolina','Mecânico','Lava jato','Troca de óleo']],
  ['Vestuário', ['Roupas','Calçados']],
  ['Viagens', ['Passagem','Acomodação']],
  ['Investimentos', ['Aporte']],
  ['Descontos', ['INSS','Contador','Tarifas bancárias']],
  ['Educação', ['Cursos','Livros']],
  ['Presentes e doações', ['Presentes','Doações']],
  ['Outros', ['Outros']],
];

function defaults() {
  return {
    version: 1,
    accounts: [
      { id: 'sicoob', name: 'Sicoob', type: 'corrente', initial: 0 },
      { id: 'dinheiro', name: 'Dinheiro em casa', type: 'dinheiro', initial: 0 },
      { id: 'nubank', name: 'Nubank (cartão)', type: 'cartao', initial: 0, closeDay: 4, dueDay: 11 },
    ],
    areas: DEFAULT_AREAS.map(([name, types], i) => ({
      id: uid(), name, color: COLORS[i % COLORS.length], budget: 0,
      types: types.map(t => ({ id: uid(), name: t })),
    })),
    incomeCats: [
      { id: uid(), name: 'Salário', taxed: true },
      { id: uid(), name: 'VR', taxed: false },
      { id: uid(), name: 'VT', taxed: false },
      { id: uid(), name: 'Freela', taxed: true },
      { id: uid(), name: 'Investimentos', taxed: false },
    ],
    taxes: [
      { id: uid(), name: 'IRPJ', rate: 0 }, { id: uid(), name: 'CSLL', rate: 0 },
      { id: uid(), name: 'COFINS', rate: 0 }, { id: uid(), name: 'PIS', rate: 0 },
      { id: uid(), name: 'INSS', rate: 0 }, { id: uid(), name: 'ISS', rate: 0 },
    ],
    tx: [], fixed: [], goals: [], investments: [],
    generated: {},
  };
}

const AREA_ICONS = { 'Moradia':'🏠','Alimentação':'🍽️','Lazer':'🎉','Serviços':'📺','Saúde':'💊','Pet':'🐾','Esportes':'⚽','Transporte':'🚗','Vestuário':'👕','Viagens':'✈️','Investimentos':'📈','Descontos':'🧾','Educação':'📚','Presentes e doações':'🎁','Outros':'📦' };
const TYPE_ICONS = { 'Financiamento':'🏠','Conta de luz':'💡','Conta de água':'🚿','Internet':'🌐','Faxina':'🧹','Compras do mês':'🛒','Bebidas':'🍺','Café da manhã':'☕','Almoço':'🍛','Lanche':'🥪','Jantar':'🍝',
  'Cinema':'🎬','Show':'🎤','Barzinho':'🍻','Jogos':'🃏','Games':'🎮','YouTube':'▶️','Crunchyroll':'🍥','Celular':'📱','iCloud':'☁️','Farmácia':'💊','Dentista':'🦷','Plano de saúde':'🩺',
  'Petiscos':'🦴','Ração':'🥣','Brinquedos':'🧸','Veterinário':'🩺','Pet shop':'🛁','Academia':'🏋️','Pelada':'⚽','Táxi':'🚕','Uber':'🚘','99 táxi':'🚖','Ônibus':'🚌','Gasolina':'⛽','Mecânico':'🔧',
  'Lava jato':'🧽','Troca de óleo':'🛢️','Roupas':'👕','Calçados':'👟','Passagem':'🎫','Acomodação':'🏨','Aporte':'📈','INSS':'🏛️','Contador':'🧮','Tarifas bancárias':'🏦','Cursos':'🎓','Livros':'📖','Presentes':'🎁','Doações':'🤝' };
const INC_ICONS = { 'Salário':'💼','VR':'🍴','VT':'🚌','Freela':'💻','Investimentos':'📈' };
const ACC_ICONS = { corrente:'🏦', dinheiro:'💵', cartao:'💳', bloqueado:'🔒' };
const APP_VERSION = '7';
const ACC_TYPES = { corrente: 'Conta', dinheiro: 'Dinheiro', cartao: 'Cartão de crédito', bloqueado: 'Saldo bloqueado' };
const spendable = a => a.type !== 'bloqueado';
const ACC_COLORS = { sicoob:'#0b7a5c', dinheiro:'#16a34a', nubank:'#820ad1' };
const ICON_CHOICES = ['🔒','⚖️','🏠','🍽️','🛒','☕','🍛','🍔','🍕','🍺','🍻','🎉','🎬','🎤','🎮','🃏','📺','▶️','📱','☁️','💻','💊','🦷','🩺','🏥','🐾','🦴','🐶','🐱','⚽','🏋️','🚗','🚕','🚌','⛽','🔧','✈️','🏨','🎫','👕','👟','👜','💇','💄','📚','🎓','🎁','🤝','🧾','🏛️','🧮','🏦','💳','💵','💰','💼','📈','🪙','💡','🚿','🌐','🧹','🛠️','👶','❤️','⭐','📦','🏷️'];
function migrate() {
  for (const a of S.areas) { a.icon = a.icon || AREA_ICONS[a.name] || '🏷️'; for (const t of a.types) if (t.icon === undefined) t.icon = TYPE_ICONS[t.name] || ''; }
  for (const a of S.accounts) { a.icon = a.icon || ACC_ICONS[a.type] || '🏦'; a.color = a.color || ACC_COLORS[a.id] || '#64748b'; }
  for (const c of S.incomeCats) c.icon = c.icon || INC_ICONS[c.name] || '💰';
  for (const a of S.accounts) a.parts = a.parts || [];
  // As contas "FGTS" e "Transferência judicial" soltas viraram partes bloqueadas dentro de cada conta.
  // Remove as que o app criou sozinho, se ainda estiverem vazias.
  if (!S.partsMigrated) {
    S.accounts = S.accounts.filter(a => !(['fgts', 'judicial'].includes(a.id) && !a.initial && !S.tx.some(t => t.accountId === a.id)));
    S.partsMigrated = true;
  }
}

let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || !S.version) S = defaults();
  for (const k of ['tx','fixed','goals','investments']) S[k] = S[k] || [];
  S.generated = S.generated || {};
  migrate(); save();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('Não consegui salvar: ' + e.message); }
}

/* ===================== Utilidades ===================== */
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const money = v => BRL.format(v || 0);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const mkOf = date => date.slice(0, 7);
function addMonths(mk, n) { let [y, m] = mk.split('-').map(Number); m += n; y += Math.floor((m - 1) / 12); m = ((m - 1) % 12 + 12) % 12 + 1; return `${y}-${pad(m)}`; }
function dateAddMonths(date, n) {
  const mk = addMonths(mkOf(date), n); const [y, m] = mk.split('-').map(Number);
  const last = new Date(y, m, 0).getDate(); return `${mk}-${pad(Math.min(+date.slice(8), last))}`;
}
const MONTHS = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const monthName = mk => `${MONTHS[+mk.slice(5) - 1]} ${mk.slice(0, 4)}`;
const fmtDate = d => `${d.slice(8)}/${d.slice(5, 7)}`;
function parseMoney(s) {
  s = String(s).trim().replace(/[R$\s]/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ''); // 10.000 = dez mil
  const v = parseFloat(s); return isNaN(v) ? 0 : Math.round(v * 100) / 100;
}
const moneyInput = v => v ? String(v.toFixed(2)).replace('.', ',') : '';
const acc = id => S.accounts.find(a => a.id === id);
const area = id => S.areas.find(a => a.id === id);
const typeName = (aId, tId) => area(aId)?.types.find(t => t.id === tId)?.name || '';
const incomeCat = id => S.incomeCats.find(c => c.id === id);
const taxRate = () => S.taxes.reduce((s, t) => s + (+t.rate || 0), 0);
const typeOf = (aId, tId) => area(aId)?.types.find(t => t.id === tId);
const av = (icon, color) => `<span class="av" style="background:${color}33;border-color:${color}">${icon || '•'}</span>`;
const accTag = a => a ? `<span class="acc" style="color:${a.color}">${a.icon} ${esc(a.name)}</span>` : '';
const sum = (arr, f) => arr.reduce((s, x) => s + (f(x) || 0), 0);

function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hidden'), 2200); }

/* ===================== Regras ===================== */
// Fatura: compra antes do dia de fechamento cai na fatura deste mês; no dia ou depois, na do mês seguinte.
function billKey(t) {
  const a = acc(t.accountId); if (!a || a.type !== 'cartao') return null;
  return +t.date.slice(8) < (a.closeDay || 1) ? mkOf(t.date) : addMonths(mkOf(t.date), 1);
}
function dueDate(a, bk) { return a.dueDay >= a.closeDay ? `${bk}-${pad(a.dueDay)}` : `${addMonths(bk, 1)}-${pad(a.dueDay)}`; }

function balance(a, upTo = '9999-12-31') {
  let b = +a.initial || 0;
  for (const t of S.tx) {
    if (t.date > upTo) continue;
    if (t.kind === 'receita' && t.accountId === a.id) b += t.net;
    if (t.kind === 'despesa' && t.accountId === a.id) { if (a.type === 'cartao' || t.paid) b -= t.amount; }
    if (t.kind === 'transferencia') { if (t.from === a.id) b -= t.amount; if (t.to === a.id) b += t.amount; }
    if (t.kind === 'fatura') { if (t.accountId === a.id) b -= t.amount; if (t.cardId === a.id) b += t.amount; }
    if (t.kind === 'ajuste' && t.accountId === a.id) b += t.amount; // partes bloqueadas somam por fora do saldo livre
  }
  return b;
}
const partBal = (a, p, upTo = '9999-12-31') => sum(S.tx.filter(t => t.kind === 'ajuste' && t.accountId === a.id && t.sub === p.id && t.date <= upTo), t => t.amount);
const blockedOf = a => !spendable(a) ? balance(a) : sum(a.parts || [], p => partBal(a, p));
const freeOf = a => balance(a) - blockedOf(a);
const patrimonio = (upTo) => sum(S.accounts.filter(a => !a.archived), a => balance(a, upTo));

function monthSummary(mk) {
  const txs = S.tx.filter(t => mkOf(t.date) === mk);
  const rec = txs.filter(t => t.kind === 'receita');
  const bruto = sum(rec, t => t.gross), liquido = sum(rec, t => t.net);
  const despesas = sum(txs.filter(t => t.kind === 'despesa'), t => t.amount);
  return { bruto, impostos: bruto - liquido, liquido, despesas, sobra: liquido - despesas };
}

function generateFixed(mk) {
  S.generated[mk] = S.generated[mk] || [];
  let n = 0;
  for (const f of S.fixed) {
    if (!f.active || S.generated[mk].includes(f.id)) continue;
    if (f.start && mk < f.start) continue;
    const [y, m] = mk.split('-').map(Number); const last = new Date(y, m, 0).getDate();
    S.tx.push({ id: uid(), kind: 'despesa', date: `${mk}-${pad(Math.min(f.day || 1, last))}`, amount: f.amount,
      areaId: f.areaId, typeId: f.typeId, accountId: f.accountId, nature: 'fixa', paid: false, desc: f.desc, fixedId: f.id });
    S.generated[mk].push(f.id); n++;
  }
  if (n) save();
}

/* ===================== Navegação ===================== */
let tab = 'inicio', sub = null, curMonth = mkOf(today()), filterArea = '';
const TITLES = { inicio: 'Início', mes: 'Mês', fixos: 'Gastos fixos', mais: 'Mais', ano: 'Ano', metas: 'Metas', invest: 'Investimentos', ajustes: 'Ajustes', faturas: 'Faturas' };
function go(t, s = null) { tab = t; sub = s; render(); window.scrollTo(0, 0); }
function render() {
  generateFixed(mkOf(today()));
  const page = sub || tab;
  document.getElementById('title').textContent = TITLES[page];
  document.querySelectorAll('.tabbar [data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('view').innerHTML = VIEWS[page]();
}

/* ===================== Telas ===================== */
const VIEWS = {};
function txRow(t) {
  let left, right, cls = 'neg', badges = '';
  if (t.kind === 'despesa') {
    const a = area(t.areaId);
    left = av(typeOf(t.areaId, t.typeId)?.icon || a?.icon, a?.color || '#94a3b8');
    const label = t.desc || typeName(t.areaId, t.typeId) || a?.name || 'Despesa';
    const parc = t.inst ? ` ${t.inst.n}/${t.inst.total}` : '';
    if (acc(t.accountId)?.type === 'cartao') badges += `<span class="badge card">${t.paid ? 'fatura paga' : 'fatura'}</span> `;
    else if (!t.paid) badges += `<span class="badge pend">pendente</span> `;
    return `<div class="row" data-action="editar" data-id="${t.id}">${left}<div class="l"><div class="t">${esc(label)}${parc}</div>
      <div class="sub">${fmtDate(t.date)} · ${esc(a?.name || '')}${t.typeId ? ' › ' + esc(typeName(t.areaId, t.typeId)) : ''}</div><div class="sub">${accTag(acc(t.accountId))}</div></div>
      <div style="text-align:right"><div class="${cls}">-${money(t.amount)}</div>${badges}</div></div>`;
  }
  if (t.kind === 'receita') {
    return `<div class="row" data-action="editar" data-id="${t.id}">${av(incomeCat(t.catId)?.icon || '💰', '#16a34a')}<div class="l"><div class="t">${esc(t.desc || incomeCat(t.catId)?.name || 'Receita')}</div>
      <div class="sub">${fmtDate(t.date)} · ${esc(incomeCat(t.catId)?.name || '')}${t.gross !== t.net ? ' · bruto ' + money(t.gross) : ''}</div><div class="sub">${accTag(acc(t.accountId))}</div></div>
      <div class="pos">+${money(t.net)}</div></div>`;
  }
  if (t.kind === 'transferencia') {
    return `<div class="row" data-action="editar" data-id="${t.id}">${av('🔄', '#64748b')}<div class="l"><div class="t">${esc(t.desc || 'Transferência')}</div>
      <div class="sub">${fmtDate(t.date)} · ${esc(acc(t.from)?.name)} → ${esc(acc(t.to)?.name)}</div></div><div class="sub">${money(t.amount)}</div></div>`;
  }
  if (t.kind === 'ajuste') {
    const a = acc(t.accountId);
    return `<div class="row" data-action="editar" data-id="${t.id}">${av(a?.icon || '🔒', a?.color || '#64748b')}<div class="l"><div class="t">${t.sub ? '🔒 ' + esc(a?.parts.find(p => p.id === t.sub)?.name || 'Parte bloqueada') : 'Atualização de saldo'}</div>
      <div class="sub">${fmtDate(t.date)} · ${accTag(a)}</div></div><div class="sub ${t.amount < 0 ? 'neg' : 'pos'}">${t.amount < 0 ? '' : '+'}${money(t.amount)}</div></div>`;
  }
  return `<div class="row" data-action="editar" data-id="${t.id}">${av('✅', acc(t.cardId)?.color || '#8b5cf6')}<div class="l"><div class="t">Pagamento de fatura</div>
    <div class="sub">${fmtDate(t.date)} · ${esc(acc(t.cardId)?.name)} · de ${esc(acc(t.accountId)?.name)}</div></div><div class="sub">${money(t.amount)}</div></div>`;
}

function billsOf(card) {
  const bills = {};
  for (const t of S.tx) if (t.kind === 'despesa' && t.accountId === card.id) {
    const k = billKey(t); bills[k] = bills[k] || { key: k, total: 0, open: 0, items: [] };
    bills[k].total += t.amount; if (!t.paid) bills[k].open += t.amount; bills[k].items.push(t);
  }
  return Object.values(bills).sort((a, b) => a.key.localeCompare(b.key));
}

VIEWS.inicio = () => {
  const mk = mkOf(today()), s = monthSummary(mk);
  const accs = S.accounts.filter(a => !a.archived);
  const livres = accs.filter(spendable), bloqAccs = accs.filter(a => !spendable(a));
  const blocked = [...accs.filter(spendable).flatMap(a => (a.parts || []).map(p => ({ icon: p.icon, name: p.name, where: a.name, color: a.color, v: partBal(a, p), acc: a.id, p: p.id }))),
    ...bloqAccs.map(a => ({ icon: a.icon, name: a.name, where: '', color: a.color, v: balance(a), acc: a.id, p: '' }))];
  const accRow = a => { const bl = blockedOf(a), fr = freeOf(a);
    return `<div class="row">${av(a.icon, a.color)}<div class="l">${esc(a.name)}${bl ? `<div class="sub">+ 🔒 ${money(bl)} bloqueado</div>` : ''}</div><div class="${fr < 0 ? 'neg' : ''}">${money(fr)}</div></div>`; };
  let h = `<div class="card"><h2>Patrimônio total</h2><div class="big">${money(patrimonio())}</div>
    ${blocked.length ? `<div class="sub" style="margin:10px 0 2px;font-weight:600">DISPONÍVEL · ${money(sum(livres, freeOf))}</div>` : ''}${livres.map(accRow).join('')}
    ${blocked.length ? `<div class="sub" style="margin:14px 0 2px;font-weight:600">🔒 BLOQUEADO · ${money(sum(blocked, b => b.v))}</div>
      ${blocked.map(b => `<div class="row" data-action="parte-valor" data-id="${b.acc}" data-p="${b.p}">${av(b.icon, b.color)}<div class="l">${esc(b.name)}${b.where ? `<div class="sub">${esc(b.where)}</div>` : ''}</div><div>${money(b.v)} <span class="sub">✎</span></div></div>`).join('')}
      <button class="link" data-action="ajustar">Atualizar saldos bloqueados →</button>` : ''}</div>`;
  h += `<div class="card"><h2>${monthName(mk)}</h2><div class="grid3">
    <div><span class="sub">Receita líquida</span><b class="pos">${money(s.liquido)}</b></div>
    <div><span class="sub">Despesas</span><b class="neg">${money(s.despesas)}</b></div>
    <div><span class="sub">Sobra</span><b class="${s.sobra < 0 ? 'neg' : ''}">${money(s.sobra)}</b></div></div>
    ${budgetBlock(mk, true)}
    <button class="link" data-tab="mes">Ver o mês →</button></div>`;
  for (const card of accs.filter(a => a.type === 'cartao')) {
    const cur = billKey({ accountId: card.id, date: today() });
    const bills = billsOf(card).filter(b => b.open > 0.004 && b.key <= cur);
    const next = sum(billsOf(card).filter(b => b.key > cur), b => b.open);
    h += `<div class="card" style="border-left:4px solid ${card.color}"><h2>${card.icon} ${esc(card.name)}</h2>`;
    if (!bills.length) h += `<div class="sub">Nenhuma fatura em aberto.</div>`;
    for (const b of bills) {
      h += `<div class="row"><div class="l"><div>Fatura de ${monthName(b.key)}</div><div class="sub">${b.key === cur ? 'aberta, fecha dia ' + card.closeDay : 'fechada'} · vence ${fmtDate(dueDate(card, b.key))}</div></div>
        <div style="text-align:right"><b>${money(b.open)}</b><br><button class="btn small sec" data-action="pagar" data-card="${card.id}" data-bill="${b.key}">Pagar</button></div></div>`;
    }
    if (next > 0) h += `<div class="sub" style="margin-top:6px">Parcelas em próximas faturas: ${money(next)}</div>`;
    h += `<button class="link" data-action="faturas" data-card="${card.id}">Ver todas as faturas →</button></div>`;
  }
  const pend = S.tx.filter(t => t.kind === 'despesa' && !t.paid && acc(t.accountId)?.type !== 'cartao' && t.date <= `${mk}-31`).sort((a, b) => a.date.localeCompare(b.date));
  if (pend.length) h += `<div class="card"><h2>Contas a pagar</h2>${pend.map(txRow).join('')}</div>`;
  if (S.goals.length) h += `<div class="card"><h2>Metas</h2>${S.goals.map(goalRow).join('')}</div>`;
  if (!S.tx.length) h += `<div class="card"><h2>Comece por aqui</h2><div class="sub">0. Em <b>Mais › Ajustes › Privacidade</b>, ative a senha.<br>1. Em <b>Mais › Ajustes › Contas</b>, coloque o saldo atual do Sicoob e do dinheiro em casa.<br>2. Em <b>Mais › Ajustes › Impostos</b>, coloque as alíquotas da nota.<br>3. Cadastre as assinaturas em <b>Fixos</b>.<br>4. Toque em <b>+</b> para lançar gastos e receitas.</div></div>`;
  return h;
};

function budgetBlock(mk, onlyBudgeted) {
  const txs = S.tx.filter(t => t.kind === 'despesa' && mkOf(t.date) === mk);
  const rows = S.areas.map(a => ({ a, spent: sum(txs.filter(t => t.areaId === a.id), t => t.amount) }))
    .filter(r => onlyBudgeted ? r.a.budget > 0 : (r.spent > 0 || r.a.budget > 0))
    .sort((x, y) => y.spent - x.spent);
  if (!rows.length) return onlyBudgeted ? '' : `<div class="empty">Nenhum gasto neste mês.</div>`;
  return rows.map(({ a, spent }) => {
    const pct = a.budget ? Math.min(100, spent / a.budget * 100) : 0;
    return `<div style="margin:10px 0"><div style="display:flex;justify-content:space-between"><span>${a.icon} ${esc(a.name)}</span>
      <span class="${a.budget && spent > a.budget ? 'neg' : ''}">${money(spent)}${a.budget ? ' <span class="sub">de ' + money(a.budget) + '</span>' : ''}</span></div>
      ${a.budget ? `<div class="bar ${spent > a.budget ? 'over' : ''}"><i style="width:${pct}%"></i></div>` : ''}</div>`;
  }).join('');
}

VIEWS.mes = () => {
  const mk = curMonth, s = monthSummary(mk);
  let txs = S.tx.filter(t => mkOf(t.date) === mk);
  if (filterArea) txs = txs.filter(t => t.areaId === filterArea);
  txs.sort((a, b) => b.date.localeCompare(a.date));
  return `<div class="monthnav"><button class="icon-btn" data-action="mes-ant">‹</button><b>${monthName(mk)}</b><button class="icon-btn" data-action="mes-prox">›</button></div>
  <div class="card"><div class="row"><div class="l">Receita bruta</div><div>${money(s.bruto)}</div></div>
    <div class="row"><div class="l">Impostos</div><div class="neg">-${money(s.impostos)}</div></div>
    <div class="row"><div class="l">Receita líquida</div><div class="pos">${money(s.liquido)}</div></div>
    <div class="row"><div class="l">Despesas</div><div class="neg">-${money(s.despesas)}</div></div>
    <div class="row"><div class="l"><b>Sobra</b></div><b class="${s.sobra < 0 ? 'neg' : 'pos'}">${money(s.sobra)}</b></div></div>
  <div class="card"><h2>Por área</h2>${budgetBlock(mk, false)}</div>
  <div class="card"><h2>Lançamentos</h2>
    <select data-change="filtro"><option value="">Todas as áreas</option>${S.areas.map(a => `<option value="${a.id}" ${a.id === filterArea ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select>
    ${txs.length ? txs.map(txRow).join('') : '<div class="empty">Nada lançado.</div>'}</div>`;
};

VIEWS.fixos = () => {
  const mk = mkOf(today());
  const rows = S.fixed.map(f => {
    const t = S.tx.find(x => x.fixedId === f.id && mkOf(x.date) === mk);
    const st = !f.active ? '<span class="badge">pausado</span>' : t ? (t.paid || acc(t.accountId)?.type === 'cartao' ? '<span class="badge">lançado</span>' : '<span class="badge pend">pendente</span>') : '';
    return `<div class="row" data-action="fixo" data-id="${f.id}">${av(typeOf(f.areaId, f.typeId)?.icon || area(f.areaId)?.icon, area(f.areaId)?.color || '#94a3b8')}
      <div class="l"><div class="t">${esc(f.desc)}</div><div class="sub">todo dia ${f.day} · ${accTag(acc(f.accountId))}</div></div>
      <div style="text-align:right">${money(f.amount)}<br>${st}</div></div>`;
  }).join('');
  const total = sum(S.fixed.filter(f => f.active), f => f.amount);
  return `<div class="card"><h2>Assinaturas e contas fixas</h2>${rows || '<div class="empty">Nenhum gasto fixo ainda.</div>'}
    ${S.fixed.length ? `<div class="row"><b>Total por mês</b><b>${money(total)}</b></div>` : ''}
    <button class="btn full" data-action="fixo">+ Novo gasto fixo</button></div>
    <p class="hint">Todo mês o app lança sozinho cada gasto fixo ativo. Toque em um item para editar, pausar ou excluir.</p>`;
};

VIEWS.mais = () => `<div class="card menu">
  ${[['ano','📊','Ano','Sobra e patrimônio mês a mês'],['metas','🎯','Metas','Entrada, reserva e outros objetivos'],['invest','📈','Investimentos','Renda fixa e variável'],['ajustes','⚙️','Ajustes','Categorias, contas, impostos e backup']]
    .map(([k, i, t, d]) => `<div class="row" data-go="${k}"><span style="font-size:22px">${i}</span><div class="l"><div>${t}</div><div class="sub">${d}</div></div><span class="sub">›</span></div>`).join('')}</div>`;

const NUM = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const num = v => NUM.format(Math.round(v || 0));
VIEWS.ano = () => {
  const y = curMonth.slice(0, 4); const meta = sum(S.goals, g => +g.monthly || 0);
  const first = S.tx.length ? S.tx.reduce((m, t) => t.date < m ? t.date : m, '9999').slice(0, 7) : null;
  let rows = '', tot = { l: 0, d: 0 };
  for (let m = 1; m <= 12; m++) {
    const mk = `${y}-${pad(m)}`, s = monthSummary(mk); tot.l += s.liquido; tot.d += s.despesas;
    const show = first && mk >= first && mk <= mkOf(today());
    rows += `<tr><td style="text-transform:capitalize">${MONTHS[m - 1].slice(0, 3)}</td><td>${num(s.liquido)}</td><td>${num(s.despesas)}</td>
      <td class="${s.sobra < 0 ? 'neg' : ''}">${num(s.sobra)}</td><td>${show ? num(patrimonio(`${mk}-31`)) : ''}</td>
      ${meta ? `<td>${show && (s.liquido || s.despesas) ? (s.sobra >= meta ? '✅' : '❌') : ''}</td>` : ''}</tr>`;
  }
  return `<div class="monthnav"><button class="icon-btn" data-action="ano-ant">‹</button><b>${y}</b><button class="icon-btn" data-action="ano-prox">›</button></div>
  <div class="card"><table><tr><th>Mês</th><th>Receita</th><th>Despesa</th><th>Sobra</th><th>Patrim.</th>${meta ? '<th>Meta</th>' : ''}</tr>${rows}
  <tr><th>Total</th><th>${num(tot.l)}</th><th>${num(tot.d)}</th><th>${num(tot.l - tot.d)}</th><th></th>${meta ? '<th></th>' : ''}</tr></table>
  <p class="hint">Valores em reais, sem centavos.${meta ? ` Meta atingida = sobra do mês maior ou igual a ${money(meta)} (soma do valor mensal das metas).` : ''}</p></div>
  <p class="hint">Gráficos chegam no próximo passo.</p>`;
};

function goalRow(g) {
  const pct = g.target ? Math.min(100, (g.saved || 0) / g.target * 100) : 0;
  return `<div style="margin:10px 0" data-action="meta" data-id="${g.id}"><div style="display:flex;justify-content:space-between"><span>${esc(g.name)}</span>
    <span>${money(g.saved)} <span class="sub">de ${money(g.target)}</span></span></div><div class="bar"><i style="width:${pct}%"></i></div>
    <div class="sub">${pct.toFixed(0)}%${g.monthly ? ' · guardar ' + money(g.monthly) + '/mês' : ''}</div></div>`;
}
VIEWS.metas = () => `<div class="card">${S.goals.length ? S.goals.map(goalRow).join('') : '<div class="empty">Nenhuma meta ainda. Exemplo: Entrada R$ 70.000, Reserva R$ 18.000.</div>'}
  <button class="btn full" data-action="meta">+ Nova meta</button></div><p class="hint">Toque numa meta para guardar dinheiro nela, editar ou excluir.</p>`;

const INV_TYPES = { 'Renda fixa': ['CDB','LCI','LCA','Tesouro','Poupança'], 'Renda variável': ['Ações','FII','ETF','Cripto','Fundos'] };
VIEWS.invest = () => {
  const inv = S.investments;
  const tot = sum(inv, i => i.invested), cur = sum(inv, i => i.current);
  let h = `<div class="card"><h2>Total investido</h2><div class="big">${money(cur)}</div><div class="sub">Aplicado ${money(tot)} · rendimento <span class="${cur - tot < 0 ? 'neg' : 'pos'}">${money(cur - tot)}</span></div></div>`;
  for (const cls of Object.keys(INV_TYPES)) {
    const list = inv.filter(i => i.cls === cls);
    h += `<div class="card"><h2>${cls}</h2>${list.length ? list.map(i => `<div class="row" data-action="invest" data-id="${i.id}"><div class="l"><div>${esc(i.name)}</div><div class="sub">${esc(i.kind)} · aplicado ${money(i.invested)}</div></div>
      <div style="text-align:right">${money(i.current)}<div class="sub ${i.current - i.invested < 0 ? 'neg' : 'pos'}">${money(i.current - i.invested)}</div></div></div>`).join('') : `<div class="sub">${INV_TYPES[cls].join(', ')}</div>`}</div>`;
  }
  return h + `<button class="btn full" data-action="invest">+ Novo investimento</button>
    <details class="card"><summary><b>O que é cada um?</b></summary><p class="sub"><b>CDB</b>: empréstimo ao banco, que paga juros; costuma render 100% do CDI ou mais; garantia do FGC até R$ 250 mil.<br>
    <b>CDI</b>: taxa de referência entre bancos, base para calcular o rendimento de CDB, LCI e LCA.<br><b>LCI/LCA</b>: empréstimo ao setor imobiliário/agro; isentas de IR para pessoa física.<br>
    <b>Tesouro</b>: títulos do governo.<br><b>Ações</b>: parte de uma empresa; ganha com valorização e dividendos.<br><b>FII</b>: cotas de fundos de imóveis; pagam aluguéis mensais.<br>
    <b>ETF</b>: fundo que segue um índice, como o Ibovespa.<br><b>Cripto</b>: Bitcoin, Ethereum etc.; muito voláteis.</p></details>`;
};

VIEWS.faturas = () => {
  const card = acc(sub_card); if (!card) return '';
  const bills = billsOf(card).reverse();
  return `<div class="card"><h2>${esc(card.name)}</h2><div class="sub">Fecha dia ${card.closeDay}, vence dia ${card.dueDay}</div></div>` +
    (bills.length ? bills.map(b => `<div class="card"><div class="row"><div class="l"><b>Fatura de ${monthName(b.key)}</b><div class="sub">vence ${fmtDate(dueDate(card, b.key))}</div></div>
      <div style="text-align:right"><b>${money(b.total)}</b><div class="sub">${b.open > 0.004 ? 'em aberto ' + money(b.open) : 'paga'}</div></div></div>
      ${b.items.sort((x, y) => x.date.localeCompare(y.date)).map(txRow).join('')}</div>`).join('') : '<div class="empty">Nenhuma compra no cartão.</div>');
};
let sub_card = null;

VIEWS.ajustes = () => {
  const areas = S.areas.map((a, i) => `<div class="card"><div style="display:flex;align-items:center;gap:8px">
      ${av(a.icon, a.color)}<b style="flex:1">${esc(a.name)}</b>
      <button class="icon-btn" data-action="area-up" data-id="${a.id}" ${i ? '' : 'disabled'}>↑</button>
      <button class="icon-btn" data-action="area-edit" data-id="${a.id}">✎</button>
      <button class="icon-btn" data-action="area-del" data-id="${a.id}">🗑</button></div>
    <label>Orçamento mensal (opcional)</label><input inputmode="decimal" placeholder="R$ 0,00" value="${moneyInput(a.budget)}" data-change="area-orc" data-id="${a.id}">
    <div class="chips">${a.types.map(t => `<span class="chip" data-action="tipo-edit" data-id="${a.id}" data-t="${t.id}">${t.icon ? t.icon + ' ' : ''}${esc(t.name)}<button data-action="tipo-del" data-id="${a.id}" data-t="${t.id}">×</button></span>`).join('')}
      <button class="btn small sec" data-action="tipo-add" data-id="${a.id}">+ tipo</button></div></div>`).join('');
  const accs = S.accounts.map(a => `<div class="row" data-action="conta" data-id="${a.id}">${av(a.icon, a.color)}<div class="l"><div>${esc(a.name)}${a.archived ? ' <span class="badge">arquivada</span>' : ''}</div>
    <div class="sub">${ACC_TYPES[a.type]} · saldo inicial ${money(a.initial)}</div></div><span class="sub">›</span></div>`).join('');
  const inc = S.incomeCats.map(c => `<div class="row"><span data-action="inc-edit" data-id="${c.id}" style="display:flex;align-items:center;gap:8px;flex:1;cursor:pointer">${av(c.icon, '#16a34a')}${esc(c.name)} <span class="sub">✎</span></span>
    <label class="check" style="margin:0;font-size:13px"><input type="checkbox" data-change="inc-tax" data-id="${c.id}" ${c.taxed ? 'checked' : ''}>com nota</label>
    <button class="icon-btn" data-action="inc-del" data-id="${c.id}">🗑</button></div>`).join('');
  const tx = S.taxes.map(t => `<div class="row"><div class="l">${esc(t.name)}</div><input style="width:90px;text-align:right" inputmode="decimal" value="${String(t.rate).replace('.', ',')}" data-change="tax-rate" data-id="${t.id}"> %
    <button class="icon-btn" data-action="tax-del" data-id="${t.id}">🗑</button></div>`).join('');
  return `<div class="card"><h2>Privacidade</h2><p class="sub">${pinSet() ? 'O app pede senha ao abrir e depois de 1 minuto em segundo plano.' : 'Sem senha. Qualquer pessoa com seu celular desbloqueado consegue abrir o app.'}</p>
    ${pinSet() ? '<button class="btn full sec" data-action="pin-set">Trocar senha</button><button class="btn full danger" data-action="pin-off">Desativar senha</button>' : '<button class="btn full" data-action="pin-set">Ativar senha</button>'}</div>
  <div class="card"><h2>Contas</h2><p class="hint" style="margin-top:0">Toque numa conta para mudar o ícone e a cor.</p>${accs}<button class="btn full sec" data-action="conta">+ Nova conta ou cartão</button></div>
  <div class="card"><h2>Impostos da nota (PJ)</h2>${tx}<div class="row"><b>Total</b><b>${taxRate().toFixed(2).replace('.', ',')} %</b></div>
    <button class="btn full sec" data-action="tax-add">+ Imposto</button><p class="hint">Receitas marcadas "com nota" têm esse percentual descontado do valor bruto.</p></div>
  <div class="card"><h2>Tipos de receita</h2>${inc}<button class="btn full sec" data-action="inc-add">+ Tipo de receita</button></div>
  <h2 style="font-size:15px;color:var(--muted);margin:18px 0 0">ÁREAS DE GASTO</h2><p class="hint">Toque em ✎ para mudar nome, ícone e cor da área. Toque num tipo para escolher o ícone dele.</p>${areas}
  <button class="btn full sec" data-action="area-add">+ Nova área</button>
  <div class="card"><h2>Backup</h2><p class="sub">Os dados ficam só neste aparelho. Faça um backup de vez em quando.</p>
    <button class="btn full" data-action="exportar">Baixar backup (JSON)</button>
    <button class="btn full sec" data-action="csv">Exportar lançamentos (planilha CSV)</button>
    <button class="btn full sec" data-action="importar">Restaurar backup</button>
    <button class="btn full danger" data-action="zerar">Apagar todos os dados</button></div>
  <p class="hint" style="text-align:center">Versão ${APP_VERSION}</p>`;
};

/* ===================== Formulários ===================== */
function openSheet(html) { document.getElementById('sheet-card').innerHTML = html; document.getElementById('sheet').classList.remove('hidden'); }
function closeSheet() { document.getElementById('sheet').classList.add('hidden'); }
const opt = (v, l, sel) => `<option value="${v}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`;
const val = id => document.getElementById(id)?.value;

let form = null; // { kind, id }
function txForm(kind, t = null) {
  form = { kind, id: t?.id };
  const isNew = !t; t = t || {};
  const seg = ['despesa', 'receita', 'transferencia'].map(k => `<button type="button" class="${k === kind ? 'on' : ''}" data-action="form-kind" data-k="${k}">${{ despesa: 'Despesa', receita: 'Receita', transferencia: 'Transferir' }[k]}</button>`).join('');
  const accs = S.accounts.filter(a => !a.archived || a.id === t.accountId);
  let h = `<h3>${isNew ? 'Novo lançamento' : 'Editar lançamento'}</h3>${isNew ? `<div class="seg">${seg}</div>` : ''}
    <label>${kind === 'receita' ? 'Valor bruto' : 'Valor'}</label><input id="f-valor" class="amount" inputmode="decimal" placeholder="0,00" value="${moneyInput(kind === 'receita' ? t.gross : t.amount)}" data-input="preview">
    <div class="two"><div><label>Data</label><input id="f-data" type="date" value="${t.date || today()}"></div>`;
  if (kind === 'despesa') {
    const aId = t.areaId || S.areas[1]?.id;
    const accId = t.accountId || 'nubank';
    h += `<div><label>Pago com</label><select id="f-conta" data-change="conta-form">${accs.filter(spendable).map(a => opt(a.id, a.name, accId)).join('')}</select></div></div>
      <label>Descrição</label><input id="f-desc" placeholder="Ex.: Ifood, Niver Angélica" value="${esc(t.desc)}">
      <div class="two"><div><label>Área</label><select id="f-area" data-change="area-form">${S.areas.map(a => opt(a.id, a.name, aId)).join('')}</select></div>
      <div><label>Tipo</label><select id="f-tipo">${typeOpts(aId, t.typeId)}</select></div></div>
      <div class="two"><div><label>Natureza</label><select id="f-nat">${opt('variavel', 'Variável', t.nature || 'variavel')}${opt('fixa', 'Fixa', t.nature)}</select></div>
      <div id="parc-box"><label>Parcelas</label>${isNew ? `<input id="f-parc" type="number" min="1" max="48" value="1">` : `<input disabled value="${t.inst ? t.inst.n + '/' + t.inst.total : 'à vista'}">`}</div></div>
      <label class="check" id="pago-box"><input type="checkbox" id="f-pago" ${t.paid ?? true ? 'checked' : ''}>Já está pago</label>`;
  } else if (kind === 'receita') {
    const cId = t.catId || S.incomeCats[0]?.id;
    h += `<div><label>Entrou em</label><select id="f-conta">${accs.filter(a => a.type !== 'cartao' && spendable(a)).map(a => opt(a.id, a.name, t.accountId || 'sicoob')).join('')}</select></div></div>
      <label>Tipo</label><select id="f-cat" data-change="cat-form">${S.incomeCats.map(c => opt(c.id, c.name, cId)).join('')}</select>
      <label>Descrição</label><input id="f-desc" placeholder="Opcional" value="${esc(t.desc)}">
      <label class="check"><input type="checkbox" id="f-nota" data-change="preview" ${(t.id ? t.gross !== t.net : incomeCat(cId)?.taxed) ? 'checked' : ''}>Com nota (descontar ${taxRate().toFixed(2).replace('.', ',')}% de impostos)</label>
      <div class="hint" id="f-prev"></div>`;
  } else {
    const nb = accs.filter(a => a.type !== 'cartao' && spendable(a));
    h += `<div></div></div><div class="two"><div><label>De</label><select id="f-de">${nb.map(a => opt(a.id, a.name, t.from || 'sicoob')).join('')}</select></div>
      <div><label>Para</label><select id="f-para">${nb.map(a => opt(a.id, a.name, t.to || 'dinheiro')).join('')}</select></div></div>
      <label>Descrição</label><input id="f-desc" placeholder="Ex.: Saque" value="${esc(t.desc)}">`;
  }
  h += `<button class="btn full" data-action="salvar-tx">Salvar</button>`;
  if (!isNew) h += `<button class="btn full danger" data-action="excluir-tx">Excluir${t.inst ? ' (só esta parcela)' : ''}</button>${t.inst ? '<button class="btn full danger" data-action="excluir-grupo">Excluir todas as parcelas</button>' : ''}`;
  h += `<button class="btn full sec" data-action="fechar">Cancelar</button>`;
  openSheet(h); syncForm();
}
function typeOpts(aId, sel) { return `<option value="">—</option>` + (area(aId)?.types || []).map(t => opt(t.id, t.name, sel)).join(''); }
function syncForm() {
  if (form?.kind === 'despesa') {
    const card = acc(val('f-conta'))?.type === 'cartao';
    document.getElementById('pago-box').style.display = card ? 'none' : '';
    const p = document.getElementById('parc-box'); if (p) p.style.visibility = card ? 'visible' : 'hidden';
  }
  if (form?.kind === 'receita') {
    const g = parseMoney(val('f-valor')), nota = document.getElementById('f-nota').checked;
    document.getElementById('f-prev').textContent = nota && g ? `Impostos ${money(g * taxRate() / 100)} · líquido ${money(g * (1 - taxRate() / 100))}` : '';
  }
}
function saveTx() {
  const amount = parseMoney(val('f-valor')); if (!amount) return toast('Informe o valor');
  const date = val('f-data') || today(), desc = val('f-desc').trim();
  const old = form.id ? S.tx.find(t => t.id === form.id) : null;
  if (form.kind === 'despesa') {
    const accountId = val('f-conta'), card = acc(accountId).type === 'cartao';
    const base = { kind: 'despesa', areaId: val('f-area'), typeId: val('f-tipo'), accountId, nature: val('f-nat'), desc };
    if (old) { Object.assign(old, base, { amount, date, paid: card ? old.paid && old.accountId === accountId : document.getElementById('f-pago').checked }); }
    else {
      const n = card ? Math.max(1, Math.min(48, parseInt(val('f-parc')) || 1)) : 1;
      const group = uid(), each = Math.floor(amount / n * 100) / 100;
      for (let i = 0; i < n; i++) {
        const v = i === 0 ? Math.round((amount - each * (n - 1)) * 100) / 100 : each;
        S.tx.push({ ...base, id: uid(), amount: v, date: dateAddMonths(date, i), paid: card ? false : document.getElementById('f-pago').checked,
          ...(n > 1 ? { inst: { n: i + 1, total: n, group } } : {}) });
      }
    }
  } else if (form.kind === 'receita') {
    const nota = document.getElementById('f-nota').checked;
    const net = Math.round(amount * (nota ? 1 - taxRate() / 100 : 1) * 100) / 100;
    const o = { kind: 'receita', date, gross: amount, net, catId: val('f-cat'), accountId: val('f-conta'), desc };
    old ? Object.assign(old, o) : S.tx.push({ id: uid(), ...o });
  } else {
    const o = { kind: 'transferencia', date, amount, from: val('f-de'), to: val('f-para'), desc };
    if (o.from === o.to) return toast('Escolha contas diferentes');
    old ? Object.assign(old, o) : S.tx.push({ id: uid(), ...o });
  }
  save(); closeSheet(); render(); toast('Salvo');
}

function payForm(cardId, bk) {
  const card = acc(cardId), b = billsOf(card).find(x => x.key === bk);
  form = { kind: 'pagar', cardId, bk };
  openSheet(`<h3>Pagar fatura de ${monthName(bk)}</h3><div class="big">${money(b.open)}</div>
    <label>Pagar com</label><select id="f-conta">${S.accounts.filter(a => a.type !== 'cartao' && spendable(a) && !a.archived).map(a => opt(a.id, a.name, 'sicoob')).join('')}</select>
    <label>Data do pagamento</label><input id="f-data" type="date" value="${today()}">
    <button class="btn full" data-action="confirmar-pag">Confirmar pagamento</button><button class="btn full sec" data-action="fechar">Cancelar</button>`);
}
function confirmPay() {
  const card = acc(form.cardId), b = billsOf(card).find(x => x.key === form.bk);
  S.tx.push({ id: uid(), kind: 'fatura', date: val('f-data') || today(), amount: Math.round(b.open * 100) / 100, accountId: val('f-conta'), cardId: card.id, bill: form.bk });
  b.items.forEach(t => t.paid = true);
  save(); closeSheet(); render(); toast('Fatura paga');
}

function fixedForm(f = null) {
  form = { kind: 'fixo', id: f?.id }; f = f || {};
  const aId = f.areaId || S.areas.find(a => a.name === 'Serviços')?.id || S.areas[0].id;
  openSheet(`<h3>${f.id ? 'Editar' : 'Novo'} gasto fixo</h3>
    <label>Descrição</label><input id="f-desc" placeholder="Ex.: YouTube, Plano de saúde" value="${esc(f.desc)}">
    <div class="two"><div><label>Valor por mês</label><input id="f-valor" inputmode="decimal" placeholder="0,00" value="${moneyInput(f.amount)}"></div>
    <div><label>Dia do mês</label><input id="f-dia" type="number" min="1" max="31" value="${f.day || 10}"></div></div>
    <div class="two"><div><label>Área</label><select id="f-area" data-change="area-form">${S.areas.map(a => opt(a.id, a.name, aId)).join('')}</select></div>
    <div><label>Tipo</label><select id="f-tipo">${typeOpts(aId, f.typeId)}</select></div></div>
    <label>Pago com</label><select id="f-conta">${S.accounts.filter(a => !a.archived && spendable(a)).map(a => opt(a.id, a.name, f.accountId || 'nubank')).join('')}</select>
    ${f.id ? `<label class="check"><input type="checkbox" id="f-ativo" ${f.active ? 'checked' : ''}>Ativo (desmarque para pausar)</label>` : ''}
    <button class="btn full" data-action="salvar-fixo">Salvar</button>
    ${f.id ? '<button class="btn full danger" data-action="excluir-fixo">Excluir (lançamentos passados ficam)</button>' : ''}
    <button class="btn full sec" data-action="fechar">Cancelar</button>`);
}
function saveFixed() {
  const amount = parseMoney(val('f-valor')), desc = val('f-desc').trim();
  if (!desc || !amount) return toast('Preencha descrição e valor');
  const o = { desc, amount, day: Math.max(1, Math.min(31, parseInt(val('f-dia')) || 1)), areaId: val('f-area'), typeId: val('f-tipo'), accountId: val('f-conta') };
  if (form.id) {
    const f = S.fixed.find(x => x.id === form.id); Object.assign(f, o, { active: document.getElementById('f-ativo').checked });
    // atualiza o lançamento deste mês, se ainda não foi pago
    const t = S.tx.find(x => x.fixedId === f.id && mkOf(x.date) === mkOf(today()) && !x.paid);
    if (t) Object.assign(t, { amount: o.amount, desc: o.desc, areaId: o.areaId, typeId: o.typeId, accountId: o.accountId });
  } else {
    const mk = mkOf(today());
    // começa neste mês se o dia ainda não passou; senão, no próximo
    S.fixed.push({ id: uid(), ...o, active: true, start: o.day >= +today().slice(8) ? mk : addMonths(mk, 1) });
  }
  save(); closeSheet(); render(); toast('Salvo');
}

function goalForm(g = null) {
  form = { kind: 'meta', id: g?.id }; g = g || {};
  openSheet(`<h3>${g.id ? esc(g.name) : 'Nova meta'}</h3>
    ${g.id ? `<label>Guardar ou retirar valor (use - para retirar)</label><div class="two"><input id="f-mov" inputmode="decimal" placeholder="0,00"><button class="btn" data-action="meta-mov">Aplicar</button></div><hr style="border:0;border-top:1px solid var(--line);margin:16px 0">` : ''}
    <label>Nome</label><input id="f-nome" value="${esc(g.name)}" placeholder="Ex.: Entrada do apartamento">
    <div class="two"><div><label>Valor final</label><input id="f-alvo" inputmode="decimal" value="${moneyInput(g.target)}"></div>
    <div><label>Guardar por mês</label><input id="f-mensal" inputmode="decimal" value="${moneyInput(g.monthly)}"></div></div>
    <label>Já guardado</label><input id="f-guardado" inputmode="decimal" value="${moneyInput(g.saved)}">
    <button class="btn full" data-action="salvar-meta">Salvar</button>${g.id ? '<button class="btn full danger" data-action="excluir-meta">Excluir</button>' : ''}
    <button class="btn full sec" data-action="fechar">Cancelar</button>`);
}
function investForm(i = null) {
  form = { kind: 'invest', id: i?.id }; i = i || {};
  const kinds = Object.entries(INV_TYPES).map(([c, ks]) => `<optgroup label="${c}">${ks.map(k => opt(k, k, i.kind)).join('')}</optgroup>`).join('');
  openSheet(`<h3>${i.id ? 'Editar' : 'Novo'} investimento</h3>
    <label>Nome</label><input id="f-nome" value="${esc(i.name)}" placeholder="Ex.: CDB Sicoob 110% CDI">
    <label>Tipo</label><select id="f-tipo">${kinds}</select>
    <div class="two"><div><label>Valor aplicado</label><input id="f-apl" inputmode="decimal" value="${moneyInput(i.invested)}"></div>
    <div><label>Valor atual</label><input id="f-atual" inputmode="decimal" value="${moneyInput(i.current)}"></div></div>
    <button class="btn full" data-action="salvar-invest">Salvar</button>${i.id ? '<button class="btn full danger" data-action="excluir-invest">Excluir</button>' : ''}
    <button class="btn full sec" data-action="fechar">Cancelar</button>`);
}
const SWATCHES = ['#820ad1','#0b7a5c','#ff7a00','#ec7000','#cc092f','#005ca9','#fcd116','#1f2937','#16a34a','#0ea5e9','#6366f1','#ec4899','#f59e0b','#a16207','#64748b','#14b8a6'];
// Bloco de escolha de ícone (e cor, opcional) usado nos formulários
function lookFields(icon, color, withColor = true, withIcon = true) {
  return `<div class="look"><span id="look-prev">${av(icon, color || '#94a3b8')}</span><span class="sub">Prévia</span></div>
    <input type="hidden" id="f-icon" value="${esc(icon || '')}"><input type="hidden" id="f-cor" value="${color || '#94a3b8'}">
    ${withColor ? `<label>Cor</label><div class="swatches">${[...new Set([color, ...SWATCHES, ...COLORS].filter(Boolean))].map(c => `<button type="button" class="sw ${c === color ? 'on' : ''}" style="background:${c}" data-action="pick-cor" data-v="${c}"></button>`).join('')}
      <label class="sw custom" title="Outra cor"><input type="color" value="${color || '#94a3b8'}" data-change="pick-cor-custom">🎨</label></div>` : ''}
    ${withIcon ? `<label>Ícone</label><div class="icongrid">${ICON_CHOICES.map(i => `<button type="button" class="${i === icon ? 'on' : ''}" data-action="pick-icon" data-v="${i}">${i}</button>`).join('')}</div>
    <input id="f-icon-txt" placeholder="Ou digite/cole outro emoji" maxlength="4" data-input="icon-txt" style="margin-top:8px">` : ''}`;
}
function updLook() { document.getElementById('look-prev').innerHTML = av(val('f-icon'), val('f-cor')); }

// Editar área, tipo ou tipo de receita
function itemForm(kind, aId, tId) {
  const it = kind === 'area' ? area(aId) : kind === 'tipo' ? typeOf(aId, tId) : incomeCat(aId);
  const color = kind === 'area' ? it.color : kind === 'tipo' ? area(aId).color : '#16a34a';
  form = { kind: 'item-' + kind, aId, tId };
  openSheet(`<h3>${{ area: 'Editar área', tipo: 'Editar tipo de gasto', inc: 'Editar tipo de receita' }[kind]}</h3>
    <label>Nome</label><input id="f-nome" value="${esc(it.name)}">
    ${lookFields(it.icon || (kind === 'tipo' ? area(aId).icon : ''), color, kind === 'area')}
    ${kind === 'tipo' ? '<p class="hint">A cor vem da área. Sem ícone próprio, o tipo usa o ícone da área.</p><button class="btn full sec" data-action="tipo-sem-icone">Usar o ícone da área</button>' : ''}
    <button class="btn full" data-action="salvar-item">Salvar</button><button class="btn full sec" data-action="fechar">Cancelar</button>`);
}

function accountForm(a = null) {
  form = { kind: 'conta', id: a?.id }; a = a || { type: 'corrente' };
  const card = a.type === 'cartao';
  const partRow = p => `<div class="part">${av(p.icon, a.color)}<div class="l"><b>${esc(p.name)}</b><div class="sub">valor bloqueado, separado do livre</div></div>
      <input inputmode="decimal" class="f-parte" data-p="${p.id}" value="${moneyInput(partBal(a, p))}" placeholder="0,00">
      <button class="icon-btn" data-action="parte-del" data-id="${a.id}" data-p="${p.id}">🗑</button></div>`;
  openSheet(`<h3>${a.id ? 'Editar conta' : 'Nova conta'}</h3>
    <label>Nome</label><input id="f-nome" value="${esc(a.name)}">
    <label>Tipo</label><select id="f-tipo" ${a.id ? 'disabled' : ''}>${opt('corrente', 'Conta bancária', a.type)}${opt('dinheiro', 'Dinheiro', a.type)}${opt('cartao', 'Cartão de crédito', a.type)}${opt('bloqueado', 'Saldo bloqueado (FGTS, judicial…)', a.type)}</select>
    <div class="box"><label style="margin-top:0">${card ? 'Saldo inicial (use negativo se já houver fatura)' : a.type === 'bloqueado' ? 'Saldo inicial' : '💵 Saldo livre inicial'}</label>
      <input id="f-ini" inputmode="decimal" value="${a.initial ? String(a.initial).replace('.', ',') : ''}" placeholder="0,00">
      ${a.id && !card && spendable(a) ? `<div class="sub" style="margin-top:6px">Saldo livre hoje: <b>${money(freeOf(a))}</b></div>` : ''}</div>
    ${a.id && spendable(a) && !card ? `<div class="box"><label style="margin-top:0">🔒 Valores bloqueados (cada um independente)</label>
      ${(a.parts || []).map(partRow).join('') || '<div class="sub">Nenhum. Adicione abaixo, se houver.</div>'}
      <div class="chips"><button class="btn small sec" data-action="parte-add" data-id="${a.id}" data-n="FGTS">+ FGTS</button><button class="btn small sec" data-action="parte-add" data-id="${a.id}" data-n="Transferência judicial">+ Transferência judicial</button><button class="btn small sec" data-action="parte-add" data-id="${a.id}">+ Outro</button></div></div>` : ''}
    ${card || !a.id ? `<div class="two"><div><label>Fecha dia (cartão)</label><input id="f-fecha" type="number" min="1" max="31" value="${a.closeDay || ''}"></div>
    <div><label>Vence dia (cartão)</label><input id="f-vence" type="number" min="1" max="31" value="${a.dueDay || ''}"></div></div>` : ''}
    ${a.id && a.type === 'bloqueado' ? `<button class="btn full sec" data-action="ajustar" data-id="${a.id}">Atualizar saldo (hoje: ${money(balance(a))})</button>` : ''}
    ${lookFields(a.icon || ACC_ICONS[a.type], a.color || '#64748b')}
    ${a.id ? `<label class="check"><input type="checkbox" id="f-arq" ${a.archived ? 'checked' : ''}>Arquivada (esconde sem apagar o histórico)</label>` : ''}
    <button class="btn full" data-action="salvar-conta">Salvar</button><button class="btn full sec" data-action="fechar">Cancelar</button>`);
}
// Grava os valores bloqueados digitados no formulário da conta
function saveParts(a) {
  document.querySelectorAll('.f-parte').forEach(i => {
    const p = a.parts.find(x => x.id === i.dataset.p); if (!p) return;
    const diff = Math.round((parseMoney(i.value) - partBal(a, p)) * 100) / 100;
    if (Math.abs(diff) >= 0.005) S.tx.push({ id: uid(), kind: 'ajuste', date: today(), amount: diff, accountId: a.id, sub: p.id });
  });
}

/* ===================== Ações ===================== */
const ACTIONS = {
  fechar: closeSheet,
  novo: () => txForm('despesa'),
  'form-kind': el => txForm(el.dataset.k),
  editar: el => { const t = S.tx.find(x => x.id === el.dataset.id);
    if (t.kind === 'ajuste') { if (confirm('Desfazer esta atualização de saldo?')) { S.tx = S.tx.filter(x => x !== t); save(); render(); } return; } if (t.kind === 'fatura') { if (confirm('Desfazer este pagamento de fatura?')) { S.tx.filter(x => x.kind === 'despesa' && x.accountId === t.cardId && billKey(x) === t.bill).forEach(x => x.paid = false); S.tx = S.tx.filter(x => x !== t); save(); render(); } return; } txForm(t.kind, t); },
  'salvar-tx': saveTx,
  'excluir-tx': () => { if (!confirm('Excluir este lançamento?')) return; S.tx = S.tx.filter(t => t.id !== form.id); save(); closeSheet(); render(); },
  'excluir-grupo': () => { const g = S.tx.find(t => t.id === form.id).inst.group; if (!confirm('Excluir todas as parcelas?')) return; S.tx = S.tx.filter(t => t.inst?.group !== g); save(); closeSheet(); render(); },
  pagar: el => payForm(el.dataset.card, el.dataset.bill),
  'confirmar-pag': confirmPay,
  faturas: el => { sub_card = el.dataset.card; go('inicio', 'faturas'); },
  'mes-ant': () => { curMonth = addMonths(curMonth, -1); render(); },
  'mes-prox': () => { curMonth = addMonths(curMonth, 1); render(); },
  'ano-ant': () => { curMonth = addMonths(curMonth, -12); render(); },
  'ano-prox': () => { curMonth = addMonths(curMonth, 12); render(); },
  fixo: el => fixedForm(S.fixed.find(f => f.id === el.dataset.id)),
  'salvar-fixo': saveFixed,
  'excluir-fixo': () => { if (!confirm('Excluir este gasto fixo?')) return; S.fixed = S.fixed.filter(f => f.id !== form.id); S.tx = S.tx.filter(t => !(t.fixedId === form.id && !t.paid && mkOf(t.date) >= mkOf(today()) && acc(t.accountId)?.type !== 'cartao')); save(); closeSheet(); render(); },
  meta: el => goalForm(S.goals.find(g => g.id === el.dataset.id)),
  'meta-mov': () => { const g = S.goals.find(x => x.id === form.id); g.saved = Math.round(((g.saved || 0) + parseMoney(val('f-mov'))) * 100) / 100; save(); closeSheet(); render(); toast('Meta atualizada'); },
  'salvar-meta': () => { const o = { name: val('f-nome').trim(), target: parseMoney(val('f-alvo')), monthly: parseMoney(val('f-mensal')), saved: parseMoney(val('f-guardado')) }; if (!o.name) return toast('Dê um nome');
    form.id ? Object.assign(S.goals.find(g => g.id === form.id), o) : S.goals.push({ id: uid(), ...o }); save(); closeSheet(); render(); },
  'excluir-meta': () => { if (!confirm('Excluir meta?')) return; S.goals = S.goals.filter(g => g.id !== form.id); save(); closeSheet(); render(); },
  invest: el => investForm(S.investments.find(i => i.id === el.dataset.id)),
  'salvar-invest': () => { const kind = val('f-tipo'); const o = { name: val('f-nome').trim() || kind, kind, cls: INV_TYPES['Renda fixa'].includes(kind) ? 'Renda fixa' : 'Renda variável', invested: parseMoney(val('f-apl')), current: parseMoney(val('f-atual')) || parseMoney(val('f-apl')) };
    form.id ? Object.assign(S.investments.find(i => i.id === form.id), o) : S.investments.push({ id: uid(), ...o }); save(); closeSheet(); render(); },
  'excluir-invest': () => { if (!confirm('Excluir investimento?')) return; S.investments = S.investments.filter(i => i.id !== form.id); save(); closeSheet(); render(); },
  conta: el => accountForm(acc(el.dataset.id)),
  'salvar-conta': () => { const name = val('f-nome').trim(); if (!name) return toast('Dê um nome');
    const o = { name, icon: val('f-icon') || '🏦', color: val('f-cor'), initial: parseMoney(val('f-ini')), closeDay: parseInt(val('f-fecha')) || acc(form.id)?.closeDay || undefined, dueDay: parseInt(val('f-vence')) || acc(form.id)?.dueDay || undefined };
    if (form.id) { const a = acc(form.id); Object.assign(a, o, { archived: document.getElementById('f-arq').checked }); saveParts(a); }
    else { const type = val('f-tipo'); if (o.icon === ACC_ICONS.corrente && type !== 'corrente') o.icon = ACC_ICONS[type]; if (type === 'cartao' && (!o.closeDay || !o.dueDay)) return toast('Informe os dias de fechamento e vencimento'); S.accounts.push({ id: uid(), type, parts: [], ...o }); }
    save(); closeSheet(); render(); },
  ajustar: el => {
    const bloq = S.accounts.filter(a => !spendable(a) && !a.archived);
    const parts = S.accounts.filter(a => spendable(a) && !a.archived).flatMap(a => (a.parts || []).map(p => ({ a, p })));
    form = { kind: 'ajuste' };
    openSheet(`<h3>Atualizar saldos bloqueados</h3><p class="hint">Informe o valor bloqueado de hoje em cada item (consulte o app do FGTS ou do banco). Ele fica separado do saldo livre da conta. Deixe em branco o que não mudou.</p>
      ${parts.map(({ a, p }) => `<label>${p.icon} ${esc(p.name)} · ${esc(a.name)} <span class="sub">(hoje: ${money(partBal(a, p))})</span></label><input inputmode="decimal" data-acc="${a.id}" data-sub="${p.id}" class="f-saldo" placeholder="${moneyInput(partBal(a, p)) || '0,00'}">`).join('')}
      ${bloq.map(a => `<label>${a.icon} ${esc(a.name)} <span class="sub">(hoje: ${money(balance(a))})</span></label><input inputmode="decimal" data-acc="${a.id}" class="f-saldo" placeholder="${moneyInput(balance(a)) || '0,00'}">`).join('')}
      ${parts.length + bloq.length ? '' : '<p class="empty">Nenhuma parte bloqueada. Em Ajustes › Contas, toque numa conta e use “+ Parte bloqueada”.</p>'}
      <button class="btn full" data-action="salvar-ajuste">Salvar</button><button class="btn full sec" data-action="fechar">Cancelar</button>`);
  },
  'parte-valor': el => {
    const a = acc(el.dataset.id), p = el.dataset.p ? a.parts.find(x => x.id === el.dataset.p) : null, cur = p ? partBal(a, p) : balance(a);
    form = { kind: 'parte-valor', acc: a.id, sub: p?.id, volta: !!el.dataset.volta };
    openSheet(`<h3>${p ? p.icon + ' ' + esc(p.name) : a.icon + ' ' + esc(a.name)}</h3>${p ? `<div class="sub">${esc(a.name)}</div>` : ''}
      <label>Valor bloqueado hoje</label><input id="f-valor" class="amount" inputmode="decimal" value="${moneyInput(cur)}" placeholder="0,00">
      <p class="hint">Fica separado do saldo livre da conta.</p>
      <button class="btn full" data-action="salvar-parte-valor">Salvar</button><button class="btn full sec" data-action="fechar">Cancelar</button>`);
    setTimeout(() => document.getElementById('f-valor')?.select(), 100);
  },
  'salvar-parte-valor': () => {
    const a = acc(form.acc), p = form.sub ? a.parts.find(x => x.id === form.sub) : null;
    const diff = Math.round((parseMoney(val('f-valor')) - (p ? partBal(a, p) : balance(a))) * 100) / 100;
    if (Math.abs(diff) >= 0.005) S.tx.push({ id: uid(), kind: 'ajuste', date: today(), amount: diff, accountId: a.id, ...(p ? { sub: p.id } : {}) });
    save(); render(); if (form.volta) accountForm(a); else closeSheet(); toast('Valor salvo');
  },
  'parte-add': el => { const a = acc(el.dataset.id); const n = el.dataset.n || prompt('Nome da parte bloqueada:'); if (!n?.trim()) return;
    if (a.parts.some(p => p.name === n.trim())) return toast('Essa parte já existe nesta conta');
    a.parts.push({ id: uid(), name: n.trim(), icon: /fgts/i.test(n) ? '🔒' : /judic/i.test(n) ? '⚖️' : '🔒' }); saveParts(a); save(); render(); accountForm(a); setTimeout(() => { const i = [...document.querySelectorAll('.f-parte')].at(-1); i?.focus(); i?.scrollIntoView({ block: 'center' }); }, 100); },
  'parte-del': el => { const a = acc(el.dataset.id), p = a.parts.find(x => x.id === el.dataset.p);
    if (!confirm(`Remover "${p.name}" desta conta? O valor bloqueado registrado nela será apagado.`)) return;
    saveParts(a); S.tx = S.tx.filter(t => !(t.kind === 'ajuste' && t.sub === p.id)); a.parts = a.parts.filter(x => x !== p); save(); accountForm(a); render(); },
  'salvar-ajuste': () => {
    let n = 0;
    document.querySelectorAll('.f-saldo').forEach(i => { if (!i.value.trim()) return; const a = acc(i.dataset.acc), sub = i.dataset.sub;
      const cur = sub ? partBal(a, a.parts.find(p => p.id === sub)) : balance(a);
      const diff = Math.round((parseMoney(i.value) - cur) * 100) / 100; if (Math.abs(diff) < 0.005) return;
      S.tx.push({ id: uid(), kind: 'ajuste', date: today(), amount: diff, accountId: a.id, ...(sub ? { sub } : {}) }); n++; });
    save(); closeSheet(); render(); toast(n ? 'Saldo atualizado' : 'Nada mudou');
  },
  'pick-icon': el => { document.getElementById('f-icon').value = el.dataset.v; document.querySelectorAll('.icongrid .on').forEach(b => b.classList.remove('on')); el.classList.add('on'); updLook(); },
  'pick-cor': el => { document.getElementById('f-cor').value = el.dataset.v; document.querySelectorAll('.swatches .on').forEach(b => b.classList.remove('on')); el.classList.add('on'); updLook(); },
  'area-edit': el => itemForm('area', el.dataset.id),
  'tipo-edit': (el, e) => itemForm('tipo', el.dataset.id, el.dataset.t),
  'inc-edit': el => itemForm('inc', el.dataset.id),
  'tipo-sem-icone': () => { document.getElementById('f-icon').value = ''; updLook(); },
  'salvar-item': () => {
    const name = val('f-nome').trim(); if (!name) return toast('Dê um nome');
    const k = form.kind.slice(5), it = k === 'area' ? area(form.aId) : k === 'tipo' ? typeOf(form.aId, form.tId) : incomeCat(form.aId);
    it.name = name; it.icon = val('f-icon') || (k === 'tipo' ? '' : it.icon); if (k === 'area') it.color = val('f-cor');
    save(); closeSheet(); render(); toast('Salvo');
  },
  'area-add': () => { const n = prompt('Nome da nova área:'); if (!n?.trim()) return; S.areas.push({ id: uid(), name: n.trim(), icon: '🏷️', color: COLORS[S.areas.length % COLORS.length], budget: 0, types: [] }); save(); render(); },
  'area-ren': el => { const a = area(el.dataset.id); const n = prompt('Novo nome:', a.name); if (n?.trim()) { a.name = n.trim(); save(); render(); } },
  'area-del': el => { const a = area(el.dataset.id); const used = S.tx.some(t => t.areaId === a.id) || S.fixed.some(f => f.areaId === a.id);
    if (used) return alert('Essa área tem lançamentos ou gastos fixos. Mude-os de área antes de excluir.'); if (!confirm(`Excluir a área ${a.name}?`)) return; S.areas = S.areas.filter(x => x !== a); save(); render(); },
  'area-up': el => { const i = S.areas.findIndex(a => a.id === el.dataset.id); if (i > 0) { [S.areas[i - 1], S.areas[i]] = [S.areas[i], S.areas[i - 1]]; save(); render(); } },
  'tipo-add': el => { const n = prompt('Nome do novo tipo:'); if (!n?.trim()) return; area(el.dataset.id).types.push({ id: uid(), name: n.trim(), icon: TYPE_ICONS[n.trim()] || '' }); save(); render(); },
  'tipo-del': el => { const a = area(el.dataset.id); a.types = a.types.filter(t => t.id !== el.dataset.t); save(); render(); toast('Tipo removido (lançamentos antigos continuam)'); },
  'inc-add': () => { const n = prompt('Nome do tipo de receita:'); if (!n?.trim()) return; S.incomeCats.push({ id: uid(), name: n.trim(), icon: '💰', taxed: false }); save(); render(); },
  'inc-del': el => { if (S.tx.some(t => t.catId === el.dataset.id)) return alert('Esse tipo já tem receitas lançadas.'); S.incomeCats = S.incomeCats.filter(c => c.id !== el.dataset.id); save(); render(); },
  'tax-add': () => { const n = prompt('Nome do imposto:'); if (!n?.trim()) return; S.taxes.push({ id: uid(), name: n.trim(), rate: 0 }); save(); render(); },
  'tax-del': el => { S.taxes = S.taxes.filter(t => t.id !== el.dataset.id); save(); render(); },
  exportar: () => download(`financas-backup-${today()}.json`, JSON.stringify(S, null, 1), 'application/json'),
  csv: () => {
    const rows = [['Data','Tipo','Valor','Valor líquido','Área/Categoria','Subtipo','Conta','Pago','Parcela','Descrição']];
    for (const t of [...S.tx].sort((a, b) => a.date.localeCompare(b.date))) {
      if (t.kind === 'despesa') rows.push([t.date, 'Despesa', t.amount, t.amount, area(t.areaId)?.name, typeName(t.areaId, t.typeId), acc(t.accountId)?.name, t.paid ? 'Sim' : 'Não', t.inst ? `${t.inst.n}/${t.inst.total}` : '', t.desc]);
      else if (t.kind === 'receita') rows.push([t.date, 'Receita', t.gross, t.net, incomeCat(t.catId)?.name, '', acc(t.accountId)?.name, 'Sim', '', t.desc]);
      else if (t.kind === 'transferencia') rows.push([t.date, 'Transferência', t.amount, t.amount, '', '', `${acc(t.from)?.name} → ${acc(t.to)?.name}`, 'Sim', '', t.desc]);
      else if (t.kind === 'ajuste') rows.push([t.date, t.sub ? 'Parte bloqueada' : 'Atualização de saldo', t.amount, t.amount, t.sub ? acc(t.accountId)?.parts.find(p => p.id === t.sub)?.name : '', '', acc(t.accountId)?.name, 'Sim', '', '']);
      else rows.push([t.date, 'Pagamento de fatura', t.amount, t.amount, '', '', acc(t.accountId)?.name, 'Sim', '', acc(t.cardId)?.name]);
    }
    const csv = rows.map(r => r.map(c => typeof c === 'number' ? String(c).replace('.', ',') : `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
    download(`financas-${today()}.csv`, '﻿' + csv, 'text/csv');
  },
  importar: () => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'application/json,.json';
    i.onchange = () => { const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (!d.version || !d.tx) throw 0;
      if (!confirm('Substituir os dados atuais pelo backup?')) return; S = d; save(); load(); render(); toast('Backup restaurado'); } catch (e) { alert('Arquivo de backup inválido.'); } }; r.readAsText(i.files[0]); };
    i.click(); },
  zerar: () => { if (prompt('Isso apaga tudo deste aparelho. Digite APAGAR para confirmar.') === 'APAGAR') { S = defaults(); save(); render(); } },
};
function download(name, content, type) {
  const blob = new Blob([content], { type }); const file = new File([blob], name, { type });
  if (navigator.canShare?.({ files: [file] })) return navigator.share({ files: [file], title: name }).catch(() => {});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const CHANGES = {
  filtro: el => { filterArea = el.value; render(); },
  'area-form': el => { document.getElementById('f-tipo').innerHTML = typeOpts(el.value); },
  'conta-form': () => syncForm(),
  'cat-form': el => { document.getElementById('f-nota').checked = !!incomeCat(el.value)?.taxed; syncForm(); },
  preview: () => syncForm(),
  'pick-cor-custom': el => { document.getElementById('f-cor').value = el.value; updLook(); },
  'area-cor': el => { area(el.dataset.id).color = el.value; save(); },
  'area-orc': el => { area(el.dataset.id).budget = parseMoney(el.value); save(); },
  'inc-tax': el => { incomeCat(el.dataset.id).taxed = el.checked; save(); },
  'tax-rate': el => { S.taxes.find(t => t.id === el.dataset.id).rate = parseMoney(el.value); save(); render(); },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action],[data-tab],[data-go]'); if (!el) return;
  if (el.dataset.tab) return go(el.dataset.tab);
  if (el.dataset.go) return go('mais', el.dataset.go);
  ACTIONS[el.dataset.action]?.(el);
});
document.addEventListener('change', e => { const el = e.target.closest('[data-change]'); if (el) CHANGES[el.dataset.change]?.(el); });
document.addEventListener('input', e => {
  if (e.target.dataset.input === 'preview') syncForm();
  if (e.target.dataset.input === 'icon-txt' && e.target.value.trim()) { document.getElementById('f-icon').value = e.target.value.trim(); updLook(); }
});

/* ===================== Senha (PIN) ===================== */
const PIN_KEY = 'financas.pin';
async function hash(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('financas:' + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
const pinSet = () => { try { return localStorage.getItem(PIN_KEY); } catch (e) { return null; } };
function lock() {
  if (!pinSet() || document.getElementById('lock')) return;
  const d = document.createElement('div'); d.id = 'lock'; d.className = 'lock';
  d.innerHTML = `<div class="lock-box"><div style="font-size:40px">🔒</div><h2>Finanças</h2><input id="pin-in" type="password" inputmode="numeric" autocomplete="off" placeholder="Senha" maxlength="12"><div id="pin-err" class="neg sub"></div><button class="btn full" id="pin-ok">Entrar</button></div>`;
  document.body.appendChild(d);
  const tryPin = async () => { if (await hash(document.getElementById('pin-in').value) === pinSet()) d.remove(); else { document.getElementById('pin-err').textContent = 'Senha incorreta'; document.getElementById('pin-in').value = ''; } };
  d.querySelector('#pin-ok').onclick = tryPin; d.querySelector('#pin-in').onkeydown = e => { if (e.key === 'Enter') tryPin(); };
  setTimeout(() => document.getElementById('pin-in')?.focus(), 100);
}
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => { if (document.hidden) hiddenAt = Date.now(); else if (Date.now() - hiddenAt > 60000) lock(); });
ACTIONS['pin-set'] = async () => {
  const a = prompt('Nova senha (4 a 12 números):'); if (!a) return; if (!/^\d{4,12}$/.test(a)) return alert('Use de 4 a 12 números.');
  if (prompt('Repita a senha:') !== a) return alert('As senhas não conferem.');
  localStorage.setItem(PIN_KEY, await hash(a)); render(); toast('Senha ativada');
};
ACTIONS['pin-off'] = async () => { const a = prompt('Senha atual:'); if (a && await hash(a) === pinSet()) { localStorage.removeItem(PIN_KEY); render(); toast('Senha desativada'); } else if (a) alert('Senha incorreta'); };

load(); render(); lock();
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
