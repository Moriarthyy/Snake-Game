// primeiramente pegar o quadrado do desenho
const canvas = document.querySelector("canvas")//usar queryselector dessa forma só pelo nome mesmo ja que só existe um
// criar o ''contexto'' para falar se é 2d ou 3d etc e desenhar fazer tudo.
const ctx = canvas.getContext("2d")
//audio de comida
const audioeat = new Audio("eatfood.mp3")
audioeat.volume = 0.1
const score = document.querySelector(".pontuação")
const menu_death = document.querySelector(".menu_death")
const button_play_again = document.querySelector(".play-again")
const menu_start = document.querySelector(".menu_start")
const button_play = document.querySelector(".play")
const backMenu = document.querySelector(".backToMenu")
const menu_score = document.querySelector(".menu_score")
const highScore = document.querySelector(".high-Score")
const max_point = document.querySelector(".max_point")
const backMenu2 = document.querySelector(".backMenu2")
const audioCollision = new Audio("tuc.mp3")
audioCollision.volume = 0.3
const audioButton = new Audio("button_sound.mp3")
audioButton.volume = 0.3
const menuDifficulty = document.querySelector(".menu_difficulty")
const easy = document.getElementById("easy")
const medium = document.getElementById("medium")
const hard = document.getElementById("hard")








//definir o size tudo vai ser utilizado essas medidas
const size = 30
// o corpo da cobra será uma lista que ira se movimentar 
// para encaixar direito tem que ser multiplo de 30 ja que o size é 30


const initialPosition =  { x: 270, y: 240}

//crio uma variavel para armazenar o pontos começando em 0
let points = 0

const difficulty = {
    easy: 120,
    normal: 80,
    hard: 40
}
let selectedDifficulty = difficulty.normal


let snake = [initialPosition]
const scorePoints = () => {
    points += 20
    score.innerText = points
    if(points >= 200) {
        score.style.color = "yellow"
    }if (points >= 500) {
        score.style.color = "green"
    }if (points >= 1000) {
        score.style.color = "red"
    }
}

//função de criar números aleatorios inteiros
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
    //Math.random - gera um número aleatório maior que zero e menor que um float
    //Math.Round - faz ser um número inteiro
}
//função de criar os números multiplos de 30 para ser a position e caber no campo
const randomPosition = () => {
    const number  = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30 // vai pegar o número float na divisão usar o round ficar inteiro e multiplicar por 30 
}
//função de cor aleatoria 
randomColor = () => {
    // pegar o randomNumber que ja temos e botar no rgb que precisa de 3 valores
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const starterMenu = () => {
    menu_start.style.display = "flex"
}
starterMenu()

const menuHighScore = () => {
    menu_score.style.display = "flex"
}
const menuDifficultySelect = () => {
    menuDifficulty.style.display = "flex"
    
}
const gameScreen = () => {
    menuDifficulty.style.display = "none"
    menu_score.style.display = "none"
    menu_start.style.display = "none"
}



const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

//cria uma lista pra armazenar os scores 
let scores = []

//não funciona
const maxScore = () => {
    const max = Math.max.apply(null, scores)
    max_point.innerHTML = max
}   


// direção e loop id 
//loop id é para parar o set timeout do gameloop pra ter ctz que quando acabar um o outro será finalizado.
let direction, loopId


// função onde vai desenhar a cobra
const drawSnake = () => {
    // passa pessa lista desenhando os elementos
    snake.forEach((position, index) => {
        ctx.fillStyle = randomColor() // pinta o corpo da cobra rainbow
        // mudando a cor da cabeça de acordo com o ultimo item da lista que é o index -1
        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
            
            
        }
        
        // fillrect precisa de x, y, width, e height
        ctx.fillRect(position.x, position.y, size, size)
    })
}
//fazer o desenho da comida no campo
const drawFood = () => {
    // invez de ficar chamando food.x/food.color podemos fazer isso
    const { x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color //cor

    //desenha um circulo como comida
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0
}
//função que ira mover a cobra 
const moveSnake = () => {
    // validação pra ver se possui direção na ''direction''
    if (!direction) return
    
    //pegar a cabeça para mover de acordo com ela
    const head = snake[snake.length - 1] // pode usar o snake.at(-1) mas o intelisense não vai funcionar
    
    // defini os movimentos da cobra de acordo com a tecla pressionada
    if (direction == "right") {
        snake.push({x: head.x + size, y: head.y})
    }
    if (direction == "up") {
        snake.push({x: head.x, y: head.y - size})
    }
    if (direction == "down") {
        snake.push({x: head.x, y: head.y + size})
    }
    if (direction == "left") {
        snake.push({x: head.x - size, y: head.y})
    }


    snake.shift()

}
//fazer as linhas para dividir o campo
const drawGrid = () => {
    ctx.lineWidth = 1 //largura da linha
    ctx.strokeStyle = "black" //cor da linha

    for (let i = 30; i < canvas.width;i += 30){
        // linhas verticais 
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, canvas.width)
        ctx.stroke() //desenha na tela

        // linhas horizontais 
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
    }
}
//função para verificar se houve colisão entre a cobra e a comida
const collisionFood = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        scorePoints()
        snake.push(head)
        audioeat.play()
        let x = randomPosition()
        let y = randomPosition()
        
        //criar loop pra verificar se o x e o y da comida é o mesmo que o da cobra não pode nascer dentro
        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }
        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const backToMenu = () => {
    menu_death.style.display = "flex"
    canvas.style.filter = "blur(2px)"
    score.innerText = "00"
}

//função para verificar se houve colisão nas bordas ou nela mesma
const checkCollisions = () => {
    const head = snake[snake.length -1]
    const borda = canvas.width - size
    const corpo = snake.length - 2 // pega o corpo e não a cabeça

    // verificar as posições e se houve colisão nas bordas
    const colisãoBorda = head.x < 0 || head.x > borda || head.y < 0 || head.y > borda

    // verifica colisão no proprio corpo 
    const colisãoCorpo = snake.find((position, index) => {
        return index < corpo && position.x == head.x && position.y == head.y
    })

    
    if (colisãoBorda || colisãoCorpo) {
        audioCollision.play()
        loseGame()
    }
}
//função que vai fazer as coisas quando você perder 
const loseGame = () => {
    direction = undefined // quando bate fica parado

    
    snake = [initialPosition] // quando perder volta pra posição orignal pra não ficar perdendo infinitamente
    scores.push(points) // adiciona o score da partida atual a lista 
    score.style.color = "black"
    points = 0 // volta o score para 0
    maxScore()
    backToMenu()
}
//muda a posição da comida quando clica no botão de jogar novamente
const RegenerateFood = () => {
    let x = randomPosition()
    let y = randomPosition()
    food.x = x
    food.y = y
    food.color = randomColor()
}


// função do game loop que ira rodar o jogo definitivamente
const gameLoop = () => {
    //limpa o loop pra só ter um rodando
    clearInterval(loopId)

    
    //limpa o rastro da cobra pra não encher a tela.
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    
    //chama função de mover e de desenhar a cobra tem que mover primeiro que desenhar.
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    collisionFood()
    checkCollisions()

    //função que ira chamar o gameLoop infinitamente 
    loopId = setTimeout(() => {
        gameLoop()
    }, selectedDifficulty);
    // para mudar a velocidade da cobra basta mudar o intervalo q chama o gameloop
}
gameLoop()


// começar a fazer a cobra se mexer automaticamente 
document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (key == "ArrowLeft"  && direction != "right") {
        direction = "left"
    }
    if (key == "ArrowDown"  && direction != "up") {
        direction = "down"
    }
    if (key == "ArrowUp"  && direction != "down") {
        direction = "up"
    }

})
button_play_again.addEventListener("click", () =>{
    audioButton.play()
    score.innerText = "00" // reseta o score para 0
    menu_death.style.display = "none" //muda o display para desaparecer de flex para none
    canvas.style.filter = "none" //tira o blur
    snake = [initialPosition]
    RegenerateFood()
})
button_play.addEventListener("click", () =>{
    audioButton.play()
    menu_start.style.display = "none"
    menuDifficultySelect()
    RegenerateFood()
    gameLoop()
})
backMenu.addEventListener("click", () =>{
    audioButton.play()
    score.innerText = "00"
    snake = [initialPosition]
    menu_death.style.display = "none"
    canvas.style.filter = "none"
    menu_start.style.display = "flex"
    menu_score.style.display = "none"
})
highScore.addEventListener("click", () => {
    audioButton.play()
    snake = [initialPosition]
    menu_start.style.display = "none"
    menuHighScore()
})
backMenu2.addEventListener("click", () => {
    audioButton.play()
    menu_score.style.display = "none"
    starterMenu()
})
//fazer as funcionalidades das dificuldades. 
   /*  RegenerateFood()
    gameLoop() */ //colocar isso nas funçoes do botão
easy.addEventListener("click", () => {
    audioButton.play()
    selectedDifficulty = difficulty.easy
    RegenerateFood()
    gameScreen()
    gameLoop()

}) 
medium.addEventListener("click", () => {
    audioButton.play()
    selectedDifficulty = difficulty.normal
    RegenerateFood()
    gameScreen()
    gameLoop()
})
hard.addEventListener("click", () => {
    audioButton.play()
    selectedDifficulty = difficulty.hard
    RegenerateFood()
    gameScreen()
    gameLoop()
})
