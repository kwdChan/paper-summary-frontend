FROM node:lts AS base

FROM base AS development
ENV PORT=3000
WORKDIR /paper-summary
COPY package*.json ./
RUN npm ci
COPY . /paper-summary

CMD [ "npm", "run", "dev" ]

#https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /paper-summary
COPY --from=development /paper-summary/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build
CMD ["npm", "run", "start"]
# Production image, copy all the files and run next

FROM base AS deploy
WORKDIR /paper-summary

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /paper-summary/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /paper-summary/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["next", "start"]