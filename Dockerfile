FROM node:20

WORKDIR /app

# Instala NestJS CLI globalmente
RUN yarn global add @nestjs/cli

# Asegurar que el binario de nest está en el PATH
ENV PATH=$PATH:/root/.yarn/bin

# Copia solo package.json y yarn.lock
COPY package.json yarn.lock ./

# Instala las dependencias
RUN yarn install --frozen-lockfile --ignore-engines

# Copia el resto del código (incluyendo `prisma/schema.prisma`)
COPY . .

# Asegurar que Prisma Client se genere correctamente
RUN if [ -f "prisma/schema.prisma" ]; then yarn prisma generate; else echo "⚠️ WARNING: No se encontró prisma/schema.prisma"; fi

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["yarn", "start:dev"]
