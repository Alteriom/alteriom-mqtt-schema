# 04-deps — the pipeline

Read the bump and its checks, say what it touches, recommend; a person decides.

| Stage | Job | Input | Output | Human check |
|---|---|---|---|---|
| [`01_review`](stages/01_review/CONTEXT.md) | what the bump changes | the bump | `output/review.md` | A person reads `review.md` and decides: merge, wait, or close. A runtime bump that changes any validator's result is never merged from here. |
