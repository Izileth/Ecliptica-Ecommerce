// Para versões >= 3.x
declare module 'jwt-decode' {
    export function jwtDecode<T = unknown>(token: string): T;
}
declare module 'jwt-decode' {
    function jwt_decode<T = unknown>(token: string): T;
    export default jwt_decode;
}