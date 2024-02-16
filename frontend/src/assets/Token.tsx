interface Authority {
    authority: string;
}

export interface Decoded {
    authorities: [Authority],
    sub: string,
    iat: number,
    exp: number
}

export interface Token {
    access_token: string;
    refresh_token: string
}

export interface Data {
    email: string;
    password: string;
    confirm: string;
}