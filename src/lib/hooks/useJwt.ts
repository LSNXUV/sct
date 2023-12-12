
import { useState, useEffect } from "react";

/**
 * 自定义hook，用于获取和设置jwt
 */
export function useJwt() {
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        console.log("初始化jwt"+localStorage.getItem("jwt"));
        setJwt(localStorage.getItem("jwt"));
    }, []);

    useEffect(() => {
        console.log("jwt发生变化: ", jwt);
        if (jwt) {
            localStorage.setItem("jwt", jwt);
        } else {
            localStorage.removeItem("jwt");
        }
    }, [jwt]);

    return [jwt, setJwt] as const;
}



