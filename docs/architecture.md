# Architecture boundary

Native teacher action → pinned authored document → full contract-side acquisition → independent four-predicate interpretation → exact report comparison → finite version-space filtering → conservative queries, next-test selection and inconsistency diagnostics.

## Responsibilities

Client: choose predicates/representative documents, hold teacher signing authority, display results. No client label, hypothesis, source summary, confidence or result is authoritative.

External publisher: supplies authored text, not guaranteed facts. Full Git commit and SHA-256 bind bytes. No assertion of independent authority from a URL.

GenLayer: independently obtains/compares complete evidence and semantic labels, applies/reverses training constraints, maintains native authorization and immutable action records, computes the exact residual function set and query partitions. Rechecks learning context after consensus. State writes occur only after acquisition and guards.

## Stored state

`teacher: Address`, immutable `configuration: str`; `active_ids: str` bounded list; `records: TreeMap[str,str]` immutable action/evidence records; `pins: TreeMap[str,str]` first definite semantic vector per content hash; `revision: u256` action sequence binding. The version space is recomputed from the bounded active corpus, not independently writable or a mutable graph. Six public methods, no cross-contract writes or token transfers.

Revisions prevent stale evaluation-context substitution; they are not versions of a graph proposal. IDs and source reports are bound to this contract, native teacher, immutable predicates and preceding space root. Withdrawal leaves the content pin in place; reusing the same bytes requires fresh acquisition/interpretation matching that pin.

## Material difference from earlier submissions

| Mechanism | Maintained object / workflow | Consequence |
|---|---|---|
| Graph variants | Nodes, edges, proposals and advancing head | Approved topology transition |
| Certificate variants | Verdict/certificate and consume flag | One-time execution permission |
| BoundedPolicyCompiler | One compiled policy function | Publish compiler output |
| CounterexampleCircuitBreaker | A classifier and counterexample latch | Irreversible circuit break |
| ConstraintBudgetReducer | Original clauses and shorter artifact | Publish accepted compaction |
| SemanticHypothesisLab | Residual family of distinct Boolean functions; reversible corpus | Conditioned predictions, adaptive distinguishing query, irreducible conflict core |

No claim that the generic consensus/acquisition technique itself is novel. The reusable mechanism here is **reversible version-space learning with active test selection and explicit family inconsistency**, not renamed domains or a static graph algorithm inside consensus.

## Algorithm and uncertainty

`H(D) = { h in H0 : for every active example (x,y), h(x)=y }`.

Each hypothesis is a unique eight-bit truth table from the two-term signed-DNF family, avoiding syntactic multiplicity bias in query counts. For each x, partition H(D) by h(x). Choose maximum min(partition sizes), ties smaller x. No subjective confidence threshold or tolerance exists. Nonempty unanimous partitions imply only a finite-family conditional answer. Empty H(D) blocks all answers. UNKNOWN in any semantic dimension does not get coerced to a bit or partially train the model.

An inconsistent subset is reduced in active insertion order, removing a row whenever the remainder is still inconsistent. The result is deletion-minimal and deterministic, not the globally smallest subset or an attribution of blame. A contradictory example can make the whole lab contradictory; the teacher can explicitly withdraw it, with original evidence remaining readable.

## Validator invariant

Source URL/commitment, HTTP status, full UTF-8 body, recomputed hash, acquisition status, complete semantic vector and contract/action/configuration/before-root context must match. The actual callback re-fetches and re-prompts before exact canonical comparison. Well-shaped but semantically changed labels are rejected. Malformed output returns disagreement/reverts, not a business UNKNOWN. No candidate family is supplied by a caller or trusted leader report.
