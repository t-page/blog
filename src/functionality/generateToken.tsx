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

const scope: string = 'user-read-private user-read-email';
const authUrl: URL = new URL("https://accounts.spotify.com/authorize")

// generated in the previous step
window.localStorage.setItem('code_verifier', codeVerifier);

async function getToken(code: any): Promise<TaskOption<string>> {
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

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('access_token', response.access_token);
    console.log("YOYOYOYOYOYOOYYO");
    console.log(response.access_token);

    return () => response.access_token
}

const rawParams = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge, // Promise
    redirect_uri: redirectUri,
};

const resolvedParams = {
    ...rawParams,
    code_challenge: await rawParams.code_challenge,
};

function extractedCode(): string | null {
    authUrl.search = new URLSearchParams(resolvedParams).toString();
    window.location.href = authUrl.toString();

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

const resolvedToken = {
    token: await getToken(extractedCode())
}

export function createToken(): TaskOption<string> {
    if (localStorage.getItem('access_token') == null) {
        return resolvedToken.token
    } else {
        return TO.fromNullable(localStorage.getItem('access_token'))
    }
}
