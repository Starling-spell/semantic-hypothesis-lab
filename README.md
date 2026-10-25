# SemanticHypothesisLab

Experimental GenLayer primitive for **reversible finite-family learning from authored examples**. Not a reality oracle, service-delivery verifier, graph, settlement system, permission certificate or production-audited protocol.

One deployment fixes three natural-language input features and one independently evaluated target predicate. Its teacher supplies pinned public documents, never feature vectors or desired labels. GenLayer validators fetch the full documents and independently interpret all four predicates. Exact normalized reports must agree before an example can constrain the hypothesis set.

The hypothesis family is every distinct three-input Boolean function expressible as a disjunction of at most two conjunctions of positive/negative literals, including constants. Duplicate syntax is collapsed to unique eight-bit truth tables. `scripts/reference.mjs` independently enumerates the family as sets of satisfying tuples.

## Consequential mechanism

- **Teach:** exact semantic feature/target labels filter all surviving hypotheses. The resulting set, not a graph head, is the maintained object.
- **Query:** YES/NO only when every surviving hypothesis agrees on the input pattern; otherwise UNDETERMINED. An empty version space returns CONTRADICTORY for **every** pattern, never vacuous YES.
- **Next experiment:** choose the input pattern maximizing the smaller YES/NO partition, breaking ties by pattern number. Counts are model counts, **not probabilities**. The suggestion is hypothetical; no document is invented or acquired automatically.
- **Conflict:** publish a deterministic deletion-minimal inconsistent example core. This is not a minimum-cardinality core and does not identify a false source.
- **Withdraw:** only the immutable teacher may deactivate an example. Recompute from all remaining active examples, allowing previously eliminated hypotheses to return. Preserve original evidence and action records; never rewrite a historical interpretation.
- **Ambiguity/failure:** UNKNOWN, unavailable or mismatched evidence adds no training constraint. Malformed model output reverts without consuming the action ID. Every re-teach fetches and interprets again; an immutable per-content semantic pin detects drift. Concurrent duplicate active content is held, including URL aliases.

## Scope and trust

This learns a restricted **interpretation of a teacher-selected corpus**, not a universally correct rule. Agreement on a query is conditional on the finite model family, all active interpretations, and the three supplied features. The target may depend on omitted variables or fall outside the family. Contradictions require corpus revision or a separately deployed, explicitly different experiment—not silent approximation. Withdrawal restores consistency, not truth.

The teacher can curate/poison/withdraw its own examples. It cannot submit labels or publish a handpicked hypothesis. Anyone can read/query; only the constructor's native sender can teach/withdraw. No owner-controlled graph, proposals, consumed capabilities, transfers, funds, queues or external execution. SHA-256 proves fetched-byte binding, not publisher authenticity or actual events. Fixture documents are synthetic demonstrations. Consensus and instruction/data separation do not prove immunity to prompt injection or shared model mistakes.

Sources are full-commit `raw.githubusercontent.com` `.txt` files (1–4096 UTF-8 bytes). All acquisition metadata, body, hash and four semantic decisions participate in independent comparison. Failed, partial or truncated acquisitions never constrain learning. This deliberate endpoint restriction limits SSRF surface and makes byte commitments reproducible, but restricts supported sources.

## Reproduce

```powershell
python -m pip install -r requirements-dev.txt
genvm-lint check contracts/SemanticHypothesisLab.py --json
python -m pytest tests -q
npm ci --ignore-scripts
node --test tests/reference.test.mjs
node scripts/sdk-check.mjs
```

26 Python direct/helper/callback tests plus 3 independent JavaScript tests. Exhaustive test compares all 3^8 = 6,561 partial labelings against an independently represented family; every family member is identified by at most eight adaptive tests. Direct tests alone do **not** establish validator consensus. A Windows-only fixture defers gltest's known open-temporary-file unlink (`WinError 32`) until cleanup; it does not suppress contract/runtime failures.

The live workflow uses GenLayer CLI 0.39.2, a dedicated native encrypted test account and gasless StudioNet (61999). Never paste/export a private key. Clean clones install the CLI separately, unlock the dedicated account natively, and set `SHL_CLI_PATH` to its `dist/index.js` if using the owned proof scripts. `SHL_TEST_ACCOUNT` is a **public local account name**, not a key. The sibling CLI fallback is a workspace convenience, not a bundled dependency.

`scripts/complete-proofs.mjs COMMIT` journals intent and native nonce before each serial send. Known hashes are receipt-checked, not rebroadcast. If broadcast returns no hash, stop and audit signer/contract history before retrying. Read-only verification is separate and cannot send a transaction. A finalized execution error is a negative proof, never a successful transition. Native Windows HTTPS remains narrowly restricted to Studio and this repository's pinned fixture paths.

Deployment and live proof results are recorded separately once verified. No portal submission has been made automatically.

## Related work and architecture boundary

`docs/architecture.md` compares this state model with the earlier mechanisms. No global novelty or reviewer acceptance is claimed. This is one representative mechanism, not parallel domain variants. Generic acquisition, encrypted CLI orchestration, receipt checking and Windows test cleanup are adapted from [SemanticArrivalPolicer](https://github.com/stoneforger10/semantic-arrival-policer); its metering architecture is not reused.

API: `get_configuration`, `get_space`, `teach(action_id, coordinate, sha256)`, `withdraw(action_id, example_id)`, `get_record(action_id)`, `query(pattern)`. Pattern bit 0 corresponds to feature A, bit 1 to B, bit 2 to C. IDs are immutable within this deployment. At most 16 active examples; withdrawal frees capacity, with no lifetime action cap. Historical evidence storage grows with calls and is not free in production.

Runtime references: [GenLayer nondeterminism](https://docs.genlayer.com/developers/intelligent-contracts/features/non-determinism), [SDK run_nondet_unsafe](https://sdk.genlayer.com/v0.2.9/api/genlayer.html). The custom validator checks independently re-derived substance, not merely valid JSON.
