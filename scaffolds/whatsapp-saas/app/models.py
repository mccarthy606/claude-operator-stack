"""Typed Pydantic models for the slice of the WhatsApp Cloud API payload we use.

Meta's payload is large and evolves. This file does not try to model every
field — only the parts the scaffold reads. Add fields as you need them rather
than mirroring the whole schema upfront.
"""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class TextPayload(BaseModel):
    body: str


class InboundMessage(BaseModel):
    """A single inbound message from Meta's `messages` array."""

    id: str
    from_: str = Field(alias="from")  # E.164 number, no leading '+'
    timestamp: str
    type: Literal[
        "text",
        "image",
        "audio",
        "video",
        "document",
        "interactive",
        "button",
        "location",
        "sticker",
        "reaction",
        "contacts",
        "order",
        "system",
    ]
    text: TextPayload | None = None

    model_config = {
        "populate_by_name": True,
        "extra": "ignore",
    }


class Contact(BaseModel):
    wa_id: str
    profile: dict[str, Any] | None = None


class Metadata(BaseModel):
    display_phone_number: str
    phone_number_id: str


class ChangeValue(BaseModel):
    messaging_product: str
    metadata: Metadata
    contacts: list[Contact] = Field(default_factory=list)
    messages: list[InboundMessage] = Field(default_factory=list)

    model_config = {"extra": "ignore"}


class Change(BaseModel):
    field: str
    value: ChangeValue


class Entry(BaseModel):
    id: str
    changes: list[Change]


class WebhookPayload(BaseModel):
    """Top-level payload Meta POSTs to the webhook for `messages` events."""

    # Aliased to avoid shadowing the builtin ``object``. Pydantic accepts
    # either name on input thanks to ``populate_by_name``.
    object_type: str = Field(alias="object")
    entry: list[Entry]

    model_config = {"populate_by_name": True}


# --- Internal classification labels ---------------------------------------

ClassificationLabel = Literal["question", "lead", "complaint", "spam"]


class ClassificationResult(BaseModel):
    label: ClassificationLabel
    raw: str  # raw model output, kept for debugging
