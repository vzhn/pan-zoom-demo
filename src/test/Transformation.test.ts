import {PanZoom1D} from "../transformation/PanZoom1D";

test('translate 1', () => {
  const t = new PanZoom1D()
  t.translate(1)

  expect(t.apply(0)).toEqual(1);
  expect(t.apply(1)).toEqual(2);
});

test('scale 2', () => {
  const t = new PanZoom1D()
  t.scale(2)

  expect(t.apply(0)).toEqual(0);
  expect(t.apply(1)).toEqual(2);
});

test('[translate 1] ⚬ [scale 2]', () => {
  const t = new PanZoom1D()
  t.translate(1)
  t.scale(2)

  expect(t.apply(0)).toEqual(1);
  expect(t.apply(1)).toEqual(3);
});

test('[scale 2] ⚬ [translate 1]', () => {
  const t = new PanZoom1D();
  t.scale(2)
  t.translate(1)

  expect(t.apply(0)).toEqual(2);
  expect(t.apply(1)).toEqual(4);
});

test('inv [translate 1] ⚬ [scale 2]', () => {
  const t = new PanZoom1D();
  t.translate(1)
  t.scale(2)

  const invt = t.inv()

  expect(invt.apply(t.apply(0))).toEqual(0);
  expect(invt.apply(t.apply(1))).toEqual(1);
  expect(invt.apply(t.apply(2))).toEqual(2);
});

test('inv [scale 2] ⚬ [translate 1]', () => {
  const t = new PanZoom1D()
  t.scale(2)
  t.translate(1)

  const invt = t.inv()

  expect(invt.apply(t.apply(0))).toEqual(0);
  expect(invt.apply(t.apply(1))).toEqual(1);
  expect(invt.apply(t.apply(2))).toEqual(2);
});

test('zoomAt A', () => {
  const init = new PanZoom1D();
  const mx = 2

  const t = new PanZoom1D(init.k, init.b)
  t.zoomAt(mx, 2)

  expect(init.inv().apply(mx)).toEqual(t.inv().apply(mx));
})

test('zoomAt B', () => {
  const init = new PanZoom1D();
  init.scale(2)
  init.translate(3);

  const mx = 2

  const t = new PanZoom1D(init.k, init.b)
  t.zoomAt(mx, 2)

  expect(init.inv().apply(mx)).toEqual(t.inv().apply(mx));
})