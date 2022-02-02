async function toModule(action, body, label){
    if(!label){
        label = "labelInfo"
    }
    return await new Promise((resolve, reject) => {
        if(document.getElementById(label)){
            document.getElementById(label).innerText = ""
        }
        fetch(window.location.href, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                'action': action
            },
            body: JSON.stringify(body)
        })
        .then( response => response.json() )
        .then( response => {
            if(document.getElementById(label)){
                switch(response.statut){
                    case "error":
                        document.getElementById(label).style.color = "red"
                        document.getElementById(label).innerText = response.info
                        reject(response)
                        break;

                    case "successful":
                        document.getElementById(label).style.color = "green"
                        document.getElementById(label).innerText = response.info
                        resolve(response)
                        break;  
                        
                }  
            }
            else(
                resolve(response)
            )
        })
        .catch((error) => {
            console.error(error);
        })
    })
}