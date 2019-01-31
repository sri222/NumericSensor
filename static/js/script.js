let cvsIn = document.getElementById("inputimg");
let ctxIn = cvsIn.getContext('2d');
let divOut = document.getElementById("predictdigit");
let svgGraph = null;
let mouselbtn = false;


//async function start(cur_mode) {
    //arabic or english
  //  mode = cur_mode
    
    //load the model 
    //model = await tf.loadModel('model/model.json')
    
    //warm up 
    //model.predict(tf.zeros([1, 28, 28, 1]))
    
    //allow drawing on the canvas 
    //allowDrawing()
    
    //load the class names
    //await loadDict()
}

// initilize
window.onload = function(){
    
    ctxIn.fillStyle = "white";
    ctxIn.fillRect(0, 0, cvsIn.width, cvsIn.height);
    ctxIn.lineWidth = 7;
    ctxIn.lineCap = "round";
    
    initProbGraph();
    //Added by Sridhar
    //model = await tf.loadModel('model/model.json')
}

// init probability graph
function initProbGraph(){

    const dummyData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // dummy data for initialize graph
    const margin = { top: 10, right: 10, bottom: 10, left: 20 }
        , width = 250, height = 196;

    let yScale = d3.scaleLinear()
        .domain([9, 0])
        .range([height, 0]);
    
    svgGraph = d3.select("#probGraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svgGraph.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    const barHeight = 20
    svgGraph.selectAll("svg")
        .data(dummyData)
        .enter()
        .append("rect")
        .attr("y", function(d,i){return yScale(i) - barHeight / 2})
        .attr("height", barHeight)
        .style("fill", "green")
        .attr("x", 0)
        .attr("width", function(d){return d * 2})
        .call(d3.axisLeft(yScale));
}

// add cavas events
cvsIn.addEventListener("mousedown", function(e) { 

    if(e.button == 0){
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        mouselbtn = true;
        ctxIn.beginPath();
        ctxIn.moveTo(x, y);
    }   
    else if(e.button == 2){
        onClear();  // right click for clear input
    }
});
cvsIn.addEventListener("mouseup", function(e) { 
    if(e.button == 0){
        mouselbtn = false; 
        onRecognition();
    }
});
cvsIn.addEventListener("mousemove", function(e) {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if(mouselbtn){
        ctxIn.lineTo(x, y);
        ctxIn.stroke();
    }
});

cvsIn.addEventListener("touchstart", function(e) {
    // for touch device
    if (e.targetTouches.length == 1) {
        let rect = e.target.getBoundingClientRect();
        let touch = e.targetTouches[0];
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        ctxIn.beginPath();
        ctxIn.moveTo(x, y);
    }
});

cvsIn.addEventListener("touchmove", function(e) {
    // for touch device
    if (e.targetTouches.length == 1) {
        let rect = e.target.getBoundingClientRect();
        let touch = e.targetTouches[0];
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        ctxIn.lineTo(x, y);
        ctxIn.stroke();
        e.preventDefault();
    }
});

cvsIn.addEventListener("touchend", function(e) { 
    // for touch device
    onRecognition();
});

// prevent display the contextmenu 
cvsIn.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.getElementById("clearbtn").onclick = onClear;
function onClear(){
    mouselbtn = false;
    ctxIn.fillStyle = "white";
    ctxIn.fillRect(0, 0, cvsIn.width, cvsIn.height);
    ctxIn.fillStyle = "black";
}

// post data to server for recognition
function onRecognition() {
    /*console.time("time");

    $.ajax({
            url: './DigitRecognition',
            type:'POST',
            data : {img : cvsIn.toDataURL("image/png").replace('data:image/png;base64,','') },

        }).done(function(data) {

            showResult(JSON.parse(data))

        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            alert("Error: Model Not Loaded: Sridhar");
        })

    console.timeEnd("time");*/
    //var c=document.getElementById("cvsIn");
    var imgData=cvsIn.toDataURL("image/png");
    window.open(cvsIn.toDataURL('image/png'));
	
	//const imgData = getImageData()

        //get the prediction 
		//window.alert("Test")
		//model = await tf.loadModel('model/model.json')
		//window.alert("Test1")
		//const pred = model.predict(imgData).dataSync()
		//window.alert("Test2")

        //find the top 5 predictions 
        //const indices = findIndicesOfMax(pred, 5)
        //const probs = findTopValues(pred, 5)
        //const names = getClassNames(indices)
		//window.alert(pred)

        //set the table 
        //setTable(names, probs)
}

function preprocess(imgData) {
	    return tf.tidy(() => {
        //convert to a tensor 
        let tensor = tf.fromPixels(imgData, numChannels = 1)
        
        //resize 
        const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
        
        //normalize 
        const offset = tf.scalar(255.0);
        const normalized = tf.scalar(1.0).sub(resized.div(offset));

        //We add a dimension to get a batch shape 
        //const batched = normalized.expandDims(0)
        return normalized
    })
}


function showResult(resultJson){

    // show predict digit
    divOut.textContent = resultJson.predict_digit;

    // show probability
    document.getElementById("probStr").innerHTML = 
        "Probability : " + resultJson.prob[resultJson.predict_digit].toFixed(2) + "%";    

    // show processing images
    //drawImgToCanvas("detectimg", resultJson.detect_img);
    //drawImgToCanvas("centerimg", resultJson.centering_img);

    // show probability graph
    let graphData = [];
    for (let val in resultJson.prob){
        graphData.push(resultJson.prob[val]);
    }

    svgGraph.selectAll("rect")
        .data(graphData)
        .transition()
        .duration(300)
        .style("fill", function(d, i){return (i == resultJson.predict_digit ? "blue":"green")})
        .attr("width", function(d){return d * 2})  

}


function drawImgToCanvas(canvasId, b64Img){
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.src = "data:image/png;base64," + b64Img;
    img.onload = function(){
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    }   
}   
