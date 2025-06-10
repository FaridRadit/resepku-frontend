# Tahap pembangunan (build stage)
# Menggunakan Node.js 18 berbasis Alpine
FROM node:18-alpine as builder

# Set direktori kerja di dalam container
WORKDIR /app/resepsku-frontend

# Salin package.json dan package-lock.json terlebih dahulu untuk memanfaatkan cache Docker
COPY resepsku-frontend/package.json ./
COPY resepsku-frontend/package-lock.json ./

# Instal dependensi
RUN npm install

# Salin sisa kode aplikasi
COPY resepsku-frontend/. ./

# Jalankan build aplikasi React
RUN npm run build

# Tahap produksi (production stage)
# Menggunakan Nginx berbasis Alpine untuk melayani file statis
FROM nginx:alpine

# Salin hasil build dari tahap pembangunan ke direktori default Nginx
COPY --from=builder /app/resepsku-frontend/build /usr/share/nginx/html

# Opsional: Salin konfigurasi Nginx kustom jika Anda memilikinya
# Pastikan file nginx.conf berada di root folder RESEPKU-FRONTEND
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ekspos port 80
EXPOSE 80

# Jalankan Nginx saat container dimulai
CMD ["nginx", "-g", "daemon off;"]