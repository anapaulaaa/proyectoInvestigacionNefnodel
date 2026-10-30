import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, BarChart3, Calculator, ChevronDown, Clock3, Info, Menu, RotateCcw, Truck, X } from 'lucide-react'
import { Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import eoqData from './data/eoq.json'
import defaultLots from './data/lots.json'
import { DEFAULT_TRUCK_MINUTES, eoqValues, money, number, preparationMinutes, transport } from './lib/models'

const navy = '#0E1F3A'
const sectionLinks = [['modelos', 'Modelos'], ['empresa', 'Empresa'], ['transporte', 'Transporte'], ['eoq', 'EOQ'], ['cola', 'Cola'], ['conclusiones', 'Cierre']]

function Logo() {
  const [failed, setFailed] = useState(false)
  return failed ? <div className="logo-fallback">UMG</div> : <img src="/logo_umg.png" onError={() => setFailed(true)} className="logo" alt="Escudo de la Universidad Mariano Gálvez" />
}
function ShoeWatermark({ className = '' }) {
  return <svg className={`shoe-watermark ${className}`} viewBox="0 0 220 130" aria-hidden="true">
    <path d="M22 76c26-3 42-18 51-44l6-18c2-6 10-8 15-3l29 28c10 9 23 14 38 16l34 5c12 2 19 14 14 25-4 9-13 15-23 15H54c-18 0-30-8-32-24Z" />
    <path d="M80 18c13 10 24 18 34 24M72 29c13 10 24 18 34 24M63 40c13 10 24 18 34 24" />
    <path d="M36 91h137" />
  </svg>
}
function TopicWatermark({ type, className = '' }) {
  const drawings = {
    transport: <><path d="M25 67h99V38H25zM124 48h30l24 19v29h-54z" /><path d="M154 48v20h24M43 67V50h35v17M22 86h159M43 86a12 12 0 1 0 24 0M137 86a12 12 0 1 0 24 0" /><path d="M89 38V25h25v13" /></>,
    warehouse: <><path d="M28 105V36l80-25 80 25v69M20 105h176M49 105V52h118v53M49 70h118M49 87h118" /><path d="M65 52v53M87 52v53M109 52v53M131 52v53M153 52v53" /></>,
    boxes: <><path d="m38 52 41-20 41 20-41 20zM38 52v46l41 20V72M120 52v46l-41 20" /><path d="m105 40 36-18 40 20-40 20M141 42v42M105 40v27M141 84l40-20M105 67l36 17" /><path d="M61 60h35M61 76h22" /></>,
    queue: <><path d="M30 103h160M48 103V58h34v45M100 103V38h34v65M152 103V70h34v33" /><path d="M38 45h35M38 45l10-10M38 45l10 10M91 27h35M91 27l10-10M91 27l10 10M143 58h35M143 58l10-10M143 58l10 10" /><circle cx="65" cy="82" r="7" /><circle cx="117" cy="62" r="7" /><circle cx="169" cy="86" r="7" /></>
  }
  return <svg className={`topic-watermark ${className}`} viewBox="0 0 220 130" aria-hidden="true">{drawings[type]}</svg>
}
function SectionAccent({ label }) {
  return <div className="section-accent" aria-hidden="true"><span>{label}</span><i /><i /><i /></div>
}
function Tip({ children, text }) { return <span className="tip" title={text}>{children}<Info size={13} /></span> }
function Section({ id, dark = false, children, className = '' }) { return <section id={id} className={`${dark ? 'dark-section' : 'light-section'} section ${className}`}>{children}</section> }
function SectionTitle({ eyebrow, title, copy, light = false }) { return <div className={`section-title ${light ? 'light' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div> }
function Reveal({ children, delay = 0 }) { return <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .55, delay }}>{children}</motion.div> }
function Field({ label, children, tip }) { return <label className="field"><span>{tip ? <Tip text={tip}>{label}</Tip> : label}</span>{children}</label> }
const inputClass = 'control'

function TransportCalculator() {
  const [v, setV] = useState({ boxes: 120, destination: 'Bodega', trucks: 6, people: 2, boxesPerPerson: 3, minutes: 12 })
  const set = (key, value) => setV({ ...v, [key]: value })
  const result = transport(v)
  const reference = Math.ceil(v.boxes / 24) * (v.destination === 'Central' ? 24 : v.destination === 'Sucursal' ? 9 : 12)
  const saving = reference - result.minutes
  const pct = reference ? (saving / reference) * 100 : 0
  const reset = () => setV({ boxes: 120, destination: 'Bodega', trucks: 6, people: 2, boxesPerPerson: 3, minutes: 12 })
  return <div className="calculator-grid">
    <div className="panel controls-panel">
      <div className="panel-heading"><span className="icon-box orange"><Truck size={20} /></span><div><h3>Configura el traslado</h3><p>Prueba el modelo con tus propios supuestos.</p></div><button className="icon-button" onClick={reset} title="Restablecer valores"><RotateCcw size={17} /></button></div>
      <div className="form-grid">
        <Field label="Cajas del lote" tip="Número total de cajas que se moverán."><input className={inputClass} type="number" min="1" value={v.boxes} onChange={e => set('boxes', +e.target.value)} /></Field>
        <Field label="Destino"><select className={inputClass} value={v.destination} onChange={e => { const d = e.target.value; setV({ ...v, destination: d, minutes: DEFAULT_TRUCK_MINUTES[d], people: d === 'Central' ? 0 : v.people }) }}><option>Sucursal</option><option>Bodega</option><option>Central</option></select></Field>
        <Field label="Truckets (0–6)" tip="Vehículos disponibles; cada trucket transporta 4 cajas."><input className={inputClass} type="number" min="0" max="6" value={v.trucks} onChange={e => set('trucks', Math.min(6, Math.max(0, +e.target.value)))} /></Field>
        <Field label="Personas a mano (0–3)" tip="Personal que puede cargar cajas manualmente."><input disabled={v.destination === 'Central'} className={inputClass} type="number" min="0" max="3" value={v.people} onChange={e => set('people', Math.min(3, Math.max(0, +e.target.value)))} /></Field>
        <Field label="Cajas por persona" tip="Capacidad manual considerada por recorrido."><select className={inputClass} value={v.boxesPerPerson} onChange={e => set('boxesPerPerson', +e.target.value)}><option value="2">2 cajas</option><option value="3">3 cajas</option></select></Field>
        <Field label="Minutos por recorrido" tip="Tiempo de un recorrido completo, editable para explorar escenarios."><input className={inputClass} type="number" min="1" value={v.minutes} onChange={e => set('minutes', +e.target.value)} /></Field>
      </div>
      <div className="constraint"><strong>Restricción:</strong> truckets + personas a mano = {v.trucks + v.people} / 9 {v.trucks + v.people > 9 && <b>· Ajusta la combinación</b>}</div>
    </div>
    <div className="panel result-panel">
      <div className="metric-row"><div><span className="metric-label">Capacidad / recorrido</span><strong className="metric-number">{result.capacity}<small> cajas</small></strong></div><div><span className="metric-label">Tiempo calculado</span><strong className="metric-number accent">{result.minutes}<small> min</small></strong></div></div>
      <div className="compare"><div><span>Solo 6 truckets</span><strong>{reference} min</strong></div><div><span>Configuración actual</span><strong>{result.minutes} min</strong></div><div className={saving >= 0 ? 'saving' : 'warning'}><span>{saving >= 0 ? 'Ahorro' : 'Exceso'}</span><strong>{Math.abs(saving)} min · {Math.abs(pct).toFixed(1)}%</strong></div></div>
      <h4>Reparto de cajas por recorrido</h4><div className="trip-list">{result.distribution.map((amount, index) => <div key={index}><span>Recorrido {index + 1}</span><div className="bar-track"><i style={{ width: `${Math.min(100, amount / Math.max(1, result.capacity) * 100)}%` }} /></div><b>{amount} cajas</b></div>)}</div>
      <div className="notice orange-notice"><strong>Observación del estudio</strong><br />La ventaja desaparece si el recorrido mixto tarda <b>15 min</b>. Central solo permite truckets.</div>
    </div>
  </div>
}

function EoqCalculator() {
  const [branch, setBranch] = useState('Sucursal')
  const [brand, setBrand] = useState('I-RUN')
  const [adjust, setAdjust] = useState(0)
  const [holdMult, setHoldMult] = useState(1)
  const [hours, setHours] = useState(2.5)
  const [cash, setCash] = useState(0)
  const list = eoqData[branch].items
  const item = list.find(x => x[0] === brand) || list[0]
  const demand = item[1] * (1 + adjust / 100)
  const holding = eoqData[branch].H * holdMult + demand * (cash / 100)
  const orderCost = (2275 / 55) * hours
  const r = eoqValues({ demand, orderCost, holdingCost: holding, usualOrder: item[2] })
  const curve = Array.from({ length: 15 }, (_, i) => { const q = Math.max(10, Math.round(r.optimal * (.35 + i * .12))); return { q, costo: r.annualCost(q) } })
  const reset = () => { setBranch('Sucursal'); setBrand('I-RUN'); setAdjust(0); setHoldMult(1); setHours(2.5); setCash(0) }
  return <div className="calculator-grid">
    <div className="panel controls-panel">
      <div className="panel-heading"><span className="icon-box teal"><Calculator size={20} /></span><div><h3>Explora el lote económico</h3><p>Compara una política óptima con el pedido habitual.</p></div><button className="icon-button" onClick={reset} title="Restablecer valores"><RotateCcw size={17} /></button></div>
      <div className="form-grid">
        <Field label="Sucursal"><select className={inputClass} value={branch} onChange={e => { setBranch(e.target.value); setBrand(eoqData[e.target.value].items[0][0]) }}><option>Sucursal</option><option>Bodega</option><option>Central</option></select></Field>
        <Field label="Marca"><select className={inputClass} value={brand} onChange={e => setBrand(e.target.value)}>{list.map(x => <option key={x[0]}>{x[0]}</option>)}</select></Field>
        <Field label="Ajuste de demanda" tip="Sensibilidad aplicada a la demanda anual proyectada."><input type="range" min="-50" max="100" value={adjust} onChange={e => setAdjust(+e.target.value)} /><output>{adjust > 0 ? '+' : ''}{adjust}%</output></Field>
        <Field label="Costo de guardar" tip="Multiplicador sobre limpieza y electricidad."><input type="range" min=".5" max="5" step=".5" value={holdMult} onChange={e => setHoldMult(+e.target.value)} /><output>×{holdMult}</output></Field>
        <Field label="Horas por orden"><input className={inputClass} type="number" min="2" max="3.5" step=".5" value={hours} onChange={e => setHours(+e.target.value)} /></Field>
        <Field label="Dinero detenido (% anual)" tip="Opcional; se suma como costo de capital."><input className={inputClass} type="number" min="0" max="100" value={cash} onChange={e => setCash(+e.target.value)} /></Field>
      </div>
      <div className="constraint">D = {number(demand)} cajas/año · S = {money(orderCost)} por orden · H = {money(holding)} por caja/año</div>
    </div>
    <div className="panel result-panel">
      <div className="metric-row"><div><span className="metric-label">EOQ recomendado</span><strong className="metric-number teal-text">{r.optimal}<small> cajas</small></strong></div><div><span className="metric-label">Punto de reposición</span><strong className="metric-number">{r.reorder}<small> cajas</small></strong></div></div>
      <div className="compare"><div><span>Pedido habitual · {item[2]}</span><strong>{money(r.usualCost)}</strong></div><div><span>Pedido EOQ · {r.optimal}</span><strong>{money(r.optimalCost)}</strong></div><div className="saving"><span>Ahorro asignado</span><strong>{money(Math.max(0, r.usualCost - r.optimalCost))}</strong></div></div>
      <div className="chart-wrap"><ResponsiveContainer width="100%" height={210}><LineChart data={curve}><CartesianGrid strokeDasharray="3 3" stroke="#d8d1c5" /><XAxis dataKey="q" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={v => `Q${Math.round(v)}`} /><Tooltip formatter={v => money(v)} labelFormatter={v => `Pedido de ${v} cajas`} /><Line type="monotone" dataKey="costo" stroke="#0E7A76" strokeWidth={3} dot={false} /><Line data={[{ q: item[2], costo: r.usualCost }]} dataKey="costo" stroke="#F58A4B" dot={{ r: 5 }} activeDot={false} /></LineChart></ResponsiveContainer></div>
      <div className="legend"><span><i className="dot teal-dot" /> Curva de costo total</span><span><i className="dot orange-dot" /> Pedido habitual / referencia</span></div>
      <div className="notice teal-notice">El costo solo cubre limpieza y electricidad: es una referencia del modelo, <b>no un ahorro comprobado</b>.</div>
    </div>
  </div>
}

function QueueSimulator() {
  const [lots, setLots] = useState(defaultLots)
  const [priority, setPriority] = useState('sales')
  const [prep, setPrep] = useState(0)
  const [move, setMove] = useState(0)
  const reset = () => { setLots(defaultLots); setPriority('sales'); setPrep(0); setMove(0) }
  const update = (id, key, value) => setLots(lots.map(l => l.id === id ? { ...l, [key]: key === 'boxes' ? +value : value } : l))
  const schedule = useMemo(() => {
    let cursor = 0
    return lots.map((lot, index) => {
      const base = preparationMinutes(lot.boxes) * (1 + prep / 100)
      const travel = transport({ boxes: lot.boxes, destination: lot.destination, trucks: lot.destination === 'Central' ? 6 : 6, people: lot.destination === 'Central' ? 0 : 2, boxesPerPerson: 3, minutes: DEFAULT_TRUCK_MINUTES[lot.destination] * (1 + move / 100) }).minutes
      const start = cursor
      cursor += base + travel
      return { ...lot, start, end: cursor, wait: Math.max(0, start - index * 75), base, travel }
    })
  }, [lots, prep, move])
  const totalPrep = schedule.reduce((a, x) => a + x.base, 0), totalTravel = schedule.reduce((a, x) => a + x.travel, 0)
  const minutes = m => `${Math.floor(m / 60)} h ${Math.round(m % 60).toString().padStart(2, '0')} min`
  return <div className="queue-wrap">
    <div className="panel">
      <div className="panel-heading"><span className="icon-box orange"><Clock3 size={20} /></span><div><h3>Escenario editable de ingresos</h3><p>La simulación conserva los supuestos de jornada y continuidad.</p></div><button className="icon-button" onClick={reset} title="Restablecer valores"><RotateCcw size={17} /></button></div>
      <div className="queue-controls"><Field label="Prioridad"><select className={inputClass} value={priority} onChange={e => setPriority(e.target.value)}><option value="sales">Mayor venta mensual</option><option value="arrival">Orden de llegada</option></select></Field><Field label="Preparación"><input type="range" min="-20" max="20" value={prep} onChange={e => setPrep(+e.target.value)} /><output>{prep > 0 ? '+' : ''}{prep}%</output></Field><Field label="Traslado"><input type="range" min="-20" max="20" value={move} onChange={e => setMove(+e.target.value)} /><output>{move > 0 ? '+' : ''}{move}%</output></Field></div>
      <div className="table-scroll"><table><thead><tr><th>Marca</th><th>Destino</th><th>Cajas</th><th>Día</th><th>Hora</th></tr></thead><tbody>{lots.map(l => <tr key={l.id}><td><input value={l.brand} onChange={e => update(l.id, 'brand', e.target.value)} /></td><td><select value={l.destination} onChange={e => update(l.id, 'destination', e.target.value)}><option>Sucursal</option><option>Bodega</option><option>Central</option></select></td><td><input type="number" value={l.boxes} onChange={e => update(l.id, 'boxes', e.target.value)} /></td><td><select value={l.day} onChange={e => update(l.id, 'day', e.target.value)}><option>Lun</option><option>Mar</option><option>Mié</option><option>Jue</option><option>Vie</option></select></td><td><input value={l.time} onChange={e => update(l.id, 'time', e.target.value)} /></td></tr>)}</tbody></table></div>
      <div className="notice muted-notice"><b>Jornada efectiva:</b> lunes a viernes 08:30–13:00 y 14:00–17:00 · sábado 08:30–13:00 · domingo cerrado. Un lote no se interrumpe y continúa en el siguiente período.</div>
    </div>
    <div className="panel queue-output"><div className="metric-row"><div><span className="metric-label">Espera efectiva promedio</span><strong className="metric-number">{minutes(schedule.reduce((a, x) => a + x.wait, 0) / schedule.length)}</strong></div><div><span className="metric-label">Carga del proceso</span><strong className="metric-number teal-text">{Math.round(totalPrep / (totalPrep + totalTravel) * 100)}<small>% prep.</small></strong></div></div><div className="split-bar"><span style={{ width: `${totalPrep / (totalPrep + totalTravel) * 100}%` }}>Preparación {Math.round(totalPrep / (totalPrep + totalTravel) * 100)}%</span><b>Traslado {Math.round(totalTravel / (totalPrep + totalTravel) * 100)}%</b></div><h4>Secuencia simulada · prioridad: {priority === 'sales' ? 'ventas mensuales' : 'llegada'}</h4><div className="gantt">{schedule.map((x, i) => <div className="gantt-row" key={x.id}><span>{x.brand}</span><div><i style={{ left: `${x.start / Math.max(1, schedule.at(-1).end) * 100}%`, width: `${(x.end - x.start) / Math.max(1, schedule.at(-1).end) * 100}%` }} /> </div><small>{minutes(x.end)}</small></div>)}</div><div className="table-scroll"><table><thead><tr><th>Lote</th><th>Inicio</th><th>Fin traslado</th><th>Espera efectiva</th></tr></thead><tbody>{schedule.map(x => <tr key={x.id}><td>{x.brand}</td><td>{minutes(x.start)}</td><td>{minutes(x.end)}</td><td>{minutes(x.wait)}</td></tr>)}</tbody></table></div></div>
  </div>
}

function App() {
  const [menu, setMenu] = useState(false)
  return <div className="app">
    <div className="progress" />
    <header className="nav"><a href="#inicio" className="brand"><Logo /><span>NEFNODEL<span> · UMG</span></span></a><button className="menu-button" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button><nav className={menu ? 'open' : ''}>{sectionLinks.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>{label}</a>)}</nav></header>
    <main>
      <section id="inicio" className="hero dark-section"><ShoeWatermark className="hero-shoe" /><div className="hero-grid"><Reveal><span className="eyebrow orange-eyebrow">INVESTIGACIÓN DE OPERACIONES · 2026</span><h1>Decisiones que<br /><em>mueven</em> inventario.</h1><p className="hero-copy">Aplicación de la investigación de operaciones en la distribuidora de calzado NEFNODEL, Huehuetenango.</p><div className="hero-meta"><span><b>Equipo</b> María Méndez Guzmán · Ana Paula Merida · Anghelo Tello Tello</span><span><b>Presentación</b> 27 de octubre de 2026</span></div><a className="button primary" href="#modelos">Explorar el estudio <ArrowDown size={17} /></a></Reveal><Reveal delay={.15}><div className="hero-orbit"><div className="orbit-card"><span>3</span><small>modelos aplicados</small></div><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="hero-tag">HUEHUETENANGO<br /><b>GUATEMALA</b></div></div></Reveal></div></section>
      <Section id="modelos" dark><ShoeWatermark className="section-shoe section-shoe-left" /><SectionAccent label="NEFNODEL / 03" /><div className="content"><SectionTitle eyebrow="01 · RESUMEN" title="Una operación, tres lentes." copy="Traducimos situaciones cotidianas de NEFNODEL en decisiones medibles: mover, abastecer y recibir." light /><div className="model-cards"><Reveal><article className="model-card orange-card"><span>01</span><Truck /><h3>Transporte</h3><p>Capacidad y recorridos para reducir minutos de traslado entre sucursales.</p><a href="#transporte">Abrir modelo <ArrowRight size={16} /></a></article></Reveal><Reveal delay={.1}><article className="model-card teal-card"><span>02</span><BarChart3 /><h3>Inventario · EOQ</h3><p>Una cantidad de pedido que equilibra ordenar y conservar existencias.</p><a href="#eoq">Abrir modelo <ArrowRight size={16} /></a></article></Reveal><Reveal delay={.2}><article className="model-card cream-card"><span>03</span><Clock3 /><h3>Cola de ingresos</h3><p>Una vista temporal del flujo de lotes, preparación y llegada a cada destino.</p><a href="#cola">Abrir modelo <ArrowRight size={16} /></a></article></Reveal></div></div></Section>
      <Section id="empresa"><TopicWatermark type="warehouse" className="watermark-company" /><SectionAccent label="OPERACIÓN / 24·7" /><div className="content"><SectionTitle eyebrow="02 · CONTEXTO" title="El pulso de NEFNODEL." copy="Una red local con decisiones operativas que se repiten todos los días." /><div className="company-layout"><div className="stats-grid">{[['03', 'tiendas'], ['15', 'marcas'], ['12', 'bodegas'], ['09', 'bodegueros'], ['06', 'truckets'], ['04', 'cajas / trucket']].map(([n, l]) => <Reveal key={l}><div className="stat"><strong>{n}</strong><span>{l}</span></div></Reveal>)}</div><div className="company-story"><div className="store-list"><div><b>Sucursal</b><span>Deportivo</span></div><div><b>Bodega</b><span>Dama</span></div><div><b>Central</b><span>Caballero</span></div></div><div className="flow"><span>Compra</span><ArrowRight /><span>Registro</span><ArrowRight /><span>Traslado</span><ArrowRight /><span>Ordenamiento</span><ArrowRight /><span>Venta</span></div></div></div></div></Section>
      <Section id="transporte" dark><TopicWatermark type="transport" className="watermark-transport" /><div className="content"><SectionTitle eyebrow="03 · MODELO 1" title="Mover más, esperar menos." copy="Calcula cómo una combinación de truckets y carga manual cambia el tiempo total de un lote." light /><TransportCalculator /><div className="limitations"><strong>Supuestos y límites</strong><span>La capacidad se considera constante por recorrido; no representa tráfico, averías, carga/descarga ni disponibilidad real de personal.</span></div></div></Section>
      <Section id="eoq"><TopicWatermark type="boxes" className="watermark-boxes" /><div className="content"><SectionTitle eyebrow="04 · MODELO 2" title="El tamaño justo del pedido." copy="El EOQ encuentra el equilibrio entre costo de ordenar y costo de mantener inventario." /><EoqCalculator /><div className="limitations"><strong>Qué NO demuestra este modelo</strong><span>EOQ no garantiza ventas, disponibilidad de proveedores, ni que el ahorro sea efectivo. Es una referencia con demanda proyectada y costos simplificados.</span></div></div></Section>
      <Section id="cola" dark><TopicWatermark type="queue" className="watermark-queue" /><div className="content"><SectionTitle eyebrow="05 · MODELO 3" title="Cuando cada minuto cuenta." copy="Simula la cola de ingresos bajo una jornada real de trabajo y distintas reglas de prioridad." light /><QueueSimulator /><div className="limitations"><strong>Supuestos y límites</strong><span>La simulación no predice ausencias, urgencias, cambios de ventas ni interrupciones operativas. Las horas son relativas para comparar escenarios.</span></div></div></Section>
      <Section id="escenarios"><div className="content"><SectionTitle eyebrow="06 · COMPARADOR" title="La misma operación, tres decisiones." copy="Una lectura rápida de lo que cambia cuando el supuesto cambia." /><div className="scenario-grid">{[['Referencia', '24 cajas / recorrido', 'Punto de partida', 'navy'], ['Propuesto', '30 cajas / recorrido', 'Mezcla operativa', 'orange'], ['Crítico', '15 min / recorrido mixto', 'La ventaja desaparece', 'teal']].map(([title, value, desc, color]) => <div className={`scenario ${color}`} key={title}><span>{title}</span><strong>{value}</strong><p>{desc}</p><ArrowRight /></div>)}</div><div className="quote-card">“Un modelo no reemplaza el criterio del equipo: lo vuelve visible, comparable y conversable.”</div></div></Section>
      <Section id="conclusiones" dark><div className="content"><SectionTitle eyebrow="07 · CIERRE" title="De los números a la acción." copy="La investigación ordena preguntas; la operación decide cómo responderlas." light /><div className="closing-grid"><div><h3>Conclusiones</h3><ul><li>La capacidad mixta permite explorar ahorros de tiempo en Sucursal y Bodega.</li><li>El EOQ sirve como señal para revisar pedidos habituales y su costo.</li><li>La cola muestra que la preparación domina el tiempo total bajo los supuestos dados.</li></ul></div><div><h3>Recomendaciones</h3><ul><li>Registrar minutos reales por recorrido y cajas por lote durante una semana.</li><li>Revisar el pedido económico por marca cada mes.</li><li>Usar una regla de prioridad explícita al liberar ingresos.</li></ul></div></div><div className="references"><h3>Referencias</h3><p>Hillier, F. S., y Lieberman, G. J. (2010). <i>Introducción a la investigación de operaciones</i> (9.ª ed.). McGraw-Hill.</p><p>Taha, H. A. (2012). <i>Investigación de operaciones</i> (9.ª ed.). Pearson Educación.</p></div></div></Section>
    </main>
    <footer><div className="brand"><Logo /><span>NEFNODEL · UMG</span></div><span>Proyecto académico · Universidad Mariano Gálvez · 2026</span><a href="#inicio">Volver arriba ↑</a></footer>
  </div>
}

export default App
