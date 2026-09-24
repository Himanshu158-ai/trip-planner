import dotenv from "dotenv"
dotenv.config();

if(!process.env.GOOGLE_API_KEY){
    throw new Error("GOOGLE_API_KEY is not defined")
}
if(!process.env.PORT){
    throw new Error("PORT is not defined")
}

export const config = {
    googleApiKey: process.env.GOOGLE_API_KEY,
    PORT:process.env.PORT
}
