import { RBMap } from "@vlcn.io/datastructures-and-algos/RedBlackMap";
import { Tuple2 } from "./tuple";
import { comparator } from "./consolidation";

export type Entry<T extends Value> = readonly [T, Multiplicity];
export type Multiplicity = number;
export type PrimitiveValue = string | number | boolean | bigint;
export type JoinableValue<K extends PrimitiveValue, V extends Value> = Tuple2<
  K,
  V
>;
export type Value = any;

/**
 * A naive implementation of a multi-set.
 * I.e., no optimization is going on here.
 */
export class Multiset<T extends Value> {
  constructor(public readonly entries: readonly Entry<T>[]) {}

  // Is this how we really want to do difference?
  // Or should we do it in a normalize way which will actually shrink the size of the multiset?
  difference(b: Multiset<T>): Multiset<T> {
    return new Multiset([...this.entries, ...b.negate().entries]);
  }

  differenceAndConsolidate(b: Multiset<T>): Multiset<T> {
    return this.difference(b).consolidate();
  }

  concat<O extends Value>(b: Multiset<O>): Multiset<T | O> {
    return new Multiset<T | O>([...this.entries, ...b.entries]);
  }

  negate(): Multiset<T> {
    return new Multiset(
      this.entries.map(([value, multiplicity]) => [value, -multiplicity])
    );
  }

  // aka normalize
  consolidate(): Multiset<T> {
    return new Multiset([...this.#toNormalizedMap()]);
  }

  map<R extends Value>(f: (value: T) => R): Multiset<R> {
    return new Multiset(
      this.entries.map(([value, multiplicity]) => [f(value), multiplicity])
    );
  }

  filter(f: (value: T) => boolean): Multiset<T> {
    return new Multiset(this.entries.filter(([value, _]) => f(value)));
  }

  reduce<R extends Value>(
    f: (values: Multiset<T>) => Multiset<R>
  ): Map<T, Multiset<R>> {
    const byKey = new Map<T, Entry<T>[]>();
    for (const [value, multiplicity] of this.entries) {
      const existing = byKey.get(value);
      if (existing === undefined) {
        byKey.set(value, [[value, multiplicity]]);
      } else {
        existing.push([value, multiplicity]);
      }
    }

    const ret = new Map<T, Multiset<R>>();
    for (const [value, entries] of byKey) {
      ret.set(value, f(new Multiset(entries)));
    }
    return ret;
  }

  iterate(f: (values: Multiset<T>) => Multiset<T>) {
    // apply f to the multiset in turn until the multiset stops changing
    // f must only be combinations of the public operations of this class
    let current: Multiset<T> = this;
    let next = f(current);
    while (!current.equals(next)) {
      current = next;
      next = f(current);
    }
  }

  equals(b: Multiset<T>): boolean {
    const a = this.#toNormalizedMap();
    const bMap = b.#toNormalizedMap();
    if (a.size !== bMap.size) {
      return false;
    }

    for (const [value, multiplicity] of a) {
      const bMultiplicity = bMap.get(value);
      if (bMultiplicity === undefined || bMultiplicity !== multiplicity) {
        return false;
      }
    }

    return true;
  }

  #toNormalizedMap(): RBMap<T, Multiplicity> {
    const ret = new RBMap<T, Multiplicity>(comparator);
    for (const [value, multiplicity] of this.entries) {
      if (multiplicity == 0) {
        continue;
      }

      const existing = ret.get(value);
      if (existing === undefined) {
        ret.set(value, multiplicity);
      } else {
        const sum = existing + multiplicity;
        if (sum === 0) {
          ret.delete(value);
        } else {
          ret.set(value, sum);
        }
      }
    }

    return ret;
  }

  toString() {
    return this.entries.toString();
  }

  _extend(other: Multiset<T>) {
    for (const e of other.entries) {
      (this.entries as Entry<T>[]).push(e);
    }
  }
}

// export function join(
//   left: Multiset<JoinableValue>,
//   right: Multiset<JoinableValue>
// ) {
//   const ret = new Map<PrimitiveValue, Entry<JoinableValue[1]>[]>();
//   for (const [value, multiplicity] of left.entires) {
//     if (multiplicity === 0) {
//       continue;
//     }

//     let existing = ret.get(value[0]);
//     if (existing === undefined) {
//       existing = [];
//       ret.set(value[0], existing);
//     }
//     existing.push([value[1], multiplicity]);
//   }
// }

/*
const ret = this.#toNormalizedMap();

for (const [value, multiplicity] of b.entires) {
  if (multiplicity == 0) {
    continue;
  }
  const existing = ret.get(value);
  if (existing === undefined) {
    if (multiplicity > 0) {
      ret.set(value, -multiplicity);
    } else {
      ret.set(value, multiplicity);
    }
  } else {
    let sum = 0;
    if (multiplicity > 0) {
      sum = existing - multiplicity;
    } else {
      sum = existing + multiplicity;
    }
    
    if (sum === 0) {
      ret.delete(value);
    } else {
      ret.set(value, sum);
    }
  }
}
*/
