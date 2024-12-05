export async function getAccessToken() {
    let token = Cookies.get("accessToken");
    let refreshToken = getRefreshToken();

    if(refreshToken == null || refreshToken.length === 0) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return null;
    }

    if(token == null || token.length === 0) {
        await fetch("http://localhost:1612/api/auth/refresh-token",{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({refreshToken : refreshToken})
        }).then(response => {
            if(!response.ok) {
                let status = response.status;
                if(status === 408) {
                    Cookies.remove("refreshToken");
                }
                return null;
            }
            return response.text();
        }).then(data => {
            token = data;
            setAccessToken(token);
        });
    }

    return token;
}

export async function getSasToken() {
    let sasToken = Cookies.get("sasToken");
    let accessToken = getAccessToken();

    if(sasToken == null || sasToken.length === 0) {
        let response = await fetch("http://localhost:1612/api/private/getsaskey",{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if(response.ok) {
            sasToken = response.text();
            setSasToken(sasToken);
        }
    }

    return sasToken;

}

export function setSasToken(token) {
    Cookies.set("sasToken",token,{expires: 1 / 24});
}


export function setAccessToken(token) {
    Cookies.set("accessToken",token,{expires: 1 / 24});
}

export function getRefreshToken() {
    return Cookies.get("refreshToken");
}

export function setRefreshToken(token) {
    Cookies.set("refreshToken",token,{expires: 60});
}

export async function isLoggedIn() {
    const token = await getAccessToken();
    return token != null;
}


export function logOut() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
}