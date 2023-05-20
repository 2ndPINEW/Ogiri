FROM denoland/deno:1.32.2
WORKDIR /app/backend
COPY backend .
RUN deno cache main.ts --import-map=import_map.json --lock=deno.lock --lock-write
CMD ["deno", "task", "start"]
