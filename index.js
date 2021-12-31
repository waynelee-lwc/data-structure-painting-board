
$(function(){
	let url = window.location.href
	console.log(url)
	let paramStr = url.split('?')[1]
	console.log(paramStr)
	if(!paramStr)
	return
	
	paramStr = paramStr.split('&')
	let params = {}
	for(let key in paramStr){
		let val = paramStr[key]
		let k = val.split('=')[0]
		let v = val.split('=')[1]
		
		params[k] = v
	}
	console.log(params)
	
	if(params['username']){
		
		resetMask()
		$('.control-load').click()
		$('.loading-username').val(params['username'])
		$('.loading-search').click()
		
	}
})

$('.vertex-newinfo').on('input',function(){
	$(this).val(
		Math.max(Math.min(Math.floor($(this).val()),99),1)
		)
	if(!vertexsUnused[$(this).val()]){
		for(let key in vertexsUnused){
			$(this).val(key)
			$('.vertex-demo').text($(this).val())
			return
		}
		$(this).val(0)
	}	
	
	$('.vertex-demo').text($(this).val())
})

$('.edge-v1').on('input',function(){
	if($(this).val() == $('.edge-v2').val()){
		$(this).val($('.edge-demo-v1').text())
		return
	}
	$(this).val(
		Math.max(Math.min(Math.floor($(this).val()),99),0)
	)
	$('.edge-demo-v1').text($(this).val())
	refresh()
})

$('.edge-v2').on('input',function(){
	if($(this).val() == $('.edge-v1').val()){
		$(this).val($('.edge-demo-v2').text())
		return
	}
	$(this).val(
		Math.max(Math.min(Math.floor($(this).val()),99),0)
	)
	$('.edge-demo-v2').text($(this).val())
	refresh()
})

$('.edge-exchange').on('click',function(){
	let v1 = $('.edge-v1').val()
	let v2 = $('.edge-v2').val()
	
	$('.edge-v1').val(v2)
	$('.edge-v2').val(v1)
	
	$('.edge-demo-v1').text(v2)
	$('.edge-demo-v2').text(v1)
	refresh()
})

$('.edge-new').on('click',function(){
	let v1 = $('.edge-demo-v1').text()
	let v2 = $('.edge-demo-v2').text()
	let dis = $('.edge-dis').val()
	
	// if(v1 == v2){
	// 	return
	// }
	
	if(!vertexsUsing[v1] || !vertexsUsing[v2]){
		return
	}
	
	if(edges[`${v1}-${v2}`]){
		if(edges[`${v1}-${v2}`].dis != dis){
			updateEdge(v1,v2,dis)
		}else{
			deleteEdge(v1,v2)
		}
	}else{
		addEdge(v1,v2,dis)
	}
})

$('.vertex-new').on('click',function(){
	let idx = $('.vertex-newinfo').val()
	
	if(vertexsUnused[idx]){
		addVertex(idx)
	}
})

$('.edge-dis').on('click',function(){
	let v1 = $('.edge-v1').val()
	let v2 = $('.edge-v2').val()
	let dis = $(this).val()
	let expr = `${v1}-${v2}`
	if(edges[expr]){
		edges[expr].dis = dis
	}
	refresh()
})

$('.edge-direction').on('click',function(){
	Edge.directed = !Edge.directed
	refresh()
})

$('.edge-distance').on('click',function(){
	Edge.distance = !Edge.distance
	refresh()
})

$('.control-save').on('click',function(){
	resetMask()
	resetSave()
	showSaving()
})

$('.control-load').on('click',function(){
	resetMask()
	resetLoad()
	showLoading()
})

$('.control-reset').on('click',function(){
	reset()
})

$('.control-settings').on('click',function(){
	resetMask()
	showSettings()
})

$('.cross').on('click',function(){
	resetMask()
})

$('.saving-submit').on('click',function(){
	submitSaving()
})

$('.loading-search').on('click',function(){
	searchBoardsName()
})

$('.loading-submit').on('click',function(){
	loadSubmit()
})

canvas.onmousedown = function(e){
	if(ctrl){
		return
	}
	let x = e.layerX
	let y = e.layerY
	
	for(let key in vertexsUsing){
		let vertex = vertexsUsing[key]
		
		if(vertex.isClicked(x,y)){
			vertex.clicked = true
			return
		}
	}
	
	for(let key in notes){
		let note = notes[key]
		
		if(note.isClicked(x,y)){
			note.clicked = true
			return
		}
	}
	
}

var mousePos = {
	x:0,
	y:0
}

canvas.ondblclick = function(e){
	let x = e.layerX
	let y = e.layerY
	let vertex2delete = []
	
	for(let key in vertexsUsing){
		let vertex = vertexsUsing[key]
		
		if(vertex.isClicked(x,y)){
			vertex2delete.push(vertex.idx)
		}
	}
	
	for(let idx of vertex2delete){
		deleteVertex(idx)
	}
	
	if(vertex2delete.length != 0){
		return
	}
	
	for(let key in edges){
		let edge = edges[key]
		if(edge.isClicked(x,y)){
			console.log(edge)
			deleteEdge(edge.v1.idx,edge.v2.idx,edge.dis)
			return
		}
	}
	
	for(let key in notes){
		let note = notes[key]
		if(note.isClicked(x,y)){
			delete notes[key]
			refresh()
			return
		}
	}
	
	/* 创建注释 */
	let content = prompt('注释内容: ')
	if(content){
		let key = new Date().getMilliseconds()
		notes[key] = new Note(
			x,
			y,
			content
		)
		refresh()
	}
}

// canvas.onclick = function(e){
// 	let x = e.layerX
// 	let y = e.layerY
	
// 	for(let key in notes){
// 		let note = notes[key]
		
// 		if(note.isClicked(x,y)){
// 			let content = prompt('修改内容:')
// 			if(content){
// 				console.log(content)
// 				note.setContent(content)
// 			}
// 			break;
// 		}
// 	}
// }

canvas.onmousemove = function(e){
	let x = e.layerX
	let y = e.layerY
	
	mousePos = {
		x:x,
		y:y
	}
	
	for(let key in vertexsUsing){
		let vertex = vertexsUsing[key]
		
		if(vertex.clicked){
			vertex.x = x
			vertex.y = y
		}
	}
	
	for(let key in notes){
		let note = notes[key]
		
		if(note.clicked){
			note.x = x - note.width / 2
			note.y = y - note.height / 2
		}
	}
	
	refreshCanvas()
}

canvas.onmouseup = function(e){
	for(let key in vertexsUsing){
		let vertex = vertexsUsing[key]
		vertex.clicked = false
	}
	
	for(let key in notes){
		let note = notes[key]
		note.clicked = false
	}
}

window.onkeydown = function(e){
	
	if(e.key == 'x'){
		$('.edge-new').click()
	}
	
	if(e.keyCode == 17){
		ctrl = true
	}
	
	let v1 = $('.edge-v1').val()
	let v2 = $('.edge-v2').val()
	let dis = $('.edge-dis').val()
	let expr = `${v1}-${v2}`
	

	
	$('.edge-dis').val(dis)
	
	let x = mousePos.x
	let y = mousePos.y
	for(let key in vertexsUsing){
		let vertex = vertexsUsing[key]
		
		if(vertex.isClicked(x,y)){
			if(e.keyCode == 81){
				$('.edge-v1').val(vertex.idx)
				refresh()
			}
			if(e.keyCode == 87){
				$('.edge-v2').val(vertex.idx)
				refresh()
			}
			if(e.key == 'e'){
				selecteVertex(vertex.idx)
			}
			if(e.key == 'd'){
				deleteVertex(vertex.idx)
			}
		}
	}
	
	for(let key in edges){
		let edge = edges[key]
		
		if(edge.isClicked(x,y)){
			if(e.key == 'e'){
				edges[`${edge.v1.idx}-${edge.v2.idx}`].selected = !edges[`${edge.v1.idx}-${edge.v2.idx}`].selected
			}
			if(e.key == 'u'){
				edge.dis++
			}
			if(e.key == 'j'){
				edge.dis--
			}
		}
	}
	
	for(let key in notes){
		let note = notes[key]
		
		if(note.isClicked(x,y)){
			if(e.key == 'e'){
				note.selected = !note.selected
			}
			if(e.key == 'r'){
				let content = prompt('修改内容:')
				if(content){
					console.log(content)
					note.setContent(content)
				}
				break;
			}
		}
	}
	refresh()
}


var vertexsUnused = {}
var vertexsUsing = {}
var edges = {}
var notes = {}

/* 刷新左侧面板以及右侧画板 */
function refresh(){
	
	refreshPanel()
	refreshCanvas()
}

/* 刷新左侧面板 */
function refreshPanel(){
	/*清空顶点列表以及边列表*/
	$('.vertex-list-unused').empty()
	$('.vertex-list-using').empty()
	$('.edge-list').empty()
	
	/*更新边demo值*/
	$('.edge-demo-v1').text($('.edge-v1').val())
	$('.edge-demo-v2').text($('.edge-v2').val())
	
	/*更新点demo值*/
	$('.vertex-demo').text($('.vertex-newinfo').val())
	
	/*渲染所有边*/
	for(let key in edges){
		let edge = edges[key]
		$('.edge-list').append(geneEdgeElement(edge))
	}
	
	/*渲染正在使用的顶点*/
	for(let key in vertexsUsing){
		let vertex = vertexsUsing[key]
		$('.vertex-list-using').append(geneVertexUsingElement(vertex))
	}
	
	/*渲染未使用的顶点*/
	for(let key in vertexsUnused){
		let vertex = vertexsUnused[key]
		$('.vertex-list-unused').append(geneVertexUnusedElement(vertex))
	}
	
	/*更新面板控制按钮*/
	let v1 = $('.edge-demo-v1').text()
	let v2 = $('.edge-demo-v2').text()
	let dis = $('.edge-dis').val()
	if(edges[`${v1}-${v2}`]){
		if(edges[`${v1}-${v2}`].dis != dis){
			$('.edge-new').text('更新')
		}else{
			$('.edge-new').text('删除')
		}
	}else{
		$('.edge-new').text('添加')
	}
	$('.edge-direction').text(Edge.directed ? '有向' : '无向')
	$('.edge-distence').text(Edge.distance ? '有权' : '无权')
	
	/*面板未使用顶点击事件*/
	$('.vertex-item-unused').on('click',function(e){
		let idx = $(this).attr('id').split('-')[1]
		
		if(vertexsUnused[idx]){
			addVertex(idx)
		}
	})
	
	/*面板未使用顶点鼠标经过事件*/
	$('.vertex-item-unused').on('mouseover',function(e){
		let idx = $(this).attr('id').split('-')[1]
		
		$('.vertex-newinfo').val(idx)
		$('.vertex-demo').text(idx)
	})
	
	/*面板正在使用顶点双击事件*/
	$('.vertex-item-using').on('dblclick',function(e){
		let idx = $(this).attr('id').split('-')[1]
		
		if(vertexsUsing[idx]){
			deleteVertex(idx)
		}
	})
	
	/*面板边单击事件*/
	$('.edge-item').on('click',function(e){
		let v1 = $(this).children('.edge-item-v1').text()
		let v2 = $(this).children('.edge-item-v2').text()
		let dis = $(this).children('.edge-item-dis').text()
		
		if(e.ctrlKey){
			$('.edge-v1').val(v1)
			$('.edge-v2').val(v2)
			$('.edge-dis').val(dis)
			
			$('.edge-demo-v1').text(v1)
			$('.edge-demo-v2').text(v2)
		}else{
			edges[`${v1}-${v2}`].selected = !edges[`${v1}-${v2}`].selected
		}

		refresh()
	})
}
/* 刷新画布 */
function refreshCanvas(){
	/*清空画布*/
	ctx.clearRect(0,0,canvas.width,canvas.height)
	
	/*渲染所有边*/
	for(let key in edges){
		let edge = edges[key]
		edge.draw()
	}
	
	/*渲染正在使用的顶点*/
	for(let key in vertexsUsing){
		let vertex = vertexsUsing[key]
		vertex.draw()
	}
	
	/*渲染未使用的顶点*/
	for(let key in vertexsUnused){
		let vertex = vertexsUnused[key]
	}
	
	/*渲染注释*/
	for(let key in notes){
		let note = notes[key]
		note.draw()
	}
}

/* 添加边 */
function addEdge(v1,v2,dis){
	
	if(!vertexsUsing[v1] || !vertexsUsing[v2]){
		return
	}
	
	edges[`${v1}-${v2}`] = new Edge(
		vertexsUsing[v1],
		vertexsUsing[v2],
		dis
	)
	refresh()
}

/* 删除边 */
function deleteEdge(v1,v2,dis){
	delete edges[`${v1}-${v2}`]
	refresh()
}

/* 更新边 */
function updateEdge(v1,v2,dis){
	if(!edges[`${v1}-${v2}`]){
		return
	}
	edges[`${v1}-${v2}`].dis = dis
	refresh()
}

/* 删除顶点 */
function deleteVertex(idx){
	let vertex = vertexsUsing[idx]
	delete vertexsUsing[idx]
	vertexsUnused[idx] = vertex
	
	/*删除相关边*/
	for(let key in edges){
		let edge = edges[key]
		if(edge.v1 == vertex || edge.v2 == vertex){
			delete edges[key]
		}
	}
	
	refresh()
}

/* 添加顶点 */
function addVertex(idx){
	let vertex = vertexsUnused[idx]
	
	delete vertexsUnused[idx]
	vertexsUsing[idx] = vertex
	refresh()
}

/*选择顶点*/
function selecteVertex(idx){
	let vertex = vertexsUnused[idx]
	vertexsUsing[idx].selected = !vertexsUsing[idx].selected
	refresh()
}


/* 根据边对象创建边列表元素 */
function geneEdgeElement(edge){
	let v1 = edge.v1
	let v2 = edge.v2
	let dis = edge.dis
	let expr = edge.expr
	
	return $(`<div class="edge-item" id="${expr}"></div>`)
		.append($(`<div class="edge-item-v1">${v1.idx}</div>`))
		.append($(`<div class="edge-item-v2">${v2.idx}</div>`))
		.append($(`<div class="edge-item-dis ${Edge.distance ? '' : 'edge-no-distance'}">${dis}</div>`))
		.append($(`<div class="edge-item-edge ${Edge.directed ? 'edge-directed' : ''}"></div>`))
}

/* 根据顶点对象创建顶点元素 */
function geneVertexUsingElement(vertex){
	let idx = vertex.idx
	
	return $(`<div class="vertex-item vertex-item-using ${vertex.selected ? 'vertex-item-selected' : ''}" id="vertex-${idx}">${idx}</div>`)
}
function geneVertexUnusedElement(vertex){
	let idx = vertex.idx
	
	return $(`<div class="vertex-item vertex-item-unused" id="vertex-${idx}">${idx}</div>`)
}

/* 初始化 */
function init(){
	
	edges = {}
	vertexsUnused = {}
	vertexsUsing = {}
	notes = {}
	for(let i = 1;i <= 100;i++){
		vertexsUnused[i] = new Vertex(
			Math.floor(Math.random() * 100 + 50),
			Math.floor(Math.random() * 100 + 50),
			i
		)
	}
	
	// edges['1-2'] = new Edge({idx:1},{idx:2},45)
	
	refresh()
}
init()

/* 导出功能 */
function exportAll(){
	let result = {
		vertexsUnused:vertexsUnused,
		vertexsUsing:vertexsUsing,
		edges:edges,
		notes:notes,
		edgeDirected:Edge.directed,
		edgeDistance:Edge.distance
	}
	console.log(JSON.stringify(result))
	return JSON.stringify(result)
}

/* 导入功能 */
function importAll(result){
	
	result = JSON.parse(result)
	
	if(!result['edges'] || !result['vertexsUnused'] || !result['vertexsUsing'] || 
		!result['notes']){
		alert('导入失败，格式错误！')
		return false
	}
	
	vertexsUnused = {}
	for(let key in result.vertexsUnused){
		let val = result.vertexsUnused[key]
		let vertex = new Vertex(val.x,val.y,val.idx)
		vertex.selected = val.selected
		vertexsUnused[key] = vertex
	}
	
	vertexsUsing = {}
	for(let key in result.vertexsUsing){
		let val = result.vertexsUsing[key]
		let vertex = new Vertex(val.x,val.y,val.idx)
		vertex.selected = val.selected
		vertexsUsing[key] = vertex
	}
	console.log(vertexsUsing)
	
	edges = {}
	for(let key in result.edges){
		let val =  result.edges[key]
		let v1 = vertexsUsing[val.v1.idx]
		let v2 = vertexsUsing[val.v2.idx]
		let edge = new Edge(v1,v2,val.dis)
		edge.selected = val.selected
		edges[key] = edge
	}
	
	notes = {}
	for(let key in result.notes){
		let val = result.notes[key]
		let note = new Note(val.x,val.y,val.content)
		note.selected = val.selected
		notes[key] = note
	}
	
	Edge.directed = result.edgeDirected
	Edge.distance = result.edgeDistance
	
	refresh()
	return true
}

/* 重置画布 */
function reset(){
	init()
}

/* 重置遮罩层 */
function resetMask(){
	$('.settings').hide()
	$('.saving').hide()
	$('.loading').hide()
	$('.mask').hide()
}

/* 展示设置页面 */
function showSettings(){
	$('.mask').show()
	$('.settings').fadeIn(100)
}

/* 展示存档页面 */
function showSaving(){
	$('.mask').show()
	$('.saving').fadeIn(100)
}

/* 展示读档页面 */
function showLoading(){
	$('.mask').show()
	$('.loading').fadeIn(100)
}

/* 云端保存作品 */
function submitSaving(){
	let text = exportAll()
	let username = $('.saving-username').val()
	let boardname = $('.saving-boardname').val()
	
	if(username == ''){
		alert('保存失败，请输入用户名！')
		return
	}
	if(boardname == ''){
		alert('保存失败，请输入作品名！')
		return
	}
	
	$.ajax({
		url:'http://123.56.40.181:4010/update',
		type:'post',
		headers:{
			'content-type':'application/x-www-form-urlencoded'
		},
		data:{
			text:text,
			username:username,
			boardname:boardname + '##' + currTime() 
		},
		success(res){
			if(res.code == 200){
				alert('保存成功!')
				resetMask()
			}else{
				alert('保存失败!' + res.message)
			}
		}
	})
}

/* 检索用户作品名称 */
function searchBoardsName(){
	let username = $('.loading-username').val()
	
	if(username == ''){
		alert('请输入用户名!')
		return
	}

	$.ajax({
		url:'http://123.56.40.181:4010/ask_board',
		type:'post',
		data:{
			username:username
		},
		success:function(res){
			if(res.code == 200){
				
				console.log(res.data)
				let result = res.data
				
				$('.loading-list').empty()
				for(let i = 0;i < result.length;i++){
					let boardname = result[i].split('##')[0]
					let timestamp = result[i].split('##')[1]
					$('.loading-list').append(
						$(`<div class="loading-item" id="item<->${username}<->${result[i]}"></div>`).append(
							$(`<div class="loading-item-boardname">${boardname}</div>`)
						).append(
							$(`<div class="loading-item-timestamp">${timestamp}</div>`)
						).append(
							$(`<button class="loading-item-delete" id="delete<->${username}<->${result[i]}">删除</button>`)
						)
					)
				}
				
				$('.loading-item-delete').on('click',function(){
					let username = $(this).attr('id').split('<->')[1]
					let boardname = $(this).attr('id').split('<->')[2]
					deleteBoard(username,boardname)
				})
				
				$('.loading-item').on('click',function(){
					let username = $(this).attr('id').split('<->')[1]
					let boardname = $(this).attr('id').split('<->')[2]
					console.log(boardname)
					
					$.ajax({
						url:'http://123.56.40.181:4010/ask',
						type:'get',
						data:{
							username:username,
							boardname:boardname
						},
						success:function(res){
							if(res.code == 200){
							
								$('.loading-output-result').text(res.data)
							}
						}
					})
					
					$('.loading-item').removeClass('loading-item-selected')
					$(this).addClass('loading-item-selected')
					
				})
			}else{
				alert('查询错误！' + res.message)
			}
		}
	})
}

/* 删除作品 */
function deleteBoard(username,boardname){
	
	if(!confirm('是否删除？' + boardname)){
		return
	}
	
	$.ajax({
		url:'http://123.56.40.181:4010/delete',
		type:'get',
		data:{
			username:username,
			boardname:boardname
		},
		success:function(res){
			if(res.code == 200){
				alert('删除成功!')
				$('.loading-username').val(username)
				$('.loading-boardname').val()
				$('.loading-search').click()
				$('.loading-output-result').text()
			}else{
				alert('删除失败!' + res.message)
			}
		}
	})
	
}

/* 读档 */
function loadSubmit(){
	let result = $('.loading-output-result').text()
	if(result == ''){
		alert('读档失败，请选择存档！')
		return
	}
	if(importAll(result)){
		alert('读档成功！')
		resetMask()
	}
	
}

/* 重置读档页面 */
function resetLoad(){
	$('.loading-username').val()
	$('.loading-list').empty()
	$('.loading-output-result').text('')
}

/* 重置存档页面 */
function resetSave(){
	let result = exportAll()
	$('.saving-output-result').text(result)
	$('.saving-username').val()
	$('.saving-boardname').val()
}