

class Note{
	
	constructor(x,y,content) {
	    this.x = x;
		this.y = y
		this.clicked = false
		this.selected = false
		
		this.setContent(content)
	}
	
	setContent(content){
		
		content = content ? content : ''
		
		ctx.font = '20px song'
		console.log(ctx.measureText(content).width)
		this.width = Math.max(40,Math.min(ctx.measureText(content).width,320))
		let contents = []
		let curr = ''
		for(let i = 0;i < content.length;i++){
			if(ctx.measureText(curr + content[i]).width > 300){
				contents.push(curr)
				curr = ''
			}
			curr += content[i]
		}
		if(curr != ''){
			contents.push(curr)
		}
		this.height = Math.max(35,contents.length * 32)
		this.contents = contents
		this.content = content
	}
	
	draw(){
		ctx.beginPath()
		ctx.fillStyle = 'white'
		ctx.fillRect(this.x,this.y,this.width,this.height)
		ctx.strokeStyle = this.selected ? 'orange' : 'gray'
		ctx.lineWidth = 2
		ctx.strokeRect(this.x,this.y,this.width,this.height)
		ctx.strokeRect(this.x + 5,this.y + 5,this.width - 10,this.height - 10)
		
		ctx.fillStyle = 'black'
		ctx.font = '20px song'
		for(let i = 0;i < this.contents.length;i++){
			ctx.fillText(this.contents[i],this.x + 10,this.y + 25 + i * 25,this.width - 20)
		}
	}
	
	isClicked(x,y){
		return x - this.x >= 0 && x - this.x <= this.width &&
			   y - this.y >= 0 && y - this.y <= this.height
	}
	
}