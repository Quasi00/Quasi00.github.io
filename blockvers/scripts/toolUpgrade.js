var toolUpgrades = [
    ["Drewniany kilof",1,"wood.png", 10],
    ["Kamienny kilof",2,"stone.png", 10,"wood.png", 10]
];
var toolUpgradeInfo = document.querySelector("[toolUpgrade] > [info]");

function setUpgradeInfo(state){
    if(state < toolUpgrades.length){
        var info = "<span name>Ulepsz do:<br>"+toolUpgrades[state][0]+"</span><hr><span materials>Potrzebne materiały:";
        for(var i=0;i<toolUpgrades[state][1]*2;i+=2){
            info += "<img src='graphics/resource/"+toolUpgrades[state][i+2]+"'> x "+toolUpgrades[state][i+3];
        }
    }else{
        var info = "<span name>Osiągnięto maksymalny poziom narzędzi.</span>";
    }
    $(toolUpgradeInfo).html(info);
}
setUpgradeInfo(hotBarItems[0]);
$("[toolUpgrade]").on("click", function(){
    var tool = document.querySelector("[tool]");
    if(hotBarItems[0] == 0){
        if(resourceManage(["wood", 10]))return;

        hotBarItems[0]++;
        $(tool).css("background-image","var(--html-wooden-pickaxe-texture)");
    }else if(hotBarItems[0] == 1){
        if(resourceManage(["wood", 10],["stone", 10]))return;

        hotBarItems[0]++;
        $(tool).css("background-image","var(--html-stone-pickaxe-texture)");
    }
    setUpgradeInfo(hotBarItems[0]);
    setDescription();
});