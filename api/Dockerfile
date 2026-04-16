# Stage 1: Build do frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/web

COPY web/package*.json ./

RUN npm install 

COPY web/ .

RUN npm run build

# Stage 2: Backend
FROM python:3.14-rc-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY api/.python-version ./.python-version

COPY api/pyproject.toml api/uv.lock ./

RUN uv sync --frozen

COPY api/src ./src

# OBS: Copia frontend buildado do Stage 1
COPY --from=frontend-builder /app/web/dist ./src/web/dist

ENV PYTHONPATH=/app/src

EXPOSE 8000

CMD ["/app/.venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]