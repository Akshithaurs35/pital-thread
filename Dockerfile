# ---- Stage 1: prepare files ----
FROM alpine:3.20 AS build
WORKDIR /site
COPY web/ .

# ---- Stage 2: serve ----
FROM nginx:1.27-alpine
COPY --from=build /site /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
