FROM node:18 as frontendBuilder
WORKDIR /app/frontend
COPY frontend .
RUN yarn install && yarn build


FROM denoland/deno:1.32.2
WORKDIR /app/backend
COPY backend .
COPY --from=frontendBuilder app/frontend/dist static
RUN deno cache main.ts --import-map=import_map.json --lock=deno.lock --lock-write
EXPOSE 8080
CMD ["run", "-A", "main.ts"]
