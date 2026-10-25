# Live proofs — SemanticHypothesisLab

Experimental synthetic authored-example demonstration on **StudioNet**, chain 61999. No production, real-world approval, service delivery, fund transfer or learning-generalization claim.

[Deployed source](https://explorer-studio.genlayer.com/address/0x372086B471Aa8E14e8afe9c44D7447719E980494) · [Contract repository](https://github.com/Starling-spell/semantic-hypothesis-lab/blob/main/contracts/SemanticHypothesisLab.py) · [Machine-readable ledger](https://github.com/Starling-spell/semantic-hypothesis-lab/blob/main/PROOFS.json)

- Address: `0x372086B471Aa8E14e8afe9c44D7447719E980494`
- Normalized deployed source SHA-256: `73d79e944151eea61235c4aa1b444837b9c5035429237c8f7b4b0f5c2a8c429b`
- Published full fixture/source commit: [42a0b8c5a2535f960587d9cf2e5cf15675ae2d65](https://github.com/Starling-spell/semantic-hypothesis-lab/tree/42a0b8c5a2535f960587d9cf2e5cf15675ae2d65)
- 14 finalized transactions: 8 execution successes, 6 expected execution errors. Every receipt is MAJORITY_AGREE, leader-only false, with at least 5 initial validators and 3 explicit agree votes. Idle votes are recorded; this is **not** a unanimity claim.
- Full deployed source comparison, native sender/zero-value/nonce checks, exact contract transaction-history match, seven immutable action records, historical state replay and all eight final queries independently verified read-only.

## Transaction matrix

| Transaction | Finality / execution | Observed consequence | Votes |
|---|---|---|---|
| [deploy](https://explorer-studio.genlayer.com/tx/0x1d86e11b3697f5efa81aeccc5ea7d60740b988d789c8aa3466359f56051cdc76) | FINALIZED / SUCCESS | 158 initial candidates | 3 agree, 2 idle, 0 disagree |
| [teach-negative](https://explorer-studio.genlayer.com/tx/0x828555c842e71a8bbb92f6890c4903341ccb59bb358ad3383dc48e22a0822134) | FINALIZED / SUCCESS | TAUGHT; LEARNING; 89 candidates | 3 agree, 2 idle, 0 disagree |
| [teach-positive](https://explorer-studio.genlayer.com/tx/0x51baef7366214b09ccfcbec347e567e8072d4ab171990253aec77b0d58bb3b22) | FINALIZED / SUCCESS | TAUGHT; LEARNING; 35 candidates | 3 agree, 2 idle, 0 disagree |
| [unknown-held](https://explorer-studio.genlayer.com/tx/0xb9f95d7c9ab63e75d5649b4240962a658b98e360794e805f6844ee53991814d1) | FINALIZED / SUCCESS | UNCERTAIN; LEARNING; 35 candidates | 3 agree, 2 idle, 0 disagree |
| [hash-mismatch](https://explorer-studio.genlayer.com/tx/0xf4469c56a8efa204d6e94ae5874624909cc42cad93df5fa925b55d3086f746b4) | FINALIZED / SUCCESS | HELD; LEARNING; 35 candidates | 3 agree, 2 idle, 0 disagree |
| [duplicate-held](https://explorer-studio.genlayer.com/tx/0x24f45e1b39cf52439983886d4118257329ef3f01d8664742ef83ad44a16b703e) | FINALIZED / SUCCESS | DUPLICATE_HELD; LEARNING; 35 candidates | 3 agree, 2 idle, 0 disagree |
| [contradiction](https://explorer-studio.genlayer.com/tx/0x3e6bccd75f29dce565e7cc0fff5c2e4f4ea3647b7564164c9e81923e9d532cb9) | FINALIZED / SUCCESS | TAUGHT; CONTRADICTORY; 0 candidates | 3 agree, 2 idle, 0 disagree |
| [unauthorized-teach](https://explorer-studio.genlayer.com/tx/0x0cb3aec960ef2efc152f68190bb544ee8388a2de8350bfacdaf33d9b2e396891) | FINALIZED / ERROR | Only teacher | 3 agree, 2 idle, 0 disagree |
| [unauthorized-withdraw](https://explorer-studio.genlayer.com/tx/0xaf5832362a642d4552c26525beba729efdcfe7fa6f3f5180a25bb7352dd34777) | FINALIZED / ERROR | Only teacher | 3 agree, 2 idle, 0 disagree |
| [replay](https://explorer-studio.genlayer.com/tx/0x42944d4865859120d4aa3c256a306160751a64e52d78f65df00668fc5a42bed7) | FINALIZED / ERROR | Action ID already used | 3 agree, 2 idle, 0 disagree |
| [withdraw-recovery](https://explorer-studio.genlayer.com/tx/0x7f1d3ecb70686c45179770be33a6548318fa358286c9ec529e4cb9a0cea37674) | FINALIZED / SUCCESS | WITHDRAW; LEARNING; 35 candidates | 4 agree, 1 idle, 0 disagree |
| [repeat-withdraw](https://explorer-studio.genlayer.com/tx/0x53f2dc18a01ca945ea172b30f8e2fd2543fbcbfcc5c5c1cf14c99119ef0fe62a) | FINALIZED / ERROR | Example is not active | 3 agree, 2 idle, 0 disagree |
| [unsafe-source](https://explorer-studio.genlayer.com/tx/0xc170b98bb3460c68fdac4849aafe5ade24b4873facd404fecfa7b3e56ef39695) | FINALIZED / ERROR | Invalid source | 3 agree, 2 idle, 0 disagree |
| [invalid-id](https://explorer-studio.genlayer.com/tx/0x4cd4a7c57aac8f10c86bf9cb83745f7ec7b23fdcb765a3e364ed315e00757349) | FINALIZED / ERROR | Invalid action ID | 3 agree, 2 idle, 0 disagree |

## Consequential evidence

| Claim | Actual observation | Proof |
|---|---|---|
| Semantic labels affect the learned state | Initial 158 functions narrow to 35; pattern 1 is YES only after independently classified training examples | [teach-positive](https://explorer-studio.genlayer.com/tx/0x51baef7366214b09ccfcbec347e567e8072d4ab171990253aec77b0d58bb3b22) |
| Contradictions cannot produce vacuous YES | Opposing target labels for the same feature pattern leave 0 functions; all eight answers CONTRADICTORY; core positive, conflict | [contradiction](https://explorer-studio.genlayer.com/tx/0x3e6bccd75f29dce565e7cc0fff5c2e4f4ea3647b7564164c9e81923e9d532cb9) |
| Corpus revision is reversible | Withdraw conflicting example; recover exactly the earlier 35-function set and YES for pattern 1; original conflicting evidence still readable | [withdraw-recovery](https://explorer-studio.genlayer.com/tx/0x7f1d3ecb70686c45179770be33a6548318fa358286c9ec529e4cb9a0cea37674) |
| Incomplete or mismatched evidence does not train | UNKNOWN and HASH_MISMATCH preserve the active corpus and candidate set | [unknown-held](https://explorer-studio.genlayer.com/tx/0xb9f95d7c9ab63e75d5649b4240962a658b98e360794e805f6844ee53991814d1), [hash-mismatch](https://explorer-studio.genlayer.com/tx/0xf4469c56a8efa204d6e94ae5874624909cc42cad93df5fa925b55d3086f746b4) |
| Teacher and immutable ID bindings | Native peer cannot teach or withdraw; replay, invalid IDs/source and repeated withdrawal leave no new record | Negative receipts above |

## Local evidence, not onchain claims

26 Python direct/helper/callback tests + 3 independent JavaScript tests pass; six SDK roundtrips and GenVM lint/SDK validation pass. Exhaustive comparison covers 6,561 partial labelings; each family member is identified in at most eight adaptive tests. Actual callback test re-fetches and re-interprets, rejecting a shape-valid changed target. Active-bound recovery, semantic drift, alias duplication and malformed model rollback are **local tests**, not falsely listed as extra live transactions.

Run read-only verification: `node --require ./scripts/native-http.cjs scripts/verify-live.mjs`. It cannot sign/send. Re-render only after it succeeds: `node scripts/render-proofs.mjs`. Complete script nonce journaling is not a substitute for inspecting receipts if transport fails.
