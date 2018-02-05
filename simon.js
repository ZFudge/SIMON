const simon = {
	count: 0,
	pattern: [],
	clickPattern: [],
	iterationSpeed: 800,
	clickable: false,
	strict: false,
	colorSoundTable: [[document.getElementById("red"), new Audio("red.mp3")],[document.getElementById("green"), new Audio("green.mp3")],[document.getElementById("blue"), new Audio("blue.mp3")],[document.getElementById("yellow"), new Audio("yellow.mp3")],new Audio("buzz.mp3")],
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
		this.pattern[index][0].style.backgroundColor = Array.from(this.pattern[index][0].dataset.background.split("!"))[0];
		this.pattern[index][1].play();
		setTimeout(() => {
			this.pattern[index][0].style.backgroundColor = Array.from(this.pattern[index][0].dataset.background.split("!"))[1];
			this.pattern[index][1].pause();
			this.pattern[index][1].currentTime = 0;
			setTimeout(() => (index < this.pattern.length-1) ? simon.iterate(index + 1, turn) : (turn) ? this.turn():null, this.iterationSpeed);
		}, 500);
	},
	restart() {
		this.count = -1;
		this.updateCount();
		this.pattern = [];
		this.clickPattern = [];
		this.iterationSpeed = 800;
		this.clickable = false;
	},
	updateCount() {
		this.count++;
		document.getElementById("count").innerHTML = this.count;
	},
	click(btn) {
		if (this.pattern.length && this.clickable) {
			// answered correctly
			if (btn === this.pattern[this.clickPattern.length][0]) {
				this.pattern[this.clickPattern.length][1].play();
				this.pattern[this.clickPattern.length][0].style.backgroundColor = this.pattern[this.clickPattern.length][0].dataset.background.split("!")[0];
				btn.onmouseup = () => {	
					this.pattern[this.clickPattern.length][1].pause();
					this.pattern[this.clickPattern.length][1].currentTime = 0;
					this.pattern[this.clickPattern.length][0].style.backgroundColor = this.pattern[this.clickPattern.length][0].dataset.background.split("!")[1];
					this.clickPattern.push(this.topElement_Sound);
				
					if (this.clickPattern.length === this.pattern.length) {
						this.clickable = false;
						this.clickPattern = [];
						this.updateCount();
						setTimeout(()=>this.iterate(), 750);
					} else {
						console.log(this.pattern.length - this.clickPattern.length )
					}
				};
			} else {
			// answered INcorrectly
				this.colorSoundTable[4].play();
				setTimeout(()=> {
					this.colorSoundTable[4].pause();
					this.colorSoundTable[4].currentTime = 0;
					(this.strict) ? this.restart() : this.iterate(0,false); 
				}, 1000)
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

  