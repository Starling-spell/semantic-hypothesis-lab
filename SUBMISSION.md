# Ready-to-fill submission

Contribution type: **Builder → Intelligent Contracts**

## Title

SemanticHypothesisLab — Reversible Consensus-Grounded Rule Learning

## Notes / Description

SemanticHypothesisLab learns within a finite Boolean rule family from authored examples. Three input predicates and one target are immutable. Validators independently fetch each complete SHA-256-bound document and interpret all four predicates; exact report agreement is required. Callers cannot supply labels or a chosen rule.

Definite examples eliminate inconsistent functions. Queries return YES or NO only with nonempty unanimity; otherwise UNDETERMINED or CONTRADICTORY. A maximin partition selects the next distinguishing test. Contradictions expose a deletion-minimal core; explicit teacher withdrawal restores previously eliminated functions without rewriting history. Unknown, mismatched or duplicate evidence does not train.

StudioNet proofs show narrowing, contradiction blocking, exact recovery and rejected unauthorized/replayed calls. Tests cover all 6,561 partial labelings. Experimental: predictions are conditional on the finite family and corpus, not external truth.

986/1000 characters.

## Evidence

- [Repository](https://github.com/Starling-spell/semantic-hypothesis-lab)
- [Contract source](https://github.com/Starling-spell/semantic-hypothesis-lab/blob/main/contracts/SemanticHypothesisLab.py)
- [Architecture boundary and differences](https://github.com/Starling-spell/semantic-hypothesis-lab/blob/main/docs/architecture.md)
- [Fourteen-receipt proof matrix](https://github.com/Starling-spell/semantic-hypothesis-lab/blob/main/LIVE_PROOFS.md)
- [Machine-readable receipts/state replay](https://github.com/Starling-spell/semantic-hypothesis-lab/blob/main/PROOFS.json)
- [Explorer contract](https://explorer-studio.genlayer.com/address/0x372086B471Aa8E14e8afe9c44D7447719E980494)
- [deploy](https://explorer-studio.genlayer.com/tx/0x1d86e11b3697f5efa81aeccc5ea7d60740b988d789c8aa3466359f56051cdc76)
- [teach-positive](https://explorer-studio.genlayer.com/tx/0x51baef7366214b09ccfcbec347e567e8072d4ab171990253aec77b0d58bb3b22)
- [unknown-held](https://explorer-studio.genlayer.com/tx/0xb9f95d7c9ab63e75d5649b4240962a658b98e360794e805f6844ee53991814d1)
- [hash-mismatch](https://explorer-studio.genlayer.com/tx/0xf4469c56a8efa204d6e94ae5874624909cc42cad93df5fa925b55d3086f746b4)
- [contradiction](https://explorer-studio.genlayer.com/tx/0x3e6bccd75f29dce565e7cc0fff5c2e4f4ea3647b7564164c9e81923e9d532cb9)
- [unauthorized-teach](https://explorer-studio.genlayer.com/tx/0x0cb3aec960ef2efc152f68190bb544ee8388a2de8350bfacdaf33d9b2e396891)
- [unauthorized-withdraw](https://explorer-studio.genlayer.com/tx/0xaf5832362a642d4552c26525beba729efdcfe7fa6f3f5180a25bb7352dd34777)
- [replay](https://explorer-studio.genlayer.com/tx/0x42944d4865859120d4aa3c256a306160751a64e52d78f65df00668fc5a42bed7)
- [withdraw-recovery](https://explorer-studio.genlayer.com/tx/0x7f1d3ecb70686c45179770be33a6548318fa358286c9ec529e4cb9a0cea37674)

## Optional steward response

Implemented one representative finite-family learning mechanism instead of parallel graph variants. Independent GenLayer semantic interpretation determines which hypotheses survive and which distinguishing test is selected. Empty version spaces block every query; explicit withdrawals restore prior candidates. Full source acquisition and exact four-label/evidence agreement replace summaries and confidence tolerances. Matching repository/deployed source and actual positive/negative receipts are linked above. This is corpus-conditioned rule learning, not proof of real-world events or service delivery.

## Scope

8 successful and 6 expected-error finalized transactions; errors are rejection proofs, not successful mutations. Deployment source matched. Not production audited, globally novel by assertion, or guaranteed accepted by a steward. No automatic portal submission.
