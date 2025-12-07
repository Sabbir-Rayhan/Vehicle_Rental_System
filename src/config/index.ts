import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.join(process.cwd(),".env"),
})

const config = {
    port : process.env.PORT,
    connectionDB : process.env.CONNECTION_STR,
    jwtsecret : process.env.JWTSECRET,
}

export default config