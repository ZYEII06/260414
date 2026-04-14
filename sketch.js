let frames = [];
let filmStrip;
// 作業資料陣列
let homeworkData = [
  { title: "WEEK 01", url: "https://zyeii06.github.io/w1/" },
  { title: "WEEK 02", url: "https://zyeii06.github.io/w2/" },
  { title: "WEEK 03", url: "https://zyeii06.github.io/w3/" },
  { title: "WEEK 04", url: "https://zyeii06.github.io/w4/" },
  { title: "WEEK 05", url: "https://zyeii06.github.io/260324/" }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  filmStrip = new FilmStrip();
  
  // 設定膠卷格之間的間距
  let spacing = 450;
  for (let i = 0; i < homeworkData.length; i++) {
    frames.push(new FilmFrame(i * spacing + width/2, height/2, homeworkData[i]));
  }
}

function draw() {
  background(10);
  
  // 視差效果
  let parallaxX = map(mouseX, 0, width, -30, 30);
  
  push();
  translate(parallaxX, 0);
  
  filmStrip.update();
  filmStrip.display();
  
  for (let frame of frames) {
    frame.update();
    frame.display();
  }
  pop();
  
  // 繪製指示文字
  fill(0, 242, 255);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text("DRAG OR HOVER TO EXPLORE | CLICK TO OPEN PROJECT", width/2, height - 50);
}

// --- Class: 膠卷底片 (Vertex & For Loop) ---
class FilmStrip {
  constructor() {
    this.y = height / 2;
    this.h = 320;
    this.offset = 0;
  }

  update() {
    this.offset -= 1.5; // 緩慢流動
  }

  display() {
    noFill();
    stroke(0, 242, 255, 150);
    strokeWeight(3);
    
    for (let side of [-1, 1]) {
      let edgeY = this.y + (side * this.h / 2);
      
      // 使用 Vertex 繪製帶波浪感的底片邊緣
      beginShape();
      for (let x = -100; x <= width + 100; x += 30) {
        let nx = x - this.offset;
        let noiseY = edgeY + noise(nx * 0.005, frameCount * 0.01) * 20;
        vertex(x, noiseY);
      }
      endShape();
      
      // 繪製齒孔
      this.drawSprockets(edgeY + (side * -20));
    }
  }

  drawSprockets(y) {
    fill(0, 242, 255, 200);
    noStroke();
    let startX = this.offset % 50;
    for (let x = startX - 50; x < width + 50; x += 50) {
      rectMode(CENTER);
      rect(x, y, 12, 18, 2); // 使用內建 rect 但模擬 vertex 效果
    }
  }
}

// --- Class: 膠卷格 (Class & Interaction) ---
class FilmFrame {
  constructor(x, y, data) {
    this.baseX = x;
    this.y = y;
    this.data = data;
    this.w = 350;
    this.h = 220;
    this.scale = 1.0;
  }

  update() {
    this.currentX = this.baseX + filmStrip.offset;
    
    // 無限循環滾動
    let totalW = homeworkData.length * 450;
    if (this.currentX < -this.w) {
      this.baseX += totalW;
    }

    // 判斷滑鼠是否懸停
    if (dist(mouseX, mouseY, this.currentX, this.y) < this.w/2) {
      this.scale = lerp(this.scale, 1.15, 0.1);
    } else {
      this.scale = lerp(this.scale, 1.0, 0.1);
    }
  }

  display() {
    push();
    translate(this.currentX, this.y);
    scale(this.scale);
    
    // 霓虹發光效果
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(0, 242, 255);
    
    // 膠捲格主體
    fill(20, 20, 20, 230);
    stroke(0, 242, 255);
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 8);
    
    // 文字資訊
    drawingContext.shadowBlur = 0;
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(this.data.title, 0, -10);
    
    textSize(12);
    fill(0, 242, 255);
    text("CLICK TO VIEW", 0, 30);
    
    pop();
  }

  isClicked() {
    let d = dist(mouseX, mouseY, this.currentX, this.y);
    if (mouseX > this.currentX - this.w/2 && mouseX < this.currentX + this.w/2 &&
        mouseY > this.y - this.h/2 && mouseY < this.y + this.h/2) {
      this.openIframe();
    }
  }

  openIframe() {
    const overlay = document.getElementById('gallery-overlay');
    const container = document.getElementById('iframe-container');
    overlay.style.display = 'block';
    container.innerHTML = `<iframe src="${this.data.url}"></iframe>`;
  }
}

function mousePressed() {
  for (let frame of frames) {
    frame.isClicked();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}