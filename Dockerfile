FROM denoland/deno:1.32.2
WORKDIR /app/backend
COPY backend .
RUN deno cache main.ts --import-map=import_map.json --lock=deno.lock --lock-write
EXPOSE 8040
CMD ["deno", "task", "start"]
