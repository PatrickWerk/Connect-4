var FC = FC || {}; //create namespace for 4-Connect Game

FC.FIELD_WIDTH = 70;
FC.FIELD_HEIGHT = 70;

FC.NUM_FIELD_HORIZONTAL = 8;
FC.NUM_FIELD_VERTICAL = 8;

const gameWidth = FC.FIELD_WIDTH * ( FC.NUM_FIELD_HORIZONTAL + 2 );
const gameHeight = FC.FIELD_HEIGHT * ( FC.NUM_FIELD_VERTICAL + 2 );

var playerToggler = 1;
var playedDiscsNum = 0;
var stage;
var renderer;

class Main{
	constructor(){
		renderer = PIXI.autoDetectRenderer((FC.NUM_FIELD_HORIZONTAL + 2) * FC.FIELD_WIDTH , (FC.NUM_FIELD_VERTICAL + 2) * FC.FIELD_HEIGHT,{align:'center', backgroundColor : 0xcccccc});
		document.body.appendChild(renderer.view);

		// create the root of the scene graph
		stage = new PIXI.Container();
		
		FC.playedDiscs=[];
		FC.grid =[];

		// draw gaming area
		for(var x = 1; x <= FC.NUM_FIELD_HORIZONTAL; x++ ) 
		{
			for(var y = 1; y <= FC.NUM_FIELD_VERTICAL ; y++ ) 
			{
				if (!FC.grid[x]) FC.grid[x] = [];
				FC.grid[x][y] =  new Element(x,y,FC.FIELD_WIDTH,FC.FIELD_HEIGHT,stage, this.updateGrid, this); 
			} 
		}
		renderer.render(stage);
		}
	updateGrid(x,y,that){
		if (!FC.playedDiscs[x]) FC.playedDiscs[x] = [];
		
		playedDiscsNum++;
		
		//row full	
		if (FC.playedDiscs[x].length >= FC.NUM_FIELD_VERTICAL ) 
		{
			return;
		}
				
		FC.playedDiscs[x][FC.playedDiscs[x].length ] = playerToggler;
		FC.grid[x][ FC.NUM_FIELD_VERTICAL - FC.playedDiscs[x].length +1 ].setPlayer(playerToggler);

		renderer.render(stage);
		if( that.checkStatus() )
		{
			that.gameFinished(true);
			return;
		}
		//all rows full
		if( playedDiscsNum >= FC.NUM_FIELD_VERTICAL * FC.NUM_FIELD_HORIZONTAL )
		{
			that.gameFinished(false);
			return;
		} 
	 	playerToggler = (playerToggler === 1)?2:1; 
		}
	checkStatus(){
		let count = 0;
		//4 in a row vertically
		for(var x = 1; x <= FC.NUM_FIELD_HORIZONTAL; x++ ) 
		{
			for(var y = FC.NUM_FIELD_VERTICAL; y >= 1 ; y-- ) 
			{ 	
				count = this.countElement(x,y,count);
				if( count >= 4) return true;					 	
			}
	  	}

	  	//4 in a row horizontally
	  	for(var y = FC.NUM_FIELD_VERTICAL; y >= 1 ; y-- ) 
		{
			for(var x = 1; x <= FC.NUM_FIELD_HORIZONTAL; x++ ) 
			{ 	
				count = this.countElement(x,y,count);
				if( count >= 4) return true;				 	
			}
	  	}

	  	//4 in a row diagonally top right
	  	for(var i = FC.NUM_FIELD_VERTICAL; i >= 1 ; i-- ) 
		{
			for(var y = i, x = 1; y >= 1 && x <= i ; y--, x++ ) 
			{		
				count = this.countElement(x,y,count);
				if( count >= 4) return true;		 	
		  	}
		}
		for(var j = 2; j <= FC.NUM_FIELD_HORIZONTAL; j++ ) 
		{
			for(var y = FC.NUM_FIELD_VERTICAL, x = j; y >= j && x <= FC.NUM_FIELD_HORIZONTAL ; y--, x++ ) 
			{		
				count = this.countElement(x,y,count);
				if( count >= 4) return true;				 	
		  	}
		}

		//4 in a row diagonally button right
	  	for(var i = FC.NUM_FIELD_VERTICAL; i >= 1 ; i-- ) 
		{
			for(var y = i, x = 1; y <= FC.NUM_FIELD_VERTICAL && x <= FC.NUM_FIELD_HORIZONTAL ; y++, x++ ) 
			{		
				count = this.countElement(x,y,count);
				if( count >= 4) return true;					 	
		  	}
		}
		for(var j = 2; j <= FC.NUM_FIELD_HORIZONTAL; j++ ) 
		{
			for(var y = 1, x = j; y <= FC.NUM_FIELD_VERTICAL && x <= FC.NUM_FIELD_HORIZONTAL ; y++, x++ ) 
			{		
				count = this.countElement(x,y,count);
				if( count >= 4) return true;		 	
		  	}
		}	  	
	  return false;	  
	}
	countElement(x, y, count){
		try
		{
			if(FC.grid[x][y].player == playerToggler)
		 	{
		 		 count++;
		 	}
		 	else count = 0;
		}
		catch(e) //gridElement not in use	
		{
			count = 0;
		}

		return count;	
	}
	gameFinished(success){
		//Draw Congrats end end Game
		let textOptions = {
    		font: '50px Arial',
    		fill: '#3498db',
    		align: 'center',
    		stroke: '#34495e',
    		strokeThickness: 20,
    		lineJoin: 'round'
			}

		let graphics = new PIXI.Graphics();
		graphics.beginFill(0x333333, 0.5);
		graphics.drawRect(FC.FIELD_WIDTH,FC.FIELD_HEIGHT, FC.FIELD_WIDTH * FC.NUM_FIELD_HORIZONTAL, FC.FIELD_HEIGHT * FC.NUM_FIELD_VERTICAL);
		graphics.endFill();
		graphics.hitArea = graphics.getBounds();
		graphics.interactive = true;
		stage.addChild(graphics);		
		let congratsText = new PIXI.Text(((success)?'Gewonnen! \nGlückwunsch Spieler ' + playerToggler:'Unentschieden!\nSpielfeld ist voll belegt'),textOptions);
		congratsText.x = ( gameWidth / 2 ) - congratsText.width/2;
		congratsText.y = gameHeight / 3;

		stage.addChild(congratsText);	
		renderer.render(stage);	
	}
}

class Element {
	constructor( x, y, pWidth, pHeight, stage, callback,that) {
	 	this.x = x;
		this.y = y;		
		this.that = that;
		this.stage = stage;
	 	this.pWidth = pWidth;
		this.pHeight = pHeight;	
		this.callback = callback;

	  	let graphics = new PIXI.Graphics();
	  	graphics.lineStyle(5, 0x000000, 1);
		graphics.beginFill(0xffffff, 1);
		graphics.drawRect(pWidth * x, pHeight * y, pWidth, pHeight);
		graphics.endFill();
		graphics.hitArea = graphics.getBounds();
		stage.addChild(graphics);
		graphics.interactive = true;
		graphics.on('touchstart', onDown);	
		graphics.on('mousedown', onDown);
		function onDown() {		
			callback(x,y,that);
			};
		}		
	setPlayer(player) {
		let graphics = new PIXI.Graphics();
		this.player = player;
		graphics.lineStyle(0);
		graphics.beginFill((player === 1)?0x990000:0xFFCC00, 1);
		graphics.drawCircle(this.pWidth * this.x + this.pWidth/2, this.pHeight * this.y + this.pHeight/2, 30);
		graphics.endFill();
		this.stage.addChild(graphics);
	}
}