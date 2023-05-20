FROM denoland/deno:1.32.2
ENV PORT=8080
WORKDIR /app/backend
COPY backend .
RUN deno cache main.ts --import-map=import_map.json --lock=deno.lock --lock-write
EXPOSE 8080
CMD ["deno", "task", "start"]
