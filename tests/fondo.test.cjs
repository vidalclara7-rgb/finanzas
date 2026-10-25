// Capacidad: fondo
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const PLAN = { aporte: 100, objetivoFondo: 1000, inicio: "2026-09", saltos: "" };
const FONDO = (saldo) => A.cta(9, "Fondo", saldo, { fondo: true });
const plan = async (page) => {
  await A.ir(page, "mes");
  return page.locator("#plan .item").evaluateAll((els) => els.map((e) => [e.querySelector("span").textContent, e.querySelector(".num").textContent]));
};
const chipOct = (page) => A.texto(page, '[data-plan="2026-10"] .chip');

// Escenario: plan completo
t.test("plan completo", async () => {
  const { page } = await abrir();
  await A.ir(page, "ajustes");
  await page.fill("#aporte", "100");
  await page.fill("#objFondo", "1000");
  await page.fill("#inicio", "2026-09");
  await page.fill("#saltos", "2026-12, diciembre");
  await page.click("#guardarAjustes");
  await A.aviso(page, "Ajustes guardados");
  assert.deepEqual((await A.guardados(page)).settings, { aporte: 100, objetivoFondo: 1000, inicio: "2026-09", saltos: "2026-12" });
  assert.equal(await page.inputValue("#saltos"), "2026-12");
});

// Escenario: plan incompleto
t.test("plan incompleto", async () => {
  const { page } = await abrir();
  await A.ir(page, "ajustes");
  await page.fill("#aporte", "100");
  await page.fill("#inicio", "2026-09");
  await page.click("#guardarAjustes");
  await A.aviso(page, "Completá el aporte, el objetivo y el mes de inicio");
  assert.deepEqual((await A.guardados(page)).settings, {});
});

// Escenario: plan hasta el objetivo
t.test("plan hasta el objetivo", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: { ...PLAN, objetivoFondo: 250 }, cuentas: [FONDO(0)] }) });
  assert.deepEqual(await plan(page), [["septiembre 2026", "100 €"], ["octubre 2026", "200 €"], ["noviembre 2026", "250 €"]]);
});

// Escenario: mes sin aporte
t.test("mes sin aporte", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: { ...PLAN, saltos: "2026-10" }, cuentas: [FONDO(0)] }) });
  assert.deepEqual((await plan(page)).slice(0, 3), [["septiembre 2026", "100 €"], ["octubre 2026", "100 €"], ["noviembre 2026", "200 €"]]);
});

// Escenario: fondo en plan
t.test("fondo en plan", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: PLAN, cuentas: [FONDO(200)] }) });
  await A.ir(page, "mes");
  assert.equal(await chipOct(page), "En plan");
});

// Escenario: fondo atrasado
t.test("fondo atrasado", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: PLAN, cuentas: [FONDO(150)] }) });
  await A.ir(page, "mes");
  assert.equal(await chipOct(page), "Atrasado 50 €");
});

// Escenario: sin cuenta de fondo
t.test("sin cuenta de fondo", async () => {
  const { page } = await abrir({ datos: A.v2({ settings: PLAN, cuentas: [A.cta(1, "Banco A", 100)] }) });
  await A.ir(page, "mes");
  assert.equal(await A.texto(page, "#plan"), "Marcá una cuenta como fondo de emergencia para seguir el plan.");
});
