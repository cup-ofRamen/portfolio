var handDiv = document.getElementById('hand')
var lastCardDiv = document.getElementById('lastCard')
var bot1Div = document.getElementById('bot1')
var bot2Div = document.getElementById('bot2')
var bot3Div = document.getElementById('bot3')
var turnDiv = document.getElementById('turn')
var reverseDiv = document.getElementById('reverse')
var winnerDiv = document.getElementById('winner')
// CLASS

// Constructor (created an object from the class)

// Attributes (store information for the object)

// Methods (function tied to the objects)
class Card{
    constructor(type, color){
        this.color=color
        if(typeof type === 'number'){
            this.number = type
            this.type = 'number'
        }
        else{
            this.type = type
        }
    }
    render(){
       let button = document.createElement('BUTTON')
       if (this.type == 'number'){
           button.innerHTML = this.number
       }
       else{
           button.innerHTML = this.type
       }
       button.classList.add(this.color)
       button.classList.add('cardButton')
       return(button)
       

    }

}

// myCard = new Card("+4", "wild")
// myCard1 = new Card(7, "green")
// myCard2 = new Card('reverse', 'blue')
// myCard3 = new Card(3, "yellow")
// myCard4 = new Card('skip', 'red')

// hand.appendChild(myCard.render())
// hand.appendChild(myCard1.render())
// hand.appendChild(myCard2.render())
// hand.appendChild(myCard3.render())
// hand.appendChild(myCard4.render())
// // console.log(myCard)
class Deck{
	constructor(){
		this.cardList = []
		let colors = ['red','blue','yellow','green']
        
        // create 0 cards
        for(let i = 0;i<colors.length;i++){
            let color = colors[i]
            let card = new Card(0, color)
            this.cardList.push(card)
        }

        //create number cards
		for(let i = 0; i < colors.length;i++){
			let color = colors[i]
			for( let j = 1; j <= 9; j++){
				for(let k = 0; k < 2;k++){
					let card = new Card(j,color)
					this.cardList.push(card)
				}
			}
		}
		// create skips + reverse + +2
		for(let i = 0; i < colors.length; i++){
			let color = colors[i]
			for(let j = 0; j < 2;j++){
				let card = new Card("skip",color)
				this.cardList.push(card)
                let card2 = new Card("reverse",color)
				this.cardList.push(card2)
                let card3 = new Card("+2",color)
				this.cardList.push(card3)
			}
		}
        // create wild cards	
        for (let i = 0;i<4; i++){
            let card = new Card('wild', 'wild')
            this.cardList.push(card)
            let card1 = new Card('+4', 'wild')
            this.cardList.push(card1)
        }

    }
	draw(){
		let index = Math.floor(Math.random()*this.cardList.length)
		let card = this.cardList[index]
		this.cardList.splice(index,1)
		return card
        
	}
}


// myDeck = new Deck()
// console.log(myDeck)
// console.log(myDeck.cardList.length)
// console.log(myDeck.draw())
// console.log(myDeck.cardList.length)
class Game{
    constructor(){
        this.deck = new Deck()
        this.playerhand = []
        this.bot1hand = []
        this.bot2hand = []
        this.bot3hand = []
        this.pile = []
        this.reversed = false 
        for(let i = 0;i<7;i++){
            this.playerhand.push(this.draw())
            this.bot1hand.push(this.draw())
            this.bot2hand.push(this.draw())
            this.bot3hand.push(this.draw())
        }
        do{
            this.deck.cardList = this.deck.cardList.concat(this.pile)
            this.pile = []
            this.pile.push(this.draw())
        }
        while (this.pile[0].type != 'number')
        console.log(this.pile[0])
        this.turnlist=['player','bot 1','bot 2','bot 3']
        this.turnIndex = Math.floor(Math.random()*this.turnlist.length)
         this.winner = ''
        this.gameover = false
    }
   
    
    turn(){
        let currentplayer = this.turnlist[this.turnIndex]
        if(currentplayer == 'player') return
        if (currentplayer == 'bot 1'){
            var hand = this.bot1hand
            
        }
        else if (currentplayer == "bot 2"){
            var hand = this.bot2hand
        }
        else{
            var hand = this.bot3hand
        }
        let playable = []
        for (let i = 0;i<hand.length;i++){
            let card = hand[i]
            //check if card is playable
            if (this.canplay(card)){
                playable.push(card)
            }
        }
        var willplay = null;
        if (playable.length == 0){
            hand.push(this.draw())
        }
        else{
            let willplayindex = Math.floor(Math.random()*playable.length)
            willplay = playable[willplayindex]
            hand.splice(willplayindex,1)
            this.pile.push(willplay)
        }
        this.nextTurn(willplay)
        
    }
    nextTurn(played){
        var hand
        if (this.turnlist[this.turnIndex]== 'player'){
            hand = this.playerhand
        }
        else if (this.turnlist[this.turnIndex] == 'bot 1'){
            hand = this.bot1hand
        }
        else if (this.turnlist[this.turnIndex] == 'bot 2'){
            hand = this.bot2hand
        }
        else if (this.turnlist[this.turnIndex] == 'bot 3'){
            hand = this.bot3hand
        }
        if (hand.length == 0){
            this.gameover = true
            this.winner = this.turnlist[this.turnIndex]
        }

        
        let skip = false
        let draw = 0
        if(played != null){
            //skip
            if(played.type == 'skip'){
                skip = true
            }
            //reverse
            else if (played.type == 'reverse'){
                this.reversed = !this.reversed
            }
            //+4
            else if(played.type == '+4'){
                draw = 4
                skip = true
            }
            //+2
             else if(played.type == '+2'){
                draw = 2
                skip = true
            }
        }
        // skipping
        if (skip) {
            if (!this.reversed){
                this.turnIndex++
                if(this.turnIndex >= this.turnlist.length){
                    this.turnIndex = 0
                }
            }
            else{
                this.turnIndex --
                if(this.turnIndex <0){
                    this.turnIndex = this.turnlist.length-1
                }
            }
        
        }
        // draw extras
        var hand
        switch(this.turnlist[this.turnIndex]){
            case 'player':
                hand = this.playerhand
                break
            case 'bot 1':
                hand = this.bot1hand
                break
            case 'bot 2':
                hand = this.bot2hand
                break
            case 'bot 3':
                hand = this.bot3hand
                break
        }
        for(let i = 0; i < draw;i++){
            hand.push(this.draw())
        }
        //move to next turn
        if (!this.reversed){
            this.turnIndex++
            if(this.turnIndex >= this.turnlist.length){
                this.turnIndex = 0
            }
        }
        else{
            this.turnIndex --
            if(this.turnIndex <0){
                this.turnIndex = this.turnlist.length-1
            }
        }
        // prep next turn
        if (this.turnlist[this.turnIndex]!= 'player'&&!this.gameover){
            setTimeout(this.turn.bind(this),2500)
        }
        this.render()

    }
    canplay(card){
        let last = this.pile[this.pile.length-1]
        //if last card is wild
        if(last.color == 'wild'){
            return true
        }
        //if last card has same color
        if(last.color == card.color){
            return true
        }
        //if last card has same number
        if(last.type == 'number' && card.type == 'number' && last.number==card.number){
            return true
        }
        //if last card has same type
        if(last.type == card.type && last.type != 'number'){
            return true
        }
        //if card is wild
        if(card.color=='wild'){
            return true
        }
        return false
    }
    draw(){
        // console.log(this.deck.cardList.length, this.pile.length)
        if(this.deck.cardList.length == 0){
            let oldcards = this.pile.slice(0,this.pile.length-1)
            this.deck.cardList = this.deck.cardList.concat(oldcards)
            this.pile = [this.pile[this.pile.length-1]]
        }
        return(this.deck.draw())
    }
    render(){
        //Rendering player hand
        handDiv.innerHTML = ''
        for (let i = 0;i<this.playerhand.length;i++){
            let card = this.playerhand [i]
            let cardbutton = card.render()
            cardbutton.addEventListener('click', () => {
                //have player play their card
                // console.log(card)
                let index = i
                if (this.turnlist[this.turnIndex]== 'player'&&this.canplay(card)&&!this.gameover){
                    this.playerhand.splice(index,1)
                    this.pile.push(card)
                    this.nextTurn(card)
                }
            })
            handDiv.appendChild(cardbutton) 

        }
        if(this.turnlist[this.turnIndex]=='player'){
            let drawbutton = document.createElement('BUTTON')
            drawbutton.innerHTML = 'draw'
            drawbutton.addEventListener('click', () => {
                this.playerhand.push(this.draw())
                this.nextTurn()
            })
            handDiv.appendChild(drawbutton)
        }
        //Renders last card played
        lastCardDiv.innerHTML = ''
        if (this.pile.length>0){
            let lastcard = this.pile[this.pile.length -1]
            let lastcardbutton = lastcard.render()
            lastCardDiv.appendChild(lastcardbutton)

        }
        //shows #of bot1's cards
        bot1Div.innerHTML = "bot 1 has "+this.bot1hand.length+" cards"
        //shows #of bot2's cards
        bot2Div.innerHTML = "bot 2 has "+this.bot2hand.length+" cards"
        //shows #of bot3's cards
        bot3Div.innerHTML = "bot 3 has "+this.bot3hand.length+" cards"

        //display active player
        turnDiv.innerHTML = "it is "+this.turnlist[this.turnIndex]+"'s turn"
        //display reverse status
        reverseDiv.innerHTML = ''
        if(this.reversed == true){
            reverseDiv.innerHTML = 'reversed'
        }
        winnerDiv.innerHTML = ''
        if(this.gameover){
            winnerDiv.innerHTML = 'The winner is: '+this.winner+'!'
        }
    }
}
myGame = new Game()

myGame.render()
myGame.turn()
