
class Vertex{
	
	constructor(x,y,idx) {
	    this.x = x
		this.y = y
		this.idx = idx
		this.selected = false
		this.clicked = false
	}
	
	draw(){
		
		let r = Vertex.r
		let x = this.x
		let y = this.y
		let idx = this.idx
		let selected = this.selected
		
		ctx.fillStyle = 'white'
		ctx.beginPath()
		ctx.arc(x,y,r,0,Math.PI * 2)
		ctx.fill()
		
		ctx.lineWidth = 3
		ctx.strokeStyle = selected ? "red" : "black"
		ctx.stroke()
		
		ctx.fillStyle = 'black'
		ctx.font = '16px song'
		ctx.fillText(idx,x - r / 2,y + r / 4,r)
	}
	
	isClicked(x,y){
		return Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) <= Vertex.r
	}
}

Vertex.ctx = ctx
Vertex.r = 16