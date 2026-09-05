process.loadEnvFile("./.env")  //dotenv incorporada a node

export const config={
    database:{
        MONGO_URL : process.env.MONGO_URI,
        DB_NAME : process.env.DB_NAME,

    },
    general:{
        PORT:process.env.PORT,
        SECRET: process.env.SECRET,
        COOKIE_NAME : process.env.COOKIE,
    },
    github:{
        CLIENTID: process.env.CLIENTID,
        CLIENTSECRET: process.env.CLIENTSECRET,
        CALLBACKURL: process.env.CALLBACKURL
    }
}