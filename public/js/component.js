class component{
    constructor(id){
        this.#div = document.getElementById(id)
        this.#name = this.#div.innerText
        this.#div.innerText = ""
    }

    async refresh(body){
        this.#div.outerHTML = await this.#request(body)
        this.#end()
    }

    async #request(body){
        return new Promise((resolve, reject) => {
            fetch(window.location.origin + "/" + loc.path[0] + "/" + this.#name, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'action': 'components'
                },
                body: JSON.stringify(body)
            })
            .then( response => response.json() )
            .then( response => {
                if(this.#requestResponse(response)){
                    resolve(response.component)
                }
                else{
                    reject(response)
                }
            })
            .catch(this.#error)
        })
    }

    on(event, callBack){
        switch(event){
            case "end":
                this.#end = callBack
                break;

            case "error":
                this.#error = callBack
                break;

            case "requestResponse":
                this.#requestResponse = callBack
                break;

            default:
                break;
        }
    }

    #end = () => { }

    #requestResponse = () => { return true }

    #error = (err) => { throw err }

    #name = ""

    #div = {}
}