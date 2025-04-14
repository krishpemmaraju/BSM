

export default class RequestHeaders {

    private map = new Map<string, any>();

    public setRequestHeaders(key: string, value: any): RequestHeaders {
        this.map.set(key, value);
        return this;
    }

    public get() {
        return Object.fromEntries(this.map);
    }
}