function makeCircleHoleClipPathRule( radius ) {

    const inner_path = [];
    const circumference = Math.PI * radius;
    const step = Math.PI * 2 / circumference;
    
    const start_step = circumference * (5 / 8);
    for( let i = start_step; i < circumference + start_step; i+=10 ) {
      const angle = step * i;
      const x = radius * Math.cos( angle );
      const y = radius * Math.sin( angle );
      const str = `calc( 50% + ${ x }px ) calc( 50% + ${ y-10 }px )`;
      inner_path.push( str );
    }
    
    inner_path.push( inner_path[ 0 ] );
  
    return `polygon( evenodd,
      0 0,
      100% 0, 
      100% 100%,
      0% 100%,
      0 0,
      ${ inner_path.join( "," ) }
     )`;
  
}
  
const hole_elem = document.querySelector( "[holeBack]" );
hole_elem.style.clipPath = makeCircleHoleClipPathRule( 150 );

var vw = window.innerWidth;
var vh = window.innerHeight;
const player = document.querySelector('[player]');
var gameWorld = document.querySelector('[gameworld]');
var hotBar = document.querySelector('[hotBar]::before');
var healthBar = document.querySelector('[playerHealth] > div');
var x = 500;
var y = 500;
var spawnArea = document.querySelector('[spawnArea]');
var body = document.querySelector('body');
var width = player.clientWidth/2;
let time = 0.85;
let hours = 5;
let minutes = 0;
var tutorial = 9;

var woodCounter = 0;
var plankCounter = 0;
var stoneCounter = 0;
var coalCounter = 0;
var seedCounter = 0;
var beefCounter = 0;
var score = 0;
var health = 5;
var hotBarItems = [0,0,0,0,0,0];
var selected = 0;

var sawmillCount = 0;
var quarryCount = 0;

const maxAnimals = 2;
const maxEnemis = 3;
var animalCount = 0;
var animals;
var enemyCount = 0;
var enemis;
function spawnAnimal(animal, hp){
    if(Math.floor(Math.random()*10) > 1){
        const newAnimal = document.createElement("div");
        newAnimal.setAttribute(animal, "");
        newAnimal.setAttribute("animal", "");
        newAnimal.setAttribute("entity", "");
        newAnimal.setAttribute("health", hp);
        newAnimal.setAttribute("maxhealth", hp);
        var left = Math.floor(Math.random() * (spawnArea.clientWidth - 40));
        var top = Math.floor(Math.random() * (spawnArea.clientHeight - 40));
        newAnimal.style.left = left + "px";
        newAnimal.style.top = top + "px";
        newAnimal.style.zIndex = y+39;
        
        if(newAnimal.getAttribute("health") == 0){
            clearInterval(animalsMove)
        }
        var animalsMove = setInterval(function() {
            const left = Math.floor(Math.random() * (spawnArea.clientWidth - 40));
            const top = Math.floor(Math.random() * (spawnArea.clientHeight - 40));
            newAnimal.style.left = left + "px";
            newAnimal.style.top = top + "px";
            newAnimal.style.zIndex = top+39;
            
            if(newAnimal.getAttribute("health") == 0){
                clearInterval(animalsMove)
            }
        }, 5000);
        spawnArea.appendChild(newAnimal);
        left = Math.floor(Math.random() * (spawnArea.clientWidth - 40));
        top = Math.floor(Math.random() * (spawnArea.clientHeight - 40));
        newAnimal.style.left = left + "px";
        newAnimal.style.top = top + "px";
        newAnimal.style.zIndex = top+39;

        animalCount++;
        animals = spawnArea.querySelectorAll("[animal]")
    }
}
function spawnEnemy(enemy, hp){
    if(Math.floor(Math.random()*10) > 1){
        const newEnemy = document.createElement("div");
        newEnemy.setAttribute(enemy, "");
        newEnemy.setAttribute("enemy", "");
        newEnemy.setAttribute("entity", "");
        newEnemy.setAttribute("health", hp);
        newEnemy.setAttribute("maxhealth", hp);
        const left = Math.floor(Math.random() * (spawnArea.clientWidth - 40));
        const top = Math.floor(Math.random() * (spawnArea.clientHeight - 40));
        newEnemy.style.left = left + "px";
        newEnemy.style.top = top + "px";
        newEnemy.style.zIndex = y+30;
        followPlayer(newEnemy)
        spawnArea.appendChild(newEnemy);

        enemyCount++;
        enemis = document.querySelectorAll("[enemy]")
    }
}

function changeHealth(change, type){
    health += change
    healthBar.style.height = (20*health)+"%";
    if(health == 0){
        gameOver()
    }
}

function gameOver(){
    document.querySelector("[game]").style.display = "none"
    document.querySelector("[gameOver]").style.display = "block"
    document.querySelector("[goPoints]").innerHTML = score
    clearInterval(timer)
    clearInterval(counter)
}

function followPlayer(enemy) {
    var speed = 3000;
    
    var enenyMove = setInterval(function() {
        var playerX = player.offsetLeft + gameWorld.offsetLeft * -1;
        var playerY = player.offsetTop + gameWorld.offsetTop * -1;
        
        var enemyX = enemy.offsetLeft + enemy.offsetWidth / 2;
        var enemyY = enemy.offsetTop + enemy.offsetHeight / 2;
        
        var deltaX = playerX - enemyX;
        var deltaY = playerY - enemyY;
        
        var angle = Math.atan2(deltaY, deltaX);
        
        var velocityX = Math.cos(angle) * speed;
        var velocityY = Math.sin(angle) * speed;
        
        enemy.style.left = (enemy.offsetLeft + velocityX) + "px";
        enemy.style.top = (enemy.offsetTop + velocityY) + "px";

        if(player.offsetLeft + gameWorld.offsetLeft * -1 == enemy.offsetLeft + enemy.offsetWidth / 2 &&
        player.offsetTop + gameWorld.offsetTop * -1 == enemy.offsetTop + enemy.offsetHeight / 2){
            changeHealth(-1, enemy);
            enemy.remove()
            enemyCount--;
            clearInterval(enenyMove)
            $(entityInfo).css("display", "none")
        }
    }, 16);
}



var counter = setInterval(function() {
    if( hours > 4 && hours < 20 ){
        if(animalCount < maxAnimals)spawnAnimal("cow", 10)
    }else{
        if(enemyCount < maxEnemis)spawnEnemy("ghost", 10)
    }
    
    incresse("wood", sawmillCount);
    incresse("stone", quarryCount);
    for(var i=0;i<sawmillCount;i++){
        if (Math.random() >= 0.9) {
            incresse("seed");
        }
    }
}, 3000);
function plantSeed(x, y) {
    const newSeed = document.createElement("div");
    newSeed.setAttribute("wood", "");
    const rand = Math.floor(Math.random()*10);
    newSeed.setAttribute("health", (rand + 5));
    newSeed.style.left = x + "px";
    newSeed.style.top = y + "px";
    newSeed.style.zIndex = y+39;
    spawnArea.appendChild(newSeed);
}
function buildSawmill(x, y) {
    const newSawMill = document.createElement("div");
    newSawMill.setAttribute("sawmill", "");
    newSawMill.style.left = x + "px";
    newSawMill.style.top = y + "px";
    newSawMill.style.zIndex = y+39;
    spawnArea.appendChild(newSawMill);

    sawmillCount++;
}
function buildQuarry(x, y) {
    const newQuarry = document.createElement("div");
    newQuarry.setAttribute("quarry", "");
    newQuarry.style.left = x + "px";
    newQuarry.style.top = y + "px";
    newQuarry.style.zIndex = y+39;
    spawnArea.appendChild(newQuarry);

    quarryCount++;
}
function buildCrafting(x, y) {
    const newCrafting = document.createElement("div");
    newCrafting.setAttribute("crafting", "");
    newCrafting.style.left = x + "px";
    newCrafting.style.top = y + "px";
    newCrafting.style.zIndex = y+39;
    spawnArea.appendChild(newCrafting);
}
var timer = setInterval(function() {
    minutes++;
    if(minutes == 60){
        minutes = 0;
        hours++;
        if(hours == 25){
            hours = 1;
        }
        if(hours < 13) time+=0.05; else time-=0.05;
        $("[hours]").html(hours<10?"0"+hours:hours);
    }
    $("[minutes]").html(minutes<10?"0"+minutes:minutes);
    $("body").css("filter", "brightness("+time+")")
}, 100);

function setGameWorld(){
    gameWorld.style.top = vh/2-y+"px";
    gameWorld.style.left = vw/2-x+"px";
    body.style.backgroundPositionX = -x/2+"px";
    body.style.backgroundPositionY = -y/2+"px";
}


var cameraCenterX = window.innerWidth / 2 - 10;
var cameraCenterY = window.innerHeight / 2 - 10;

window.addEventListener('resize', function(){
    vw = window.innerWidth;
    vh = window.innerHeight;
    cameraCenterX = window.innerWidth / 2 - 10;
    cameraCenterY = window.innerHeight / 2 - 10;
    setGameWorld();
});

function createResource(nwood, nstone, ncoal) {
    const elementSize = 40;
    const gridStep = elementSize;
    
    for (let i = 0; i < nwood+nstone+ncoal; i++) {
        const div = document.createElement("div");
        if (i < nwood){
            div.setAttribute("Wood", "");
            const rand = Math.floor(Math.random()*10);
            div.setAttribute("health", (rand + 5));
        }else if(i < nwood+nstone){
            div.setAttribute("Stone", "");
        }else if(i < nwood+nstone+ncoal){
            div.setAttribute("Coal", "");
        }
        let left, top;
        do{
            left = Math.floor(Math.random() * (spawnArea.clientWidth - elementSize));
            top = Math.floor(Math.random() * (spawnArea.clientHeight - elementSize));
            
            left = Math.floor(left / gridStep) * gridStep;
            top = Math.floor(top / gridStep) * gridStep;
        }while (left == 480 && top == 480);
        
        div.style.left = left + "px";
        div.style.top = top + "px";
        div.style.zIndex = top+39;
        spawnArea.appendChild(div);
    }
}


//drzewa, kamienie, wegiel
createResource(10, 10, 10);

setGameWorld();

var description = document.querySelector("[infoAbout]");
function setDescription(){
    if (selected == 0){
        if (hotBarItems[0] == 0){
            description.innerHTML = "Przy pomocy dłoni można zbierać drewno.";
        }else if (hotBarItems[0] == 1){
            description.innerHTML = "Drewniany kilof pozwala wydobywać kamień.";
        }else if (hotBarItems[0] == 2){
            description.innerHTML = "Kamienny kilof pozwala wydobywać węgiel.";
        }
    }else if (selected == 1){
        if (hotBarItems[1] == 0){
            description.innerHTML = "Możesz zasadzić drzewo w wolnym miejscu na mapie.";
        }else if (hotBarItems[1] == 1){
            description.innerHTML = "Tartak może zostać wybudowany w wolnym miejscu na mapie.<br>Każdy tartak umieszczony na mapie generuje 1x<img src='graphics/resource/wood.png'>/3s.";
        }else if (hotBarItems[1] == 2){
            description.innerHTML = "Kamieniołom może zostać wybudowany na złożu kamienia.<br>Każdy kamieniołom umieszczony na mapie generuje 1x<img src='graphics/resource/stone.png'>/3s.";
        }
    }else if (selected == 2){
        if (hotBarItems[2] == 0){
            description.innerHTML = "Stół rzemieślniczy może zostać umieszczony w wolnym miejscu na mapie.";
        }else if (hotBarItems[2] == 1){
            description.innerHTML = "Tartak może zostać wybudowany w wolnym miejscu na mapie.<br>Każdy tartak umieszczony na mapie generuje 1x<img src='graphics/resource/wood.png'>/3s.";
        }else if (hotBarItems[2] == 2){
            description.innerHTML = "Kamieniołom może zostać wybudowany na złożu kamienia.<br>Każdy kamieniołom umieszczony na mapie generuje 1x<img src='graphics/resource/stone.png'>/3s.";
        }
    }
}
setDescription();



function checkResources(name, count){
    if((name == "wood" && woodCounter < count) ||
    (name == "seed" && seedCounter < count)||
    (name == "stone" && stoneCounter < count)||
    (name == "coal" && coalCounter < count)||
    (name == "plank" && plankCounter < count)||
    (name == "beef" && beefCounter < count)){
        return true;
    }
    return false;
}
function decresse(name, count){
    if(name == "wood"){
        woodCounter-=count;
        $("[woodCounter]").html(woodCounter);
    }else if(name == "seed"){
        seedCounter-=count;
        $("[seedCounter]").html(seedCounter);
    }else if(name == "stone"){
        stoneCounter-=count;
        $("[stoneCounter]").html(stoneCounter);
    }else if(name == "coal"){
        coalCounter-=count;
        $("[coalCounter]").html(coalCounter);
    }else if(name == "plank"){
        plankCounter-=count;
        $("[plankCounter]").html(plankCounter);
    }else if(name == "beef"){
        beefCounter-=count;
        $("[beefCounter]").html(beefCounter);
    }
}
function resourceManage(...args){
    var error = false;
    for(var i=0;i<args.length;i++){
        if(checkResources(args[i][0], args[i][1]))error = true;
    }
    if(error) return true;
    for(var i=0;i<args.length;i++){
        decresse(args[i][0], args[i][1]);
    }
    return false;
}
function incresse(name, count = 1){
    if(name == "wood"){
        woodCounter+=count;
        $("[woodCounter]").html(woodCounter);
        updateScore(count)
    }else if(name == "seed"){
        seedCounter+=count;
        $("[seedCounter]").html(seedCounter);
        updateScore(count*2)
    }else if(name == "stone"){
        stoneCounter+=count;
        $("[stoneCounter]").html(stoneCounter);
        updateScore(count*2)
    }else if(name == "coal"){
        coalCounter+=count;
        $("[coalCounter]").html(coalCounter);
        updateScore(count*3)
    }else if(name == "plank"){
        plankCounter+=count;
        $("[plankCounter]").html(plankCounter);
        updateScore(count*10)
    }else if(name == "beef"){
        beefCounter+=count;
        $("[beefCounter]").html(beefCounter);
        updateScore(count*10)
    }
}
function updateScore(count = 1){
    score+=count;
    $("[score]").html(score);
}