import Fastify, { FastifyInstance } from 'fastify'
import middie from '@fastify/middie'
import { JWK, JWKS, Provider } from 'oidc-provider'
import fs from 'fs'
import path from 'path'

const loadKeys = (): JWKS => {
  const key = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '..', 'keys', 'private-rs384.json'),
      'utf8'
    )
  )
  return{
    keys: [
      {
        ...key,
        kid: 'private-rs384',
        use: 'sig',
        alg: 'RS384',
      },
    ]
  }
}

//console.log(keyStore.all())

const server = Fastify()

const provider = new Provider('http://localhost:3000', {
  // refer to the documentation for other available configuration
  clients: [
    {
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['http://lvh.me:8080/cb'],
      // ... other client properties
    },
  ],
  jwks: loadKeys(),
})

const registerMiddleware = async (
  server: FastifyInstance,
  provider: Provider
) => {
  await server.register(middie)
  server.use('/oidc', provider.callback())
}

// Server start function
const start = async () => {
  try {
    await registerMiddleware(server, provider)

    const port = process.env.PORT ? Number(process.env.PORT) : 3000
    await server.listen({ port })
    console.log(
      'Server is running on ' + JSON.stringify(server.server?.address())
    )
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
