import * as TO from "fp-ts/TaskOption";
import {TaskOption} from "fp-ts/TaskOption";

const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier: string  = generateRandomString(64);

const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

async function base64encode(input: (plain: string) => Promise<ArrayBuffer>): Promise<string>{
    const param = input(codeVerifier).then(res => res)
    const unwrappedArray: ArrayBuffer = await param

    return btoa(String.fromCharCode(...new Uint8Array(unwrappedArray)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

}
const codeChallenge: Promise<string> = base64encode(() => sha256(codeVerifier));

const clientId = '6051dc7872fc4d978f770adfc1bcdaf7';
const redirectUri = 'https://t-page.github.io/blog/';

// const scope: string = 'user-read-private user-read-email';
// const authUrl: URL = new URL("https://accounts.spotify.com/authorize")

// generated in the previous step
window.localStorage.setItem('code_verifier', codeVerifier);

export async function getToken(code: any): Promise<any> {
    // stored in the previous step
    const codeVerifier: string = localStorage.getItem('code_verifier') ?? '';

    const url = "https://accounts.spotify.com/api/token";
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    }

    console.log("MAKING THE CALL")
    const body = await fetch(url, payload);
    const response = await body.json();

    return response.access_token
}
