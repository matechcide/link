function loadPlateau(plateau) {
    const ctx = document.getElementById('plateau').getContext('2d');
    for(let h = 0; h < 832; h += 64){
        for(let w = 0; w < 832; w += 64){
            ctx.drawImage(images["/" + plateau[`${h}!${w}`][0][0] + ".png"], h, w);
            if(plateau[`${h}!${w}`][1]){
                ctx.drawImage(images["/" + plateau[`${h}!${w}`][1][0] + ".png"], h, w);
            }
        };
    }
    return
}