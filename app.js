const moneyConfig = {
    2000 : 0, 500 : 0, 200 : 0, 100 : 0, 50 : 0, 20 : 0, 10 : 0, 5 : 0, 2 : 0, 1 : 0
}
let moneyStore = Object.assign({}, moneyConfig);
const coins = Object.keys(moneyStore).map(Number);
const colors = ['cornflowerblue', 'orange'];
const dispense = document.getElementById('dispense');
const dispenseSummary = document.getElementById('dispense-summary');
const numberInputs = document.querySelectorAll('.number');
const amountDiv = document.getElementById('amount');
const soundDiv = document.getElementById('sound');
let amount = "";
let disabled = false;
let messageTimeout = null;

function resetMoneyStore() {
    moneyStore = Object.assign({}, moneyConfig);
}

function playAudio(dispense, callback) {
    let audio = document.createElement('AUDIO');
    audio.src = dispense ? "assets/dispense.mp3" : "assets/beep.mp3";
    audio.opacity = 0;
    soundDiv.innerHTML = "";
    soundDiv.appendChild(audio);
    audio.play();
    if (dispense) {
        audio.addEventListener('pause', () => {
            callback();
        })
    }
}

function thakyouNote() {
    amountDiv.innerHTML = "TAKE CASH";
    amount = "";
    messageTimeout = setTimeout(() => {
        amountDiv.innerHTML = "WELCOME";
        dispenseSummary.innerHTML = "";
        disabled = false;
        resetMoneyStore();
    }, 9000);
}

function renderDispenser () {
    let virtualDOM = document.createDocumentFragment();
    dispenseSummary.innerHTML = "";
    for (let idx = 9; idx >= 0; idx--) {
        const key = coins[idx];
        const item = moneyStore[key];
        if (item) {
            let itemElem = document.createElement('DIV');
            let countLabel = document.createElement('SPAN');
            countLabel.innerHTML = item;
            let elem = document.createElement('IMG');
            if (key >= 5) {
                elem.src = `assets/${key}.png`;
                elem.style.height = "100px";
            }
            else {
                elem = document.createElement('P')
                elem.innerHTML = `${key}`;
                elem.style.backgroundColor = colors[idx];
            }
            itemElem.appendChild(elem);
            itemElem.appendChild(countLabel);

            virtualDOM.appendChild(itemElem);
        }
    }
    dispenseSummary.appendChild(virtualDOM)
    thakyouNote();
}

function calculator (n) {
    disabled = true;
    for (let i = 9; i >= 0; i--) {
      const coin = Number(coins[i]);
      if (n < 1) break;
      if (n >= coin) {
        moneyStore[coin] = Math.floor(n/coin);
        n = n%coin;
      }
    }
    playAudio("dispense", renderDispenser);
}

numberInputs.forEach(item => {
    item.addEventListener('click', () => {
        if (disabled) {
            amountDiv.innerHTML = "PLEASE WAIT";
            return;
        }
        playAudio();
        let {number} = item.dataset;

        if (number == "cancel") {
            amount = "";
            resetMoneyStore();
            amountDiv.innerHTML = amount;
            return;
        }
        if (number == "clear") {
            amount = amount.substring(0, amount.length-1);
            amountDiv.innerHTML = amount; 
            return;
        }

        if (number == 0 && amount.length == 0) return;
        if (amount.length > 10) return;

        amount += number;
        amountDiv.innerHTML = amount;
    })
})

dispense.addEventListener('click', () => {
    calculator(Number(amount));
})



