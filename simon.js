const simon = {
	count: 0,
	pattern: [],
	clickPattern: [],
	iterationSpeed: 800,
	clickable: false,
	strict: false,
	strictSwitch() {
		this.strict = !this.strict;
		if (this.strict) {
			document.getElementById('strict').style.color = '#F00'
		} else {
			document.getElementById('strict').style.color = '#333'
		}
	},
	colorSoundTable: [
		[document.getElementById("red"), new Audio("red.wav")],
		[document.getElementById("green"), new Audio("green.wav")],
		[document.getElementById("blue"), new Audio("blue.wav")],
		[document.getElementById("yellow"), new Audio("yellow.wav")],
		new Audio("buzz.mp3"),
		new Audio("correct.mp3"),
		new Audio("won.wav"),
		new Audio("lost.wav")
	],
	get topElement_Sound() {
		return this.pattern[this.pattern.length-1];
	},
	turn() {
		const index = Math.floor(Math.random() * 4);
		this.pattern.push(this.colorSoundTable[index]);
		this.topElement_Sound[1].play();
		this.topElement_Sound[0].style.backgroundColor = Array.from(this.colorSoundTable[index][0].dataset.background.split("!"))[0];
		this.clickable = true;
		setTimeout(() => {
			this.topElement_Sound[0].style.backgroundColor = this.colorSoundTable[index][0].dataset.background.split("!")[1];
			this.topElement_Sound[1].pause();
			this.topElement_Sound[1].currentTime = 0;
		}, 500);
	},
	iterate(index = 0, turn = true) {
		if (this.pattern.length) {
			this.pattern[index][0].style.backgroundColor = Array.from(this.pattern[index][0].dataset.background.split("!"))[0];
			this.pattern[index][1].play();
			setTimeout(() => {
					this.pattern[index][0].style.backgroundColor = Array.from(this.pattern[index][0].dataset.background.split("!"))[1];
					this.pattern[index][1].pause();
					this.pattern[index][1].currentTime = 0;
					if (this.pattern.length) {
						this.restartable = false;
						setTimeout(() => {
							this.restartable = true;
							(index < this.pattern.length-1) ? simon.iterate(index + 1, turn) : (turn) ? this.turn():null;
						}, this.iterationSpeed);
					}
			}, this.iterationSpeed); // 500
		}
	},
	restartable: true,
	restart() {
		this.count = -1;
		this.updateCount();
		this.pattern = [];
		this.clickPattern = [];
		this.iterationSpeed = 750;
		this.clickable = false;
		if (this.restartable) setTimeout(() => this.turn(), 750)
	},
	updateCount() {
		this.count++;
		document.getElementById("count").innerHTML = this.count;
	},
	checkIterationSpeed() {
		(this.count >= 13) ? this.iterationSpeed = 300 : (this.count >= 9) ? this.iterationSpeed = 500 : (this.count >= 5) ? this.iterationSpeed = 650 : null;
						
	},
	won() {
		this.colorSoundTable[6].play();
		setTimeout(()=>this.restart(),6500);
	},
	lost() {
		this.colorSoundTable[7].play();
		setTimeout(()=>this.restart(),3500);
	},
	click(btn) {
		if (this.pattern.length && this.clickable) {
			// answered correctly
			if (btn === this.pattern[this.clickPattern.length][0]) {
				this.pattern[this.clickPattern.length][1].play();
				this.pattern[this.clickPattern.length][0].style.backgroundColor = this.pattern[this.clickPattern.length][0].dataset.background.split("!")[0];
				window.onmouseup = () => {	
					window.onmouseup = () => null;
					this.pattern[this.clickPattern.length][1].pause();
					this.pattern[this.clickPattern.length][1].currentTime = 0;
					this.pattern[this.clickPattern.length][0].style.backgroundColor = this.pattern[this.clickPattern.length][0].dataset.background.split("!")[1];
					this.clickPattern.push(this.topElement_Sound);
					if (this.clickPattern.length === this.pattern.length) {
						this.clickable = false;
						this.clickPattern = [];
						this.updateCount();
						this.checkIterationSpeed();
						this.colorSoundTable[5].play();
						(this.count < 20) ? setTimeout(()=>this.iterate(), this.iterationSpeed) : this.won();
					}
				};
			} else {
			// answered INcorrectly
			if (this.strict) {
				this.lost();
			} else {
				this.colorSoundTable[4].play();
				this.clickPattern = [];
				setTimeout(()=> {
					this.colorSoundTable[4].pause();
					this.colorSoundTable[4].currentTime = 0;
					(this.strict) ? this.lost() : this.iterate(0,false); 
				}, 1000)
			}
			}
		}
	},
	status: {
		light: document.getElementById("status"),
		off: ["background-color: #444;", "box-shadow: inset 0 -2px 3px 0 #222, 0 0 10px 3px #222"],
		green: ["background-color: #0F0", "box-shadow: inset 0 -2px 10px 0 #050, inset 0 2px 10px 0 #FFF, 0 0 10px 3px #050"],
		red: ["background-color: #F00", "box-shadow: inset 0 -2px 10px 0 #500, inset 0 2px 10px 0 #FFF, 0 0 10px 3px #500"],
		changeLight(settings) {
			this.light.style.backgroundColor = settings[0];
			this.light.style.boxShadow = settings[1];
		}
	}
};

for (let i = 0; i < 4; i++) simon.colorSoundTable[i][1].loop = true;
