module.exports = (name) => {
    let plateau = {};
    for(let h = 0; h < 832; h += 64){
        for(let w = 0; w < 832; w += 64){
            plateau[`${h}!${w}`] = [];
            plateau[`${h}!${w}`][0] = {0 : "herbe"};
            if(Math.floor(Math.random() * Math.floor(100)) > 50 && (h != 0 && h != 768) && (w != 0 && w != 768)){
                plateau[`${h}!${w}`][1] = {0 : "arbre", 1 : 5};
            }
        }
    }
    global.functions.mongodb.insertOne("map", {
        name: name,
        plateau: plateau
    })
    return plateau
}