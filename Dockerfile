FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip zip curl \
    nodejs npm \
    libzip-dev \
    && docker-php-ext-install pdo_mysql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy seluruh project terlebih dahulu
COPY . .

# Baru install composer
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

RUN npm install

RUN npm run build

EXPOSE 8080

CMD php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=8080