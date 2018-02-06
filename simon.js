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
		if (this.hard) {
			this.hardMode();
			this.hardMode();
		}
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
		off: ["#444", "inset 0 -2px 3px 0 #222, 0 0 10px 3px #222"],
		on: ["#DDD", "inset 0 -2px 3px 0 #BBB, 0 0 10px 3px #BBB"],
		green: ["#0F0", "inset 0 -2px 10px 0 #050, inset 0 2px 10px 0 #FFF, 0 0 10px 3px #050"],
		red: ["#F00", "inset 0 -2px 10px 0 #500, inset 0 2px 10px 0 #FFF, 0 0 10px 3px #500"],
		changeLight(setting) {
			this.light.style.backgroundColor = simon.status[setting][0];
			this.light.style.boxShadow = simon.status[setting][1];
		}
	},
	hard: false,
	hardMode() {
		if (this.hard) {
			this.hard = false;
			document.getElementById("simon").style.transitionDuration = "0s";
			document.getElementById("round").style.transitionDuration = "0s";
			this.rotation = 0;
		} else {
			if (!this.pattern.length) this.turn();
			this.hard = true;
			if (!this.strict) this.strictSwitch();
			this.hardLoop();
		}
	},
	hardLoop() {
		const speed = this.iterationSpeed * 36;
		document.getElementById("simon").style.transitionDuration = speed/1000 + "s";
		document.getElementById("round").style.transitionDuration = speed/1000 + "s";
		this.rotation = 1;
		setTimeout(() => {
		    this.rotation = -1;
		    setTimeout(()=>this.hardLoop(), speed);
		}, speed);
	},
	set rotation(n) {
		document.getElementById("simon").style.transform = "rotate(" + n + "turn)";
		document.getElementById("round").style.transform = "rotate(" + (n * -1) + "turn)";
		
	}
};

for (let i = 0; i < 4; i++) simon.colorSoundTable[i][1].loop = true;

