import { expect, test } from "vitest";
import { Multiset } from "../multiset";

/**
 * We need a more efficient difference.
 * One that produces small sets when overlap is small.
 *
 * So no concat negate crazyness.
 *
 * concat + negate + normalize?
 *
 * But carrying these concats forward seems bogus.
 *
 *
 */

test("map then difference, full change", () => {
  const s = new Multiset<number>([
    [1, 1],
    [2, 1],
    [3, 1],
  ]);
  const difference = s.map((v) => v + 1).difference(s);
  expect(difference.entires).toEqual([
    [2, 1],
    [3, 1],
    [4, 1],
    [1, -1],
    [2, -1],
    [3, -1],
  ]);
  const consolidatedDifference = difference.consolidate();
  expect(consolidatedDifference.entires).toEqual([
    [4, 1],
    [1, -1],
  ]);
});

test("map then difference, minor change", () => {
  const s = new Multiset<number>([
    [1, 1],
    [2, 1],
    [3, 1],
  ]);
  const difference = s.map((v) => (v == 3 ? 4 : v)).difference(s);
  const consolidatedDifference = difference.consolidate();
  console.log(consolidatedDifference);
  expect(consolidatedDifference.entires).toEqual([
    [4, 1],
    [3, -1],
  ]);
});
