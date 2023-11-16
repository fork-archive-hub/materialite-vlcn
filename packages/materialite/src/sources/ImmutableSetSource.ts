import { PersistentTreap } from "@vlcn.io/ds-and-algos/PersistentTreap";
import { MaterialiteForSourceInternal } from "../core/types.js";
import { Comparator } from "@vlcn.io/ds-and-algos/types";
import { StatefulSetSource } from "./StatefulSetSource.js";

/**
 * A set source that retains its contents in an immutable data structure.
 */
export class ImmutableSetSource<T> extends StatefulSetSource<T> {
  constructor(
    materialite: MaterialiteForSourceInternal,
    comparator: Comparator<T>
  ) {
    super(
      materialite,
      comparator,
      (comparator) => new PersistentTreap(comparator)
    );
  }

  withNewOrdering(comp: Comparator<T>): this {
    const ret = new ImmutableSetSource<T>(this.materialite, comp);
    this.materialite.materialite.tx(() => {
      for (const v of this.value) {
        ret.add(v);
      }
    });
    return ret as any;
  }
}
