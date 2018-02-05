const simon = {
	pattern: [],
	clickPattern: [],
	iterationSpeed: 800,
	strict: false,
	get topElement_Sound() {
		return this.pattern[this.pattern.length-1];
	},
	colorSoundTable: [[document.getElementById("red"), new Audio("red.mp3")],[document.getElementById("green"), new Audio("green.mp3")],[document.getElementById("blue"), new Audio("blue.mp3")],[document.getElementById("yellow"), new Audio("yellow.mp3")],new Audio("buzz.mp3")],
	turn() {
		const index = Math.floor(Math.random() * 4);
		this.pattern.push(this.colorSoundTable[index]);
		this.topElement_Sound[1].play();
		this.topElement_Sound[0].style.backgroundColor = Array.from(this.colorSoundTable[index][0].dataset.background.split("!"))[0];
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
	count: 0,
	updateCount() {
		this.count++;
		document.getElementById("count").innerHTML = this.count;
	},
	click(btn) {
		if (this.pattern.length) {
			if (btn === this.pattern[this.clickPattern.length][0]) {
				this.pattern[this.clickPattern.length][1].play();
				this.pattern[this.clickPattern.length][0].style.backgroundColor = this.pattern[this.clickPattern.length][0].dataset.background.split("!")[0];
				setTimeout(() => {	
					this.pattern[this.clickPattern.length][1].pause();
					this.pattern[this.clickPattern.length][1].currentTime = 0;
					this.pattern[this.clickPattern.length][0].style.backgroundColor = this.pattern[this.clickPattern.length][0].dataset.background.split("!")[1];
					this.clickPattern.push(this.topElement_Sound);
				
					if (this.clickPattern.length === this.pattern.length) {
						this.clickPattern = [];
						this.updateCount();
						setTimeout(()=>this.iterate(), 1000);
					} else {
						console.log(this.pattern.length - this.clickPattern.length )
					}
				}, 500);
			} else {
				this.colorSoundTable[4].play();
				setTimeout(()=> {
					this.colorSoundTable[4].pause();
					this.colorSoundTable[4].currentTime = 0;
					(this.strict) ? null : this.iterate(0,false); 
				}, 500)
			}
		}
	}
};
