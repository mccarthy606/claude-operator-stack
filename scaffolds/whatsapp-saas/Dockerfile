# Multi-stage build keeps the runtime image small. Build stage installs uv and
# resolves the lockfile; runtime stage copies only the resolved venv + source.

FROM python:3.12-slim AS builder

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install uv from the official image; pinning the version is recommended in CI.
COPY --from=ghcr.io/astral-sh/uv:0.5.10 /uv /uvx /usr/local/bin/

WORKDIR /app

# Copy only the files needed to resolve deps first — keeps Docker cache hot.
COPY pyproject.toml uv.lock* ./

RUN uv sync --frozen --no-dev --no-install-project

COPY app ./app

RUN uv sync --frozen --no-dev


FROM python:3.12-slim AS runtime

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Copy the resolved venv and source from the builder.
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/app /app/app

# Drop privileges.
RUN addgroup --system app && adduser --system --ingroup app app
USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request, sys; \
r = urllib.request.urlopen('http://127.0.0.1:8000/healthz', timeout=3); \
ok = r.status == 200; \
r.close(); \
sys.exit(0 if ok else 1)"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
