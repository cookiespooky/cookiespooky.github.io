FROM node:22-alpine

WORKDIR /app

COPY scripts/graph-runtime-server.js /app/scripts/graph-runtime-server.js
COPY scripts/graph-runtime-schema.json /app/scripts/graph-runtime-schema.json
COPY theme/assets/site-graph.json /app/theme/assets/site-graph.json
COPY site_atoms_v12_research_principles/prompts/system-prompt.md /app/site_atoms_v12_research_principles/prompts/system-prompt.md

ENV NODE_ENV=production
ENV GRAPH_RUNTIME_PROVIDER=deepseek
ENV GRAPH_RUNTIME_HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD ["node", "/app/scripts/graph-runtime-server.js"]
