FROM dunglas/frankenphp:1-php8.3

WORKDIR /app

# Install dependency sistem
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    nodejs \
    npm \
    libzip-dev \
    && docker-php-ext-install zip pdo_mysql

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy composer terlebih dahulu agar cache Docker optimal
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction

# Copy package.json
COPY package*.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Build asset Vite
RUN npm run build

# Optimasi Laravel
RUN php artisan package:discover --ansi
RUN php artisan storage:link || true

EXPOSE 8000

CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=8000