let mouse = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', (event) => {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
})
let mousedown = 0
window.addEventListener("mousedown", function () {
    mousedown = 1
});
window.addEventListener("mouseup", function () {
    mousedown = 0
    control_Circle = 0
});
//window事件監聽



function lerp(start, end, amt) { //
    return (1 - amt) * start + amt * end //smooth移動
}


var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
window.addEventListener("resize", resizeCanvas);
function resizeCanvas() {                   //螢幕顯示100%
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
const colors = ['#0000ff', '#7ECEFD', '#FFF6E5', '#FF7F66']


class circularSpace {                        //大圓形群組
    constructor(x, y, r, color) {
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.circles = []
        this.creatNum = 5;
    }
    creat() {
        for (let i = 0; i < this.creatNum; i++) {
            const x = Math.random() * ((this.x + this.r) - (this.x - this.r)) + (this.x - this.r)
            const y = Math.random() * ((this.y + this.r) - (this.y - this.r)) + (this.y - this.r);
            const radius = (canvas.width / 40 - canvas.width / 60) + canvas.width / 60;
            const color = "red"
            this.circles.push(new circle(x, y, radius, color))
        }
        this.circles.forEach(i => {
            this.circles.forEach(k => {
                i.vectors.push(new vector(i, k))
            })

        })
        this.circles.forEach(i => {      //
            this.circles.forEach(k => {  //
                i.vectors.forEach(j => { //
                    j.record_vector()  //紀錄初始的向量    
                })
            })
        })

    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        c.shadowColor = this.color;
        c.shadowBlur = 15
        c.fillStyle = this.color
        c.fill()
        c.closePath()

    }
    update() {
        this.draw()
    }

}
class circle {                               //小圓形群組
    constructor(x, y, r, color) {
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.vectors = []
        this.randomNum
        this.randomTime = (Math.floor(Math.random() *200) +200)
        this.randomTimeFlag = 0
        this.randomX = 0
        this.randomY = 0
    }
    move() {
        if (this.randomTimeFlag == 0) {
            this.randomNum = Math.floor(Math.random() * 12)
            this.randomX = Math.random() * canvas.width
            this.randomY = Math.random() * canvas.height
            this.randomTimeFlag = 1
        }
        if (this.randomTimeFlag == 1) { 
            this.randomTime--
            if(this.randomNum ==1){
            this.x = lerp(this.x, this.randomX, 0.01 * 0.001)
            this.y = lerp(this.y, this.randomY, 0.01 * 0.001)
            }
        }
        if(this.randomTime < 0){           
            this.randomTime = (Math.floor(Math.random() *200) +200)
            this.randomTimeFlag = 0
        }


    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        c.shadowColor = this.color;
        c.shadowBlur = 15
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }
    update() {
        //this.draw()
        //this.move()
    }
}
class vector {                                 //每個圓對彼此的向量
    constructor(circle0, circle1) {
        this.circle0 = circle0
        this.circle1 = circle1
        this.vector_

    }
    record_vector() {
        this.vector_ = Math.pow((Math.pow(Math.abs(this.circle0.x - this.circle1.x), 2) + Math.pow(Math.abs(this.circle0.y - this.circle1.y), 2)), 0.5)
    }
    draw() {
        c.beginPath()
        c.moveTo(this.circle0.x, this.circle0.y)
        c.lineTo(this.circle1.x, this.circle1.y)
        c.strokeStyle = "white"
        c.lineWidth = 1;
        c.stroke()
        c.closePath()
    }
    update() {
        this.draw()
    }

}


let circularSpaces
function init() {                              //初始化
    circularSpaces = []
    creatNum = Math.floor(Math.random() * 10) + 20;
    for (let i = 0; i < creatNum; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * (canvas.width / 20 - canvas.width / 30) + canvas.width / 30;
        const color = "blue"
        if (x - radius >= 0 && y - radius >= 0 && x + radius < canvas.width && y + radius < canvas.height) {
            circularSpaces.push(new circularSpace(x, y, radius, color))
            circularSpaces[i].creat()
        }
        else {
            i--
        }

    }
    console.log(circularSpaces)
}

let control_Circle = 0                         //全域變數滑鼠選取圓中....
let which_Control_Circle                       //全域變數滑鼠事件選取到哪個圓
let which_Control_Circle_group                 //全域變數滑鼠事件選取到哪個圓型群組
function mainUpdate() {                         //mainUpdate
    circularSpaces.forEach(i => {
        i.circles.forEach(k => {
            if (control_Circle == 0) {
                if ((Math.pow((Math.pow(Math.abs(k.x - mouse.x), 2) + Math.pow(Math.abs(k.y - mouse.y), 2)), 0.5) < k.r)) {
                    which_Control_Circle = k
                    which_Control_Circle_group = i
                    control_Circle = 1


                }
            }
            if (control_Circle == 1) {
                controlCircle(which_Control_Circle)
                if ((Math.pow((Math.pow(Math.abs(which_Control_Circle.x - mouse.x), 2) + Math.pow(Math.abs(which_Control_Circle.y - mouse.y), 2)), 0.5) > (which_Control_Circle.r) * 3)) {
                    control_Circle = 0
                }
            }
        })
    }
    )


    //circleForce(which_Control_Circle_group,which_Control_Circle)






}

function circleForce(circle0, circle1, v) {
    v0 = Math.pow((Math.pow(Math.abs(circle0.x - circle1.x), 2) + Math.pow(Math.abs(circle0.y - circle1.y), 2)), 0.5)
    if (v0 > v) {
        circle1.x = lerp(circle1.x, circle0.x, (v0 / v) * 0.01 * 0.001)
        circle1.y = lerp(circle1.y, circle0.y, (v0 / v) * 0.01 * 0.001)
    }
}




function controlCircle(controlCircle) {
    controlCircle.x = lerp(controlCircle.x, mouse.x, 0.0005)
    controlCircle.y = lerp(controlCircle.y, mouse.y, 0.0005)
    controlCircle.vectors.forEach(i => {
        circleForce(i.circle0, i.circle1, i.vector_)
    })

}





function animate() {
    requestAnimationFrame(animate)
    c.fillStyle =  "rgba(35, 36, 42, 0.8)";
    c.fillRect(0, 0, canvas.width, canvas.height)
    circularSpaces.forEach(i => {
        //i.update()
        i.circles.forEach(k => {
            k.vectors.forEach(i => {
                i.update()
            })
        })
        i.circles.forEach(k => {
            k.update()
        })
    }
    )
    mainUpdate()


}
resizeCanvas()
init()
animate()
