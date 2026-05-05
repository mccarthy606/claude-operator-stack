"""Inbound-message classifier.

One Anthropic call per inbound text. The prompt and the label set live here so
they can change in one place. If you add new labels, also update
`ClassificationLabel` in `models.py`.
"""

from __future__ import annotations

import logging
from typing import get_args

from .deps import get_anthropic_client, get_settings
from .models import ClassificationLabel, ClassificationResult

logger = logging.getLogger(__name__)

_VALID_LABELS: tuple[str, ...] = get_args(ClassificationLabel)

SYSTEM_PROMPT = (
    "You classify inbound WhatsApp messages for a B2B service.\n"
    "Reply with EXACTLY one of these labels and nothing else:\n"
    f"  {', '.join(_VALID_LABELS)}\n"
    "Definitions:\n"
    "- question: the sender wants information; not a buying signal yet\n"
    "- lead: the sender expresses buying intent or asks for pricing/availability\n"
    "- complaint: the sender is dissatisfied or reports a problem\n"
    "- spam: promotional, off-topic, or automated noise\n"
    "If unsure, choose the most conservative label that still helps routing."
)


async def classify_message(text: str) -> ClassificationResult:
    """Classify a single inbound message body.

    Falls back to ``"spam"`` on parse failure rather than raising — a misrouted
    message is recoverable, a 5xx triggers a Meta retry storm.
    """
    settings = get_settings()
    client = get_anthropic_client()

    try:
        response = await client.messages.create(
            model=settings.classifier_model,
            max_tokens=12,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": text[:2000]}],
        )
        raw = response.content[0].text if response.content else ""
    except Exception:
        logger.exception("classifier_call_failed")
        return ClassificationResult(label="spam", raw="")

    label_candidate = raw.strip().lower().split()[0] if raw.strip() else ""
    if label_candidate not in _VALID_LABELS:
        logger.warning(
            "classifier_unrecognised_label",
            extra={"raw": raw, "fallback": "spam"},
        )
        return ClassificationResult(label="spam", raw=raw)

    return ClassificationResult(label=label_candidate, raw=raw)  # type: ignore[arg-type]
