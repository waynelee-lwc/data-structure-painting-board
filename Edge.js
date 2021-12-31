

class Edge{
	
	constructor(v1,v2,dis) {
	    this.v1 = v1
		this.v2 = v2
		this.dis = dis
		this.expr = `${v1.idx}-${v2.idx}-dis`
		this.selected = false
	}
	
	
	draw(){
		this.drawEdge()
		if(Edge.directed){
			this.drawDirection()
		}
		if(Edge.distance){
			this.drawDistance()
		}
		
		
		// 	let x1 = this.v1.x
		// 	let y1 = this.v1.y
		// 	let x2 = this.v2.x
		// 	let y2 = this.v2.y
		// 	let vx = y2 - y1
		// 	let vy = x1 - x2
		// 	let vl = Math.sqrt(vx * vx + vy * vy)
			
		// 	vx /= vl
		// 	vy /= vl
			
		// 	vx *= Vertex.r / 1
		// 	vy *= Vertex.r / 1
			
		// 	let vax = vx * 2
		// 	let vay = -vy * 2
		// 	let vbx = x2 + vx 
		// 	let vby = y2 - vy
			
		// 	ctx.beginPath()
		// 	ctx.moveTo(x1 + vx,y1 + vy)
		// 	ctx.lineTo(x1 - vx,y1 - vy)
		// 	ctx.lineTo(x2 - vx,y2 - vy)
		// 	ctx.lineTo(x2 + vx,y2 + vy)
		// 	ctx.closePath()
		// 	ctx.fillStyle = 'blue'
		// 	ctx.fill()
			
	}
	
	drawEdge(){
		let x1 = this.v1.x
		let y1 = this.v1.y
		let x2 = this.v2.x
		let y2 = this.v2.y
		
		//自环
		if(this.v1 == this.v2){
			ctx.beginPath()
			ctx.arc(x1 + Vertex.r,y1 - Vertex.r,Vertex.r,0,Math.PI * 2)
			ctx.lineWidth = 2
			ctx.stroke()
			return
		}
		
		ctx.beginPath()
		
		ctx.strokeStyle = this.selected ? 'red' : 'black'
		ctx.setline
		ctx.lineWidth = 2
		ctx.moveTo(x1,y1)
		ctx.lineTo(x2,y2)
		ctx.stroke()
		
		
		
	}
	
	drawDistance(){
		let x1 = this.v1.x
		let y1 = this.v1.y
		let x2 = this.v2.x
		let y2 = this.v2.y
		
		ctx.font = '20px bold song'
		ctx.fillStyle = this.selected ? 'red' : 'black'
		
		if(this.v1 == this.v2){
			ctx.fillText(this.dis,x1 + Vertex.r - 5,y1 - Vertex.r + 5)
		}else{
			ctx.fillText(this.dis,(x1 + x2) / 2,(y1 + y2) / 2)
		}
		
	}
	
	drawDirection(){
		let x1 = this.v1.x
		let y1 = this.v1.y
		let x2 = this.v2.x
		let y2 = this.v2.y
		let vx = x1 - x2
		let vy = y1 - y2
		let vl = Math.sqrt(vx * vx + vy * vy)
				
				
		if(this.v1 == this.v2){
			ctx.beginPath()
			ctx.moveTo(x1 + 6,y1 - Vertex.r - 8)
			ctx.lineTo(x1,y1 - Vertex.r)
			ctx.lineTo(x1 - 6,y1 - Vertex.r - 8)
			ctx.closePath()
			ctx.fillStyle = 'black'
			ctx.fill()
			return
		}
				
		vx /= vl
		vy /= vl
		
		vx *= Vertex.r
		vy *= Vertex.r
		
		let x = x2
		let y = y2
		
		x += vx
		y += vy
		
		ctx.fillStyle = this.selected ? 'red' : 'black'
		ctx.beginPath()
		ctx.moveTo(x,y)
		
		x += vx / 1.25
		y += vy / 1.25
		
		x += vy / 2
		y -= vx / 2
		
		ctx.lineTo(x,y)
		x -= vy
		y += vx
		ctx.lineTo(x,y)
		ctx.closePath()
		
		ctx.fill()
	}
	 
	isClicked(x,y){
		let x1 = this.v1.x
		let y1 = this.v1.y
		let x2 = this.v2.x
		let y2 = this.v2.y
		let vx = y2 - y1
		let vy = x1 - x2
		let vl = Math.sqrt(vx * vx + vy * vy)
		let vxx = x2 - x1
		let vyy = y2 - y1
		
		vx /= vl
		vy /= vl
		vxx /= vl
		vyy /= vl
		
		vx *= Vertex.r / 2
		vy *= Vertex.r / 2
		vxx *= Vertex.r
		vyy *= Vertex.r
		
		
		let vax = vx * 2
		let vay = vy * 2
		let vbx = x2 - x1 - vxx * 2
		let vby = y2 - y1 - vyy * 2
		let vcx = x - x1 + vx - vxx
		let vcy = y - y1 + vy - vyy
		
		// ctx.beginPath()
		// ctx.moveTo(x1 + vx,y1 + vy)
		// ctx.lineTo(x1 - vx,y1 - vy)
		// ctx.lineTo(x2 - vx,y2 - vy)
		// ctx.lineTo(x2 + vx,y2 + vy)
		// ctx.closePath()
		// ctx.fillStyle = 'blue'
		// ctx.fill()
		
		// ctx.beginPath()
		// ctx.arc(x,y,5,0,Math.PI * 2)
		// ctx.fillStyle = 'red'
		// ctx.fill()
		

		return vax * vcx + vay * vcy >= 0 && vax * vcx + vay * vcy <= vax * vax + vay * vay &&
			vbx * vcx + vby * vcy >= 0 && vbx * vcx + vby * vcy <= vbx * vbx + vby * vby
	}
	
}

Edge.directed = true
Edge.distance = true