# Experimental security boundary

Not audited for production. No value is received/transferred; gasless StudioNet proofs use an encrypted dedicated native CLI signer. Keys and credentials must never enter source, logs, scripts or repository history.

- Native constructor sender is the immutable teacher. Only it can mutate its lab. Lost teacher keys prevent further curation; no funds are trapped. No broad admin, pause, delegatecall, proxy or cross-contract write.
- Strict bounded predicates, action IDs, source coordinates, exact full SHA-256 and full-body size/UTF-8 checks. Boolean/integer label coercion is forbidden. Duplicate JSON keys rejected. Query input is 0–7, not a caller-supplied verdict.
- Contract/teacher/action/configuration/preceding state-root binding. No mutation inside nondeterministic callbacks; post-consensus context recheck.
- Independent four-label semantic evaluation on the actual full fetched body. No source hashes as substitutes for documents, no caller summary, no threshold-crossing tolerance. All consequential labels must agree exactly.
- Unknown evidence adds no constraint. Malformed models revert without action-ID/pin/learning writes. Duplicate active bytes and changed semantic interpretations of pinned content do not train. Pins survive withdrawal; historical records remain unchanged.
- Empty version space returns CONTRADICTORY everywhere; no vacuous approval. Conflict cores are deletion-minimal only. Withdrawal recomputes from remaining rows and frees the active bound.
- Full source commits and hashes are immutable-byte anchors, not provenance, authenticity, real-world truth or independent-authority proofs. Synthetic fixtures do not establish live operational outcomes.
- Teacher-selected corpus poisoning, shared LLM errors, prompt injection, model drift and insufficient/omitted features remain risks. Family-unanimous predictions do not prove generalization. Strict equality can prevent progress under model disagreement; no weaker fallback is allowed.
- 16 active examples bounds recomputation. History grows without a lifetime cap; there are no incentives or production storage-cost guarantees. No credits, payments or settlement are implemented or implied.

Pre-deploy checks: GenVM lint and SDK validation, helper/direct authorization/replay/bounds tests, malformed and failed acquisition, independent actual callback test, exhaustive family comparisons, recovery beyond active bound, SDK calldata roundtrips. Solidity-specific analyzers are not applicable to this Python GenVM source. Live proof receipts/source/state must be verified separately before being claimed.

Generic transport/test helpers are adapted from the public SemanticArrivalPolicer build. Unknown send outcomes must be audited against nonce/history; never blindly retry a write.
