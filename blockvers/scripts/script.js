function move(x1, y1){
    var newx = x + x1 * 5;
    var newy = y + y1 * 5;
    var blocks = document.querySelectorAll('[stone], [coal], [quarry], [crafting]');
    for(var i=0;i<blocks.length;i++){
        if(parseInt(blocks[i].style.left)-10 < newx &&
            newx < parseInt(blocks[i].style.left)+50 &&
            parseInt(blocks[i].style.top)+(blocks[i].hasAttribute("crafting")?20:10) < newy &&
            newy < parseInt(blocks[i].style.top)+(blocks[i].hasAttribute("crafting")?40:50))
                return;
    }
    if(newx >= width && newx <= gameWorld.clientWidth - width){
        x = newx;
    }
    if(newy >= width && newy <= gameWorld.clientHeight){
        y = newy;
        player.style.zIndex = y;
    }
    setGameWorld();
}
var craftingDialog = document.querySelector("[craftingDialog]");
$("[close]").on("click", function(){
    craftingDialog.close()
});

var code = 0;
document.addEventListener('keydown', event => {
    if (event.code == "Space" && tutorial > 0){
        var tutImgs = document.querySelectorAll("[tutorial] > img");
        $(tutImgs[9 - tutorial]).css("display", "none");
        tutorial--;
        if(tutorial > 0)
            $(tutImgs[9 - tutorial]).css("display", "block");
        else{
            $(document.querySelectorAll("[tutorial]")).remove();
            myAudio.play();
        }
    }
    if (tutorial > 0){
        return;
    }
    if (event.key == "j"){
        spawnEnemy("ghost", 10)
    }
    if (event.key == "Escape" && craftingDialog.open){
        craftingDialog.close();
    }
    if (event.key === '/') {
        if (code > 0) {
            code=0;
            clearInterval(codeInterval);
            return;
        };
        code++;
        var codeInterval = setInterval(function() {
            if(code==3){
                incresse("seed", 1000);
                incresse("wood", 1000);
                incresse("stone", 1000);
                incresse("coal", 1000);
                incresse("plank", 1000);
                incresse("beef", 1000);
            }
            clearInterval(codeInterval);
            code=0;
        }, 3000);
        return;
    }
    if (code > 0){
        if (event.key === 'g') {
            code++;
        }
    }
    if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        move(0, -1)
    } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        move(0, 1)
    } else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        move(-1, 0)
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        move(1, 0)
    } else if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' || event.key === '5' || event.key === '6') {
        var target = document.querySelectorAll('[hotBar] > span');
        if (document.querySelector('[hotBar] > [active]') == target){
            return
        }
        document.querySelector('[active]').removeAttribute('active');
        target[parseInt(event.key)-1].setAttribute("active", "");
        selected = parseInt(event.key)-1;
    }
    setDescription();
});



var myAudio = new Audio('sounds/bgmusic.mp3'); 
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

const woodHitSounds = [
    'sounds/cutwood1.mp3', 
    'sounds/cutwood2.mp3', 
    'sounds/cutwood3.mp3', 
    'sounds/cutwood4.mp3', 
    'sounds/cutwood5.mp3', 
    'sounds/cutwood6.mp3'
];
function playWoodHitSound() {
    var soundRandom = Math.floor(Math.random() * woodHitSounds.length);
    var sound = new Audio(woodHitSounds[soundRandom]);
    sound.play();
}

const stoneHitSounds = [
    'sounds/hitstone1.mp3', 
    'sounds/hitstone2.mp3', 
    'sounds/hitstone3.mp3', 
    'sounds/hitstone4.mp3'
];
function playStoneHitSound() {
    var soundRandom = Math.floor(Math.random() * stoneHitSounds.length);
    var sound = new Audio(stoneHitSounds[soundRandom]);
    sound.play();
}

var entityInfo = document.querySelector("[entityInfo]")
var entityName = document.querySelector("[entityName]")
var entityHealthBar = document.querySelector("[entityHealthBar]")
var entityHealth = document.querySelector("[entityHealth]")
$(document).on("click", "[entity]", function(event) {
    const target = event.target
    target.setAttribute("health", target.getAttribute("health")-(hotBarItems[0]+1))
    if(target.getAttribute("health") <= 0){
        target.remove()
        if(target.hasAttribute("animal")){
            incresse("beef");
            animalCount--;
        }else if(target.hasAttribute("enemy")){
            enemyCount--;
        }
        $(entityInfo).css("display", "none")
    }
    const health = target.getAttribute("health");
    const maxhealth = target.getAttribute("maxhealth");
    $(entityHealth).html(health+" / "+maxhealth)
    $(entityHealthBar).css("width", health*100/maxhealth+"%")
});
$(document).on("mousemove", "[entity]", function(event) {
    $(entityInfo).css("top", event.clientY + "px")
    $(entityInfo).css("left", event.clientX + "px")
});
$(document).on("mouseenter", "[entity]", function(event) {
    const target = event.target
    const health = target.getAttribute("health");
    const maxhealth = target.getAttribute("maxhealth");
    $(entityInfo).css("display", "block")
    $(entityName).html(target.hasAttribute("cow")?"Krowa":target.hasAttribute("ghost")?"Duch":"Inne")
    $(entityHealth).html(health+" / "+maxhealth)
    $(entityHealthBar).css("width", health*100/maxhealth+"%")
});
$(document).on("mouseleave", "[entity]", function(event) {
    $(entityInfo).css("display", "none")
});
$("[heal]").click(function(){
    if(health<5){
        if(resourceManage(["beef", 1]))return;
        changeHealth(1)
    }
})

$("[spawnarea]").click(function(){
    if (tutorial > 0){
        return;
    }
    var target = event.target;
    if (target.hasAttribute('crafting')) {
        craftingDialog.showModal()
    }
    if (selected == 0){
        var get = hotBarItems[0]+1;
        var span;
        if (target.hasAttribute('coal')) {
            if (hotBarItems[0] > 1){
                playStoneHitSound()
                get = get-2;
                span = $("<span><img src='graphics/resource/coal.png'>+"+get+"</span>");
                incresse("coal", get);
            }
        }
        if (target.hasAttribute('stone')) {
            if (hotBarItems[0] > 0){
                playStoneHitSound();
                get = get-1;
                span = $("<span><img src='graphics/resource/stone.png'>+"+get+"</span>");
                incresse("stone", get);
            }
        }
        if (target.hasAttribute('wood')) {
            playWoodHitSound();
            var health = target.getAttribute("health")-1;
            span = $("<span><img src='graphics/resource/wood.png'>+"+get+"</span>");
            if (health > 0){
                target.setAttribute("health", health);
            }else{
                target.parentNode.removeChild(target);
            }
            if (Math.random() >= 0.8) {
                incresse("seed");
            }
            incresse("wood", get);
        }
        if (span != null){
            $("body").append(span);

            span.css({
                "position": "absolute",
                "left": event.pageX-10 + (Math.random()*10-5) + "px",
                "top": event.pageY-20 + "px",
                "font-size": "15px",
                "font-weight": "bold",
                "color": "black",
                "pointer-events": "none",
                "z-index": 9999,
                "opacity": 1
            });

            var i = 0;
            var intervalId = setInterval(function() {
                span.css("top", parseInt(span.css("top")) - 1 + "px");
                if (i >= 10){
                    span.css("opacity", 1-(i-10)*0.1);
                }
                i++;
                if (i == 20) {
                    clearInterval(intervalId);
                    span.remove();
                }
            }, 50);
        }
    }else if (selected == 1){
        if (hotBarItems[1] == 0 && target.hasAttribute('spawnarea')){
            if(resourceManage(["seed", 1]))return;
            
            var x = Math.floor(event.offsetX / 40) * 40;
            var y = Math.floor(event.offsetY / 40) * 40;
            plantSeed(x, y);
        }else if (hotBarItems[1] == 1 && target.hasAttribute('spawnarea')){
            if(resourceManage(["wood", 100],["seed", 10]))return;

            var x = Math.floor(event.offsetX / 40) * 40;
            var y = Math.floor(event.offsetY / 40) * 40;
            buildSawmill(x, y);
        }else if (hotBarItems[1] == 2 && target.hasAttribute('stone')){
            if(resourceManage(["wood", 100]))return;

            var x = parseInt($(target).css("left"));
            var y = parseInt($(target).css("top"));
            console.log(x,y);
            $(target).remove();
            buildQuarry(x, y);
        }
    }else if (selected == 2 && target.hasAttribute('spawnarea')){
        var x = Math.floor(event.offsetX / 40) * 40;
        var y = Math.floor(event.offsetY / 40) * 40;

        if(resourceManage(["wood", 100]))return;

        buildCrafting(x, y);
    }
});

function activeTarget(target){
    document.querySelector('[active]').removeAttribute('active');
    target.setAttribute("active", "");
}

$("[hotBar] > span").click(function(event){
    var target = event.target;

    if (target.hasAttribute('tool')) {
        selected = 0;
        activeTarget(target);
    }else if (target.hasAttribute('item1')) {
        selected = 1;
        activeTarget(target);
    }else if (target.hasAttribute('item2')) {
        selected = 2;
        activeTarget(target);
    }else if (target.hasAttribute('item3')) {
        selected = 3;
        activeTarget(target);
    }else if (target.hasAttribute('item4')) {
        selected = 4;
        activeTarget(target);
    }else if (target.hasAttribute('item5')) {
        selected = 5;
        activeTarget(target);
    }else if (target.hasAttribute('itemSelect1')){
        var parentTarget = document.querySelector('[item1]');
        selected = 1;
        if(target.hasAttribute('tree')){
            hotBarItems[selected] = 0;
            $(parentTarget).css("background-image", "var(--html-tree-texture)");
        }else if(target.hasAttribute('sawmill')){
            hotBarItems[selected] = 1;
            $(parentTarget).css("background-image", "var(--html-sawmill-texture)");
        }else if(target.hasAttribute('quarry')){
            hotBarItems[selected] = 2;
            $(parentTarget).css("background-image", "var(--html-quarry-texture)");
        }else if(target.hasAttribute('coalmine')){
            hotBarItems[selected] = 3;
        }
        activeTarget(parentTarget);
    }else if (target.hasAttribute('itemSelect2')){
        selected = 2;
        target = document.querySelector('[item2]');
        activeTarget(target);
    }
    setDescription();
});

window.addEventListener('wheel', function(e) {
    var target = document.querySelectorAll('[hotBar] > span');
    if (e.deltaY > 0) {
        target[selected].removeAttribute('active');
        selected += selected < target.length-1 ? 1 : 0
        target[selected].setAttribute("active", "");
    } else {
        target[selected].removeAttribute('active');
        selected -= selected > 0 ? 1 : 0
        target[selected].setAttribute("active", "");
    }
    setDescription();
});




$("[craft]").click(function(event){
    if($(event.target.hasAttribute("woodc"))){
        if(resourceManage(["wood", 10]))return;
        incresse("plank");
    }
})