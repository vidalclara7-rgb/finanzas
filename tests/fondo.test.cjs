// Capacidad: fondo
const t = require("node:test");
const assert = require("node:assert/strict");
const A = require("./ayuda.cjs");

const abrir = A.preparar(t);
const plan = async (page) => {
  await A.ir(page, "mes");
  return page.locator("#plan .item").evaluateAll((els) => els.map((e) => [e.querySelector("span").textContent, e.querySelector(".num").textContent]));
};

// Escenario: plan hasta el objetivo
t.test("plan hasta el objetivo", async () => {
  const { page } = await abrir({ datos: A.con({ settings: { ...A.AJUSTES, objetivoFondo: 250 } }) });
  assert.deepEqual(await plan(page), [["septiembre 2026", "100 €"], ["octubre 2026", "200 €"], ["noviembre 2026", "250 €"]]);
});

// Escenario: mes sin aporte
t.test("mes sin aporte", async () => {
  const { page } = await abrir({ datos: A.con({ settings: { ...A.AJUSTES, saltos: "2026-10" } }) });
  assert.deepEqual((await plan(page)).slice(0, 3), [["septiembre 2026", "100 €"], ["octubre 2026", "100 €"], ["noviembre 2026", "200 €"]]);
});

// Escenario: fondo en plan
t.test("fondo en plan", async () => {
  const { page } = await abrir({ datos: A.con() });
  await A.ir(page, "mes");
  await page.fill("#fondoInput", "200");
  await page.click("#guardarFondo");
  await A.aviso(page, "Saldo guardado");
  await A.ir(page, "inicio");
  assert.equal(await A.texto(page, "#fondoVal"), "200 €");
  assert.equal(await A.texto(page, "#chipFondo"), "En plan");
});

// Escenario: fondo atrasado
t.test("fondo atrasado", async () => {
  const { page } = await abrir({ datos: A.con({ meses: { "2026-10": { fondo: 150, checks: {} } } }) });
  assert.equal(await A.texto(page, "#fondoVal"), "150 €");
  assert.equal(await A.texto(page, "#chipFondo"), "Atrasado 50 €");
});

// Escenario: fondo sin anotar
t.test("fondo sin anotar", async () => {
  const { page } = await abrir({ datos: A.con() });
  assert.equal(await A.texto(page, "#fondoVal"), "Sin anotar");
  assert.equal(await A.texto(page, "#chipFondo"), "Anotá el saldo");
});
