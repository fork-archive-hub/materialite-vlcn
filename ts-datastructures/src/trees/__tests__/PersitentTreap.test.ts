import { describe, beforeEach, it, expect } from "vitest";
import { PersistentTreap } from "../PersistentTreap.js";

describe("PersistentTreap", () => {
  let treap: PersistentTreap<number>;

  beforeEach(() => {
    treap = new PersistentTreap<number>((a, b) => a - b);
  });

  it("should add values correctly", () => {
    treap = treap.add(10);
    treap = treap.add(5);
    treap = treap.add(15);
    expect(treap.toArray()).toEqual([5, 10, 15]);
  });

  it("should check for contained values", () => {
    treap = treap.add(10);
    expect(treap.contains(10)).toBe(true);
    expect(treap.contains(15)).toBe(false);
  });

  // it("should addOrReplace existing values", () => {
  //   treap = treap.add(10);
  //   treap = treap.addOrReplace(10);
  //   expect(treap.contains(10)).toBe(true);
  //   treap = treap.addOrReplace(15);
  //   expect(treap.contains(15)).toBe(true);
  // });

  it("should remove values correctly", () => {
    treap = treap.add(10);
    treap = treap.add(5);
    treap = treap.delete(10);
    expect(treap.contains(10)).toBe(false);
    expect(treap.toArray()).toEqual([5]);
  });

  it("should map, filter, and reduce correctly", () => {
    treap = treap.add(10);
    treap = treap.add(5);
    treap = treap.add(15);
    expect(treap.map((value) => value * 2)).toEqual([10, 20, 30]);
    expect(treap.filter((value) => value > 10)).toEqual([15]);
    expect(treap.reduce((acc, value) => acc + value, 0)).toBe(30);
  });
});