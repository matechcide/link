socket.on('arbreA', (X, Y) => {
    const ctx = document.getElementById('Arbre').getContext('2d');
    ctx.drawImage(images['/herbe.png'], X, Y);
    ctx.drawImage(images['/arbre.png'], X, Y);

    let num = 1;
    const interval = setInterval(function (){ 
        ctx.clearRect(0, 0, 832, 832);
        if (num == 1) {
            ctx.drawImage(images['/herbe.png'], X, Y);
            ctx.drawImage(images['/arbre.png'], X+2, Y);
        }
        else if(num == 2){
            ctx.drawImage(images['/herbe.png'], X, Y);
            ctx.drawImage(images['/arbre.png'], X-2, Y);
        }
        else if(num == 3){
            ctx.drawImage(images['/herbe.png'], X, Y);
            ctx.drawImage(images['/arbre.png'], X+2, Y);
        }
        else if(num == 4){
            ctx.drawImage(images['/herbe.png'], X, Y);
            ctx.drawImage(images['/arbre.png'], X-2, Y);
        }
        else if(num == 5){
            clearInterval(interval);
        }
        num++
    }, 50);

})