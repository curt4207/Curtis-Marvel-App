import axios from "axios";
import { MD5 } from "crypto-js";

const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY;

const getMarvelCharacters = async (offset = 0) => {
    // ts time stamp
    const ts = new Date().getTime();
    const hash = MD5(ts + privateKey + publicKey).toString()

    const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=20&offset=${offset}`;


    try {
        const response = await axios.get(url);
        return response.data.data.results;
    } catch(error) {
        throw new Error(error.response.data.status)
    }
}

export {getMarvelCharacters} ;