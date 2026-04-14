FROM node:20-alpine AS frontend-builder

WORKDIR /app/web

COPY web/package*.json ./
RUN npm ci

COPY web/ .
RUN npm run build

FROM python:3.14-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY api/pyproject.toml api/uv.lock ./

RUN uv sync --frozen

COPY api/src ./src

# OBS: Copia o frontend compilado do Stage 1 para dentro da pasta da API
# O FastAPI vai servir estes arquivos como estáticos
COPY --from=frontend-builder /app/web/dist ./src/static

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]